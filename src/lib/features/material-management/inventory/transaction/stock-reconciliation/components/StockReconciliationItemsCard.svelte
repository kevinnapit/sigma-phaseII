<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ClipboardList } from 'lucide-svelte';
	import BatchwiseTransferModal from '../../transfer-receipt/components/BatchwiseTransferModal.svelte';
	import type { ReconciliationItem } from '../types/stock-reconciliation.types';

	let {
		items = [],
		onEditItem,
		readonly = false
	}: {
		items?: ReconciliationItem[];
		onEditItem?: (index: number, item: ReconciliationItem) => void;
		readonly?: boolean;
	} = $props();

	const uomOptions = [
		'Buah', 'Meter', 'Liter', 'Kilogram', 'Sak', 'Batang',
		'Caplet', 'Tablet', 'Capsul', 'Set', 'Lembar', 'Rol',
		'Karton', 'Botol', 'Kaleng', 'Drum', 'Ton', 'Gram'
	];

	// State untuk BatchwiseTransferModal
	let batchModalOpen = $state(false);
	let batchModalIndex = $state(-1);
	let batchModalItemName = $state('');
	let batchModalEntries = $state<any[]>([]);

	function handlePhysicalStockChange(index: number, value: string) {
		const stock = parseFloat(value) || 0;
		const item = items[index];
		const variations = stock - item.system_quantity;
		const updatedItem: ReconciliationItem = { ...item, physical_stock: stock, variations };
		onEditItem?.(index, updatedItem);
	}

	function handlePhysicalValueChange(index: number, value: string) {
		const val = parseFloat(value) || 0;
		const updatedItem: ReconciliationItem = { ...items[index], physical_value: val };
		onEditItem?.(index, updatedItem);
	}

	function handleUomChange(index: number, value: string) {
		const updatedItem: ReconciliationItem = { ...items[index], uom: value };
		onEditItem?.(index, updatedItem);
	}

	function handleAdjustedQuantityChange(index: number, value: string) {
		const qty = parseFloat(value) || 0;
		const updatedItem: ReconciliationItem = { ...items[index], adjusted_quantity: qty };
		onEditItem?.(index, updatedItem);
	}

	function handleAdjustedValueChange(index: number, value: string) {
		const val = parseFloat(value) || 0;
		const updatedItem: ReconciliationItem = { ...items[index], adjusted_value: val };
		onEditItem?.(index, updatedItem);
	}

	function handleApprovedChange(index: number, checked: boolean) {
		const updatedItem: ReconciliationItem = { ...items[index], approved: checked };
		onEditItem?.(index, updatedItem);
	}

	function handleRemarksChange(index: number, value: string) {
		const updatedItem: ReconciliationItem = { ...items[index], remarks: value };
		onEditItem?.(index, updatedItem);
	}

	function openBatchModal(index: number) {
		batchModalIndex = index;
		batchModalItemName = items[index].item_name;
		batchModalEntries = items[index].batchwise_entries ?? [];
		batchModalOpen = true;
	}

	function handleBatchConfirm(entries: any[]) {
		if (batchModalIndex >= 0) {
			const updatedItem: ReconciliationItem = {
				...items[batchModalIndex],
				batchwise_entries: entries
			};
			onEditItem?.(batchModalIndex, updatedItem);
		}
		batchModalOpen = false;
	}

	function getVariationClass(variations: number): string {
		if (variations < 0) return 'text-red-600 font-medium';
		if (variations > 0) return 'text-green-600 font-medium';
		return 'text-muted-foreground';
	}

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">
			{readonly ? 'Detail Barang' : 'Daftar Barang Rekonsiliasi'}
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		{#if items.length === 0}
			<div class="rounded-lg border border-dashed p-8 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					<ClipboardList class="h-8 w-8 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">
					{readonly ? 'Tidak Ada Barang' : 'Belum Ada Barang'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{readonly
						? 'Tidak ada barang dalam rekonsiliasi stok ini'
						: 'Pilih jadwal verifikasi untuk memuat daftar barang'}
				</p>
			</div>
		{:else}
			<div class="rounded-md border">
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-sm">
						<thead>
							<tr class="border-b bg-muted/50">
								<th class="p-2 text-left font-medium" style="min-width:180px;">Nama Barang</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Jumlah Sistem</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Nilai Sistem</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Stok Fisik</th>
								<th class="p-2 text-right font-medium" style="min-width:110px;">Nilai Fisik</th>
								<th class="p-2 text-right font-medium" style="min-width:90px;">Variasi</th>
								<th class="p-2 text-center font-medium" style="min-width:50px;">...</th>
								<th class="p-2 text-left font-medium" style="min-width:110px;">Satuan</th>
								<th class="p-2 text-right font-medium" style="min-width:120px;">Jml Disesuaikan</th>
								<th class="p-2 text-right font-medium" style="min-width:120px;">Nilai Disesuaikan</th>
								<th class="p-2 text-center font-medium" style="min-width:80px;">Disetujui</th>
								<th class="p-2 text-left font-medium" style="min-width:150px;">Keterangan</th>
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b last:border-0">
									<!-- Nama Barang -->
									<td class="p-2">
										<p class="font-medium text-sm">{item.item_name}</p>
									</td>
									<!-- Jumlah Sistem -->
									<td class="p-2 text-right text-muted-foreground">
										{formatNumber(item.system_quantity)}
									</td>
									<!-- Nilai Sistem -->
									<td class="p-2 text-right text-muted-foreground">
										{formatNumber(item.system_value)}
									</td>
									<!-- Stok Fisik -->
									<td class="p-2">
										{#if readonly}
											<span class="block text-right font-medium">
												{formatNumber(item.physical_stock)}
											</span>
										{:else}
											<Input
												type="number"
												value={item.physical_stock}
												step="0.001"
												min="0"
												class="h-8 text-right text-sm"
												oninput={(e) => handlePhysicalStockChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Nilai Fisik -->
									<td class="p-2">
										{#if readonly}
											<span class="block text-right font-medium">
												{formatNumber(item.physical_value)}
											</span>
										{:else}
											<Input
												type="number"
												value={item.physical_value}
												step="0.01"
												min="0"
												class="h-8 text-right text-sm"
												oninput={(e) => handlePhysicalValueChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Variasi (read-only, auto-calc) -->
									<td class="p-2 text-right">
										<span class={getVariationClass(item.variations)}>
											{item.variations > 0 ? '+' : ''}{formatNumber(item.variations)}
										</span>
									</td>
									<!-- Batchwise button -->
									<td class="p-2 text-center">
										<Button
											variant="ghost"
											size="sm"
											class="h-7 px-2 text-xs"
											onclick={() => openBatchModal(index)}
										>
											...
										</Button>
									</td>
									<!-- Satuan -->
									<td class="p-2">
										{#if readonly}
											<span class="text-muted-foreground">{item.uom}</span>
										{:else}
											<select
												value={item.uom}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												onchange={(e) => handleUomChange(index, e.currentTarget.value)}
											>
												{#each uomOptions as opt}
													<option value={opt}>{opt}</option>
												{/each}
											</select>
										{/if}
									</td>
									<!-- Jumlah Disesuaikan -->
									<td class="p-2">
										{#if readonly}
											<span class="block text-right font-medium">
												{formatNumber(item.adjusted_quantity)}
											</span>
										{:else}
											<Input
												type="number"
												value={item.adjusted_quantity}
												step="0.001"
												min="0"
												class="h-8 text-right text-sm"
												oninput={(e) => handleAdjustedQuantityChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Nilai Disesuaikan -->
									<td class="p-2">
										{#if readonly}
											<span class="block text-right font-medium">
												{formatNumber(item.adjusted_value)}
											</span>
										{:else}
											<Input
												type="number"
												value={item.adjusted_value}
												step="0.01"
												min="0"
												class="h-8 text-right text-sm"
												oninput={(e) => handleAdjustedValueChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<!-- Disetujui (checkbox per baris) -->
									<td class="p-2 text-center">
										{#if readonly}
											<span class={item.approved ? 'text-green-600' : 'text-red-500'}>
												{item.approved ? '✓' : '✗'}
											</span>
										{:else}
											<input
												type="checkbox"
												checked={item.approved}
												onchange={(e) => handleApprovedChange(index, e.currentTarget.checked)}
												class="h-4 w-4 cursor-pointer rounded border-gray-300"
											/>
										{/if}
									</td>
									<!-- Keterangan -->
									<td class="p-2">
										{#if readonly}
											<span class="text-muted-foreground text-xs">{item.remarks || '-'}</span>
										{:else}
											<Input
												value={item.remarks}
												placeholder="Keterangan"
												class="h-8 text-sm"
												oninput={(e) => handleRemarksChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">Total: {items.length} barang</div>
		{/if}
	</Card.Content>
</Card.Root>

<!-- Modal Batchwise Transfer -->
<BatchwiseTransferModal
	bind:open={batchModalOpen}
	itemName={batchModalItemName}
	bind:entries={batchModalEntries}
	readonly={readonly}
	onConfirm={handleBatchConfirm}
/>
