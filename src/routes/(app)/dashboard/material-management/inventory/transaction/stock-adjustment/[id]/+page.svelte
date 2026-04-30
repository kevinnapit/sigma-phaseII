<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, FileText } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { getMockStockAdjustmentDetail } from '$lib/features/material-management/inventory/transaction/stock-adjustment/api/stock-adjustment.mock';

	const adjustmentId = $derived(page.params.id);

	// Load detail data
	let adjustmentData = $derived.by(() => {
		try {
			return getMockStockAdjustmentDetail(adjustmentId);
		} catch {
			return null;
		}
	});

	const detail = $derived(adjustmentData?.data);
	const items = $derived(detail?.items ?? []);

	function formatDate(iso: string) {
		if (!iso) return '-';
		return new Date(iso).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}

	const grossAmount = $derived(items.reduce((s: number, i: any) => s + (i.value || 0), 0));
	const totalQuantity = $derived(items.reduce((s: number, i: any) => s + (i.quantity || 0), 0));

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/stock-adjustment');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div class="space-y-2">
			<PageHeader
				title="Detail Penyesuaian Stok"
				description="Informasi lengkap penyesuaian stok inventaris"
			/>
			{#if detail}
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<FileText class="h-4 w-4" />
						<span class="font-mono font-medium">{detail.adjustment_number}</span>
					</div>
					<div>Dibuat: {formatDate(detail.created_at)} oleh {detail.created_by}</div>
				</div>
			{/if}
		</div>
		<div class="mt-5 flex items-center gap-2 sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	{#if !detail}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">
			Data penyesuaian stok tidak ditemukan.
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Left column (2/3) -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Informasi Umum -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Umum</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No. Penyesuaian</p>
								<p class="font-mono text-sm font-medium">{detail.adjustment_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal</p>
								<p class="text-sm font-medium">{formatDate(detail.date)}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
								<p class="text-sm font-medium">{detail.store_name}</p>
							</div>
							{#if detail.allocation_code}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Kode Alokasi</p>
									<p class="text-sm font-medium">{detail.allocation_code}</p>
								</div>
							{/if}
							{#if detail.ref_no}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">No. Referensi</p>
									<p class="text-sm font-medium">{detail.ref_no}</p>
								</div>
							{/if}
							{#if detail.account}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Akun</p>
									<p class="text-sm font-medium">{detail.account}</p>
								</div>
							{/if}
							{#if detail.remarks}
								<div class="md:col-span-2">
									<p class="mb-1 text-sm text-muted-foreground">Catatan</p>
									<p class="text-sm font-medium">{detail.remarks}</p>
								</div>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Detail Barang -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							Detail Barang
							<Badge variant="outline">{items.length} Item</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="overflow-x-auto rounded-md border">
							<table class="w-full border-collapse text-sm">
								<thead>
									<tr class="border-b bg-muted/50 text-left text-muted-foreground">
										<th class="p-2 font-medium" style="min-width:150px;">No. GRN</th>
										<th class="p-2 font-medium" style="min-width:110px;">Kode Barang</th>
										<th class="p-2 font-medium" style="min-width:120px;">No. Batch</th>
										<th class="p-2 font-medium" style="min-width:80px;">Satuan</th>
										<th class="p-2 text-right font-medium" style="min-width:110px;">GRN/Stk Qty</th>
										<th class="p-2 text-right font-medium" style="min-width:120px;">GRN/Stk Value</th>
										<th class="p-2 text-right font-medium" style="min-width:110px;">Quantity</th>
										<th class="p-2 text-right font-medium" style="min-width:120px;">Value</th>
										<th class="p-2 font-medium" style="min-width:160px;">Keterangan</th>
									</tr>
								</thead>
								<tbody>
									{#each items as item}
										<tr class="border-b last:border-0">
											<td class="p-2 text-muted-foreground">{item.grn_no || '-'}</td>
											<td class="p-2 text-muted-foreground">{item.item_code || '-'}</td>
											<td class="p-2 text-muted-foreground">{item.batch_no || '-'}</td>
											<td class="p-2 text-muted-foreground">{item.item_uom || '-'}</td>
											<td class="p-2 text-right text-muted-foreground"
												>{formatNumber(item.stk_qty || 0)}</td
											>
											<td class="p-2 text-right text-muted-foreground"
												>{formatNumber(item.stk_value || 0)}</td
											>
											<td
												class="p-2 text-right font-medium"
												class:text-red-600={item.quantity < 0}
												class:text-green-600={item.quantity > 0}
											>
												{item.quantity > 0 ? '+' : ''}{formatNumber(item.quantity || 0)}
											</td>
											<td
												class="p-2 text-right font-medium"
												class:text-red-600={item.value < 0}
												class:text-green-600={item.value > 0}
											>
												{item.value > 0 ? '+' : ''}{formatNumber(item.value || 0)}
											</td>
											<td class="p-2 text-muted-foreground">{item.remarks || '-'}</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="border-t font-semibold">
										<td colspan="7" class="p-2 text-right text-sm">Gross Amount</td>
										<td
											class="p-2 text-right text-sm"
											class:text-red-600={grossAmount < 0}
											class:text-green-600={grossAmount > 0}
										>
											{grossAmount > 0 ? '+' : ''}{formatNumber(grossAmount)}
										</td>
										<td></td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Right column (1/3) sticky -->
			<div class="lg:col-span-1">
				<div class="sticky top-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Ringkasan</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">No. Penyesuaian</span>
								<span class="font-mono font-medium">{detail.adjustment_number}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Tanggal</span>
								<span class="font-medium">{formatDate(detail.date)}</span>
							</div>
							{#if detail.allocation_code}
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Kode Alokasi</span>
									<span class="max-w-[55%] text-right font-medium text-xs"
										>{detail.allocation_code}</span
									>
								</div>
							{/if}
							{#if detail.account}
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Akun</span>
									<span class="max-w-[55%] text-right font-medium text-xs">{detail.account}</span>
								</div>
							{/if}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Barang</span>
								<span class="font-medium">{detail.total_items} barang</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Qty Penyesuaian</span>
								<span
									class="font-medium"
									class:text-red-600={totalQuantity < 0}
									class:text-green-600={totalQuantity > 0}
								>
									{totalQuantity > 0 ? '+' : ''}{formatNumber(totalQuantity)}
								</span>
							</div>
							<div class="border-t pt-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Gross Amount</span>
									<span
										class="font-semibold"
										class:text-red-600={grossAmount < 0}
										class:text-green-600={grossAmount > 0}
									>
										{grossAmount > 0 ? '+' : ''}{formatNumber(grossAmount)}
									</span>
								</div>
							</div>
							<div class="border-t pt-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Dibuat oleh</span>
									<span class="font-medium">{detail.created_by}</span>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	{/if}
</div>
