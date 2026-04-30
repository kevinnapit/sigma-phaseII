<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, PackageOpen, Clock } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { formatDate } from '$lib/shared/utils';
	import { useReadGoodsIssueDetail } from '../hooks/useGoodsIssueQueries.svelte';
	import type { GoodsIssueItem } from '../types/goods-issue.types';

	let { goodsIssueId }: { goodsIssueId: string } = $props();

	const detailQuery = useReadGoodsIssueDetail(() => goodsIssueId);
	const detail = $derived(detailQuery.data?.data);
	const approvalHistory = $derived(detail?.approval_history ?? []);

	// Dialog states
	let showWorkerDialog = $state(false);
	let showAnalysisDialog = $state(false);
	let selectedItem = $state<GoodsIssueItem | null>(null);

	function formatDateFromTimestamp(timestamp: number): string {
		const date = new Date(timestamp * 1000);
		const day = date.getUTCDate().toString().padStart(2, '0');
		const month = date.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' });
		const year = date.getUTCFullYear();
		const hours = date.getUTCHours().toString().padStart(2, '0');
		const minutes = date.getUTCMinutes().toString().padStart(2, '0');
		return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
	}

	function handleBack() {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/goods-issue${params ? `?${params}` : ''}`
		);
	}

	function handleShowWorkerDetail(item: GoodsIssueItem) {
		selectedItem = item;
		showWorkerDialog = true;
	}

	function handleShowAnalysisDetail(item: GoodsIssueItem) {
		selectedItem = item;
		showAnalysisDialog = true;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Pengeluaran Barang"
			description="Informasi lengkap pengeluaran barang dari transaksi mobile"
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:flex-row-reverse max-sm:justify-end">
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
				<!-- Informasi Header -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Umum</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No GSIR</p>
								<p class="text-sm font-medium">{detail.gsir_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No Pengeluaran</p>
								<p class="text-sm font-medium">{detail.issue_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No Penerimaan</p>
								<p class="text-sm font-medium">{detail.grn_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Penerimaan</p>
								<p class="text-sm font-medium">{detail.date ? formatDate(detail.date) : '-'}</p>
							</div>
							{#if detail.division_name}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Divisi</p>
									<p class="text-sm font-medium">{detail.division_name}</p>
								</div>
							{/if}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Vendor</p>
								<p class="text-sm font-medium">{detail.vendor_name || '-'}</p>
							</div>
							{#if detail.transporter_name}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Nama Transporter</p>
									<p class="text-sm font-medium">{detail.transporter_name}</p>
								</div>
							{/if}
							{#if detail.vehicle_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">No Kendaraan</p>
									<p class="text-sm font-medium">{detail.vehicle_number}</p>
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
							<Badge variant="outline">{detail.items?.length ?? 0} Item</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each detail.items ?? [] as item, index}
								<div class="rounded-lg border p-4">
									<!-- Item Header -->
									<div class="mb-3 flex items-start justify-between gap-2">
										<div class="min-w-0">
											<p class="text-sm font-semibold">
												{index + 1}. {item.item_name}
											</p>
											<p class="text-xs text-muted-foreground">{item.item_code}</p>
										</div>
									</div>

									<!-- Jumlah Pengeluaran -->
									<div class="mb-3 flex items-center justify-between rounded-lg bg-muted/50 p-3">
										<span class="text-sm font-medium">Jumlah Pengeluaran</span>
										<span class="text-lg font-bold">
											{item.quantity}
											{item.uom_code}
										</span>
									</div>

									<!-- Foto Pengeluaran Barang -->
									{#if item.photo_url}
										<div class="mb-3">
											<p class="mb-2 text-center text-sm font-semibold">Foto Pengeluaran Barang</p>
											<div class="flex justify-center">
												<img
													src={item.photo_url}
													alt="Foto {item.item_name}"
													class="h-48 w-48 rounded-lg border object-cover"
												/>
											</div>
										</div>
									{/if}

									<!-- Detail Info Grid -->
									<div class="space-y-2 border-t pt-3 text-sm">
										<div class="flex justify-between">
											<span class="text-muted-foreground">Kode Alokasi</span>
											<span class="font-medium">{item.allocation_code || '-'}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground">Nama Alokasi</span>
											<span class="font-medium">{item.allocation_name || '-'}</span>
										</div>
										{#if item.sub_block}
											<div class="flex justify-between">
												<span class="text-muted-foreground">Sub Blok</span>
												<span class="font-medium">{item.sub_block}</span>
											</div>
										{/if}
										<div class="flex justify-between">
											<span class="text-muted-foreground">Dibutuhkan Tanggal</span>
											<span class="font-medium"
												>{item.required_date ? formatDate(item.required_date) : '-'}</span
											>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground">Tujuan</span>
											<span class="font-medium">{item.purpose || '-'}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground">Detail Pekerja</span>
											<button
												onclick={() => handleShowWorkerDetail(item)}
												class="font-medium text-primary underline hover:text-primary/80"
											>
												{item.worker_count || 0} Orang
											</button>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground">Analisa</span>
											<button
												onclick={() => handleShowAnalysisDetail(item)}
												class="font-medium text-primary underline hover:text-primary/80"
											>
												{item.cost_classification || '-'}
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Riwayat Persetujuan -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Clock class="h-5 w-5" />
							Riwayat Persetujuan
							<Badge variant="outline">{approvalHistory.length} Riwayat</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if approvalHistory.length === 0}
							<p class="text-center text-sm text-muted-foreground">Belum ada riwayat persetujuan</p>
						{:else}
							<div class="space-y-4">
								{#each approvalHistory as log}
									<div class="rounded-lg border p-4">
										<div class="mb-3 flex items-start justify-between">
											<div>
												<p class="text-sm font-medium">
													{#if log.action === 'APPROVED'}
														Disetujui
													{:else if log.action === 'REJECTED'}
														Ditolak
													{:else if log.action === 'SUBMITTED'}
														Diajukan
													{:else}
														{log.action}
													{/if}
												</p>
												<p class="text-xs text-muted-foreground">
													{formatDateFromTimestamp(log.action_date)}
												</p>
											</div>
											{#if log.level_name}
												<Badge variant="outline">{log.level_name}</Badge>
											{/if}
										</div>
										{#if log.remarks}
											<Separator class="my-3" />
											<div>
												<p class="mb-1 text-xs font-medium text-muted-foreground">Catatan:</p>
												<p class="text-sm">{log.remarks}</p>
											</div>
										{/if}
										<div class="mt-3">
											<p class="text-xs text-muted-foreground">Oleh: {log.approver_name}</p>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Right Column (1/3) - Sticky -->
			<div class="lg:col-span-1">
				<div class="sticky top-6 space-y-6">
					<!-- Status Card -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Status Pengeluaran</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-center rounded-lg border p-4">
								<p class="text-sm font-medium">{detail.approval_status}</p>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Dialog Detail Pekerja -->
<Dialog.Root bind:open={showWorkerDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Detail Pekerja</Dialog.Title>
		</Dialog.Header>

		{#if selectedItem}
			<div class="space-y-3">
				<div>
					<p class="text-sm text-muted-foreground">{selectedItem.worker_name || '-'}</p>
				</div>
				<div>
					<p class="text-sm font-semibold">
						jumlah Barang : {selectedItem.quantity}
					</p>
				</div>
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showWorkerDialog = false)}>
				<span class="text-lg">✕</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Dialog Detail Analisa -->
<Dialog.Root bind:open={showAnalysisDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Detail Analisa</Dialog.Title>
		</Dialog.Header>

		{#if selectedItem}
			<div class="space-y-4">
				<div>
					<p class="mb-1 text-sm text-muted-foreground">Tipe Analisa</p>
					<p class="text-base font-medium">{selectedItem.cost_classification || '-'}</p>
				</div>
				<Separator />
				<div>
					<p class="mb-1 text-sm text-muted-foreground">Kode Analisa</p>
					<p class="text-base font-medium">{selectedItem.cost_classification_code || '-'}</p>
				</div>
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showAnalysisDialog = false)}>
				<span class="text-lg">✕</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
