<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, LoaderCircle } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import ApprovalDialog from '$lib/features/material-management/inventory/transaction/stock-transfer-request/components/ApprovalDialog.svelte';
	import { getMockStockTransferRequestDetail } from '$lib/features/material-management/inventory/transaction/stock-transfer-request/api/stock-transfer-request.mock';
	import {
		useApproveStockTransferRequest,
		useRejectStockTransferRequest
	} from '$lib/features/material-management/inventory/transaction/stock-transfer-request/hooks/useStockTransferRequestMutations.svelte';
	import { toast } from 'svelte-sonner';

	let requestId = $state(page.params.id);
	let request = $state(null);
	let isLoading = $state(true);
	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);

	const approveMutation = useApproveStockTransferRequest();
	const rejectMutation = useRejectStockTransferRequest();

	const isApproving = $derived(approveMutation.isPending);
	const isRejecting = $derived(rejectMutation.isPending);

	// Load data
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			try {
				const result = getMockStockTransferRequestDetail(requestId);
				request = result.data;
			} catch (err) {
				console.error(err);
			}
			isLoading = false;
		}, 300);
	});

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/stock-transfer-request');
	}

	function handleApprove() {
		showApproveDialog = true;
	}

	function handleReject() {
		showRejectDialog = true;
	}

	async function handleConfirmApprove(notes) {
		if (!request) return;

		try {
			await approveMutation.mutateAsync({ id: requestId, notes });
			// Update local state for immediate feedback
			request.status = 'approved';
			request.status_label = 'Disetujui';
			request.approval_date = new Date().toISOString();
			request.approval_by = 'Askep/Tekniker 1';
			request.approval_notes = notes;
			showApproveDialog = false;
		} catch (error) {
			console.error('Error approving request:', error);
		}
	}

	async function handleConfirmReject(reason) {
		if (!request) return;

		try {
			await rejectMutation.mutateAsync({ id: requestId, reason });
			// Update local state for immediate feedback
			request.status = 'rejected';
			request.status_label = 'Ditolak';
			request.approval_date = new Date().toISOString();
			request.approval_by = 'Askep/Tekniker 1';
			request.rejection_reason = reason;
			showRejectDialog = false;
		} catch (error) {
			console.error('Error rejecting request:', error);
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

{#if isLoading}
	<div class="flex items-center justify-center py-12">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			<p class="mt-4 text-sm text-muted-foreground">Memuat data...</p>
		</div>
	</div>
{:else if request}
	<div class="space-y-6">
		<!-- Header -->
		<div class="items-center justify-between sm:flex">
			<PageHeader
				title="Detail Permintaan Transfer Stok"
				description="Informasi lengkap permintaan transfer stok"
			/>
			<div class="mt-5 flex items-center justify-end gap-2 max-sm:flex-row-reverse sm:flex">
				<Button variant="outline" size="sm" onclick={handleBack}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Kembali
				</Button>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Left Column (2/3) -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Card 1: Informasi Transaksi -->
				<Card>
					<CardHeader>
						<CardTitle>Informasi Transaksi</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No. Permintaan</p>
								<p class="mb-2 text-sm font-medium">{request.request_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Permintaan</p>
								<p class="mb-2 text-sm font-medium">{formatDate(request.request_date)}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Kebun</p>
								<p class="mb-2 text-sm font-medium">{request.from_estate_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Diminta Oleh</p>
								<p class="mb-2 text-sm font-medium">{request.requester_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang Asal</p>
								<p class="mb-2 text-sm font-medium">{request.from_store_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang Tujuan</p>
								<p class="mb-2 text-sm font-medium">{request.to_store_name}</p>
							</div>
							{#if request.reference_number}
								<div>
									<p class="mb-1 text-sm text-muted-foreground">No. Referensi</p>
									<p class="mb-2 text-sm font-medium">{request.reference_number}</p>
								</div>
							{/if}
							{#if request.remarks}
								<div class="md:col-span-2">
									<p class="mb-1 text-sm text-muted-foreground">Catatan</p>
									<p class="mb-2 text-sm font-medium">{request.remarks}</p>
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>

				<!-- Card 2: Daftar Barang -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							Daftar Barang
							<Badge variant="outline">{request.total_items} item</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<!-- Desktop: table -->
						<div class="hidden overflow-x-auto md:block">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b text-left text-muted-foreground">
										<th class="pr-4 pb-2 font-medium">Kode</th>
										<th class="pr-4 pb-2 font-medium">Nama Barang</th>
										<th class="pr-4 pb-2 text-right font-medium">Qty</th>
										<th class="pr-4 pb-2 font-medium">Satuan</th>
										<th class="pr-4 pb-2 font-medium">Tanggal Dibutuhkan</th>
										<th class="pb-2 font-medium">Tujuan Penggunaan</th>
									</tr>
								</thead>
								<tbody>
									{#each request.items as item}
										<tr class="border-b last:border-0">
											<td class="py-3 pr-4">{item.item_code}</td>
											<td class="py-3 pr-4">{item.item_name}</td>
											<td class="py-3 pr-4 text-right">{item.quantity}</td>
											<td class="py-3 pr-4">{item.uom}</td>
											<td class="py-3 pr-4">{formatDate(item.required_date)}</td>
											<td class="py-3">{item.purpose || '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<!-- Mobile: cards -->
						<div class="space-y-3 md:hidden">
							{#each request.items as item}
								<div class="rounded-lg border p-4">
									<div class="mb-3">
										<p class="text-sm font-medium">{item.item_name}</p>
										<p class="text-xs text-muted-foreground">{item.item_code}</p>
									</div>
									<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
										<div>
											<p class="text-muted-foreground">Qty:</p>
											<p class="font-medium">{item.quantity} {item.uom}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Tanggal Dibutuhkan:</p>
											<p class="font-medium">{formatDate(item.required_date)}</p>
										</div>
										<div class="col-span-2">
											<p class="text-muted-foreground">Tujuan Penggunaan:</p>
											<p class="font-medium">{item.purpose || '-'}</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>

				<!-- Card 3: Riwayat Persetujuan -->
				{#if request.status !== 'pending_approval' && request.status !== 'draft'}
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center gap-2">
								Riwayat Persetujuan
								<Badge variant="outline">
									{#if request.status === 'approved' || request.status === 'rejected'}
										1 Riwayat
									{:else}
										0 Riwayat
									{/if}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{#if request.approval_date}
								<div class="rounded-lg border p-4">
									<div class="mb-3 flex items-start justify-between">
										<div>
											<p class="text-sm font-medium">
												{#if request.status === 'approved'}
													Disetujui
												{:else if request.status === 'rejected'}
													Ditolak
												{/if}
											</p>
											<p class="text-xs text-muted-foreground">{formatDate(request.approval_date)}</p>
										</div>
										<Badge variant="outline">Askep/Tekniker 1</Badge>
									</div>

									{#if request.approval_notes || request.rejection_reason}
										<Separator class="my-3" />
										<div>
											<p class="mb-1 text-xs font-medium text-muted-foreground">Catatan:</p>
											<p class="text-sm">
												{request.approval_notes || request.rejection_reason}
											</p>
										</div>
									{/if}

									<div class="mt-3">
										<p class="text-xs text-muted-foreground">Oleh: {request.approval_by}</p>
									</div>
								</div>
							{:else}
								<p class="text-center text-sm text-muted-foreground">Belum ada riwayat persetujuan</p>
							{/if}
						</CardContent>
					</Card>
				{/if}
			</div>

			<!-- Right Column (1/3) - Sticky -->
			<div class="lg:col-span-1">
				<div class="sticky top-6 space-y-6">
					<!-- Card: Status Saat Ini -->
					<Card>
						<CardHeader>
							<CardTitle>Status Saat Ini</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="flex items-center justify-center rounded-lg border p-4">
								<p class="text-xs text-muted-foreground">
									{request.status_label}
								</p>
							</div>
						</CardContent>
					</Card>

					<!-- Card: Tindakan Persetujuan -->
					{#if request.status === 'pending_approval'}
						<Card class="border-primary">
							<CardHeader>
								<CardTitle class="text-primary">Tindakan Persetujuan</CardTitle>
								<p class="mt-1 text-sm text-muted-foreground">
									Sebagai Askep/Tekniker 1, Anda perlu menyetujui atau menolak permintaan ini.
								</p>
							</CardHeader>
							<CardContent class="space-y-3">
								<Button
									onclick={handleApprove}
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
									onclick={handleReject}
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
							</CardContent>
						</Card>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center py-12">
		<div class="text-center">
			<p class="text-muted-foreground">Data tidak ditemukan</p>
			<Button onclick={handleBack} variant="outline" class="mt-4">Kembali</Button>
		</div>
	</div>
{/if}

<!-- Dialogs -->
<ApprovalDialog
	bind:open={showApproveDialog}
	type="approve"
	onConfirm={handleConfirmApprove}
	isSubmitting={isApproving}
/>

<ApprovalDialog
	bind:open={showRejectDialog}
	type="reject"
	onConfirm={handleConfirmReject}
	isSubmitting={isRejecting}
/>
