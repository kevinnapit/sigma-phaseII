<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowLeft, Loader2 } from 'lucide-svelte';
	import { useReadItemCodeRequestDetail } from '$lib/features/material-management/inventory/master/item-code-request/hooks/useItemCodeRequestQueries.svelte';
	import { formatDate } from '$lib/shared/utils';

	const requestId = $derived(page.params.id);

	const requestQuery = useReadItemCodeRequestDetail(() => requestId);

	const request = $derived(requestQuery.data?.data);

	const isRejected = $derived(request?.status === 'REJECTED');

	function getStatusText(status: string) {
		switch (status) {
			case 'PENDING':
			case 'IN_REVIEW':
				return 'Menunggu Persetujuan Staff HO';
			case 'APPROVED':
				return 'Disetujui';
			case 'REJECTED':
				return 'Ditolak';
			default:
				return status;
		}
	}

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/item-code-request');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-start justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-gray-900">Detail Permintaan Kode Barang</h1>
			<p class="text-sm text-gray-500">Informasi lengkap permintaan kode barang</p>
		</div>
		<Button variant="outline" size="sm" onclick={handleBack}>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Kembali
		</Button>
	</div>

	{#if requestQuery.isLoading}
		<div class="flex items-center justify-center py-12">
			<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if requestQuery.isError}
		<Card.Root>
			<Card.Content class="py-12">
				<div class="text-center">
					<p class="text-destructive">Gagal memuat data permintaan. Silakan coba lagi.</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if request}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Left Column - Main Info -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Informasi Transaksi -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Transaksi</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid gap-6 md:grid-cols-2">
							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Nomor Permintaan</p>
								<p class="font-medium">{request.request_number}</p>
							</div>

							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Tanggal Permintaan</p>
								<p class="font-medium">{formatDate(request.requested_at)}</p>
							</div>

							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Diminta Oleh</p>
								<p class="font-medium">{request.requested_by_name}</p>
							</div>

							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Departemen Tujuan</p>
								<p class="font-medium">{request.department_destination}</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Detail Barang -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Detail Barang</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Nama Barang</p>
								<p class="font-medium">{request.item_name}</p>
							</div>

							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Satuan</p>
								<p class="font-medium">{request.uom}</p>
							</div>

							<div class="space-y-1">
								<p class="text-sm text-muted-foreground">Deskripsi</p>
								<p class="text-sm">{request.description}</p>
							</div>

							{#if request.approved_item_code}
								<div class="space-y-1">
									<p class="text-sm text-muted-foreground">Kode Barang</p>
									<p class="font-semibold text-green-700">{request.approved_item_code}</p>
								</div>
							{/if}

							{#if isRejected && request.rejection_reason}
								<div class="space-y-1">
									<p class="text-sm text-muted-foreground">Alasan Penolakan</p>
									<p class="text-sm text-destructive">{request.rejection_reason}</p>
								</div>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Right Column - Status -->
			<div class="space-y-6">
				<!-- Status Saat Ini -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Status Saat Ini</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-center py-8">
							<Badge variant="outline" class="px-4 py-2 text-base">
								{getStatusText(request.status)}
							</Badge>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	{/if}
</div>
