<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search, Trash2, Layers, DollarSign } from 'lucide-svelte';
	import BatchwiseTransferModal from '../../transfer-receipt/components/BatchwiseTransferModal.svelte';
	import AdditionalChargesModal from '../../transfer-receipt/components/AdditionalChargesModal.svelte';
	import type { BatchwiseEntry } from '../../transfer-receipt/components/BatchwiseTransferModal.svelte';
	import type { AdditionalChargeEntry } from '../../transfer-receipt/components/AdditionalChargesModal.svelte';

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

	// Mock item data for GRN Without PO
	const mockItems = [
		{
			code: '7011812',
			name: 'BECOM C',
			uom: 'Caplet',
			available_storages: ['RAK-A-01', 'RAK-B-02', 'RAK-C-03'],
			batch_options: [
				{ batch_no: 'BATCH001', mfd_date: '2026-01-01', exp_date: '2027-01-01', unit_rate: 5000 },
				{ batch_no: 'BATCH011', mfd_date: '2026-02-01', exp_date: '2027-02-01', unit_rate: 5200 }
			]
		},
		{
			code: '7021129',
			name: 'MIRASECT TAB / EXTRO',
			uom: 'Tablet',
			available_storages: ['RAK-B-02', 'RAK-D-04'],
			batch_options: [
				{ batch_no: 'BATCH002', mfd_date: '2026-02-01', exp_date: '2027-02-01', unit_rate: 7500 }
			]
		},
		{
			code: '7011814',
			name: 'BIOSANBE',
			uom: 'Capsul',
			available_storages: ['RAK-C-03', 'JAC-2'],
			batch_options: [
				{ batch_no: 'BATCH003', mfd_date: '2026-03-01', exp_date: '2027-03-01', unit_rate: 6000 }
			]
		},
		{
			code: '8011001',
			name: 'Pupuk NPK 50kg',
			uom: 'Sak',
			available_storages: ['JAC-2', 'RAK-D-04'],
			batch_options: [
				{ batch_no: 'BATCH004', mfd_date: '2026-01-15', exp_date: '2028-01-15', unit_rate: 150000 }
			]
		},
		{
			code: '8011002',
			name: 'Oli Mesin SAE 40',
			uom: 'Liter',
			available_storages: ['RAK-D-04'],
			batch_options: [
				{ batch_no: 'BATCH005', mfd_date: '2026-02-10', exp_date: '2027-02-10', unit_rate: 22500 }
			]
		}
	];

	const filteredItems = $derived.by(() => {
		if (!searchQuery.trim()) return [];
		const query = searchQuery.toLowerCase();
		return mockItems.filter(
			(item) =>
				item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
		);
	});

	function handleSelectItem(item: any) {
		const firstBatch = item.batch_options[0];
		const newItem = {
			item_code: item.code,
			item_name: item.name,
			item_uom: item.uom,
			available_storages: item.available_storages,
			batch_options: item.batch_options,
			grn_quantity: 1,
			accepted_quantity: 1,
			unit_rate: firstBatch.unit_rate,
			total_value: 1 * firstBatch.unit_rate,
			batch_no: firstBatch.batch_no,
			mfd_date: firstBatch.mfd_date,
			exp_date: firstBatch.exp_date,
			storage: item.available_storages[0],
			offered_qty: 0,
			percentage_amount: 0,
			batchwise_entries: [] as BatchwiseEntry[],
			additional_charges: [] as AdditionalChargeEntry[],
			total_amount: 1 * firstBatch.unit_rate
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
		const quantity = parseFloat(value) || 0;
		const item = items[index];
		const updatedItem = { ...item, [field]: quantity };
		if (field === 'accepted_quantity') {
			updatedItem.total_value = quantity * item.unit_rate;
			updatedItem.total_amount = quantity * item.unit_rate;
		}
		if (field === 'unit_rate') {
			updatedItem.total_value = item.accepted_quantity * quantity;
			updatedItem.total_amount = item.accepted_quantity * quantity;
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
		chargesModalEntries = (item.additional_charges ?? []).map((e: AdditionalChargeEntry) => ({
			...e
		}));
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

	const grossAmount = $derived(items.reduce((sum, item) => sum + (item.total_amount || 0), 0));

	function batchwiseSummary(item: any): string {
		const entries: BatchwiseEntry[] = item.batchwise_entries ?? [];
		if (entries.length === 0) return '-';
		return entries.map((e) => e.batch).filter(Boolean).join(', ') || `${entries.length} baris`;
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
					<div
						class="search-results absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md"
					>
						{#if filteredItems.length > 0}
							<div class="max-h-[300px] overflow-y-auto p-1">
								<p class="px-3 py-2 text-xs text-muted-foreground">
									Ditemukan {filteredItems.length} barang
								</p>
								{#each filteredItems as item}
									<button
										type="button"
										class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left hover:bg-accent"
										onclick={() => handleSelectItem(item)}
									>
										<div class="flex-1">
											<p class="text-sm font-medium">{item.code} - {item.name}</p>
											<p class="text-xs text-muted-foreground">{item.uom}</p>
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
								<th class="p-2 text-left text-sm font-medium" style="min-width:180px;">Nama Barang</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:100px;">Jumlah GRN</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:80px;">Satuan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Jumlah Diterima</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:110px;">Harga Satuan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Total Nilai</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">No. Batch</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:110px;">Kode</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Tgl Kadaluarsa</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Tgl Produksi</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:110px;">Qty Ditawarkan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Penyimpanan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:100px;">% Jumlah</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:110px;">Kode</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width:120px;">Total Jumlah</th>
								{#if !readonly}
									<th class="p-2 text-center text-sm font-medium" style="min-width:60px;">Aksi</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b">
									<!-- 1. Item Code -->
									<td class="p-2">
										<span class="text-sm font-medium">{item.item_code}</span>
									</td>
									<!-- 2. Item Name -->
									<td class="p-2">
										<span class="text-sm">{item.item_name}</span>
									</td>
									<!-- 3. GRN Qty (editable) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.grn_quantity}</span>
										{:else}
											<Input
												type="number"
												value={item.grn_quantity}
												min="0"
												class="h-8 text-sm"
												oninput={(e) =>
													handleQuantityChange(index, 'grn_quantity', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- 4. UOM -->
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.item_uom}</span>
									</td>
									<!-- 5. Accepted Quantity (editable) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.accepted_quantity}</span>
										{:else}
											<Input
												type="number"
												value={item.accepted_quantity}
												min="0"
												class="h-8 text-sm"
												oninput={(e) =>
													handleQuantityChange(index, 'accepted_quantity', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- 6. Unit Rate (editable) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground"
												>{new Intl.NumberFormat('id-ID').format(item.unit_rate)}</span
											>
										{:else}
											<Input
												type="number"
												value={item.unit_rate}
												min="0"
												class="h-8 text-sm"
												oninput={(e) =>
													handleQuantityChange(index, 'unit_rate', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- 7. Total Value (auto-calc) -->
									<td class="p-2">
										<span class="text-sm text-muted-foreground"
											>{new Intl.NumberFormat('id-ID').format(item.total_value)}</span
										>
									</td>
									<!-- 8. Batch No (dropdown) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.batch_no || '-'}</span>
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
									<!-- 9. Code → Batchwise Transfer -->
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
									<!-- 10. Exp Date (auto-fill from batch) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.exp_date || '-'}</span>
										{:else}
											<Input
												type="date"
												value={item.exp_date}
												class="h-8 text-sm"
												oninput={(e) =>
													handleDateChange(index, 'exp_date', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- 11. Mfd Date (auto-fill from batch) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.mfd_date || '-'}</span>
										{:else}
											<Input
												type="date"
												value={item.mfd_date}
												class="h-8 text-sm"
												oninput={(e) =>
													handleDateChange(index, 'mfd_date', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- 12. Offered Qty (editable) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.offered_qty ?? 0}</span>
										{:else}
											<Input
												type="number"
												value={item.offered_qty ?? 0}
												min="0"
												class="h-8 text-sm"
												oninput={(e) =>
													handleQuantityChange(index, 'offered_qty', e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- 13. Storage (dropdown) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.storage || '-'}</span>
										{:else if item.available_storages && item.available_storages.length > 0}
											<select
												value={item.storage}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) =>
													handleFieldChange(index, 'storage', e.currentTarget.value)}
											>
												{#each item.available_storages as storage}
													<option value={storage}>{storage}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.storage || '-'}</span>
										{/if}
									</td>
									<!-- 14. %Amount (editable) -->
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground"
												>{item.percentage_amount ?? 0}</span
											>
										{:else}
											<Input
												type="number"
												value={item.percentage_amount ?? 0}
												min="0"
												max="100"
												class="h-8 text-sm"
												oninput={(e) =>
													handleQuantityChange(
														index,
														'percentage_amount',
														e.currentTarget.value
													)}
											/>
										{/if}
									</td>
									<!-- 15. Code → Additional Charges -->
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
									<!-- 16. Total Amount (auto-calc) -->
									<td class="p-2">
										<span class="text-sm text-muted-foreground"
											>{new Intl.NumberFormat('id-ID').format(item.total_amount)}</span
										>
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
							>Rp {new Intl.NumberFormat('id-ID').format(grossAmount)}</span
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
