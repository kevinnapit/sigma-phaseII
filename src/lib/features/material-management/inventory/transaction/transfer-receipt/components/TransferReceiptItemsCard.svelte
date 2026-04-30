<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search, Trash2, Layers, DollarSign } from 'lucide-svelte';
	import BatchwiseTransferModal from './BatchwiseTransferModal.svelte';
	import AdditionalChargesModal from './AdditionalChargesModal.svelte';
	import type { BatchwiseEntry } from './BatchwiseTransferModal.svelte';
	import type { AdditionalChargeEntry } from './AdditionalChargesModal.svelte';

	let {
		items = [],
		onSaveItem,
		onEditItem,
		onDeleteItem,
		readonly = false
	}: {
		items?: any[];
		onSaveItem?: (item: any) => void;
		onEditItem?: (index: number, item: any) => void;
		onDeleteItem?: (index: number) => void;
		readonly?: boolean;
	} = $props();

	let searchQuery = $state('');
	let showSearchResults = $state(false);
	let searchInputRef: HTMLInputElement | null = null;

	// Batchwise Transfer modal state
	let batchModalOpen = $state(false);
	let batchModalIndex = $state(-1);
	let batchModalEntries = $state<BatchwiseEntry[]>([]);
	let batchModalItemName = $state('');

	// Additional Charges modal state
	let chargesModalOpen = $state(false);
	let chargesModalIndex = $state(-1);
	let chargesModalEntries = $state<AdditionalChargeEntry[]>([]);
	let chargesModalItemName = $state('');
	let chargesModalBase = $state(0);

	// Mock item data based on MR selection
	const mockItems = [
		{
			code: '7011812',
			name: 'BECOM C',
			uom: 'Caplet',
			mr_quantity: 100,
			available_storages: ['RAK-A-01', 'RAK-B-02', 'RAK-C-03'],
			batch_options: [
				{ batch_no: 'BATCH001', mfd_date: '2026-01-01', exp_date: '2027-01-01', unit_rate: 5000 },
				{ batch_no: 'BATCH011', mfd_date: '2026-02-01', exp_date: '2027-02-01', unit_rate: 5200 }
			],
			mr_allocations: ['ALLOC-001', 'ALLOC-002']
		},
		{
			code: '7021129',
			name: 'MIRASECT TAB / EXTRO',
			uom: 'Tablet',
			mr_quantity: 100,
			available_storages: ['RAK-B-02', 'RAK-D-04'],
			batch_options: [
				{ batch_no: 'BATCH002', mfd_date: '2026-02-01', exp_date: '2027-02-01', unit_rate: 7500 }
			],
			mr_allocations: ['ALLOC-002', 'ALLOC-003']
		},
		{
			code: '7011814',
			name: 'BIOSANBE',
			uom: 'Capsul',
			mr_quantity: 100,
			available_storages: ['RAK-C-03', 'JAC-2'],
			batch_options: [
				{ batch_no: 'BATCH003', mfd_date: '2026-03-01', exp_date: '2027-03-01', unit_rate: 6000 }
			],
			mr_allocations: ['ALLOC-003', 'ALLOC-004']
		}
	];

	const filteredItems = $derived(() => {
		if (!searchQuery.trim()) return [];
		const query = searchQuery.toLowerCase();
		return mockItems.filter(
			(item) => item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
		);
	});

	function handleSelectItem(item: any) {
		const firstBatch = item.batch_options[0];
		const newItem = {
			item_code: item.code,
			item_name: item.name,
			item_uom: item.uom,
			mr_quantity: item.mr_quantity,
			available_storages: item.available_storages,
			batch_options: item.batch_options,
			mr_allocations: item.mr_allocations,
			grn_quantity: item.mr_quantity,
			grn_uom: item.uom,
			accepted_quantity: item.mr_quantity,
			storage: item.available_storages[0],
			mr_allocation: item.mr_allocations[0],
			batch_no: firstBatch.batch_no,
			mfd_date: firstBatch.mfd_date,
			exp_date: firstBatch.exp_date,
			unit_rate: firstBatch.unit_rate,
			total_value: item.mr_quantity * firstBatch.unit_rate,
			total_amount: item.mr_quantity * firstBatch.unit_rate,
			// Batchwise entries
			batchwise_entries: [] as BatchwiseEntry[],
			// Additional charges entries
			additional_charges: [] as AdditionalChargeEntry[],
			percentage_amount: 0
		};
		onSaveItem?.(newItem);
		searchQuery = '';
		showSearchResults = false;
	}

	function handleBatchChange(index: number, batchNo: string) {
		const item = items[index];
		const selectedBatch = item.batch_options?.find((b: any) => b.batch_no === batchNo);
		if (selectedBatch) {
			const updatedItem = {
				...item,
				batch_no: batchNo,
				mfd_date: selectedBatch.mfd_date,
				exp_date: selectedBatch.exp_date,
				unit_rate: selectedBatch.unit_rate,
				total_value: item.accepted_quantity * selectedBatch.unit_rate,
				total_amount: item.accepted_quantity * selectedBatch.unit_rate
			};
			onEditItem?.(index, updatedItem);
		}
	}

	function handleQuantityChange(index: number, field: string, value: string) {
		const quantity = parseInt(value) || 0;
		const item = items[index];
		const updatedItem = { ...item, [field]: quantity };
		if (field === 'accepted_quantity') {
			updatedItem.total_value = quantity * item.unit_rate;
			updatedItem.total_amount = quantity * item.unit_rate;
		}
		onEditItem?.(index, updatedItem);
	}

	function handleFieldChange(index: number, field: string, value: string) {
		const updatedItem = { ...items[index], [field]: value };
		onEditItem?.(index, updatedItem);
	}

	function handleDateChange(index: number, field: string, value: string) {
		const updatedItem = { ...items[index], [field]: value };
		onEditItem?.(index, updatedItem);
	}

	// ── Batchwise Transfer ──────────────────────────────────────────────────────
	function openBatchwiseModal(index: number) {
		const item = items[index];
		batchModalIndex = index;
		batchModalItemName = `${item.item_code} – ${item.item_name}`;
		batchModalEntries = (item.batchwise_entries ?? []).map((e: BatchwiseEntry) => ({ ...e }));
		batchModalOpen = true;
	}

	function handleBatchwiseConfirm(entries: BatchwiseEntry[]) {
		if (batchModalIndex < 0) return;
		const updatedItem = { ...items[batchModalIndex], batchwise_entries: entries };
		onEditItem?.(batchModalIndex, updatedItem);
		batchModalIndex = -1;
	}

	// ── Additional Charges ──────────────────────────────────────────────────────
	function openChargesModal(index: number) {
		const item = items[index];
		chargesModalIndex = index;
		chargesModalItemName = `${item.item_code} – ${item.item_name}`;
		chargesModalBase = item.total_value ?? 0;
		chargesModalEntries = (item.additional_charges ?? []).map((e: AdditionalChargeEntry) => ({ ...e }));
		chargesModalOpen = true;
	}

	function handleChargesConfirm(entries: AdditionalChargeEntry[]) {
		if (chargesModalIndex < 0) return;
		const updatedItem = { ...items[chargesModalIndex], additional_charges: entries };
		onEditItem?.(chargesModalIndex, updatedItem);
		chargesModalIndex = -1;
	}

	// Close search dropdown when clicking outside
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (
				searchInputRef &&
				!searchInputRef.contains(target) &&
				!target.closest('.search-results')
			) {
				showSearchResults = false;
			}
		}
		if (showSearchResults) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	const grossAmount = $derived(() =>
		items.reduce((sum, item) => sum + (item.total_amount || 0), 0)
	);

	function batchwiseSummary(item: any): string {
		const entries: BatchwiseEntry[] = item.batchwise_entries ?? [];
		if (entries.length === 0) return '-';
		return entries.map(e => e.batch).filter(Boolean).join(', ') || `${entries.length} baris`;
	}

	function chargesSummary(item: any): string {
		const entries: AdditionalChargeEntry[] = item.additional_charges ?? [];
		if (entries.length === 0) return '-';
		const total = entries.reduce((s, e) => s + (e.amount || 0), 0);
		return `Rp ${new Intl.NumberFormat('id-ID').format(total)}`;
	}
</script>

<!-- Batchwise Transfer Modal -->
<BatchwiseTransferModal
	bind:open={batchModalOpen}
	itemName={batchModalItemName}
	bind:entries={batchModalEntries}
	{readonly}
	onConfirm={handleBatchwiseConfirm}
/>

<!-- Additional Charges Modal -->
<AdditionalChargesModal
	bind:open={chargesModalOpen}
	itemName={chargesModalItemName}
	baseAmount={chargesModalBase}
	bind:entries={chargesModalEntries}
	{readonly}
	onConfirm={handleChargesConfirm}
/>

<Card>
	<CardHeader>
		<CardTitle class="text-lg"
			>{readonly ? 'Daftar Barang Diterima' : 'Cari & Tambah Barang'}</CardTitle
		>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Search -->
		{#if !readonly}
			<div class="relative">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					bind:this={searchInputRef}
					bind:value={searchQuery}
					placeholder="Ketik kode atau nama barang untuk mencari..."
					class="pl-9"
					onfocus={() => (showSearchResults = true)}
					oninput={() => (showSearchResults = true)}
				/>
				{#if showSearchResults && searchQuery.trim()}
					<div class="search-results absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
						{#if filteredItems().length > 0}
							<div class="max-h-[300px] overflow-y-auto p-1">
								<p class="px-3 py-2 text-xs text-muted-foreground">
									Ditemukan {filteredItems().length} barang
								</p>
								{#each filteredItems() as item}
									<button
										type="button"
										class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left hover:bg-accent"
										onclick={() => handleSelectItem(item)}
									>
										<div class="flex-1">
											<p class="text-sm font-medium">{item.code} - {item.name}</p>
											<p class="text-xs text-muted-foreground">
												{item.uom} • MR Qty: {item.mr_quantity}
											</p>
										</div>
										<Button size="sm" variant="ghost" class="h-7 text-xs">Pilih</Button>
									</button>
								{/each}
							</div>
						{:else}
							<div class="p-4 text-center text-sm text-muted-foreground">
								Tidak ada barang yang ditemukan
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Items Table -->
		{#if items.length > 0}
			<div class="rounded-md border">
				<div class="overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="border-b bg-muted/50">
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Kode Barang</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:200px;">Nama Barang</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:80px;">Satuan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:100px;">Jumlah MR</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:100px;">Jumlah GRN</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:80px;">Satuan GRN</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Jumlah Diterima</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:100px;">Harga Satuan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Total Nilai</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Nomor Batch</th>
								<!-- Kode 1 → Batchwise Transfer popup -->
								<th class="p-2 text-left text-sm font-medium" style="min-width:110px;">Kode</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Tanggal Produksi</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Tanggal Kadaluarsa</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Penyimpanan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:100px;">% Jumlah</th>
								<!-- Kode 2 → Additional Charges popup -->
								<th class="p-2 text-left text-sm font-medium" style="min-width:110px;">Kode</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Total Jumlah</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Alokasi MR</th>
								{#if !readonly}
									<th class="p-2 text-center text-sm font-medium" style="min-width:60px;">Aksi</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b">
									<td class="p-2">
										<span class="text-sm font-medium">{item.item_code}</span>
									</td>
									<td class="p-2">
										<span class="text-sm">{item.item_name}</span>
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.item_uom}</span>
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.mr_quantity}</span>
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.grn_quantity}</span>
										{:else}
											<Input
												type="number"
												value={item.grn_quantity}
												min="1"
												class="h-8 text-sm"
												oninput={(e) => handleQuantityChange(index, 'grn_quantity', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.grn_uom}</span>
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.accepted_quantity}</span>
										{:else}
											<Input
												type="number"
												value={item.accepted_quantity}
												min="1"
												max={item.grn_quantity}
												class="h-8 text-sm"
												oninput={(e) => handleQuantityChange(index, 'accepted_quantity', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground"
											>{new Intl.NumberFormat('id-ID').format(item.unit_rate)}</span
										>
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground"
											>{new Intl.NumberFormat('id-ID').format(item.total_value)}</span
										>
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.batch_no}</span>
										{:else if item.batch_options && item.batch_options.length > 0}
											<select
												value={item.batch_no}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleBatchChange(index, e.currentTarget.value)}
											>
												{#each item.batch_options as batch}
													<option value={batch.batch_no}>{batch.batch_no}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.batch_no || '-'}</span>
										{/if}
									</td>

									<!-- Kode 1: Batchwise Transfer -->
									<td class="p-2">
										<button
											type="button"
											class="flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2 text-sm hover:bg-accent"
											onclick={() => openBatchwiseModal(index)}
											title="Batchwise Transfer"
										>
											<Layers class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
											<span class="flex-1 truncate text-left text-xs text-muted-foreground">
												{batchwiseSummary(item)}
											</span>
										</button>
									</td>

									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.mfd_date}</span>
										{:else}
											<Input
												type="date"
												value={item.mfd_date}
												class="h-8 text-sm"
												oninput={(e) => handleDateChange(index, 'mfd_date', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.exp_date}</span>
										{:else}
											<Input
												type="date"
												value={item.exp_date}
												class="h-8 text-sm"
												oninput={(e) => handleDateChange(index, 'exp_date', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.storage || '-'}</span>
										{:else if item.available_storages && item.available_storages.length > 0}
											<select
												value={item.storage}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleFieldChange(index, 'storage', e.currentTarget.value)}
											>
												{#each item.available_storages as storage}
													<option value={storage}>{storage}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.storage || '-'}</span>
										{/if}
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.percentage_amount}</span>
										{:else}
											<Input
												type="number"
												value={item.percentage_amount}
												min="0"
												max="100"
												class="h-8 text-sm"
												oninput={(e) => handleQuantityChange(index, 'percentage_amount', e.currentTarget.value)}
											/>
										{/if}
									</td>

									<!-- Kode 2: Additional Charges -->
									<td class="p-2">
										<button
											type="button"
											class="flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2 text-sm hover:bg-accent"
											onclick={() => openChargesModal(index)}
											title="Additional Charges"
										>
											<DollarSign class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
											<span class="flex-1 truncate text-left text-xs text-muted-foreground">
												{chargesSummary(item)}
											</span>
										</button>
									</td>

									<td class="p-2">
										<span class="text-sm text-muted-foreground"
											>{new Intl.NumberFormat('id-ID').format(item.total_amount)}</span
										>
									</td>

									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.mr_allocation || '-'}</span>
										{:else if item.mr_allocations && item.mr_allocations.length > 0}
											<select
												value={item.mr_allocation}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleFieldChange(index, 'mr_allocation', e.currentTarget.value)}
											>
												{#each item.mr_allocations as allocation}
													<option value={allocation}>{allocation}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.mr_allocation || '-'}</span>
										{/if}
									</td>

									{#if !readonly}
										<td class="p-2 text-center">
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												onclick={() => onDeleteItem?.(index)}
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
			</div>

			<!-- Gross Amount -->
			<div class="flex justify-end">
				<div class="rounded-lg border bg-muted/50 p-4">
					<div class="flex items-center gap-4">
						<span class="text-sm font-medium">Gross Amount:</span>
						<span class="text-lg font-bold"
							>Rp {new Intl.NumberFormat('id-ID').format(grossAmount())}</span
						>
					</div>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">Total: {items.length} barang</div>
		{:else}
			<div class="rounded-lg border border-dashed p-8 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					<Search class="h-8 w-8 text-muted-foreground" />
				</div>
				{#if readonly}
					<h3 class="mb-2 text-lg font-semibold">Tidak Ada Barang</h3>
					<p class="text-sm text-muted-foreground">
						Tidak ada barang yang diterima dalam transaksi ini
					</p>
				{:else}
					<h3 class="mb-2 text-lg font-semibold">Belum Ada Barang</h3>
					<p class="text-sm text-muted-foreground">Cari dan tambahkan barang yang akan diterima</p>
				{/if}
			</div>
		{/if}
	</CardContent>
</Card>
