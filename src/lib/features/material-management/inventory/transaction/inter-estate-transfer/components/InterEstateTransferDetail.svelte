<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Mail, AlertCircle, Package, LoaderCircle } from 'lucide-svelte';
	import { Guard } from '$lib/components/shared';
	import { INTER_ESTATE_TRANSFER_PERMISSIONS } from '../constants/inter-estate-transfer-permissions';
	import type { InterEstateTransfer } from '../types/inter-estate-transfer.types';

	let {
		transfer,
		onBack,
		onEmail,
		onApprove,
		onReject,
		isApproving = false,
		isRejecting = false
	}: {
		transfer: InterEstateTransfer;
		onBack: () => void;
		onEmail?: () => void;
		onApprove?: () => void;
		onReject?: () => void;
		isApproving?: boolean;
		isRejecting?: boolean;
	} = $props();

	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	// Format date
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}

	const canApprove = $derived(transfer.status === 'pending_approval');
	const isApproved = $derived(transfer.status === 'approved');

	function getStatusDisplay(status: string): string {
		switch (status) {
			case 'pending_approval':
				return 'Menunggu Persetujuan Manager Kebun Diminta';
			case 'approved':
				return 'Disetujui';
			case 'rejected':
				return 'Ditolak';
			case 'received':
				return 'Diterima';
			default:
				return status;
		}
	}
</script>

<div class="space-y-6">
	<!-- Header Actions -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="sm" onclick={onBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
			<div>
				<h2 class="text-2xl font-bold">{transfer.document_number}</h2>
				<p class="text-sm text-muted-foreground">No. Permintaan: {transfer.mr_number}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			{#if isApproved}
				<Guard permissions={INTER_ESTATE_TRANSFER_PERMISSIONS.PRINT}>
					<Button onclick={onEmail}>
						<Mail class="mr-2 h-4 w-4" />
						Kirim Email
					</Button>
				</Guard>
			{/if}
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Left: Transfer Info & Items -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Transfer Information -->
			<Card>
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle>Informasi Transfer</CardTitle>
						<Badge variant="outline">{getStatusDisplay(transfer.status)}</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-muted-foreground">Kebun Peminta</p>
							<p class="font-medium">{transfer.from_estate_name}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Kebun Diminta</p>
							<p class="font-medium">{transfer.to_estate_name}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Tanggal Permintaan</p>
							<p class="font-medium">{formatDate(transfer.request_date)}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Tanggal Diperlukan</p>
							<p class="font-medium">{formatDate(transfer.required_date)}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Peminta</p>
							<p class="font-medium">{transfer.requester_name}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Departemen</p>
							<p class="font-medium">{transfer.department_name}</p>
						</div>
						{#if transfer.is_urgent}
							<div class="col-span-2">
								<Badge variant="destructive">
									<AlertCircle class="mr-1 h-3 w-3" />
									Permintaan Darurat
								</Badge>
							</div>
						{/if}
						<div class="col-span-2">
							<p class="text-sm text-muted-foreground">Justifikasi</p>
							<p class="font-medium">{transfer.justification}</p>
						</div>
					</div>

					{#if transfer.approval_date}
						<Separator class="my-4" />
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Tanggal Approval</p>
								<p class="font-medium">{formatDate(transfer.approval_date)}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Disetujui Oleh</p>
								<p class="font-medium">{transfer.approval_by}</p>
							</div>
							{#if transfer.approval_notes}
								<div class="col-span-2">
									<p class="text-sm text-muted-foreground">Catatan Approval</p>
									<p class="font-medium">{transfer.approval_notes}</p>
								</div>
							{/if}
							{#if transfer.rejection_reason}
								<div class="col-span-2">
									<p class="text-sm text-muted-foreground">Alasan Penolakan</p>
									<p class="font-medium text-destructive">{transfer.rejection_reason}</p>
								</div>
							{/if}
						</div>
					{/if}
				</CardContent>
			</Card>

			<!-- Items List with QR Codes -->
			<Card>
				<CardHeader>
					<CardTitle>Daftar Barang ({transfer.total_items} barang)</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each transfer.items as item, index}
							<div class="rounded-lg border p-4">
								<div class="flex items-start gap-4">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium"
									>
										{index + 1}
									</div>
									<div class="flex-1">
										<div class="mb-3">
											<p class="font-semibold">{item.item_name}</p>
											<p class="text-sm text-muted-foreground">{item.item_code}</p>
										</div>

										<div class="grid grid-cols-3 gap-4 text-sm">
											<div>
												<p class="text-muted-foreground">Jumlah:</p>
												<p class="font-medium">
													{item.quantity}
													{item.uom}
												</p>
											</div>
											<div>
												<p class="text-muted-foreground">Harga Satuan:</p>
												<p class="font-medium">{formatCurrency(item.unit_price)}</p>
											</div>
											<div>
												<p class="text-muted-foreground">Total:</p>
												<p class="font-medium">{formatCurrency(item.total_price)}</p>
											</div>
										</div>

										{#if item.notes}
											<div class="mt-3 pt-3 border-t">
												<p class="text-sm text-muted-foreground">Catatan:</p>
												<p class="text-sm">{item.notes}</p>
											</div>
										{/if}

										<!-- Item Codes (only show if approved) -->
										{#if isApproved}
											<div class="mt-4 pt-4 border-t">
												<p class="text-sm font-medium mb-2">
													Kode Barang untuk Scan ({item.quantity} pcs):
												</p>
												<div class="rounded-lg bg-muted p-3">
													<p class="text-lg font-mono font-bold text-center">
														{item.item_code}
													</p>
													<p class="text-xs text-muted-foreground text-center mt-1">
														Scan kode ini sebanyak {item.quantity}x saat penerimaan
													</p>
												</div>
											</div>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Right: Summary -->
		<div class="lg:col-span-1">
			<div class="sticky top-6 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Ringkasan</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Jumlah Barang:</span>
								<span class="text-lg font-bold">{transfer.total_items} barang</span>
							</div>
							<Separator />
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Total Nilai:</span>
								<span class="text-lg font-bold">{formatCurrency(transfer.total_amount)}</span>
							</div>
						</div>

						{#if isApproved}
							<div class="pt-4 border-t">
								<div class="flex items-center gap-2 text-green-600">
									<Package class="h-5 w-5" />
									<span class="font-medium">Transfer Disetujui</span>
								</div>
								<p class="text-xs text-muted-foreground mt-2">
									Kode barang siap untuk di-scan saat penerimaan
								</p>
							</div>
						{/if}

						{#if canApprove}
							<div class="pt-4 border-t">
								<div class="flex items-center gap-2 text-orange-600">
									<Package class="h-5 w-5" />
									<span class="font-medium">Menunggu Approval</span>
								</div>
								<p class="text-xs text-muted-foreground mt-2">
									Transfer ini memerlukan persetujuan Manager Kebun
								</p>
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Card: Tindakan Persetujuan -->
				{#if canApprove}
					<Guard permissions={INTER_ESTATE_TRANSFER_PERMISSIONS.APPROVE}>
						<Card class="border-primary">
							<CardHeader>
								<CardTitle class="text-primary">Tindakan Persetujuan</CardTitle>
								<p class="mt-1 text-sm text-muted-foreground">
									Sebagai Manager Kebun Diminta, Anda perlu menyetujui atau menolak transfer ini.
								</p>
							</CardHeader>
							<CardContent class="space-y-3">
								<Button
									onclick={onApprove}
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
									onclick={onReject}
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
					</Guard>
				{/if}
			</div>
		</div>
	</div>
</div>
