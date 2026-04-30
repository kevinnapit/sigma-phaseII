<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, FileText } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { getMockStockReconciliationDetail } from '$lib/features/material-management/inventory/transaction/stock-reconciliation/api/stock-reconciliation.mock';
	import StockReconciliationItemsCard from '$lib/features/material-management/inventory/transaction/stock-reconciliation/components/StockReconciliationItemsCard.svelte';

	const reconciliationId = $derived(page.params.id);

	// Muat data detail
	let reconciliationData = $derived.by(() => {
		try {
			return getMockStockReconciliationDetail(reconciliationId);
		} catch {
			return null;
		}
	});

	const detail = $derived(reconciliationData?.data);
	const items = $derived(detail?.items ?? []);

	function formatDate(iso: string) {
		if (!iso) return '-';
		return new Date(iso).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	const totalItems = $derived(items.length);
	const approvedItems = $derived(items.filter((i: any) => i.approved).length);
	const totalVariations = $derived(
		items.reduce((s: number, i: any) => s + (i.variations || 0), 0)
	);

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/stock-reconciliation');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div class="space-y-2">
			<PageHeader
				title="Detail Rekonsiliasi Stok"
				description="Informasi lengkap rekonsiliasi stok inventaris"
			/>
			{#if detail}
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<FileText class="h-4 w-4" />
						<span class="font-mono font-medium">{detail.reconciliation_number}</span>
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
			Data rekonsiliasi stok tidak ditemukan.
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
								<p class="mb-1 text-sm text-muted-foreground">No. Rekonsiliasi</p>
								<p class="font-mono text-sm font-medium">{detail.reconciliation_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No. Jadwal Verifikasi</p>
								<p class="text-sm font-medium">{detail.verification_schedule_no}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
								<p class="text-sm font-medium">{detail.store_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Status</p>
								<Badge variant="default">{detail.status}</Badge>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Entri</p>
								<p class="text-sm font-medium">{formatDate(detail.entry_date)}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Disetujui</p>
								<p class="text-sm font-medium">{formatDate(detail.approved_date)}</p>
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
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Disetujui Oleh</p>
								<p class="text-sm font-medium">{detail.approved_by}</p>
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

				<!-- Detail Barang (12 kolom, read-only) -->
				<StockReconciliationItemsCard {items} readonly={true} />
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
								<span class="text-muted-foreground">No. Rekonsiliasi</span>
								<span class="font-mono font-medium text-xs">{detail.reconciliation_number}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Jadwal</span>
								<span class="max-w-[55%] text-right font-medium text-xs">
									{detail.verification_schedule_no}
								</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Tanggal Entri</span>
								<span class="font-medium">{formatDate(detail.entry_date)}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Tanggal Disetujui</span>
								<span class="font-medium">{formatDate(detail.approved_date)}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Disetujui Oleh</span>
								<span class="max-w-[55%] text-right font-medium text-xs">{detail.approved_by}</span>
							</div>
							<div class="border-t pt-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Total Barang</span>
									<span class="font-medium">{totalItems} barang</span>
								</div>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Item Disetujui</span>
								<span class="font-medium">{approvedItems} / {totalItems}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Variasi</span>
								<span
									class="font-semibold {totalVariations < 0
										? 'text-red-600'
										: totalVariations > 0
											? 'text-green-600'
											: ''}"
								>
									{totalVariations > 0 ? '+' : ''}{new Intl.NumberFormat('id-ID').format(totalVariations)}
								</span>
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
