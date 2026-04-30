<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Trash2 } from 'lucide-svelte';
	import { mockStockItems } from '../api/stock-adjustment.mock';

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

	// Unique GRN numbers for dropdown
	const uniqueGRNs = $derived.by(() => {
		const seen = new Set<string>();
		return mockStockItems.filter((s) => {
			if (seen.has(s.grn_no)) return false;
			seen.add(s.grn_no);
			return true;
		});
	});

	// Items for a given GRN (for item code dropdown)
	function getItemsForGRN(grnNo: string) {
		return mockStockItems.filter((s) => s.grn_no === grnNo);
	}

	function handleAddItem() {
		const newItem = {
			grn_no: '',
			item_code: '',
			batch_no: '',
			item_uom: '',
			stk_qty: 0,
			stk_value: 0,
			unit_rate: 0,
			quantity: 0,
			value: 0,
			remarks: ''
		};
		onSaveItem?.(newItem);
	}

	function handleGRNChange(index: number, grnNo: string) {
		// Reset item fields when GRN changes, keep quantity/value/remarks
		const updatedItem = {
			...items[index],
			grn_no: grnNo,
			item_code: '',
			batch_no: '',
			item_uom: '',
			stk_qty: 0,
			stk_value: 0,
			unit_rate: 0
		};
		onEditItem?.(index, updatedItem);
	}

	function handleItemCodeChange(index: number, itemCode: string) {
		const item = items[index];
		const stockItem = mockStockItems.find(
			(s) => s.grn_no === item.grn_no && s.item_code === itemCode
		);
		if (!stockItem) return;

		const updatedItem = {
			...item,
			item_code: itemCode,
			batch_no: stockItem.batch_no,
			item_uom: stockItem.uom,
			stk_qty: stockItem.stk_qty,
			stk_value: stockItem.stk_value,
			unit_rate: stockItem.unit_rate
		};
		onEditItem?.(index, updatedItem);
	}

	function handleQuantityChange(index: number, value: string) {
		const qty = parseFloat(value) || 0;
		const item = items[index];
		const updatedItem = { ...item, quantity: qty };
		onEditItem?.(index, updatedItem);
	}

	function handleValueChange(index: number, value: string) {
		const val = parseFloat(value) || 0;
		const updatedItem = { ...items[index], value: val };
		onEditItem?.(index, updatedItem);
	}

	function handleRemarksChange(index: number, value: string) {
		const updatedItem = { ...items[index], remarks: value };
		onEditItem?.(index, updatedItem);
	}

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}

	const grossAmount = $derived.by(() =>
		items.reduce((sum: number, item: any) => sum + (item.value || 0), 0)
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">
			{readonly ? 'Detail Barang' : 'Daftar Barang Penyesuaian'}
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
								<th class="p-2 text-left font-medium" style="min-width:120px;">No. Batch</th>
								<th class="p-2 text-left font-medium" style="min-width:80px;">Satuan</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">GRN/Stk Qty</th>
								<th class="p-2 text-right font-medium" style="min-width:120px;">GRN/Stk Value</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Quantity</th>
								<th class="p-2 text-right font-medium" style="min-width:120px;">Value</th>
								<th class="p-2 text-left font-medium" style="min-width:160px;">Keterangan</th>
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
												{#each uniqueGRNs as grn}
													<option value={grn.grn_no}>{grn.grn_no}</option>
												{/each}
											</select>
										{/if}
									</td>
									<!-- Item Code -->
									<td class="p-2">
										{#if readonly}
											<span class="text-muted-foreground">{item.item_code || '-'}</span>
										{:else}
											{@const grnItems = getItemsForGRN(item.grn_no)}
											{#if grnItems.length > 0}
												<select
													value={item.item_code}
													class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
													onchange={(e) => handleItemCodeChange(index, e.currentTarget.value)}
												>
													<option value="">Pilih barang</option>
													{#each grnItems as gi}
														<option value={gi.item_code}>{gi.item_code}</option>
													{/each}
												</select>
											{:else}
												<span class="text-xs text-muted-foreground">Pilih GRN dulu</span>
											{/if}
										{/if}
									</td>
									<!-- Batch No -->
									<td class="p-2">
										<span class="text-muted-foreground">{item.batch_no || '-'}</span>
									</td>
									<!-- UOM -->
									<td class="p-2">
										<span class="text-muted-foreground">{item.item_uom || '-'}</span>
									</td>
									<!-- GRN/Stk Qty -->
									<td class="p-2 text-right">
										<span class="text-muted-foreground">{formatNumber(item.stk_qty || 0)}</span>
									</td>
									<!-- GRN/Stk Value -->
									<td class="p-2 text-right">
										<span class="text-muted-foreground">{formatNumber(item.stk_value || 0)}</span>
									</td>
									<!-- Quantity (editable, can be negative) -->
									<td class="p-2">
										{#if readonly}
											<span
												class="block text-right font-medium"
												class:text-red-600={item.quantity < 0}
												class:text-green-600={item.quantity > 0}
											>
												{item.quantity > 0 ? '+' : ''}{formatNumber(item.quantity || 0)}
											</span>
										{:else}
											<Input
												type="number"
												value={item.quantity}
												step="0.001"
												class="h-8 text-right text-sm"
												oninput={(e) => handleQuantityChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Value (editable) -->
									<td class="p-2">
										{#if readonly}
											<span
												class="block text-right font-medium"
												class:text-red-600={item.value < 0}
												class:text-green-600={item.value > 0}
											>
												{item.value > 0 ? '+' : ''}{formatNumber(item.value || 0)}
											</span>
										{:else}
											<Input
												type="number"
												value={item.value}
												step="0.001"
												class="h-8 text-right text-sm"
												oninput={(e) => handleValueChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Remarks -->
									<td class="p-2">
										{#if readonly}
											<span class="text-muted-foreground">{item.remarks || '-'}</span>
										{:else}
											<Input
												value={item.remarks}
												placeholder="Keterangan"
												class="h-8 text-sm"
												oninput={(e) => handleRemarksChange(index, e.currentTarget.value)}
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
								<td colspan={readonly ? 7 : 7} class="p-2 text-right text-sm">Gross Amount</td>
								<td class="p-2 text-right text-sm" class:text-red-600={grossAmount < 0} class:text-green-600={grossAmount > 0}>
									{grossAmount > 0 ? '+' : ''}{formatNumber(grossAmount)}
								</td>
								<td colspan={readonly ? 1 : 2}></td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">Total: {items.length} barang</div>
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
						? 'Tidak ada barang yang disesuaikan dalam transaksi ini'
						: 'Klik "+ Tambah Item" untuk menambahkan barang yang akan disesuaikan'}
				</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
