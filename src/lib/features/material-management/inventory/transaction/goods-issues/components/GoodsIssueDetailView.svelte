<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { formatDate } from '$lib/shared/utils';
	import { useReadGoodsIssueDetail } from '../hooks/useGoodsIssuesQueries.svelte';
	let { issueId }: { issueId: string } = $props();

	const detailQuery = useReadGoodsIssueDetail(() => issueId);
	const detail = $derived(detailQuery.data?.data);

	function handleBack() {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/goods-issues${params ? `?${params}` : ''}`
		);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Pengeluaran Barang"
			description="Informasi lengkap pengeluaran barang dari gudang."
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:justify-end">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	{#if detailQuery.isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-muted-foreground">Memuat data...</p>
		</div>
	{:else if detailQuery.isError}
		<div class="flex items-center justify-center py-12">
			<p class="text-destructive">Gagal memuat data</p>
		</div>
	{:else if detail}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Left Column (2/3) -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Informasi Umum -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Umum</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Nomor Pengeluaran</p>
								<p class="text-sm font-medium">{detail.issue_number || '-'}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal</p>
								<p class="text-sm font-medium">{detail.date ? formatDate(detail.date) : '-'}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Dikeluarkan Oleh</p>
								<p class="text-sm font-medium">{detail.issued_by || '-'}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Diterima Oleh</p>
								<p class="text-sm font-medium">{detail.received_by || '-'}</p>
							</div>
							{#if detail.remarks}
								<div class="md:col-span-2">
									<p class="mb-1 text-sm text-muted-foreground">Keterangan</p>
									<p class="text-sm font-medium">{detail.remarks}</p>
								</div>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Detail Item -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							Detail Item
							<Badge variant="outline">{detail.details?.length ?? 0} Item</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<!-- Desktop: table -->
						<div class="hidden overflow-x-auto md:block">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b text-left text-muted-foreground">
										<th class="pr-4 pb-2 font-medium">Item ID</th>
										<th class="pr-4 pb-2 text-right font-medium">Qty Dikeluarkan</th>
										<th class="pr-4 pb-2 text-right font-medium">Qty (Base Unit)</th>
										<th class="pr-4 pb-2 text-right font-medium">Nilai</th>
										<th class="pb-2 font-medium">Keterangan</th>
									</tr>
								</thead>
								<tbody>
									{#each detail.details ?? [] as item}
										<tr class="border-b last:border-0">
											<td class="py-3 pr-4 font-mono text-xs text-muted-foreground"
												>{item.item_id}</td
											>
											<td class="py-3 pr-4 text-right">{item.quantity_issued}</td>
											<td class="py-3 pr-4 text-right">{item.quantity_issued_in_base_unit}</td>
											<td class="py-3 pr-4 text-right">{item.issue_value || '-'}</td>
											<td class="py-3">{item.issue_remarks || '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<!-- Mobile: cards -->
						<div class="space-y-3 md:hidden">
							{#each detail.details ?? [] as item}
								<div class="rounded-lg border p-4">
									<p class="mb-1 font-mono text-xs text-muted-foreground">{item.item_id}</p>
									<div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Qty Dikeluarkan</p>
											<p class="text-sm font-semibold">{item.quantity_issued}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Qty Base Unit</p>
											<p class="text-sm font-medium">{item.quantity_issued_in_base_unit}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Nilai</p>
											<p class="text-sm font-medium">{item.issue_value || '-'}</p>
										</div>
										{#if item.issue_remarks}
											<div class="col-span-2">
												<p class="mb-0.5 text-xs text-muted-foreground">Keterangan</p>
												<p class="text-sm">{item.issue_remarks}</p>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Right Column (1/3) - Sticky -->
			<div class="lg:col-span-1">
				<div class="sticky top-6 space-y-6">
					<!-- Info Tambahan -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Info Tambahan</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div>
								<p class="mb-1 text-xs text-muted-foreground">Tanggal Dibuat</p>
								<p class="text-sm font-medium">
									{detail.created_at ? formatDate(detail.created_at) : '-'}
								</p>
							</div>
							<div>
								<p class="mb-1 text-xs text-muted-foreground">Status Cetak</p>
								<p class="text-sm font-medium">
									{detail.is_printed ? 'Sudah Dicetak' : 'Belum Dicetak'}
								</p>
							</div>
							<div>
								<p class="mb-1 text-xs text-muted-foreground">Total Item</p>
								<p class="text-sm font-medium">{detail.details?.length ?? 0} item</p>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	{/if}
</div>
