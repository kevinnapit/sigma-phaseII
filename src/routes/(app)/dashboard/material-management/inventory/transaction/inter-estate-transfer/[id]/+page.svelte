<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Mail, LoaderCircle } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import ApprovalDialog from '$lib/features/material-management/inventory/transaction/inter-estate-transfer/components/ApprovalDialog.svelte';
	import { getMockInterEstateTransferDetail } from '$lib/features/material-management/inventory/transaction/inter-estate-transfer/api/inter-estate-transfer.mock';
	import { toast } from 'svelte-sonner';
	
	// Import Card components properly
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	let transferId = $state(page.params.id);
	let transfer = $state(null);
	let isLoading = $state(true);
	let showApproveDialog = $state(false);
	let showRejectDialog = $state(false);
	let isApproving = $state(false);
	let isRejecting = $state(false);

	// Load data
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			try {
				const result = getMockInterEstateTransferDetail(transferId);
				transfer = result.data;
			} catch (err) {
				console.error(err);
			}
			isLoading = false;
		}, 300);
	});

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/inter-estate-transfer');
	}

	function handleApprove() {
		showApproveDialog = true;
	}

	function handleReject() {
		showRejectDialog = true;
	}

	function handleConfirmApprove(notes) {
		if (!transfer) return;
		isApproving = true;
		
		setTimeout(() => {
			transfer.status = 'approved';
			transfer.status_label = 'Disetujui';
			transfer.approval_date = new Date().toISOString();
			transfer.approval_by = 'Manager Kebun ' + transfer.to_estate_name;
			transfer.approval_notes = notes;
			
			showApproveDialog = false;
			isApproving = false;
			toast.success('Transfer berhasil disetujui');
		}, 1000);
	}

	function handleConfirmReject(reason) {
		if (!transfer) return;
		isRejecting = true;
		
		setTimeout(() => {
			transfer.status = 'rejected';
			transfer.status_label = 'Ditolak';
			transfer.approval_date = new Date().toISOString();
			transfer.approval_by = 'Manager Kebun ' + transfer.to_estate_name;
			transfer.rejection_reason = reason;
			
			showRejectDialog = false;
			isRejecting = false;
			toast.success('Transfer berhasil ditolak');
		}, 1000);
	}

	function handleEmail() {
		toast.info('Fitur email akan segera tersedia');
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
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
{:else if transfer}
	<div class="space-y-6">
		<!-- Header -->
		<div class="items-center justify-between sm:flex">
			<PageHeader
				title="Detail Transfer Antar Kebun"
				description="Informasi lengkap transfer antar kebun"
			/>
			<div class="mt-5 flex items-center justify-end gap-2 max-sm:flex-row-reverse sm:flex">
				{#if transfer.status === 'approved'}
					<Button size="sm" onclick={handleEmail}>
						<Mail class="mr-2 h-4 w-4" />
						Kirim Email
					</Button>
				{/if}
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
								<p class="mb-1 text-sm text-muted-foreground">No. Dokumen</p>
								<p class="mb-2 text-sm font-medium">{transfer.document_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No. Permintaan</p>
								<p class="mb-2 text-sm font-medium">{transfer.mr_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Permintaan</p>
								<p class="mb-2 text-sm font-medium">{formatDate(transfer.request_date)}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Diperlukan</p>
								<p class="mb-2 text-sm font-medium">{formatDate(transfer.required_date)}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Kebun Peminta</p>
								<p class="mb-2 text-sm font-medium">{transfer.from_estate_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Kebun Diminta</p>
								<p class="mb-2 text-sm font-medium">{transfer.to_estate_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Diminta Oleh</p>
								<p class="mb-2 text-sm font-medium">{transfer.requester_name}</p>
							</div>
							{#if transfer.justification}
								<div class="md:col-span-2">
									<p class="mb-1 text-sm text-muted-foreground">Justifikasi</p>
									<p class="mb-2 text-sm font-medium">{transfer.justification}</p>
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
							<Badge variant="outline">{transfer.total_items} item</Badge>
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
										<th class="pr-4 pb-2 text-right font-medium">Harga Satuan</th>
										<th class="pr-4 pb-2 text-right font-medium">Total Harga</th>
										<th class="pb-2 font-medium">Tujuan Penggunaan</th>
									</tr>
								</thead>
								<tbody>
									{#each transfer.items as item}
										<tr class="border-b last:border-0">
											<td class="py-3 pr-4">{item.item_code}</td>
											<td class="py-3 pr-4">{item.item_name}</td>
											<td class="py-3 pr-4 text-right">{item.quantity}</td>
											<td class="py-3 pr-4">{item.uom}</td>
											<td class="py-3 pr-4 text-right">{formatCurrency(item.unit_price)}</td>
											<td class="py-3 pr-4 text-right">{formatCurrency(item.total_price)}</td>
											<td class="py-3">{item.purpose || '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<!-- Mobile: cards -->
						<div class="space-y-3 md:hidden">
							{#each transfer.items as item}
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
											<p class="text-muted-foreground">Harga Satuan:</p>
											<p class="font-medium">{formatCurrency(item.unit_price)}</p>
										</div>
										<div class="col-span-2">
											<p class="text-muted-foreground">Total Harga:</p>
											<p class="font-medium">{formatCurrency(item.total_price)}</p>
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
				{#if transfer.status !== 'pending_approval'}
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center gap-2">
								Riwayat Persetujuan
								<Badge variant="outline">
									{#if transfer.status === 'approved'}
										1 Riwayat
									{:else if transfer.status === 'rejected'}
										1 Riwayat
									{:else}
										0 Riwayat
									{/if}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{#if transfer.approval_date}
								<div class="rounded-lg border p-4">
									<div class="mb-3 flex items-start justify-between">
										<div>
											<p class="text-sm font-medium">
												{#if transfer.status === 'approved'}
													Disetujui
												{:else if transfer.status === 'rejected'}
													Ditolak
												{/if}
											</p>
											<p class="text-xs text-muted-foreground">{formatDate(transfer.approval_date)}</p>
										</div>
										<Badge variant="outline">Manager Kebun</Badge>
									</div>

									{#if transfer.approval_notes || transfer.rejection_reason}
										<Separator class="my-3" />
										<div>
											<p class="mb-1 text-xs font-medium text-muted-foreground">Catatan:</p>
											<p class="text-sm">
												{transfer.approval_notes || transfer.rejection_reason}
											</p>
										</div>
									{/if}
									
									<div class="mt-3">
										<p class="text-xs text-muted-foreground">Oleh: {transfer.approval_by}</p>
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
									{transfer.status_label}
								</p>
							</div>
						</CardContent>
					</Card>

					<!-- Card: Tindakan Persetujuan -->
					{#if transfer.status === 'pending_approval'}
						<Card class="border-primary">
							<CardHeader>
								<CardTitle class="text-primary">Tindakan Persetujuan</CardTitle>
								<p class="mt-1 text-sm text-muted-foreground">
									Sebagai Manager Kebun Diminta, Anda perlu menyetujui atau menolak transfer ini.
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
{:else}
	<div class="flex items-center justify-center py-12">
		<div class="text-center">
			<p class="text-muted-foreground">Data tidak ditemukan</p>
			<Button onclick={handleBack} variant="outline" class="mt-4">Kembali</Button>
		</div>
	</div>
{/if}
