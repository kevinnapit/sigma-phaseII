<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Clock, Send, LoaderCircle, Mail, Pencil, Ban } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import Guard from '$lib/components/shared/guard.svelte';
	import { PageHeader } from '$lib/components/shared';
	import { LOCAL_PURCHASE_ORDER_PERMISSIONS } from '../constants/local-purchase-order-permissions';
	import { toast } from 'svelte-sonner';
	import {
		useReadLPODetail,
		useSubmitLPO,
		useApproveLPO,
		useRejectLPO,
		useReadLPOApprovalHistory,
		useSendPO,
		useCancelLPO,
		useReadActivityLogs
	} from '../hooks/useLocalPurchaseOrderQueries.svelte';
	import ApproveRejectDialog from './ApproveRejectDialog.svelte';
	import CancelLPODialog from './CancelLPODialog.svelte';

	let { lpoId }: { lpoId: string } = $props();

	const detailQuery = useReadLPODetail(() => lpoId);
	const detail = $derived(detailQuery.data?.data);
	const approvalId = $derived(detail?.approval_id);

	const historyQuery = useReadLPOApprovalHistory(() => approvalId);
	const approvalHistory = $derived(historyQuery.data?.data?.actions ?? []);

	const activityLogsQuery = useReadActivityLogs(() => lpoId);
	const activityLogs = $derived(activityLogsQuery.data?.data ?? []);

	const submitMutation = useSubmitLPO();
	const approveMutation = useApproveLPO();
	const rejectMutation = useRejectLPO();
	const sendPOMutation = useSendPO();
	const cancelMutation = useCancelLPO();

	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);
	let showSendPODialog = $state(false);
	let showCancelDialog = $state(false);
	let sendPOMessage = $state('');

	const isSubmitting = $derived(submitMutation.isPending);
	const isApproving = $derived(approveMutation.isPending);
	const isRejecting = $derived(rejectMutation.isPending);
	const isSending = $derived(sendPOMutation.isPending);
	const isCancelling = $derived(cancelMutation.isPending);
	const isDraft = $derived(detail?.approval_status === 'DRAFT');
	const isRejected = $derived(detail?.approval_status === 'REJECTED');
	const isApproved = $derived(detail?.approval_status === 'APPROVED');
	const isPendingApproval = $derived(detail?.approval_status === 'PENDING_APPROVAL');
	const isCancelled = $derived(detail?.approval_status === 'CANCELLED');

	// Button visibility logic based on requirements
	const canEdit = $derived(isDraft || isRejected); // REQ-016, REQ-018
	const canCancelKTU = $derived(isDraft); // REQ-017
	const canCancelManager = $derived(
		!isCancelled && detail?.approval_status !== 'PRINTED' && detail?.approval_status !== 'FINALIZED'
	); // REQ-019

	const statusLabelMap: Record<
		string,
		{ label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
	> = {
		DRAFT: { label: 'Draft', variant: 'secondary' },
		PENDING_APPROVAL: { label: 'Menunggu Persetujuan Manager Kebun', variant: 'outline' },
		APPROVED: { label: 'Disetujui', variant: 'default' },
		REJECTED: { label: 'Ditolak', variant: 'destructive' },
		CANCELLED: { label: 'Dibatalkan', variant: 'destructive' }
	};

	function getStatusInfo(status: string) {
		return statusLabelMap[status] ?? { label: status, variant: 'secondary' as const };
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
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

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	function handleBack() {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/local-purchase-order${params ? `?${params}` : ''}`
		);
	}

	async function handleSubmit() {
		if (!lpoId || !detail) return;
		try {
			await submitMutation.mutateAsync(lpoId);
			toast.success(`LPO ${detail.lpo_number} berhasil diajukan untuk persetujuan`);
		} catch (error) {
			toast.error(
				`Gagal mengajukan LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleApprove(reason?: string) {
		if (!approvalId) return;
		try {
			await approveMutation.mutateAsync({ approvalId, remarks: reason ?? '' });
			toast.success('LPO berhasil disetujui');
			showApproveDialog = false;
		} catch (error) {
			toast.error(
				`Gagal menyetujui LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleReject(reason?: string) {
		if (!approvalId || !reason) return;
		try {
			await rejectMutation.mutateAsync({ approvalId, remarks: reason });
			toast.success('LPO berhasil ditolak');
			showRejectDialog = false;
		} catch (error) {
			toast.error(`Gagal menolak LPO: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async function handleSendPO() {
		if (!lpoId) return;
		try {
			await sendPOMutation.mutateAsync({ lpoId, customMessage: sendPOMessage });
			toast.success('LPO berhasil dikirim ke vendor');
			showSendPODialog = false;
			sendPOMessage = '';
		} catch (error) {
			toast.error(
				`Gagal mengirim LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function handleCancel(reason: string) {
		if (!lpoId || !detail) return;
		try {
			await cancelMutation.mutateAsync({ lpoId, params: { reason } });
			toast.success(`LPO ${detail.lpo_number} berhasil dibatalkan`);
			showCancelDialog = false;
		} catch (error) {
			toast.error(
				`Gagal membatalkan LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function handleEdit() {
		goto(
			`/dashboard/material-management/inventory/transaction/local-purchase-order/${lpoId}/edit`
		);
	}

	const totalAmount = $derived(detail?.items?.reduce((sum, item) => sum + item.amount, 0) ?? 0);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader title="Detail Order Pembelian Lokal" description="Informasi lengkap LPO" />
		<div class="mt-5 flex items-center gap-2 max-sm:flex-row-reverse max-sm:justify-between">
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
			{#if isApproved}
				<Button
					variant="outline"
					size="sm"
					onclick={() => (showSendPODialog = true)}
					disabled={isSending}
				>
					<Mail class="mr-2 h-4 w-4" />
					Kirim ke Vendor
				</Button>
			{/if}
			<!-- Edit Button (KTU) - REQ-016, REQ-018 -->
			{#if canEdit}
				<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
					<Button variant="outline" size="sm" onclick={handleEdit}>
						<Pencil class="mr-2 h-4 w-4" />
						Edit
					</Button>
				</Guard>
			{/if}
			<!-- Cancel Button (KTU) - REQ-017 -->
			{#if canCancelKTU}
				<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
					<Button
						variant="destructive"
						size="sm"
						onclick={() => (showCancelDialog = true)}
						disabled={isCancelling}
					>
						<Ban class="mr-2 h-4 w-4" />
						Batalkan
					</Button>
				</Guard>
			{/if}
			<!-- Cancel Button (Manager) - REQ-019 -->
			{#if canCancelManager}
				<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.APPROVAL_MANAGER_UPDATE}>
					<Button
						variant="destructive"
						size="sm"
						onclick={() => (showCancelDialog = true)}
						disabled={isCancelling}
					>
						<Ban class="mr-2 h-4 w-4" />
						Batalkan
					</Button>
				</Guard>
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
								<p class="mb-1 text-sm text-muted-foreground">Nomor LPO</p>
								<p class="text-sm font-medium">{detail.lpo_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal LPO</p>
								<p class="text-sm font-medium">{formatDate(detail.lpo_date)}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Vendor</p>
								<p class="text-sm font-medium">{detail.supplier_name} ({detail.supplier_code})</p>
							</div>
							{#if detail.store_name}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
									<p class="text-sm font-medium">
										{detail.store_name}{detail.store_code ? ` (${detail.store_code})` : ''}
									</p>
								</div>
							{/if}
							{#if detail.reference_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Referensi LPO</p>
									<p class="text-sm font-medium">{detail.reference_number}</p>
								</div>
							{/if}
							{#if detail.lpo_based_on}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">LPO Berdasarkan</p>
									<p class="text-sm font-medium">{detail.lpo_based_on}</p>
								</div>
							{/if}
							{#if detail.payment_type}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Tipe Pembayaran</p>
									<p class="text-sm font-medium">{detail.payment_type}</p>
								</div>
							{/if}
							{#if detail.credit_days != null}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">Hari Kredit</p>
									<p class="text-sm font-medium">{detail.credit_days} hari</p>
								</div>
							{/if}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Dibutuhkan</p>
								<p class="text-sm font-medium">{formatDate(detail.required_by_date)}</p>
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
										<th class="pr-4 pb-2 text-right font-medium">Qty</th>
										<th class="pr-4 pb-2 font-medium">Satuan</th>
										<th class="pb-2 font-medium">Tujuan</th>
										<th class="pr-4 pb-2 font-medium">No. Proses Pembelian Lokal</th>
										<th class="pr-4 pb-2 text-right font-medium">Nilai Harga</th>
										<th class="pr-4 pb-2 text-right font-medium">Total</th>
									</tr>
								</thead>
								<tbody>
									{#each detail.items ?? [] as item}
										<tr class="border-b last:border-0">
											<td class="py-3 pr-4">{item.item_code}</td>
											<td class="py-3 pr-4">{item.item_name}</td>
											<td class="py-3 pr-4 text-right">{item.quantity}</td>
											<td class="py-3 pr-4">{item.uom_code}</td>
											<td class="py-3">{item.purpose || '-'}</td>
											<td class="py-3 pr-4">
												{#if (detail.lpo_based_on === 'RFQ' || detail.lpo_based_on === 'RO') && detail.lpo_based_on_id}
													<button
														type="button"
														class="font-medium text-primary underline-offset-2 hover:underline"
														onclick={() => {
															goto(`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${detail.lpo_based_on_id}?step=create-lpo`);
														}}
													>
														{detail.lpo_based_on === 'RO'
															? `RFQ Asal: ${detail.reference_number}`
															: detail.reference_number}
													</button>
												{:else}
													<span class="text-muted-foreground">-</span>
												{/if}
											</td>
											<td class="py-3 pr-4 text-right">{formatCurrency(item.rate)}</td>
											<td class="py-3 pr-4 text-right">{formatCurrency(item.amount)}</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="border-t font-medium">
										<td colspan="7" class="pt-3 pr-4 text-right">Total</td>
										<td class="pt-3 pr-4 text-right">{formatCurrency(totalAmount)}</td>
									</tr>
								</tfoot>
							</table>
						</div>
						<!-- Mobile: cards -->
						<div class="space-y-3 md:hidden">
							{#each detail.items ?? [] as item}
								<div class="rounded-lg border p-4">
									<div class="grid grid-cols-2 gap-x-4 gap-y-3">
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Kode</p>
											<p class="text-sm font-medium">{item.item_code}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Nama Barang</p>
											<p class="text-sm font-medium">{item.item_name}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Qty</p>
											<p class="text-sm font-medium">{item.quantity} {item.uom_code}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Tujuan</p>
											<p class="text-sm font-medium">{item.purpose || '-'}</p>
										</div>
										<div class="col-span-2">
											<p class="mb-1 text-xs text-muted-foreground">No. Proses Pembelian Lokal</p>
											{#if detail.lpo_based_on === 'RFQ' && detail.lpo_based_on_id}
												<button
													type="button"
													class="text-sm font-medium text-primary underline-offset-2 hover:underline"
													onclick={() => {
														goto(`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${detail.lpo_based_on_id}?step=create-lpo`);
													}}
												>
													{detail.reference_number}
												</button>
											{:else if detail.lpo_based_on === 'RO'}
												<p class="text-sm font-medium text-muted-foreground">{detail.reference_number || '-'}</p>
											{:else}
												<p class="text-sm font-medium text-muted-foreground">-</p>
											{/if}
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Harga Satuan</p>
											<p class="text-sm font-medium">{formatCurrency(item.rate)}</p>
										</div>
										<div>
											<p class="mb-1 text-xs text-muted-foreground">Total</p>
											<p class="text-sm font-medium">{formatCurrency(item.amount)}</p>
										</div>
									</div>
								</div>
							{/each}
							<div class="flex justify-between border-t pt-3 font-medium">
								<p class="text-sm">Total</p>
								<p class="text-sm">{formatCurrency(totalAmount)}</p>
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
												<Badge variant="outline">Persetujuan Manager Kebun</Badge>
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

				<!-- Activity Log -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Clock class="h-5 w-5" />
							Log Aktivitas
							<Badge variant="outline">{activityLogs.length} Aktivitas</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if activityLogsQuery.isLoading}
							<p class="text-center text-sm text-muted-foreground">Memuat log aktivitas...</p>
						{:else if activityLogs.length === 0}
							<p class="text-center text-sm text-muted-foreground">Belum ada log aktivitas</p>
						{:else}
							<div class="space-y-4">
								{#each activityLogs as log}
									<div class="rounded-lg border p-4">
										<div class="mb-3 flex items-start justify-between">
											<div>
												<p class="text-sm font-medium">
													{#if log.action === 'CREATED'}
														Dibuat
													{:else if log.action === 'EDITED'}
														Diedit
													{:else if log.action === 'SUBMITTED'}
														Diajukan
													{:else if log.action === 'APPROVED'}
														Disetujui
													{:else if log.action === 'REJECTED'}
														Ditolak
													{:else if log.action === 'CANCELLED'}
														Dibatalkan
													{:else if log.action === 'RESUBMITTED'}
														Diajukan Ulang
													{:else}
														{log.action}
													{/if}
												</p>
												<p class="text-xs text-muted-foreground">
													{formatDate(log.performed_at)}
												</p>
											</div>
											{#if log.status_to}
												<Badge variant="outline">{log.status_to}</Badge>
											{/if}
										</div>
										{#if log.reason}
											<Separator class="my-3" />
											<div>
												<p class="mb-1 text-xs font-medium text-muted-foreground">Alasan:</p>
												<p class="text-sm">{log.reason}</p>
											</div>
										{/if}
										<div class="mt-3">
											<p class="text-xs text-muted-foreground">Oleh: {log.performed_by_name}</p>
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
							{@const statusInfo = getStatusInfo(detail.approval_status)}
							<div class="flex items-center justify-center rounded-lg border p-4">
								<p class="text-sm font-medium">{statusInfo.label}</p>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Approval Action Card (Manager only, PENDING_APPROVAL) -->
					{#if detail.approval_status === 'PENDING_APPROVAL' && approvalId}
						<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.APPROVAL_MANAGER_UPDATE}>
							<Card.Root>
								<Card.Header>
									<Card.Title>Tindakan Persetujuan</Card.Title>
									<p class="mt-1 text-sm text-muted-foreground">
										Sebagai Manajer, Anda perlu menyetujui atau menolak LPO ini.
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

<!-- Cancel LPO Dialog -->
{#if detail}
	<CancelLPODialog
		bind:open={showCancelDialog}
		lpoNumber={detail.lpo_number}
		onConfirm={handleCancel}
		isSubmitting={isCancelling}
	/>
{/if}

<!-- Send PO Dialog -->
<Dialog.Root bind:open={showSendPODialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Kirim LPO ke Vendor</Dialog.Title>
			<Dialog.Description>
				LPO akan dikirim ke email vendor. Anda dapat menambahkan pesan khusus (opsional).
			</Dialog.Description>
		</Dialog.Header>
		<div class="py-2">
			<Textarea
				bind:value={sendPOMessage}
				placeholder="Pesan tambahan untuk vendor (opsional)..."
				rows={4}
				disabled={isSending}
			/>
		</div>
		<Dialog.Footer class="gap-2">
			<Button
				variant="outline"
				onclick={() => {
					showSendPODialog = false;
					sendPOMessage = '';
				}}
				disabled={isSending}
			>
				Batal
			</Button>
			<Button onclick={handleSendPO} disabled={isSending}>
				{#if isSending}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Mengirim...
				{:else}
					<Mail class="mr-2 h-4 w-4" />
					Kirim
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
