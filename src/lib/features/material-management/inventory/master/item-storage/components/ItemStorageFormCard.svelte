<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Trash2, Search } from 'lucide-svelte';
	import { mockRacks, mockStorageCells } from '../api/item-storage.mock';
	import type { ItemStorageAssignmentCreatePayload, StorageRack, StorageCell } from '../types/item-storage.types';

	// Item catalog with group info
	// group_parent_code = kode group induk (2 huruf), group_code = kode group barang (3 huruf)
	const mockItemCatalog = [
		{ item_code: '7037104', item_name: 'MANOMETER 0-6 KG/CM2 OR BAR',  group_parent_code: 'GF',  group_code: 'GFA' },
		{ item_code: '8011002', item_name: 'Oli Mesin SAE 40',              group_parent_code: 'GF',  group_code: 'GFB' },
		{ item_code: '7000000', item_name: 'AGRAL 250MG @1L/KLG',           group_parent_code: 'AA',  group_code: 'AAH' },
		{ item_code: '7000001', item_name: 'AGREPT 20 W',                   group_parent_code: 'AA',  group_code: 'AAH' },
		{ item_code: '7000004', item_name: 'INOSITOL " MERCK-4728 "',       group_parent_code: 'AA',  group_code: 'AAB' },
		{ item_code: '7000005', item_name: 'LILIN PUTIH (PARAFIN WAX)',     group_parent_code: 'AA',  group_code: 'AAC' },
		{ item_code: '7000006', item_name: 'MAYZENA POWDER',                group_parent_code: 'AA',  group_code: 'AAD' },
		{ item_code: '7011812', item_name: 'BECOM C',                       group_parent_code: 'JA',  group_code: 'JAO' },
		{ item_code: '7011814', item_name: 'BIOSANBE',                      group_parent_code: 'JA',  group_code: 'JAO' },
		{ item_code: '7021129', item_name: 'MIRASECT TAB / EXTRO',          group_parent_code: 'JA',  group_code: 'JAP' },
		{ item_code: '8011001', item_name: 'Pupuk NPK 50kg',                group_parent_code: 'BF',  group_code: 'BFA' },
		{ item_code: '7006825', item_name: 'BATANG BESI',                   group_parent_code: 'EM',  group_code: 'EMA' },
	];

	interface Props {
		formData?: ItemStorageAssignmentCreatePayload;
		errors?: Record<string, string>;
		readonly?: boolean;
	}

	let {
		formData = $bindable({
			rack_id: '',
			cell_id: '',
			items: [{ item_code: '', item_name: '' }],
			notes: ''
		}),
		errors = $bindable({}),
		readonly = false
	}: Props = $props();

	// Per-row search state
	let itemSearches = $state<string[]>(formData.items.map(() => ''));
	let itemDropdownOpen = $state<boolean[]>(formData.items.map(() => false));

	// Derived: selected rack
	const selectedRack = $derived<StorageRack | undefined>(
		mockRacks.find((r) => r.id === formData.rack_id)
	);

	// Derived: cells filtered by selected rack
	const availableCells = $derived<StorageCell[]>(
		formData.rack_id
			? mockStorageCells.filter((c) => c.rack_id === formData.rack_id)
			: []
	);

	// Derived: selected cell
	const selectedCell = $derived<StorageCell | undefined>(
		mockStorageCells.find((c) => c.id === formData.cell_id)
	);

	// Derived: unique group_parent_codes from all assigned items
	const assignedGroupCodes = $derived.by<string[]>(() => {
		const codes = formData.items
			.map((item) => {
				const catalog = mockItemCatalog.find((c) => c.item_code === item.item_code);
				return catalog?.group_parent_code ?? '';
			})
			.filter(Boolean);
		return [...new Set(codes)];
	});

	// Derived: rack name preview = "RAK [code1/code2/...]"
	const rackNamePreview = $derived.by<string>(() => {
		if (!selectedRack) return '-';
		if (assignedGroupCodes.length === 0) return selectedRack.rack_name;
		return `RAK ${assignedGroupCodes.join('/')}`;
	});

	// Derived: cell name preview = "[code1/code2/...] [row]/[col][letter]"
	const cellNamePreview = $derived.by<string>(() => {
		if (!selectedCell) return '-';
		const match = selectedCell.cell_code.match(/^R(\d+)C(\d+)([A-Z]?)$/);
		if (!match) return selectedCell.cell_code;
		const [, row, col, letter] = match;
		const prefix = assignedGroupCodes.length > 0
			? assignedGroupCodes.join('/')
			: (selectedRack?.item_group_code ?? '');
		return `${prefix} ${row}/${col}${letter}`;
	});

	function getFilteredItems(search: string) {
		if (!search.trim()) return mockItemCatalog.slice(0, 8);
		const q = search.toLowerCase();
		return mockItemCatalog.filter(
			(i) =>
				i.item_code.toLowerCase().includes(q) ||
				i.item_name.toLowerCase().includes(q) ||
				i.group_code.toLowerCase().includes(q) ||
				i.group_parent_code.toLowerCase().includes(q)
		).slice(0, 8);
	}

	function handleRackChange(e: Event) {
		formData.rack_id = (e.currentTarget as HTMLSelectElement).value;
		formData.cell_id = '';
	}

	function handleCellChange(e: Event) {
		formData.cell_id = (e.currentTarget as HTMLSelectElement).value;
	}

	function addItem() {
		formData.items = [...formData.items, { item_code: '', item_name: '' }];
		itemSearches = [...itemSearches, ''];
		itemDropdownOpen = [...itemDropdownOpen, false];
	}

	function removeItem(index: number) {
		if (formData.items.length === 1) return;
		formData.items = formData.items.filter((_, i) => i !== index);
		itemSearches = itemSearches.filter((_, i) => i !== index);
		itemDropdownOpen = itemDropdownOpen.filter((_, i) => i !== index);
	}

	function selectItem(index: number, item: typeof mockItemCatalog[0]) {
		formData.items[index] = { item_code: item.item_code, item_name: item.item_name };
		itemSearches[index] = `${item.item_code} - ${item.item_name}`;
		itemDropdownOpen[index] = false;
	}

	function handleSearchInput(index: number, value: string) {
		itemSearches[index] = value;
		itemDropdownOpen[index] = true;
		if (!value) formData.items[index] = { item_code: '', item_name: '' };
	}

	function handleSearchBlur(index: number) {
		setTimeout(() => { itemDropdownOpen[index] = false; }, 200);
	}

	function getItemGroupInfo(item_code: string) {
		return mockItemCatalog.find((c) => c.item_code === item_code);
	}

	const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Informasi Penugasan Penyimpanan</Card.Title>
		<Card.Description>Pilih rak dan cell, lalu assign barang. Nama rak dan cell otomatis menyesuaikan kode group barang.</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-5">
		<div class="grid gap-5 md:grid-cols-2">
			<!-- Gudang -->
			<div class="space-y-2">
				<Label>Gudang</Label>
				<Input value="GUDANG" disabled class="bg-muted" />
			</div>

			<!-- Rak -->
			<div class="space-y-2">
				<Label for="rack">Rak <span class="text-destructive">*</span></Label>
				{#if readonly}
					<Input value={selectedRack?.rack_name ?? '-'} disabled class="bg-muted" />
				{:else}
					<select
						id="rack"
						value={formData.rack_id}
						onchange={handleRackChange}
						class="{selectClass} {errors.rack_id ? 'border-destructive' : ''}"
					>
						<option value="">Pilih rak...</option>
						{#each mockRacks as rack}
							<option value={rack.id}>{rack.rack_name}</option>
						{/each}
					</select>
					{#if errors.rack_id}
						<p class="text-sm text-destructive">{errors.rack_id}</p>
					{/if}
				{/if}
			</div>

			<!-- Cell -->
			<div class="space-y-2">
				<Label for="cell">Cell <span class="text-destructive">*</span></Label>
				{#if readonly}
					<Input value={selectedCell?.cell_code ?? '-'} disabled class="bg-muted" />
				{:else}
					<select
						id="cell"
						value={formData.cell_id}
						onchange={handleCellChange}
						disabled={!formData.rack_id}
						class="{selectClass} {errors.cell_id ? 'border-destructive' : ''}"
					>
						<option value="">{formData.rack_id ? 'Pilih cell...' : 'Pilih rak terlebih dahulu'}</option>
						{#each availableCells as cell}
							<option value={cell.id}>{cell.cell_code}{cell.is_occupied ? ' (Terisi)' : ''}</option>
						{/each}
					</select>
					{#if errors.cell_id}
						<p class="text-sm text-destructive">{errors.cell_id}</p>
					{/if}
				{/if}
			</div>

			<!-- Nama Rak (preview) -->
			<div class="space-y-2">
				<Label>Nama Rak <span class="text-xs text-muted-foreground">(otomatis)</span></Label>
				<Input value={readonly ? (selectedRack?.rack_name ?? '-') : rackNamePreview} disabled class="bg-muted font-medium" />
				{#if !readonly && assignedGroupCodes.length > 0}
					<p class="text-xs text-muted-foreground">
						Dari kode group: <span class="font-medium text-foreground">{assignedGroupCodes.join(', ')}</span>
					</p>
				{/if}
			</div>

			<!-- Nama Cell (preview, full width) -->
			<div class="space-y-2 md:col-span-2">
				<Label>Nama Cell <span class="text-xs text-muted-foreground">(otomatis setelah assign)</span></Label>
				<Input value={readonly ? (selectedCell?.cell_name ?? '-') : cellNamePreview} disabled class="bg-muted font-medium" />
				{#if !readonly && assignedGroupCodes.length > 0}
					<p class="text-xs text-muted-foreground">
						Gabungan kode group: <span class="font-medium text-foreground">{assignedGroupCodes.join('/')}</span>
					</p>
				{/if}
			</div>
		</div>

		<!-- Items Table -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<Label>Barang yang Diassign <span class="text-destructive">*</span></Label>
				{#if !readonly}
					<Button variant="outline" size="sm" onclick={addItem} type="button">
						<Plus class="mr-1.5 h-3.5 w-3.5" />
						Tambah Barang
					</Button>
				{/if}
			</div>

			{#if errors.items}
				<p class="text-sm text-destructive">{errors.items}</p>
			{/if}

			<div class="rounded-md border">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b bg-muted/50">
							<th class="p-2 text-left font-medium">Barang (Kode - Nama)</th>
							{#if !readonly}
								<th class="p-2 text-center font-medium" style="width:50px;"></th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each formData.items as item, index}
							{@const groupInfo = getItemGroupInfo(item.item_code)}
							<tr class="border-b last:border-0">
								<td class="p-2">
									{#if readonly}
										<div>
											<p class="font-medium">{item.item_code} - {item.item_name}</p>
											{#if groupInfo}
												<p class="mt-0.5 text-xs text-muted-foreground">
													Group Induk: <span class="font-medium text-foreground">{groupInfo.group_parent_code}</span>
													&nbsp;·&nbsp;
													Group Barang: <span class="font-medium text-foreground">{groupInfo.group_code}</span>
												</p>
											{/if}
										</div>
									{:else}
										<div class="space-y-1">
											<!-- Dropdown search -->
											<div class="relative">
												<Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
												<Input
													value={itemSearches[index] || (item.item_code ? `${item.item_code} - ${item.item_name}` : '')}
													placeholder="Cari kode atau nama barang..."
													class="h-8 pl-8 text-sm"
													oninput={(e) => handleSearchInput(index, e.currentTarget.value)}
													onfocus={() => { itemDropdownOpen[index] = true; }}
													onblur={() => handleSearchBlur(index)}
												/>
												{#if itemDropdownOpen[index]}
													{@const filtered = getFilteredItems(itemSearches[index] || '')}
													<div class="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
														{#if filtered.length > 0}
															<div class="max-h-[220px] overflow-y-auto p-1">
																{#each filtered as catalogItem}
																	<button
																		type="button"
																		class="flex w-full flex-col rounded-sm px-3 py-2 text-left hover:bg-accent"
																		onmousedown={() => selectItem(index, catalogItem)}
																	>
																		<span class="text-sm font-medium">{catalogItem.item_code} - {catalogItem.item_name}</span>
																		<span class="text-xs text-muted-foreground">
																			Group Induk: <span class="font-medium text-foreground">{catalogItem.group_parent_code}</span>
																			&nbsp;·&nbsp;
																			Group Barang: <span class="font-medium text-foreground">{catalogItem.group_code}</span>
																		</span>
																	</button>
																{/each}
															</div>
														{:else}
															<p class="p-3 text-center text-sm text-muted-foreground">Tidak ada barang ditemukan</p>
														{/if}
													</div>
												{/if}
											</div>
											<!-- Show group info after selection -->
											{#if groupInfo}
												<p class="text-xs text-muted-foreground">
													Group Induk: <span class="font-medium text-foreground">{groupInfo.group_parent_code}</span>
													&nbsp;·&nbsp;
													Group Barang: <span class="font-medium text-foreground">{groupInfo.group_code}</span>
												</p>
											{/if}
										</div>
									{/if}
								</td>
								{#if !readonly}
									<td class="p-2 text-center align-top pt-3">
										<Button
											variant="ghost"
											size="icon"
											class="h-8 w-8"
											onclick={() => removeItem(index)}
											disabled={formData.items.length === 1}
											type="button"
										>
											<Trash2 class="h-4 w-4 text-destructive" />
										</Button>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="text-xs text-muted-foreground">Total: {formData.items.length} barang</p>
		</div>

		<!-- Catatan -->
		<div class="space-y-2">
			<Label for="notes">Catatan</Label>
			<Textarea
				id="notes"
				bind:value={formData.notes}
				placeholder="Catatan tambahan (opsional)"
				readonly={readonly}
				class={readonly ? 'bg-muted' : ''}
				rows={3}
			/>
		</div>
	</Card.Content>
</Card.Root>
