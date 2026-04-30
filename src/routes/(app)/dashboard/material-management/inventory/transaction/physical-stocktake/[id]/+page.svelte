<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, FileText } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { getMockPhysicalStocktakeDetail } from '$lib/features/material-management/inventory/transaction/physical-stocktake/api/physical-stocktake.mock';

	const stocktakeId = $derived(page.params.id);

	// Muat data detail
	let stocktakeData = $derived.by(() => {
		try {
			return getMockPhysicalStocktakeDetail(stocktakeId);
		} catch {
			return null;
		}
	});

	const detail = $derived(stocktakeData?.data);
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

	const totalPhysicalStock = $derived(
		items.reduce((s: number, i: any) => s + (i.physical_stock || 0), 0)
	);
	const totalPhysicalValue = $derived(
		items.reduce((s: number, i: any) => s + (i.physical_value || 0), 0)
	);

	function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (status) {
			case 'Verifikasi Selesai':
				return 'default';
			case 'Dalam Proses':
				return 'secondary';
			case 'Ditangguhkan':
				return 'destructive';
			default:
				return 'outline';
		}
	}

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/physical-stocktake');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div class="space-y-2">
			<PageHeader
				title="Detail Entri Stok Opname"
				description="Informasi lengkap entri stok opname fisik"
			/>
			{#if detail}
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<FileText class="h-4 w-4" />
						<span class="font-mono font-medium">{detail.entry_number}</span>
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
			Data entri stok opname tidak ditemukan.
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Kolom Kiri (2/3) -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Informasi Umum -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Umum</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Nomor Entri</p>
								<p class="font-mono text-sm font-medium">{detail.entry_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Jadwal Verifikasi Stok</p>
								<p class="text-sm font-medium">{detail.schedule}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
								<p class="text-sm font-medium">{detail.store_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Entri</p>
								<p class="text-sm font-medium">{formatDate(detail.entry_date)}</p>
							</div>
							{#if detail.from_date}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Tanggal Mulai</p>
									<p class="text-sm font-medium">{formatDate(detail.from_date)}</p>
								</div>
							{/if}
							{#if detail.to_date}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Tanggal Selesai</p>
									<p class="text-sm font-medium">{formatDate(detail.to_date)}</p>
								</div>
							{/if}
							{#if detail.ref_no}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Nomor Referensi</p>
									<p class="text-sm font-medium">{detail.ref_no}</p>
								</div>
							{/if}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Status</p>
								<Badge variant={getStatusVariant(detail.status)}>{detail.status}</Badge>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Diverifikasi Oleh</p>
								<p class="text-sm font-medium">{detail.verified_by}</p>
							</div>
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
							<Badge variant="outline">{items.length} Barang</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="overflow-x-auto rounded-md border">
							<table class="w-full border-collapse text-sm">
								<thead>
									<tr class="border-b bg-muted/50 text-left text-muted-foreground">
										<th class="p-2 font-medium" style="min-width:200px;">Kode Barang</th>
										<th class="p-2 text-right font-medium" style="min-width:130px;">Stok Fisik</th>
										<th class="p-2 text-right font-medium" style="min-width:150px;">Nilai Fisik</th>
										<th class="p-2 font-medium" style="min-width:80px;">Satuan</th>
									</tr>
								</thead>
								<tbody>
									{#each items as item}
										<tr class="border-b last:border-0">
											<td class="p-2">
												<div>
													<p class="font-medium text-sm">{item.item_code}</p>
													{#if item.item_name !== item.item_code}
														<p class="text-xs text-muted-foreground">{item.item_name}</p>
													{/if}
												</div>
											</td>
											<td class="p-2 text-right text-muted-foreground">
												{formatNumber(item.physical_stock || 0)}
											</td>
											<td class="p-2 text-right text-muted-foreground">
												{formatNumber(item.physical_value || 0)}
											</td>
											<td class="p-2 text-muted-foreground">{item.uom}</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="border-t font-semibold">
										<td class="p-2 text-right text-sm" colspan="1">Total</td>
										<td class="p-2 text-right text-sm">{formatNumber(totalPhysicalStock)}</td>
										<td class="p-2 text-right text-sm">{formatNumber(totalPhysicalValue)}</td>
										<td></td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Kolom Kanan (1/3) sticky -->
			<div class="lg:col-span-1">
				<div class="sticky top-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Ringkasan</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Nomor Entri</span>
								<span class="font-mono font-medium text-xs">{detail.entry_number}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Jadwal</span>
								<span class="max-w-[55%] text-right font-medium text-xs">{detail.schedule}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Tanggal Entri</span>
								<span class="font-medium">{formatDate(detail.entry_date)}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Status</span>
								<Badge variant={getStatusVariant(detail.status)} class="text-xs">
									{detail.status}
								</Badge>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Diverifikasi Oleh</span>
								<span class="max-w-[55%] text-right font-medium text-xs">{detail.verified_by}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Barang</span>
								<span class="font-medium">{detail.total_items} barang</span>
							</div>
							<div class="border-t pt-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Total Stok Fisik</span>
									<span class="font-semibold">{formatNumber(totalPhysicalStock)}</span>
								</div>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Nilai Fisik</span>
								<span class="font-semibold">{formatNumber(totalPhysicalValue)}</span>
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
