<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { ArrowLeft, Send } from 'lucide-svelte';
	import type {
		EligiblePRItem,
		VendorItem,
		SelectedPRItems,
		SelectedVendors
	} from '../types/local-purchase-analysis.types';
	import { SESSION_STORAGE_KEY, SESSION_STORAGE_VENDORS_KEY } from '../constants/process-steps';
	import { formatCurrency, formatDate } from '$lib/shared/utils';
	import { useCreateAndSendRFQ } from '../hooks/useLocalPurchaseAnalysisMutations.svelte';

	let selectedItems = $state<EligiblePRItem[]>([]);
	let selectedVendors = $state<VendorItem[]>([]);
	let deadline = $state('');
	let singleVendorReason = $state('');
	let showConfirmDialog = $state(false);

	// Mutation hook
	const createRFQMutation = useCreateAndSendRFQ();
	const isPending = $derived(createRFQMutation.isPending);

	// Load data from session storage
	onMount(() => {
		const storedItems = sessionStorage.getItem(SESSION_STORAGE_KEY);
		const storedVendors = sessionStorage.getItem(SESSION_STORAGE_VENDORS_KEY);

		if (storedItems) {
			const data: SelectedPRItems = JSON.parse(storedItems);
			selectedItems = data.items || [];
		}

		if (storedVendors) {
			const data: SelectedVendors = JSON.parse(storedVendors);
			selectedVendors = data.vendors || [];
		}

		// Redirect jika tidak ada data
		if (selectedItems.length === 0 || selectedVendors.length === 0) {
			toast.error('Data tidak lengkap. Silakan lengkapi tahap sebelumnya.');
			if (selectedItems.length === 0) {
				goto(
					'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=select-items'
				);
			} else {
				goto(
					'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=select-vendor'
				);
			}
		}
	});

	function handleBack() {
		goto(
			'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=select-vendor'
		);
	}

	function handleSubmitClick() {
		// Validasi
		if (!deadline) {
			toast.error('Tanggal deadline harus diisi');
			return;
		}

		if (selectedVendors.length === 1 && !singleVendorReason.trim()) {
			toast.error('Alasan pemilihan single vendor harus diisi');
			return;
		}

		// Show confirmation dialog
		showConfirmDialog = true;
	}

	async function handleConfirmSubmit() {
		// Extract pr_detail_ids dari selectedItems
		const pr_detail_ids = selectedItems.map((item) => item.purchase_request_dtl_id);

		// Extract vendor_ids dari selectedVendors (party_id untuk RFQ invitation)
		const vendor_ids = selectedVendors.map((vendor) => vendor.party_id);

		// Prepare request data - deadline langsung pakai format YYYY-MM-DD dari input
		const requestData = {
			deadline_date: deadline,
			pr_detail_ids,
			vendor_ids
		};

		try {
			const response = await createRFQMutation.mutateAsync(requestData);

			toast.success('RFQ berhasil dikirim ke vendor');

			// Clear session storage
			sessionStorage.removeItem(SESSION_STORAGE_KEY);
			sessionStorage.removeItem(SESSION_STORAGE_VENDORS_KEY);

			// Close dialog
			showConfirmDialog = false;

			// Redirect ke detail page (Step 4: Status Terkirim)
			const rfqId = response.data.uoid;
			goto(
				`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${rfqId}?step=rfq-sent-status`
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Gagal mengirim RFQ. Silakan coba lagi.';
			toast.error(errorMessage);
			showConfirmDialog = false;
		}
	}
</script>

<div class="space-y-6">
	<!-- Summary Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Review & Kirim RFQ</Card.Title>
			<Card.Description>
				Review data item dan vendor yang dipilih, kemudian kirim permintaan harga ke vendor.
			</Card.Description>
		</Card.Header>
		<Card.Content class="-mt-2">
			<div class="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:justify-end sm:gap-2">
				<Button
					variant="outline"
					class="w-full sm:w-auto"
					onclick={handleBack}
					disabled={isPending}
				>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Kembali
				</Button>
				<Button class="w-full sm:w-auto" onclick={handleSubmitClick} disabled={isPending}>
					{#if isPending}
						Mengirim...
					{:else}
						<Send class="mr-2 h-4 w-4" />
						Kirim ke Vendor
					{/if}
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Selected Items -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Item yang Dipilih ({selectedItems.length})</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="overflow-x-auto rounded-md border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="px-4">No. MR</Table.Head>
							<Table.Head class="px-4">Kode Item</Table.Head>
							<Table.Head class="px-4">Nama Item</Table.Head>
							<Table.Head class="px-4">Qty</Table.Head>
							<Table.Head class="px-4">Tgl. Kebutuhan</Table.Head>
							<!-- <Table.Head class="px-4">Divisi</Table.Head>
							<Table.Head class="px-4 text-right">Harga Estimasi</Table.Head> -->
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each selectedItems as item}
							<Table.Row>
								<Table.Cell class="px-4 py-3">{item.pr_number}</Table.Cell>
								<Table.Cell class="px-4 py-3">{item.item_code}</Table.Cell>
								<Table.Cell class="px-4 py-3">{item.item_name}</Table.Cell>
								<Table.Cell class="px-4 py-3">{item.qty} {item.uom}</Table.Cell>
								<Table.Cell class="px-4 py-3">{formatDate(item.requirement_date)}</Table.Cell>
								<!-- <Table.Cell class="px-4 py-3">{item.division}</Table.Cell>
								<Table.Cell class="px-4 py-3 text-right">
									{item.estimated_price
										? formatCurrency(item.estimated_price, item.budget_currency)
										: '-'}
								</Table.Cell> -->
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Selected Vendors -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Vendor yang Dipilih ({selectedVendors.length})</Card.Title>
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
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each selectedVendors as vendor}
							<Table.Row>
								<Table.Cell class="px-4 py-3">{vendor.code}</Table.Cell>
								<Table.Cell class="px-4 py-3">{vendor.name}</Table.Cell>
								<Table.Cell class="px-4 py-3">{vendor.email || '-'}</Table.Cell>
								<Table.Cell class="px-4 py-3"
									>{vendor.is_active ? 'Aktif' : 'Tidak Aktif'}</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- RFQ Details -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Detail RFQ</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				<!-- Deadline -->
				<div class="space-y-2">
					<Label for="deadline">Tanggal Deadline <span class="text-destructive">*</span></Label>
					<Input id="deadline" type="date" bind:value={deadline} required disabled={isPending} />
					<p class="text-xs text-muted-foreground">
						Batas waktu vendor untuk mengirimkan penawaran harga
					</p>
				</div>

				<!-- Single Vendor Reason -->
				{#if selectedVendors.length === 1}
					<div class="space-y-2">
						<Label for="reason"
							>Alasan Pemilihan Single Vendor <span class="text-destructive">*</span></Label
						>
						<Textarea
							id="reason"
							bind:value={singleVendorReason}
							placeholder="Jelaskan alasan mengapa hanya memilih 1 vendor..."
							rows={4}
							required
							disabled={isPending}
						/>
						<p class="text-xs text-muted-foreground">
							Wajib diisi karena hanya 1 vendor yang dipilih
						</p>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>

<!-- Confirmation Dialog -->
<AlertDialog.Root bind:open={showConfirmDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Konfirmasi Kirim RFQ</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin mengirim RFQ ini ke vendor? RFQ akan dikirim ke{' '}
				<span class="font-semibold">{selectedVendors.length} vendor</span> dengan deadline{' '}
				<span class="font-semibold">{formatDate(deadline)}</span>.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isPending}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleConfirmSubmit} disabled={isPending}>
				{#if isPending}
					Mengirim...
				{:else}
					Ya, Kirim RFQ
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
