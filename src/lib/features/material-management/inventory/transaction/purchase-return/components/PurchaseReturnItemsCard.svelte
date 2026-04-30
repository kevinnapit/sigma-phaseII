<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Trash2 } from 'lucide-svelte';
	import BatchwiseTransferModal from '../../transfer-receipt/components/BatchwiseTransferModal.svelte';
	import type { BatchwiseEntry } from '../../transfer-receipt/components/BatchwiseTransferModal.svelte';

	let {
		items = [],
		formData = {},
		onSaveItem,
		onEditItem,
		onDeleteItem,
		readonly = false
	}: {
		items?: any[];
		formData?: any;
		onSaveItem?: (item: any) => void;
		onEditItem?: (index: number, item: any) => void;
		onDeleteItem?: (index: number) => void;
		readonly?: boolean;
	} = $props();

	// Mock GRN data
	const mockGRNs = [
		{
			grn_no: 'GRN/2026/0001',
			supplier_id: 'sup-001',
			items: [
				{
					item_code: '7011812',
					item_name: 'BECOM C',
					uom: 'Caplet',
					grn_qty: 100,
					accepted_qty: 100,
					rate: 5000
				},
				{
					item_code: '7021129',
					item_name: 'MIRASECT TAB / EXTRO',
					uom: 'Tablet',
					grn_qty: 50,
					accepted_qty: 50,
					rate: 7500
				}
			]
		},
		{
			grn_no: 'GRN/2026/0002',
			supplier_id: 'sup-001',
			items: [
				{
					item_code: '7011814',
					item_name: 'BIOSANBE',
					uom: 'Capsul',
					grn_qty: 200,
					accepted_qty: 200,
					rate: 6000
				}
			]
		},
		{
			grn_no: 'GRN/2026/0003',
			supplier_id: 'sup-002',
			items: [
				{
					item_code: '8011001',
					item_name: 'Pupuk NPK 50kg',
					uom: 'Sak',
					grn_qty: 20,
					accepted_qty: 20,
					rate: 150000
				}
			]
		},
		{
			grn_no: 'GRN/2026/0004',
			supplier_id: 'sup-003',
			items: [
				{
					item_code: '8011002',
					item_name: 'Oli Mesin SAE 40',
					uom: 'Liter',
					grn_qty: 50,
					accepted_qty: 50,
					rate: 22500
				}
			]
		}
	];

	// Filter GRNs by selected supplier
	const filteredGRNs = $derived.by(() => {
		const supplierId = formData?.supplier_id;
		if (!supplierId) return mockGRNs;
		return mockGRNs.filter((grn) => grn.supplier_id === supplierId);
	});

	// Batchwise modal state
	let batchModalOpen = $state(false);
	let batchModalItemIndex = $state(-1);
	let batchModalItemName = $state('');
	let batchModalEntries = $state<BatchwiseEntry[]>([]);

	function handleAddItem() {
		const newItem = {
			grn_no: '',
			item_code: '',
			item_name: '',
			item_uom: '',
			grn_qty: 0,
			accepted_qty: 0,
			returned_qty: 0,
			batchwise_entries: [],
			rate: 0,
			total: 0,
			reason: ''
		};
		onSaveItem?.(newItem);
	}

	function handleGRNChange(index: number, grnNo: string) {
		const grn = filteredGRNs.find((g) => g.grn_no === grnNo);
		if (!grn) {
			const updatedItem = { ...items[index], grn_no: grnNo };
			onEditItem?.(index, updatedItem);
			return;
		}

		// Use first item from GRN as default
		const grnItem = grn.items[0];
		const updatedItem = {
			...items[index],
			grn_no: grnNo,
			item_code: grnItem.item_code,
			item_name: grnItem.item_name,
			item_uom: grnItem.uom,
			grn_qty: grnItem.grn_qty,
			accepted_qty: grnItem.accepted_qty,
			rate: grnItem.rate,
			total: (items[index].returned_qty || 0) * grnItem.rate
		};
		onEditItem?.(index, updatedItem);
	}

	function handleReturnedQtyChange(index: number, value: string) {
		const qty = parseFloat(value) || 0;
		const item = items[index];
		const updatedItem = {
			...item,
			returned_qty: qty,
			total: qty * (item.rate || 0)
		};
		onEditItem?.(index, updatedItem);
	}

	function handleRateChange(index: number, value: string) {
		const rate = parseFloat(value) || 0;
		const item = items[index];
		const updatedItem = {
			...item,
			rate,
			total: (item.returned_qty || 0) * rate
		};
		onEditItem?.(index, updatedItem);
	}

	function handleReasonChange(index: number, value: string) {
		const updatedItem = { ...items[index], reason: value };
		onEditItem?.(index, updatedItem);
	}

	function openBatchwiseModal(index: number) {
		const item = items[index];
		batchModalItemIndex = index;
		batchModalItemName = item.item_name || '';
		batchModalEntries = item.batchwise_entries || [];
		batchModalOpen = true;
	}

	function handleBatchwiseConfirm(entries: BatchwiseEntry[]) {
		if (batchModalItemIndex >= 0) {
			const updatedItem = { ...items[batchModalItemIndex], batchwise_entries: entries };
			onEditItem?.(batchModalItemIndex, updatedItem);
		}
		batchModalItemIndex = -1;
	}

	function formatCurrency(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">
			{readonly ? 'Detail Barang' : 'Daftar Barang Dikembalikan'}
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		{#if !readonly}
			<Button variant="outline" size="sm" onclick={handleAddItem}>
				<Plus class="mr-2 h-4 w-4" />
				Tambah Item
			</Button>
		{/if}

		{#if items.length > 0}
			<div class="rounded-md border">
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-sm">
						<thead>
							<tr class="border-b bg-muted/50">
								<th class="p-2 text-left font-medium" style="min-width:160px;">No. GRN</th>
								<th class="p-2 text-left font-medium" style="min-width:110px;">Kode Barang</th>
								<th class="p-2 text-left font-medium" style="min-width:180px;">Nama Barang</th>
								<th class="p-2 text-left font-medium" style="min-width:80px;">Satuan</th>
								<th class="p-2 text-right font-medium" style="min-width:90px;">Qty GRN</th>
								<th class="p-2 text-right font-medium" style="min-width:100px;">Qty Diterima</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Qty Kembali</th>
								<th class="p-2 text-center font-medium" style="min-width:60px;">Kode</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Harga</th>
								<th class="p-2 text-right font-medium" style="min-width:120px;">Total</th>
								<th class="p-2 text-left font-medium" style="min-width:160px;">Alasan</th>
								{#if !readonly}
									<th class="p-2 text-center font-medium" style="min-width:60px;">Aksi</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b last:border-0">
									<!-- GRN No -->
									<td class="p-2">
										{#if readonly}
											<span class="text-muted-foreground">{item.grn_no || '-'}</span>
										{:else}
											<select
												value={item.grn_no}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												onchange={(e) => handleGRNChange(index, e.currentTarget.value)}
											>
												<option value="">Pilih GRN</option>
												{#each filteredGRNs as grn}
													<option value={grn.grn_no}>{grn.grn_no}</option>
												{/each}
											</select>
										{/if}
									</td>
									<!-- Item Code -->
									<td class="p-2">
										<span class="text-muted-foreground">{item.item_code || '-'}</span>
									</td>
									<!-- Item Name -->
									<td class="p-2">
										<span class="font-medium">{item.item_name || '-'}</span>
									</td>
									<!-- UOM -->
									<td class="p-2">
										<span class="text-muted-foreground">{item.item_uom || '-'}</span>
									</td>
									<!-- GRN Qty -->
									<td class="p-2 text-right">
										<span class="text-muted-foreground">{item.grn_qty || 0}</span>
									</td>
									<!-- Accepted Qty -->
									<td class="p-2 text-right">
										<span class="text-muted-foreground">{item.accepted_qty || 0}</span>
									</td>
									<!-- Returned Qty -->
									<td class="p-2">
										{#if readonly}
											<span class="block text-right text-muted-foreground"
												>{item.returned_qty || 0}</span
											>
										{:else}
											<Input
												type="number"
												value={item.returned_qty}
												min="0"
												max={item.accepted_qty}
												class="h-8 text-right text-sm"
												oninput={(e) => handleReturnedQtyChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Batchwise button -->
									<td class="p-2 text-center">
										{#if readonly}
											<span class="text-xs text-muted-foreground">
												{item.batchwise_entries?.length > 0
													? item.batchwise_entries
															.map((e: any) => e.batch)
															.filter(Boolean)
															.join(', ')
													: '-'}
											</span>
										{:else}
											<Button
												variant="outline"
												size="sm"
												class="h-8 px-2 text-xs"
												onclick={() => openBatchwiseModal(index)}
											>
												...
											</Button>
										{/if}
									</td>
									<!-- Rate -->
									<td class="p-2">
										{#if readonly}
											<span class="block text-right text-muted-foreground"
												>{formatCurrency(item.rate || 0)}</span
											>
										{:else}
											<Input
												type="number"
												value={item.rate}
												min="0"
												class="h-8 text-right text-sm"
												oninput={(e) => handleRateChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Total -->
									<td class="p-2 text-right">
										<span class="font-medium">{formatCurrency(item.total || 0)}</span>
									</td>
									<!-- Reason -->
									<td class="p-2">
										{#if readonly}
											<span class="text-muted-foreground">{item.reason || '-'}</span>
										{:else}
											<Input
												value={item.reason}
												placeholder="Alasan"
												class="h-8 text-sm"
												oninput={(e) => handleReasonChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Delete action -->
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
						<tfoot>
							<tr class="border-t font-semibold">
								<td colspan={readonly ? 9 : 9} class="p-2 text-right text-sm">Gross Amount</td>
								<td class="p-2 text-right text-sm">
									{formatCurrency(items.reduce((sum, item) => sum + (item.total || 0), 0))}
								</td>
								<td colspan={readonly ? 1 : 2}></td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">
				Total: {items.length} barang
			</div>
		{:else}
			<div class="rounded-lg border border-dashed p-8 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					<Plus class="h-8 w-8 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">
					{readonly ? 'Tidak Ada Barang' : 'Belum Ada Barang'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{readonly
						? 'Tidak ada barang yang dikembalikan dalam transaksi ini'
						: 'Klik "+ Tambah Item" untuk menambahkan barang yang akan dikembalikan'}
				</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

<!-- Batchwise Transfer Modal -->
<BatchwiseTransferModal
	bind:open={batchModalOpen}
	itemName={batchModalItemName}
	bind:entries={batchModalEntries}
	onConfirm={handleBatchwiseConfirm}
/>
