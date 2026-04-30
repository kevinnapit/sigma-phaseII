<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Clock, Send, LoaderCircle, Pencil, X } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import Guard from '$lib/components/shared/guard.svelte';
	import { PURCHASE_REQUEST_PERMISSIONS } from '../constants/purchase-request-permissions';
	import {
		useReadDetailPurchaseRequest,
		useReadApprovalHistory
	} from '../hooks/usePurchaseRequestQueries.svelte';
	import {
		useApprovePurchaseRequest,
		useRejectPurchaseRequest,
		useSubmitPurchaseRequest,
		useCancelPurchaseRequest
	} from '../hooks/usePurchaseRequestMutations.svelte';
	import PurchaseRequestApproveRejectDialog from './PurchaseRequestApproveRejectDialog.svelte';
	import CancelPurchaseRequestDialog from './CancelPurchaseRequestDialog.svelte';
	import TrackingModal from './TrackingModal.svelte';
	import TrackingModalV2 from './TrackingModalV2.svelte';
	import TrackingModalV3 from './TrackingModalV3.svelte';
	import TrackingModalV5 from './TrackingModalV5.svelte';
	import HybridTrackingModal from './HybridTrackingModal.svelte';
	import { toast } from 'svelte-sonner';

	let { requestId }: { requestId: string } = $props();

	// Queries
	const detailQuery = useReadDetailPurchaseRequest(() => requestId);
	const detail = $derived(detailQuery.data?.data);
	const approvalId = $derived(detail?.approval_id);

	const historyQuery = useReadApprovalHistory(() => approvalId);
	const approvalHistory = $derived(historyQuery.data?.data?.actions || []);
	
	// Check which tracking modal to use
	const useV2Tracking = $derived(requestId === 'pr-005');
	const useV3Tracking = $derived(requestId === 'pr-006');
	const useV5Tracking = $derived(requestId === 'pr-007');

	// Mutations
	const approveMutation = useApprovePurchaseRequest();
	const rejectMutation = useRejectPurchaseRequest();
	const submitMutation = useSubmitPurchaseRequest();
	const cancelMutation = useCancelPurchaseRequest();

	// Dialog states
	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);
	let showCancelDialog = $state(false);
	let showTrackingModal = $state(false);

	const isApproving = $derived(approveMutation.isPending);
	const isRejecting = $derived(rejectMutation.isPending);
	const isSubmitting = $derived(submitMutation.isPending);
	const isCancelling = $derived(cancelMutation.isPending);

	// Check if status is DRAFT
	const isDraft = $derived(detail?.approval_status === 'DRAFT');
	const isRejected = $derived(detail?.approval_status === 'REJECTED');
	const isCancelled = $derived(detail?.approval_status === 'CANCELLED');
	const isProcessed = $derived(detail?.is_processed || false);

	// For mock mode, show buttons based on status only
	// In production, add proper permission checks
	const canEdit = $derived((isDraft || isRejected) && !isCancelled);
	const canCancel = $derived(!isCancelled && !isProcessed);

	function handleBack() {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/purchase-request${params ? `?${params}` : ''}`
		);
	}

	async function handleApprove(reason?: string) {
		if (!approvalId) return;

		try {
			await approveMutation.mutateAsync({
				approvalId,
				payload: { remarks: reason }
			});
			toast.success('Permintaan barang berhasil disetujui');
			showApproveDialog = false;
		} catch (error) {
			console.error('Error approving purchase request:', error);
			toast.error(
				`Gagal menyetujui permintaan barang: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleReject(reason?: string) {
		if (!approvalId || !reason) return;

		try {
			await rejectMutation.mutateAsync({
				approvalId,
				payload: { remarks: reason }
			});
			toast.success('Permintaan barang berhasil ditolak');
			showRejectDialog = false;
		} catch (error) {
			console.error('Error rejecting purchase request:', error);
			toast.error(
				`Gagal menolak permintaan barang: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleSubmit() {
		if (!requestId || !detail) return;

		try {
			await submitMutation.mutateAsync(requestId);
			toast.success(`PR ${detail.purchase_request_number} berhasil diajukan untuk approval`);
		} catch (error) {
			console.error('Error submitting purchase request:', error);
			toast.error(
				`Gagal mengajukan PR: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleCancel(reason: string) {
		if (!requestId || !detail) return;

		try {
			await cancelMutation.mutateAsync({
				id: requestId,
				payload: { cancelled_reason: reason }
			});
			toast.success(`PR ${detail.purchase_request_number} berhasil dibatalkan`);
			showCancelDialog = false;
		} catch (error) {
			console.error('Error cancelling purchase request:', error);
			toast.error(
				`Gagal membatalkan PR: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function handleEdit() {
		goto(`/dashboard/material-management/inventory/transaction/purchase-request/${requestId}/edit`);
	}

	function formatDate(timestamp: number): string {
		const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
		const day = date.getUTCDate().toString().padStart(2, '0');
		const month = date.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' });
		const year = date.getUTCFullYear();
		const hours = date.getUTCHours().toString().padStart(2, '0');
		const minutes = date.getUTCMinutes().toString().padStart(2, '0');
		return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Permintaan Barang"
			description="Informasi lengkap permintaan barang"
		/>
		<div class="mt-5 flex items-center justify-end gap-2 max-sm:flex-row-reverse sm:flex">
			{#if canEdit}
				<Button variant="outline" size="sm" onclick={handleEdit}>
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</Button>
			{/if}
			{#if canCancel}
				<Button variant="destructive" size="sm" onclick={() => (showCancelDialog = true)} disabled={isCancelling}>
					{#if isCancelling}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Membatalkan...
					{:else}
						<X class="mr-2 h-4 w-4" />
						Batalkan
					{/if}
				</Button>
			{/if}
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
				<!-- Card 1: Informasi Transaksi -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Transaksi</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Nomor MR</p>
								<p class="mb-2 text-sm font-medium">{detail.purchase_request_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal MR</p>
								<p class="mb-2 text-sm font-medium">
									{new Date(detail.purchase_request_date).toLocaleDateString('id-ID', {
										day: '2-digit',
										month: 'long',
										year: 'numeric'
									})}
								</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Diminta Oleh</p>
								<p class="mb-2 text-sm font-medium">{detail.requested_by}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Sumber Pengadaan</p>
								<p class="mb-2 text-sm font-medium">
									{#if detail.purchase_request_type.value === 'Local Purchase Order'}
										Pembelian Lokal
									{:else if detail.purchase_request_type.value === 'Purchase Order'}
										Kantor Pusat
									{:else if detail.purchase_request_type.value === 'Other Estate'}
										Kebun Sepupu
									{:else}
										{detail.purchase_request_type.value}
									{/if}
								</p>
							</div>

							{#if detail.reference_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Nomor Referensi</p>
									<p class="mb-2 text-sm font-medium">{detail.reference_number}</p>
								</div>
							{/if}
							{#if detail.remarks}
								<div class="md:col-span-2">
									<p class="mb-1 text-sm text-muted-foreground">Catatan Urgensi</p>
									<p class="mb-2 text-sm font-medium">{detail.remarks}</p>
								</div>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Card 2: Daftar Barang -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							Daftar Barang
							<Badge variant="outline">{detail.items.length} Item</Badge>
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
										<th class="pr-4 pb-2 text-right font-medium">Qty</th>
										<th class="pr-4 pb-2 font-medium">Satuan</th>
										<th class="pb-2 font-medium">Tujuan Penggunaan</th>
									</tr>
								</thead>
								<tbody>
									{#each detail.items as item}
										<tr class="border-b last:border-0">
											<td class="py-3 pr-4">{item.item_code}</td>
											<td class="py-3 pr-4">{item.item_name}</td>
											<td class="py-3 pr-4 text-right">{item.quantity}</td>
											<td class="py-3 pr-4">{item.uom.code}</td>
											<td class="py-3">{item.purpose || '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<!-- Mobile: cards -->
						<div class="space-y-3 md:hidden">
							{#each detail.items as item}
								<div class="rounded-lg border p-4">
									<div class="grid grid-cols-2 gap-x-4 gap-y-3">
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Kode Item</p>
											<p class="text-sm font-medium">{item.item_code}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Nama Item</p>
											<p class="text-sm font-medium">{item.item_name}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Jumlah</p>
											<p class="text-sm font-medium">{item.quantity} {item.uom.code}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Tujuan Penggunaan</p>
											<p class="text-sm font-medium">{item.purpose || '-'}</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Card 3: Riwayat Persetujuan -->
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
												{#if log.action === 'APPROVED'}
													<p class="text-sm font-medium">Disetujui</p>
												{:else if log.action === 'REJECTED'}
													<p class="text-sm font-medium">Ditolak</p>
												{:else}
													<p class="text-sm font-medium">{log.action}</p>
												{/if}
												<p class="text-xs text-muted-foreground">{formatDate(log.action_date)}</p>
											</div>
											<Badge variant="outline">{log.level_name}</Badge>
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
					<!-- Card: Status Saat Ini -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Status Saat Ini</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-center rounded-lg border p-4">
								<p class="text-xs text-muted-foreground">
									{#if detail.approval_status === 'DRAFT'}
										Belum Diajukan
									{:else if detail.approval_status === 'PENDING_APPROVAL_LEVEL_1'}
										Menunggu Persetujuan Askep/Tekniker I
									{:else if detail.approval_status === 'PENDING_APPROVAL_LEVEL_2' || detail.approval_status === 'PENDING'}
										Menunggu Persetujuan Manajer Kebun
									{:else if detail.approval_status === 'APPROVED'}
										Disetujui
									{:else if detail.approval_status === 'REJECTED'}
										Ditolak
									{:else if detail.approval_status === 'CANCELLED'}
										Dibatalkan
									{:else if detail.approval_status === 'PENDING_APPROVAL'}
										-
									{:else}
										{detail.approval_status || 'Draft'}
									{/if}
								</p>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Card: Tindakan Persetujuan -->
					<!-- Only show when status is pending approval (PENDING_APPROVAL_LEVEL_1 or PENDING_APPROVAL_LEVEL_2 or PENDING) -->
					{#if detail.approval_status === 'PENDING_APPROVAL_LEVEL_1' || detail.approval_status === 'PENDING_APPROVAL_LEVEL_2' || detail.approval_status === 'PENDING'}
						<Card.Root class="border-primary">
							<Card.Header>
								<Card.Title class="text-primary">Tindakan Persetujuan</Card.Title>
								<p class="mt-1 text-sm text-muted-foreground">
									{#if detail.approval_status === 'PENDING_APPROVAL_LEVEL_1'}
										Sebagai Askep/Tekniker I, Anda perlu menyetujui atau menolak permintaan barang ini.
									{:else}
										Sebagai Manajer Kebun, Anda perlu menyetujui atau menolak permintaan barang ini.
									{/if}
								</p>
							</Card.Header>
							<Card.Content class="space-y-3">
								{#if approvalId}
									<Button
										onclick={() => (showApproveDialog = true)}
										disabled={isApproving || isRejecting}
										class="w-full bg-[#116834] hover:bg-green-900"
									>
										{#if isApproving}
											<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
											Menyetujui...
										{:else}
											Setujui
										{/if}
									</Button>
									<Button
										onclick={() => (showRejectDialog = true)}
										disabled={isApproving || isRejecting}
										variant="destructive"
										class="w-full bg-[#D12828] hover:bg-red-700"
									>
										{#if isRejecting}
											<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
											Menolak...
										{:else}
											Tolak
										{/if}
									</Button>
								{:else}
									<div class="rounded-lg bg-yellow-50 p-4 text-center">
										<p class="text-sm font-medium text-yellow-800">Menunggu Approval</p>
										<p class="mt-1 text-xs text-yellow-600">
											Permintaan barang sedang dalam proses approval
										</p>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Dialogs -->
<PurchaseRequestApproveRejectDialog
	bind:open={showApproveDialog}
	type="approve"
	onConfirm={handleApprove}
	isSubmitting={isApproving}
/>

<PurchaseRequestApproveRejectDialog
	bind:open={showRejectDialog}
	type="reject"
	onConfirm={handleReject}
	isSubmitting={isRejecting}
/>

<CancelPurchaseRequestDialog
	bind:open={showCancelDialog}
	onConfirm={handleCancel}
	isSubmitting={isCancelling}
/>

<!-- Tracking Modal (REQ-028) -->
{#if useV5Tracking}
	<!-- Opsi C: Smart Default View - 6 steps (3 completed + 1 current + 2 next) -->
	<TrackingModalV5
		bind:open={showTrackingModal}
		{requestId}
		prNumber={detail?.purchase_request_number || ''}
	/>
{:else if useV3Tracking}
	<!-- Opsi C: Hybrid Approach - Simplified MR + Detailed LPO -->
	<HybridTrackingModal
		bind:open={showTrackingModal}
		{requestId}
		prNumber={detail?.purchase_request_number || ''}
	/>
{:else if useV2Tracking}
	<TrackingModalV2
		bind:open={showTrackingModal}
		{requestId}
		prNumber={detail?.purchase_request_number || ''}
	/>
{:else}
	<TrackingModal
		bind:open={showTrackingModal}
		{requestId}
		prNumber={detail?.purchase_request_number || ''}
	/>
{/if}
