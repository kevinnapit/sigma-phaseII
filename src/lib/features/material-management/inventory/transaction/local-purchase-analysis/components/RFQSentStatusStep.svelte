<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		CalendarClock,
		GitCompareArrows,
		Loader2,
		Upload,
		Download,
		FileText,
		UserPlus,
		Trash2
	} from 'lucide-svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { LOCAL_PURCHASE_ANALYSIS_PERMISSIONS } from '../constants/local-purchase-analysis.permissions';
	import { useReadDetailRFQ } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import { useStartEvaluation, useDeleteRFQItem } from '../hooks/useLocalPurchaseAnalysisMutations.svelte';
	import { formatDateOnly } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';
	import UploadDocumentModal from './UploadDocumentModal.svelte';
	import ExtendDeadlineModal from './ExtendDeadlineModal.svelte';
	import AddVendorModal from './AddVendorModal.svelte';
	import { env } from '$env/dynamic/public';
	import { getRFQStatusDisplay } from '../constants/process-steps';

	let { rfqId }: { rfqId: string } = $props();

	const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

	// Query RFQ detail
	const rfqDetailQuery = useReadDetailRFQ(() => rfqId);

	const rfqData = $derived(rfqDetailQuery.data?.data);
	const items = $derived(rfqData?.items || []);
	const vendors = $derived(rfqData?.vendors || []);
	const documents = $derived(rfqData?.documents || []);
	const isLoading = $derived(rfqDetailQuery.isLoading);
	const isError = $derived(rfqDetailQuery.isError);

	// Mutation untuk start evaluation
	const startEvaluationMutation = useStartEvaluation();
	const isStarting = $derived(startEvaluationMutation.isPending);

	// Mutation untuk delete item
	const deleteItemMutation = useDeleteRFQItem();

	let showConfirmDialog = $state(false);
	let showUploadModal = $state(false);
	let showExtendDeadlineModal = $state(false);
	let showAddVendorModal = $state(false);
	let showDeleteItemDialog = $state(false);
	let itemToDelete = $state<any>(null);

	// Check if actions are allowed based on status
	const canExtendDeadline = $derived(
		rfqData?.status === 'TERKIRIM' || rfqData?.status === 'PERBANDINGAN_HARGA'
	);
	const canAddVendor = $derived(
		rfqData?.status === 'TERKIRIM' || rfqData?.status === 'PERBANDINGAN_HARGA'
	);
	const canDeleteItem = $derived(
		rfqData?.status === 'TERKIRIM' || rfqData?.status === 'PERBANDINGAN_HARGA'
	);

	// Get existing vendor IDs for AddVendorModal (use party_id to match with vendor users)
	const existingVendorIds = $derived(vendors.map((v) => v.vendor_id || v.party_id || ''));

	function handleStartComparisonClick() {
		showConfirmDialog = true;
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatVendorStatus(status: string): string {
		if (!status) return 'Unknown';
		const map: Record<string, string> = {
			INVITED: 'Diundang',
			SUBMITTED: 'Sudah Mengisi',
			DECLINED: 'Menolak',
			VIEWED: 'Sudah Dilihat',
			invited: 'Diundang',
			quoted: 'Sudah Mengisi',
			declined: 'Menolak',
			viewed: 'Sudah Dilihat'
		};
		return map[status] ?? status;
	}

	async function handleConfirmStartComparison() {
		try {
			await startEvaluationMutation.mutateAsync(rfqId);

			toast.success('Evaluasi berhasil dimulai');
			showConfirmDialog = false;

			// Navigate ke step 5 (price-comparison)
			goto(
				`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${rfqId}?step=price-comparison`
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Gagal memulai evaluasi. Silakan coba lagi.';
			toast.error(errorMessage);
			showConfirmDialog = false;
		}
	}

	function handleDeleteItem(item: any) {
		if (items.length === 1) {
			toast.error('Tidak dapat menghapus item terakhir. RFQ harus memiliki minimal 1 item.');
			return;
		}
		itemToDelete = item;
		showDeleteItemDialog = true;
	}

	async function handleConfirmDeleteItem() {
		if (!itemToDelete) return;

		try {
			await deleteItemMutation.mutateAsync({
				rfqId,
				itemId: itemToDelete.uoid
			});

			toast.success('Item berhasil dihapus dari RFQ');
			showDeleteItemDialog = false;
			itemToDelete = null;
			rfqDetailQuery.refetch();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Gagal menghapus item. Silakan coba lagi.';
			toast.error(errorMessage);
		}
	}
</script>

<div class="space-y-6">
	{#if isLoading}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Memuat data RFQ...</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if isError}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<p class="text-sm text-destructive">Gagal memuat data RFQ. Silakan coba lagi.</p>
					<Button variant="outline" onclick={() => rfqDetailQuery.refetch()}>Coba Lagi</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if rfqData}
		<!-- Summary Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>RFQ Terkirim</Card.Title>
				<Card.Description>
					RFQ <span class="font-semibold">{rfqData.transaction_number}</span> telah berhasil dikirim ke
					vendor.
				</Card.Description>
			</Card.Header>
			<Card.Content class="-mt-2">
				<div class="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-2">
					<Button
						variant="outline"
						class="w-full sm:w-auto"
						onclick={() => (showUploadModal = true)}
					>
						<Upload class="mr-2 h-4 w-4" />
						Upload File
					</Button>
					<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.UPDATE}>
						<Button
							class="w-full sm:w-auto"
							onclick={handleStartComparisonClick}
							disabled={isStarting}
						>
							{#if isStarting}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Memulai...
							{:else}
								<GitCompareArrows class="mr-2 h-4 w-4" />
								Mulai Perbandingan
							{/if}
						</Button>
					</Guard>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Deadline Info -->
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<CalendarClock class="h-5 w-5 text-primary" />
					</div>
					<div class="flex-1">
						<p class="text-sm text-muted-foreground">Deadline Penawaran</p>
						<p class="text-lg font-semibold">{formatDateOnly(rfqData.deadline_date)}</p>
					</div>
					<div class="flex items-center gap-2">
						<Badge variant="outline">{getRFQStatusDisplay(rfqData.status)}</Badge>
						{#if canExtendDeadline}
							<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.UPDATE}>
								<Button
									variant="outline"
									size="sm"
									onclick={() => (showExtendDeadlineModal = true)}
								>
									<CalendarClock class="mr-2 h-4 w-4" />
									Perpanjang Deadline
								</Button>
							</Guard>
						{/if}
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Items yang Diminta -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Item yang Diminta ({items.length})</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="px-4">Kode Item</Table.Head>
								<Table.Head class="px-4">Nama Item</Table.Head>
								<Table.Head class="px-4">Qty</Table.Head>
								<Table.Head class="px-4">Satuan</Table.Head>
								<Table.Head class="px-4">Spesifikasi</Table.Head>
								{#if canDeleteItem}
									<Table.Head class="px-4 text-center">Aksi</Table.Head>
								{/if}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each items as item}
								<Table.Row>
									<Table.Cell class="px-4 py-3">{item.item_code}</Table.Cell>
									<Table.Cell class="px-4 py-3">{item.item_name}</Table.Cell>
									<Table.Cell class="px-4 py-3">{item.qty}</Table.Cell>
									<Table.Cell class="px-4 py-3">{item.uom}</Table.Cell>
									<Table.Cell class="px-4 py-3">{item.specifications || '-'}</Table.Cell>
									{#if canDeleteItem}
										<Table.Cell class="px-4 py-3 text-center">
											<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.UPDATE}>
												<Button
													variant="ghost"
													size="icon"
													onclick={() => handleDeleteItem(item)}
													title="Hapus item"
												>
													<Trash2 class="h-4 w-4 text-destructive" />
												</Button>
											</Guard>
										</Table.Cell>
									{/if}
								</Table.Row>
							{/each}
							{#if items.length === 0}
								<Table.Row>
									<Table.Cell
										colspan={canDeleteItem ? 6 : 5}
										class="px-4 py-6 text-center text-muted-foreground"
									>
										Tidak ada item
									</Table.Cell>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Vendor yang Menerima -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Vendor yang Menerima ({vendors.length})</Card.Title>
					{#if canAddVendor}
						<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.UPDATE}>
							<Button variant="outline" size="sm" onclick={() => (showAddVendorModal = true)}>
								<UserPlus class="mr-2 h-4 w-4" />
								Tambah Vendor
							</Button>
						</Guard>
					{/if}
				</div>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="px-4">Kode Vendor</Table.Head>
								<Table.Head class="px-4">Nama Vendor</Table.Head>
								<Table.Head class="px-4">Email</Table.Head>
								<Table.Head class="px-4">Status</Table.Head>
								<Table.Head class="px-4">RFQ No.</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each vendors as vendor}
								<Table.Row>
									<Table.Cell class="px-4 py-3">{vendor.vendor_code}</Table.Cell>
									<Table.Cell class="px-4 py-3">{vendor.vendor_name}</Table.Cell>
									<Table.Cell class="px-4 py-3">{vendor.vendor_email || '-'}</Table.Cell>
									<Table.Cell class="px-4 py-3">
										<Badge variant="outline">{formatVendorStatus(vendor.status)}</Badge>
									</Table.Cell>
									<Table.Cell class="px-4 py-3">
										{vendor?.vendor_rfq_number}
									</Table.Cell>
								</Table.Row>
							{/each}
							{#if vendors.length === 0}
								<Table.Row>
									<Table.Cell colspan={5} class="px-4 py-6 text-center text-muted-foreground">
										Tidak ada vendor
									</Table.Cell>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Dokumen yang Diupload -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Dokumen ({documents.length})</Card.Title>
			</Card.Header>
			<Card.Content>
				{#if documents.length === 0}
					<div
						class="flex flex-col items-center justify-center rounded-md border border-dashed py-8 text-center"
					>
						<FileText class="mb-2 h-8 w-8 text-muted-foreground/50" />
						<p class="text-sm text-muted-foreground">Belum ada dokumen yang diupload</p>
					</div>
				{:else}
					<div class="overflow-x-auto rounded-md border">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head class="px-4">Nama File</Table.Head>
									<Table.Head class="px-4">Tipe</Table.Head>
									<Table.Head class="px-4">Ukuran</Table.Head>
									<Table.Head class="px-4">Diupload Oleh</Table.Head>
									<Table.Head class="px-4">Tanggal Upload</Table.Head>
									<Table.Head class="px-4 text-center">Unduh</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each documents as doc}
									<Table.Row>
										<Table.Cell class="px-4 py-3">
											<div class="flex items-center gap-2">
												<FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
												<span class="max-w-[200px] truncate">{doc.file_name}</span>
											</div>
										</Table.Cell>
										<Table.Cell class="px-4 py-3 text-muted-foreground">
											{doc.document_type || '-'}
										</Table.Cell>
										<Table.Cell class="px-4 py-3 whitespace-nowrap text-muted-foreground">
											{formatFileSize(doc.file_size)}
										</Table.Cell>
										<Table.Cell class="px-4 py-3">{doc.uploaded_by}</Table.Cell>
										<Table.Cell class="px-4 py-3 whitespace-nowrap">
											{formatDateOnly(doc.uploaded_at)}
										</Table.Cell>
										<Table.Cell class="px-4 py-3 text-center">
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												onclick={() => {
													const url = doc.download_url?.startsWith('http')
														? doc.download_url
														: `${BASE_URL}${doc.download_url}`;
													window.open(url, '_blank');
												}}
											>
												<Download class="h-4 w-4" />
											</Button>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<!-- Upload Document Modal -->
<UploadDocumentModal bind:open={showUploadModal} {rfqId} />

<!-- Extend Deadline Modal -->
<ExtendDeadlineModal
	bind:open={showExtendDeadlineModal}
	{rfqId}
	currentDeadline={rfqData?.deadline_date || ''}
	onSuccess={() => rfqDetailQuery.refetch()}
/>

<!-- Add Vendor Modal -->
<AddVendorModal
	bind:open={showAddVendorModal}
	{rfqId}
	{existingVendorIds}
	onSuccess={() => rfqDetailQuery.refetch()}
/>

<!-- Delete Item Confirmation Dialog -->
<AlertDialog.Root bind:open={showDeleteItemDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Item dari RFQ</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menghapus item <span class="font-semibold"
					>{itemToDelete?.item_name}</span
				>
				dari RFQ ini? Quotation dari vendor untuk item ini akan tetap tersimpan di database.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleteItemMutation.isPending}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleConfirmDeleteItem}
				disabled={deleteItemMutation.isPending}
				class="bg-destructive hover:bg-destructive/90"
			>
				{#if deleteItemMutation.isPending}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Menghapus...
				{:else}
					Hapus Item
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- Confirmation Dialog -->
<AlertDialog.Root bind:open={showConfirmDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Mulai Perbandingan Harga</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin memulai proses perbandingan harga? Status RFQ akan berubah menjadi
				<span class="font-semibold">Evaluasi</span> dan tidak dapat dikembalikan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isStarting}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleConfirmStartComparison} disabled={isStarting}>
				{#if isStarting}
					Memulai...
				{:else}
					Ya, Mulai Perbandingan
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
