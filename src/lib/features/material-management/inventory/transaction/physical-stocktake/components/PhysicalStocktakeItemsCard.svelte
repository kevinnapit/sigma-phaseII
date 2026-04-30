<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { ClipboardList } from 'lucide-svelte';
	import type { StocktakeItem } from '../types/physical-stocktake.types';

	let {
		items = [],
		onEditItem,
		readonly = false
	}: {
		items?: StocktakeItem[];
		onEditItem?: (index: number, item: StocktakeItem) => void;
		readonly?: boolean;
	} = $props();

	const uomOptions = [
		'Buah', 'Meter', 'Liter', 'Kilogram', 'Sak', 'Batang',
		'Caplet', 'Tablet', 'Capsul', 'Set', 'Lembar', 'Rol',
		'Karton', 'Botol', 'Kaleng', 'Drum', 'Ton', 'Gram'
	];

	function handlePhysicalStockChange(index: number, value: string) {
		const stock = parseFloat(value) || 0;
		const updatedItem = { ...items[index], physical_stock: stock };
		onEditItem?.(index, updatedItem);
	}

	function handlePhysicalValueChange(index: number, value: string) {
		const val = parseFloat(value) || 0;
		const updatedItem = { ...items[index], physical_value: val };
		onEditItem?.(index, updatedItem);
	}

	function handleUomChange(index: number, value: string) {
		const updatedItem = { ...items[index], uom: value };
		onEditItem?.(index, updatedItem);
	}

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">
			{readonly ? 'Detail Barang' : 'Daftar Barang Stok Opname'}
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
						? 'Tidak ada barang dalam entri stok opname ini'
						: 'Pilih jadwal verifikasi stok untuk memuat daftar barang'}
				</p>
			</div>
		{:else}
			<div class="rounded-md border">
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-sm">
						<thead>
							<tr class="border-b bg-muted/50">
								<th class="p-2 text-left font-medium" style="min-width:200px;">Kode Barang</th>
								<th class="p-2 text-right font-medium" style="min-width:130px;">Stok Fisik</th>
								<th class="p-2 text-right font-medium" style="min-width:150px;">Nilai Fisik</th>
								<th class="p-2 text-left font-medium" style="min-width:80px;">Satuan</th>
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b last:border-0">
									<!-- Kode Barang -->
									<td class="p-2">
										<div>
											<p class="font-medium text-sm">{item.item_code}</p>
											{#if item.item_name !== item.item_code}
												<p class="text-xs text-muted-foreground">{item.item_name}</p>
											{/if}
										</div>
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
