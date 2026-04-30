<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { TrendingUp, Clock } from 'lucide-svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ITEM_STOCK_CONTROL_PERMISSIONS } from '../constants/item-stock-control-permissions';
	import ApproveRejectDialog from './ApproveRejectDialog.svelte';
	import type { StockControlRequestDetail } from '../types/item-stock-control.types';
	import {
		formatDate,
		formatDateFromTimestamp,
		formatDateOnly
	} from '../types/item-stock-control.types';
	import { useReadStockControlApprovalHistory } from '../hooks/useItemStockControlQueries.svelte';
	import {
		useApproveStockControl,
		useRejectStockControl
	} from '../hooks/useItemStockControlMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		detail,
		isLoading = false
	}: {
		detail?: StockControlRequestDetail;
		isLoading?: boolean;
	} = $props();

	const approvalId = $derived(detail?.fk_document_approval_hdr_id);

	const historyQuery = useReadStockControlApprovalHistory(() => approvalId);
	const approvalHistory = $derived(historyQuery.data?.data?.actions ?? []);

	const approveMutation = useApproveStockControl();
	const rejectMutation = useRejectStockControl();

	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);

	const isApproving = $derived(approveMutation.isPending);
	const isRejecting = $derived(rejectMutation.isPending);

	// Approval status from new API
	const approvalStatus = $derived(detail?.status ?? '');

	//uom
	const uom = $derived(detail?.item_uom);

	// Level 1 = PENDING_APPROVAL_LEVEL_1, Level 2 = PENDING_APPROVAL_LEVEL_2
	const isPendingManager = $derived(approvalStatus === 'PENDING_APPROVAL_LEVEL_1');
	const isPendingHO = $derived(approvalStatus === 'PENDING_APPROVAL_LEVEL_2');

	// Department for level 2 permission
	const departmentCode = $derived(detail?.department_code ?? '');

	const departmentPermission = $derived.by(() => {
		switch (departmentCode) {
			case 'agriculture':
				return ITEM_STOCK_CONTROL_PERMISSIONS.AGRICULTURE_UPDATE;
			case 'finance':
				return ITEM_STOCK_CONTROL_PERMISSIONS.FINANCE_UPDATE;
			case 'general':
				return ITEM_STOCK_CONTROL_PERMISSIONS.GENERAL_UPDATE;
			case 'it':
				return ITEM_STOCK_CONTROL_PERMISSIONS.INFORMATION_TECHNOLOGY_UPDATE;
			case 'purchase':
				return ITEM_STOCK_CONTROL_PERMISSIONS.PURCHASE_UPDATE;
			case 'sales':
				return ITEM_STOCK_CONTROL_PERMISSIONS.SALES_UPDATE;
			case 'technic':
				return ITEM_STOCK_CONTROL_PERMISSIONS.TECHNIC_UPDATE;
			default:
				return ITEM_STOCK_CONTROL_PERMISSIONS.ASISTEN_UPDATE;
		}
	});

	// Stock values
	const proposedVal = $derived(parseFloat(detail?.proposed_min_stock ?? '0'));
	const approvedVal = $derived(parseFloat(detail?.approved_min_stock ?? '0'));
	const systemVal = $derived(parseFloat(detail?.snapshot_total_usage ?? '0'));

	async function handleApprove(reason?: string) {
		if (!approvalId) return;
		try {
			await approveMutation.mutateAsync({ approvalId, remarks: reason ?? '' });
			toast.success('Kontrol stok barang berhasil disetujui');
			showApproveDialog = false;
		} catch (error) {
			toast.error(`Gagal menyetujui: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async function handleReject(reason?: string) {
		if (!approvalId || !reason) return;
		try {
			await rejectMutation.mutateAsync({ approvalId, remarks: reason });
			toast.success('Kontrol stok barang berhasil ditolak');
			showRejectDialog = false;
		} catch (error) {
			toast.error(`Gagal menolak: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
</script>

<div class="grid gap-6 lg:grid-cols-3">
	<!-- Left Column -->
	<div class="space-y-6 lg:col-span-2">
		<!-- Informasi Utama -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Informasi Utama</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Kode Barang</p>
						{#if isLoading}
							<Skeleton class="h-5 w-32" />
						{:else}
							<p class="text-sm font-medium">{detail?.item_code || '-'}</p>
						{/if}
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Nama Barang</p>
						{#if isLoading}
							<Skeleton class="h-5 w-48" />
						{:else}
							<p class="text-sm font-medium">{detail?.item_name || '-'}</p>
						{/if}
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Departemen</p>
						{#if isLoading}
							<Skeleton class="h-5 w-36" />
						{:else}
							<p class="text-sm font-medium">
								{detail?.department_name || detail?.department_code || '-'}
							</p>
						{/if}
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Diajukan Oleh</p>
						{#if isLoading}
							<Skeleton class="h-5 w-32" />
						{:else}
							<p class="text-sm font-medium">{detail?.requested_by || '-'}</p>
						{/if}
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Tanggal Pengajuan</p>
						{#if isLoading}
							<Skeleton class="h-5 w-40" />
						{:else}
							<p class="text-sm font-medium">{formatDate(detail?.requested_at ?? '')}</p>
						{/if}
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Sumber Permintaan</p>
						{#if isLoading}
							<Skeleton class="h-5 w-24" />
						{:else}
							<p class="text-sm font-medium">{detail?.request_source || '-'}</p>
						{/if}
					</div>
					{#if detail?.request_note}
						<div class="md:col-span-2">
							<p class="mb-1 text-sm text-muted-foreground">Catatan</p>
							<p class="text-sm font-medium">{detail.request_note}</p>
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Perubahan Stok Minimum -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<TrendingUp class="h-5 w-5" />
					Perubahan Stok Minimum
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				{#if isLoading}
					<Skeleton class="h-32 w-full" />
				{:else}
					<div class="grid grid-cols-3 gap-4">
						<div class="rounded-lg border bg-muted/50 p-4">
							<p class="mb-2 text-xs text-muted-foreground">Nilai Referensi Sistem</p>
							<p class="text-2xl font-bold">
								{isNaN(systemVal) ? '0' : systemVal.toFixed(0)}
								{uom}
							</p>
							{#if detail?.window_days}
								<p class="mt-1 text-xs text-muted-foreground">{detail.window_days} hari</p>
							{/if}
						</div>
						<div class="rounded-lg border bg-primary/5 p-4">
							<p class="mb-2 text-xs text-muted-foreground">Nilai Saat Ini</p>
							<p class="text-2xl font-bold text-primary">
								{isNaN(approvedVal) ? '0' : approvedVal.toFixed(0)}
								{uom}
							</p>
						</div>
						<div class="rounded-lg border bg-muted/50 p-4">
							<p class="mb-2 text-xs text-muted-foreground">Nilai yang Diajukan</p>
							<p class="text-2xl font-bold">
								{isNaN(proposedVal) ? '0' : proposedVal.toFixed(0)}
								{uom}
							</p>
						</div>
					</div>

					<!-- Snapshot detail -->
					<div class="grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-4 md:grid-cols-1">
						<div>
							<p class="text-xs text-muted-foreground">Rata-rata Pemakaian Harian</p>
							<p class="text-sm font-medium">{detail?.snapshot_avg_daily_usage || '-'} {uom}</p>
						</div>

						{#if detail?.snapshot_window_start && detail?.snapshot_window_end}
							<div>
								<p class="text-xs text-muted-foreground">Periode</p>
								<p class="text-sm font-medium">
									{formatDateOnly(detail.snapshot_window_start)} — {formatDateOnly(
										detail.snapshot_window_end
									)}
								</p>
							</div>
						{/if}
					</div>
				{/if}
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

	<!-- Right Column (sticky) -->
	<div class="lg:col-span-1">
		<div class="sticky top-6 space-y-6">
			<!-- Status Saat Ini -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Status Saat Ini</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if isLoading}
						<Skeleton class="h-10 w-full" />
					{:else}
						<div class="flex items-center justify-center rounded-lg border p-4">
							<p class="text-sm font-medium">{detail?.status_display || '-'}</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Tindakan Persetujuan — Level 1 (Manager) -->
			{#if isPendingManager && approvalId}
				<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.MANAGER_UPDATE}>
					<Card.Root>
						<Card.Header>
							<Card.Title>Tindakan Persetujuan</Card.Title>
							<p class="mt-1 text-sm text-muted-foreground">
								Sebagai Manajer, Anda perlu menyetujui atau menolak perubahan stok minimum ini.
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

			<!-- Tindakan Persetujuan — Level 2 (Staff HO, department-specific) -->
			{#if isPendingHO && approvalId && departmentPermission}
				<Guard permissions={departmentPermission}>
					<Card.Root>
						<Card.Header>
							<Card.Title>Tindakan Persetujuan</Card.Title>
							<p class="mt-1 text-sm text-muted-foreground">
								Sebagai Staff HO Departemen {detail?.department_name || ''}, Anda perlu menyetujui
								atau menolak perubahan stok minimum ini.
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
