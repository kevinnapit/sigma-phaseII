<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Clock, Send, LoaderCircle, Layers, Ruler, Weight } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import Guard from '$lib/components/shared/guard.svelte';
	import { GOODS_RECEIVES_NOTES_PERMISSIONS } from '../constants/goods-receives-notes-permissions';
	import { toast } from 'svelte-sonner';
	import { formatDate, formatCurrency } from '$lib/shared/utils';
	import {
		useReadGRNDetail,
		useSubmitGRN,
		useApproveGRN,
		useRejectGRN,
		useReadGRNApprovalHistory
	} from '../hooks/useGoodsReceivesNotesQueries.svelte';
	import ApproveRejectDialog from './ApproveRejectDialog.svelte';
	import type { GRNDetailItem } from '../types/goods-receives-notes.types';

	let { grnId }: { grnId: string } = $props();

	const detailQuery = useReadGRNDetail(() => grnId);
	const detail = $derived(detailQuery.data?.data);
	const approvalId = $derived(detail?.document_approval_id);

	const historyQuery = useReadGRNApprovalHistory(() => approvalId);
	const approvalHistory = $derived(historyQuery.data?.data?.actions ?? []);

	const approveMutation = useApproveGRN();
	const rejectMutation = useRejectGRN();
	const submitMutation = useSubmitGRN();

	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);

	// Dropping detail modal
	let showDroppingModal = $state(false);
	let selectedDroppingItem = $state<GRNDetailItem | null>(null);

	function openDroppingModal(item: GRNDetailItem) {
		selectedDroppingItem = item;
		showDroppingModal = true;
	}

	const isApproving = $derived(approveMutation.isPending);
	const isRejecting = $derived(rejectMutation.isPending);
	const isSubmitting = $derived(submitMutation.isPending);
	const isDraft = $derived(detail?.approval_status === 'DRAFT');

	function isDroppingItem(item: GRNDetailItem): boolean {
		return !!(item.volume && item.volume.calculated_volume > 0);
	}

	function formatDateFromTimestamp(timestamp: number): string {
		const date = new Date(timestamp * 1000);
		const day = date.getUTCDate().toString().padStart(2, '0');
		const month = date.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' });
		const year = date.getUTCFullYear();
		const hours = date.getUTCHours().toString().padStart(2, '0');
		const minutes = date.getUTCMinutes().toString().padStart(2, '0');
		return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
	}

	const statusLabelMap: Record<string, string> = {
		DRAFT: 'Belum Diajukan',
		PENDING_APPROVAL: 'Menunggu Persetujuan Askep/Tekniker I',
		APPROVED: 'Disetujui',
		REJECTED: 'Ditolak',
		CANCELLED: 'Dibatalkan'
	};

	function getStatusLabel(status: string): string {
		return statusLabelMap[status] ?? status;
	}

	function handleBack() {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/goods-receives-notes${params ? `?${params}` : ''}`
		);
	}

	async function handleSubmit() {
		if (!grnId || !detail) return;
		try {
			await submitMutation.mutateAsync(grnId);
			toast.success(`GRN ${detail.grn_number} berhasil diajukan untuk persetujuan`);
		} catch (error) {
			toast.error(
				`Gagal mengajukan GRN: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleApprove(reason?: string) {
		if (!approvalId) return;
		try {
			await approveMutation.mutateAsync({ approvalId, remarks: reason ?? '' });
			toast.success('GRN berhasil disetujui');
			showApproveDialog = false;
		} catch (error) {
			toast.error(
				`Gagal menyetujui GRN: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleReject(reason?: string) {
		if (!approvalId || !reason) return;
		try {
			await rejectMutation.mutateAsync({ approvalId, remarks: reason });
			toast.success('GRN berhasil ditolak');
			showRejectDialog = false;
		} catch (error) {
			toast.error(`Gagal menolak GRN: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Penerimaan Barang"
			description="Informasi lengkap Goods Receive Note"
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:flex-row-reverse max-sm:justify-end">
			{#if isDraft}
				<Button variant="default" size="sm" onclick={handleSubmit} disabled={isSubmitting}>
					{#if isSubmitting}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Mengajukan...
					{:else}
						<Send class="mr-2 h-4 w-4" />
						Ajukan
					{/if}
				</Button>
			{/if}
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
								<p class="mb-1 text-sm text-muted-foreground">Nomor Penerimaan</p>
								<p class="text-sm font-medium">{detail.grn_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Penerimaan</p>
								<p class="text-sm font-medium">{detail.date ? formatDate(detail.date) : '-'}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Vendor</p>
								<p class="text-sm font-medium">{detail.supplier_name || '-'}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
								<p class="text-sm font-medium">{detail.store_name || '-'}</p>
							</div>
							{#if detail.reference_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Nomor Referensi</p>
									<p class="text-sm font-medium">{detail.reference_number}</p>
								</div>
							{/if}
							{#if detail.delivery_despatch_note_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">No. Surat Jalan</p>
									<p class="text-sm font-medium">{detail.delivery_despatch_note_number}</p>
								</div>
							{/if}
							{#if detail.delivery_despatch_note_date}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Tanggal Surat Jalan</p>
									<p class="text-sm font-medium">
										{formatDate(detail.delivery_despatch_note_date)}
									</p>
								</div>
							{/if}
							{#if detail.vehicle_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Nomor Kendaraan</p>
									<p class="text-sm font-medium">{detail.vehicle_number}</p>
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
							<Badge variant="outline">{detail.items?.length ?? 0} Item</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<!-- Desktop: table -->
						<div class="hidden overflow-x-auto md:block">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b text-left text-muted-foreground">
										<th class="pr-4 pb-2 font-medium">Kode</th>
										<th class="pr-4 pb-2 font-medium">Nama Barang</th>
										<th class="pr-4 pb-2 text-right font-medium">Jumlah Diterima</th>
										<th class="pr-4 pb-2 font-medium">Satuan</th>
										<th class="pr-4 pb-2 text-right font-medium">Harga Satuan</th>
										<th class="pr-4 pb-2 text-right font-medium">Total</th>
										<th class="pb-2 font-medium">Detail</th>
									</tr>
								</thead>
								<tbody>
									{#each detail.items ?? [] as item}
										<tr class="border-b last:border-0">
											<td class="py-3 pr-4 text-muted-foreground">{item.item_code}</td>
											<td class="py-3 pr-4">
												<p>{item.item_name}</p>
												{#if isDroppingItem(item)}
													<span
														class="mt-0.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
													>
														<Layers class="h-3 w-3" />
														Barang Lapangan
													</span>
												{/if}
											</td>
											<td class="py-3 pr-4 text-right">{item.accepted_quantity}</td>
											<td class="py-3 pr-4">{item.uom_code}</td>
											<td class="py-3 pr-4 text-right">{formatCurrency(item.unit_rate)}</td>
											<td class="py-3 pr-4 text-right">{formatCurrency(item.gross_total)}</td>
											<td class="py-3">
												{#if isDroppingItem(item)}
													<Button
														variant="outline"
														size="sm"
														class="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-700 dark:text-amber-400"
														onclick={() => openDroppingModal(item)}
													>
														<Layers class="mr-1.5 h-3.5 w-3.5" />
														Lihat Detail
													</Button>
												{:else}
													<span class="text-xs text-muted-foreground">—</span>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="border-t font-medium">
										<td colspan="6" class="pt-3 pr-4 text-right">Total</td>
										<td class="pt-3"></td>
									</tr>
									<tr class="font-medium">
										<td colspan="6" class="pr-4 text-right"
											>{formatCurrency(detail?.gross_total)}</td
										>
										<td></td>
									</tr>
								</tfoot>
							</table>
						</div>
						<!-- Mobile: cards -->
						<div class="space-y-3 md:hidden">
							{#each detail.items ?? [] as item}
								<div class="overflow-hidden rounded-lg border">
									<div class="p-4">
										<div class="mb-3 flex items-start justify-between gap-2">
											<div class="min-w-0">
												<p class="text-sm font-semibold">{item.item_name}</p>
												<p class="text-xs text-muted-foreground">{item.item_code}</p>
											</div>
											{#if isDroppingItem(item)}
												<span
													class="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
												>
													<Layers class="h-3 w-3" />
													Lapangan
												</span>
											{/if}
										</div>
										<div class="grid grid-cols-2 gap-x-4 gap-y-2">
											<div>
												<p class="mb-0.5 text-xs text-muted-foreground">Qty Diterima</p>
												<p class="text-sm font-semibold">
													{item.accepted_quantity}
													{item.uom_code}
												</p>
											</div>
											<div>
												<p class="mb-0.5 text-xs text-muted-foreground">Harga Satuan</p>
												<p class="text-sm font-medium">{formatCurrency(item.unit_rate)}</p>
											</div>
											<div class="col-span-2">
												<p class="mb-0.5 text-xs text-muted-foreground">Total</p>
												<p class="text-sm font-semibold">{formatCurrency(item.gross_total)}</p>
											</div>
										</div>
										{#if isDroppingItem(item)}
											<div class="mt-3 border-t pt-3">
												<Button
													variant="outline"
													size="sm"
													class="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-700 dark:text-amber-400"
													onclick={() => openDroppingModal(item)}
												>
													<Layers class="mr-2 h-4 w-4" />
													Lihat Detail Barang Lapangan
												</Button>
											</div>
										{/if}
									</div>
								</div>
							{/each}
							<div class="flex justify-between border-t pt-3 font-medium">
								<p class="text-sm">Total</p>
								<p class="text-sm">{formatCurrency(detail.gross_total)}</p>
							</div>
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
						{#if historyQuery.isLoading}
							<p class="text-center text-sm text-muted-foreground">Memuat riwayat...</p>
						{:else if approvalHistory.length === 0}
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
							<Card.Title>Status Persetujuan</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-center rounded-lg border p-4">
								<p class="text-sm font-medium">{getStatusLabel(detail.approval_status)}</p>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Approval Action Card (Asisten Kepala only, PENDING_APPROVAL) -->
					{#if detail.approval_status === 'PENDING_APPROVAL' && approvalId}
						<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.APPROVAL_ASISTEN_KEPALA_UPDATE}>
							<Card.Root>
								<Card.Header>
									<Card.Title>Tindakan Persetujuan</Card.Title>
									<p class="mt-1 text-sm text-muted-foreground">
										Sebagai Asisten Kepala, Anda perlu menyetujui atau menolak GRN ini.
									</p>
								</Card.Header>
								<Card.Content class="space-y-3">
									<Button
										onclick={() => (showApproveDialog = true)}
										disabled={isApproving || isRejecting}
										class="w-full bg-[#116834] hover:bg-green-900"
									>
										Setujui
									</Button>
									<Button
										onclick={() => (showRejectDialog = true)}
										disabled={isApproving || isRejecting}
										variant="destructive"
										class="w-full bg-[#D12828] hover:bg-red-700"
									>
										Tolak
									</Button>
								</Card.Content>
							</Card.Root>
						</Guard>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Dialogs -->
<ApproveRejectDialog
	bind:open={showApproveDialog}
	type="approve"
	onConfirm={handleApprove}
	isSubmitting={isApproving}
/>

<ApproveRejectDialog
	bind:open={showRejectDialog}
	type="reject"
	onConfirm={handleReject}
	isSubmitting={isRejecting}
/>

<!-- Dropping Material Detail Modal -->
<Dialog.Root bind:open={showDroppingModal}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Layers class="h-5 w-5 text-amber-600" />
				Detail Barang Lapangan
			</Dialog.Title>
			{#if selectedDroppingItem}
				<Dialog.Description>
					{selectedDroppingItem.item_name} — {selectedDroppingItem.item_code}
				</Dialog.Description>
			{/if}
		</Dialog.Header>

		{#if selectedDroppingItem}
			<div class="space-y-4">
				<!-- Dimensi & Volume -->
				<div
					class="rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800/40 dark:bg-amber-900/10"
				>
					<div class="mb-3 flex items-center gap-1.5">
						<Ruler class="h-4 w-4 text-amber-600" />
						<p class="text-sm font-semibold text-amber-700 dark:text-amber-400">Dimensi & Volume</p>
					</div>
					<div class="grid grid-cols-4 gap-2 text-center">
						<div class="rounded-lg bg-background p-2.5">
							<p class="text-xs text-muted-foreground">Panjang</p>
							<p class="text-base font-bold">{selectedDroppingItem.volume?.length ?? '—'}</p>
							<p class="text-xs text-muted-foreground">m</p>
						</div>
						<div class="rounded-lg bg-background p-2.5">
							<p class="text-xs text-muted-foreground">Lebar</p>
							<p class="text-base font-bold">{selectedDroppingItem.volume?.width ?? '—'}</p>
							<p class="text-xs text-muted-foreground">m</p>
						</div>
						<div class="rounded-lg bg-background p-2.5">
							<p class="text-xs text-muted-foreground">Tinggi</p>
							<p class="text-base font-bold">{selectedDroppingItem.volume?.height ?? '—'}</p>
							<p class="text-xs text-muted-foreground">m</p>
						</div>
						<div
							class="rounded-lg border border-amber-200 bg-amber-100 p-2.5 dark:border-amber-800/40 dark:bg-amber-900/30"
						>
							<p class="text-xs text-amber-600">Volume</p>
							<p class="text-base font-bold text-amber-800 dark:text-amber-300">
								{selectedDroppingItem.volume?.calculated_volume ?? '—'}
							</p>
							<p class="text-xs text-amber-600">m³</p>
						</div>
					</div>
				</div>

				<!-- Timbangan -->
				{#if selectedDroppingItem.weighment}
					<div
						class="rounded-lg border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-800/40 dark:bg-purple-900/10"
					>
						<div class="mb-3 flex items-center gap-1.5">
							<Weight class="h-4 w-4 text-purple-600" />
							<p class="text-sm font-semibold text-purple-700 dark:text-purple-400">Timbangan</p>
						</div>
						<div class="mb-3 rounded-lg bg-background px-3 py-2.5">
							<p class="text-xs text-muted-foreground">Nomor Docket</p>
							<p class="text-sm font-semibold">{selectedDroppingItem.weighment.docket_number}</p>
							{#if selectedDroppingItem.weighment.vehicle_number}
								<p class="mt-0.5 text-xs text-muted-foreground">
									{selectedDroppingItem.weighment.vehicle_number}
								</p>
							{/if}
						</div>
						<div class="grid grid-cols-3 gap-2 text-center">
							<div class="rounded-lg bg-background p-2.5">
								<p class="text-xs text-muted-foreground">Gross</p>
								<p class="text-base font-bold">
									{selectedDroppingItem.weighment.gross_weight.toLocaleString('id-ID')}
								</p>
								<p class="text-xs text-muted-foreground">kg</p>
							</div>
							<div class="rounded-lg bg-background p-2.5">
								<p class="text-xs text-muted-foreground">Tare</p>
								<p class="text-base font-bold">
									{selectedDroppingItem.weighment.tare_weight.toLocaleString('id-ID')}
								</p>
								<p class="text-xs text-muted-foreground">kg</p>
							</div>
							<div
								class="rounded-lg border border-green-200 bg-green-50 p-2.5 dark:border-green-800/40 dark:bg-green-900/20"
							>
								<p class="text-xs text-green-600">Net</p>
								<p class="text-base font-bold text-green-700 dark:text-green-400">
									{selectedDroppingItem.weighment.net_weight.toLocaleString('id-ID')}
								</p>
								<p class="text-xs text-green-600">kg</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showDroppingModal = false)}>Tutup</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
