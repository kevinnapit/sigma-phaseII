<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import { ExternalLink, Package, Users } from 'lucide-svelte';
	import { useReadDetailRO } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import { formatDate, formatCurrency } from '$lib/shared/utils';

	let { rfqId }: { rfqId: string } = $props();

	const roQuery = useReadDetailRO(
		() => rfqId,
		() => !!rfqId
	);

	const roData = $derived(roQuery.data?.data);
	const isLoading = $derived(roQuery.isLoading);

	function getLPOStatusBadge(status: string) {
		const map: Record<string, string> = {
			DRAFT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
			PENDING_APPROVAL: 'bg-blue-50 text-blue-700 border-blue-200',
			APPROVED: 'bg-green-50 text-green-700 border-green-200',
			REJECTED: 'bg-red-50 text-red-700 border-red-200',
			CANCELLED: 'bg-gray-50 text-gray-600 border-gray-200'
		};
		return map[status] ?? 'bg-gray-50 text-gray-600 border-gray-200';
	}

	function getLPOStatusLabel(status: string) {
		const map: Record<string, string> = {
			DRAFT: 'Draft',
			PENDING_APPROVAL: 'Menunggu Persetujuan',
			APPROVED: 'Disetujui',
			REJECTED: 'Ditolak',
			CANCELLED: 'Dibatalkan'
		};
		return map[status] ?? status;
	}

	function handleViewLPO(lpoId: string) {
		goto(`/dashboard/material-management/inventory/transaction/local-purchase-order/${lpoId}`);
	}
</script>

<div class="space-y-6">
	{#if isLoading}
		<Card.Root>
			<Card.Content class="py-12 text-center text-muted-foreground">Memuat data...</Card.Content>
		</Card.Root>
	{:else if roData}
		<!-- Header Info -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-start justify-between">
					<div>
						<Card.Title>Detail Repeat Order</Card.Title>
						<Card.Description class="mt-1">
							{roData.transaction_number || roData.rfq_number}
						</Card.Description>
					</div>
					<Badge variant="outline" class="border-green-200 bg-green-50 text-green-700">
						LPO Dibuat
					</Badge>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
					<div>
						<p class="text-xs text-muted-foreground">No. Transaksi</p>
						<p class="mt-1 text-sm font-medium">{roData.transaction_number || '-'}</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">No. RFQ</p>
						<p class="mt-1 text-sm font-medium">{roData.rfq_number || '-'}</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Tanggal Dibuat</p>
						<p class="mt-1 text-sm font-medium">
							{roData.published_at ? formatDate(roData.published_at) : '-'}
						</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Jumlah LPO</p>
						<p class="mt-1 text-sm font-medium">{roData.lpo_count ?? roData.lpos?.length ?? 0}</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Items -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<Package class="h-4 w-4 text-muted-foreground" />
					<Card.Title class="text-base">Item yang Diminta</Card.Title>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row class="bg-muted/50">
								<Table.Head class="w-12 px-4">No.</Table.Head>
								<Table.Head class="min-w-[160px] px-4">No. MR</Table.Head>
								<Table.Head class="min-w-[110px] px-4">Kode Item</Table.Head>
								<Table.Head class="px-4">Nama Item</Table.Head>
								<Table.Head class="w-20 px-4 text-right">Qty</Table.Head>
								<Table.Head class="w-24 px-4">Satuan</Table.Head>
								<Table.Head class="w-40 px-4 text-right">Harga Terakhir</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each roData.items as item, i (item.uoid)}
								<Table.Row class="hover:bg-muted/30">
									<Table.Cell class="px-4 py-3">{i + 1}</Table.Cell>
									<Table.Cell class="px-4 py-3 text-xs"
										>{item.purchase_request_number || '-'}</Table.Cell
									>
									<Table.Cell class="px-4 py-3 font-mono text-xs">{item.item_code}</Table.Cell>
									<Table.Cell class="px-4 py-3">{item.item_name}</Table.Cell>
									<Table.Cell class="px-4 py-3 text-right">{item.qty}</Table.Cell>
									<Table.Cell class="px-4 py-3">{item.uom}</Table.Cell>
									<Table.Cell class="px-4 py-3 text-right">
										{item.last_lpo_price ? formatCurrency(item.last_lpo_price, 'IDR') : '-'}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- LPOs Created -->
		{#if roData.lpos && roData.lpos.length > 0}
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-2">
						<Users class="h-4 w-4 text-muted-foreground" />
						<Card.Title class="text-base">LPO yang Dibuat</Card.Title>
					</div>
					<Card.Description>
						{roData.lpos.length} LPO berhasil dibuat dari Repeat Order ini
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="rounded-md border">
						<Table.Root>
							<Table.Header>
								<Table.Row class="bg-muted/50">
									<Table.Head class="w-12 px-4">No.</Table.Head>
									<Table.Head class="min-w-[150px] px-4">No. LPO</Table.Head>
									<Table.Head class="min-w-[180px] px-4">Vendor</Table.Head>
									<Table.Head class="w-36 px-4">Tanggal LPO</Table.Head>
									<Table.Head class="w-28 px-4 text-right">Jumlah Item</Table.Head>
									<Table.Head class="w-40 px-4 text-right">Total</Table.Head>
									<Table.Head class="w-44 px-4">Status</Table.Head>
									<Table.Head class="w-16 px-4 text-right">Aksi</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each roData.lpos as lpo, i (lpo.uoid)}
									<Table.Row class="hover:bg-muted/30">
										<Table.Cell class="px-4 py-3">{i + 1}</Table.Cell>
										<Table.Cell class="px-4 py-3 font-mono text-sm font-semibold">
											{lpo.lpo_number}
										</Table.Cell>
										<Table.Cell class="px-4 py-3">
											<div class="text-sm">{lpo.supplier_name}</div>
											<div class="text-xs text-muted-foreground">{lpo.supplier_code}</div>
										</Table.Cell>
										<Table.Cell class="px-4 py-3">{formatDate(lpo.lpo_date)}</Table.Cell>
										<Table.Cell class="px-4 py-3 text-right">{lpo.item_count}</Table.Cell>
										<Table.Cell class="px-4 py-3 text-right">
											{formatCurrency(lpo.total_amount, 'IDR')}
										</Table.Cell>
										<Table.Cell class="px-4 py-3">
											<Badge variant="outline" class={getLPOStatusBadge(lpo.approval_status)}>
												{getLPOStatusLabel(lpo.approval_status)}
											</Badge>
										</Table.Cell>
										<Table.Cell class="px-4 py-3 text-right">
											<Button variant="ghost" size="sm" onclick={() => handleViewLPO(lpo.uoid)}>
												<ExternalLink class="h-3 w-3" />
											</Button>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	{:else}
		<Card.Root>
			<Card.Content class="py-12 text-center text-muted-foreground">
				Data tidak ditemukan.
			</Card.Content>
		</Card.Root>
	{/if}
</div>
