<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save, Send } from 'lucide-svelte';
	import TransferReceiptConfirmSubmitModal from './TransferReceiptConfirmSubmitModal.svelte';
	import TransferReceiptSuccessModal from './TransferReceiptSuccessModal.svelte';

	let {
		items = [],
		formData = {},
		onSaveDraft,
		onSubmit,
		isSubmitting = false
	}: {
		items?: any[];
		formData?: any;
		onSaveDraft?: () => void;
		onSubmit?: () => Promise<any>;
		isSubmitting?: boolean;
	} = $props();

	// Modal states
	let showConfirmModal = $state(false);
	let showSuccessModal = $state(false);
	let createdReceipt = $state({ number: '', id: '' });

	const isFormValid = $derived(
		formData.store_id && 
		formData.administrative_unit_id &&
		formData.from_store_id &&
		formData.grn_date && 
		formData.delivery_date &&
		formData.mr_no &&
		items.length > 0
	);

	const validationMessage = $derived(() => {
		if (!formData.store_id) {
			return 'Gudang wajib dipilih';
		}
		if (!formData.administrative_unit_id) {
			return 'Unit administratif wajib dipilih';
		}
		if (!formData.from_store_id) {
			return 'Gudang asal wajib dipilih';
		}
		if (!formData.grn_date) {
			return 'Tanggal GRN wajib diisi';
		}
		if (!formData.delivery_date) {
			return 'Tanggal pengiriman wajib diisi';
		}
		if (!formData.mr_no) {
			return 'Nomor MR wajib dipilih';
		}
		if (items.length === 0) {
			return 'Minimal harus ada 1 item';
		}
		return '';
	});

	const totalQuantity = $derived(() => {
		return items.reduce((sum, item) => sum + (item.accepted_quantity || 0), 0);
	});

	const grossAmount = $derived(() => {
		return items.reduce((sum, item) => sum + (item.total_amount || 0), 0);
	});

	function handleSaveDraft() {
		if (!isFormValid) return;
		onSaveDraft?.();
	}

	function handleSubmitClick() {
		if (!isFormValid) return;
		showConfirmModal = true;
	}

	async function handleConfirmSubmit() {
		showConfirmModal = false;
		
		try {
			const result = await onSubmit?.();
			
			// Set created receipt info for success modal
			createdReceipt = {
				number: result?.grn_number || 'GRN/TR/2026/0001',
				id: result?.id || '1'
			};
			
			showSuccessModal = true;
		} catch (error) {
			console.error('Error submitting transfer receipt:', error);
		}
	}

	function handleCancelSubmit() {
		showConfirmModal = false;
	}

	function handleBackToList() {
		showSuccessModal = false;
		// Navigate back to list will be handled by parent
		window.location.href = '/dashboard/material-management/inventory/transaction/transfer-receipt';
	}
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Tindakan</CardTitle>
	</CardHeader>
	<CardContent class="space-y-3">
		<!-- Validation Message -->
		{#if !isFormValid && validationMessage()}
			<div class="rounded-md bg-yellow-50 border border-yellow-200 p-3">
				<p class="text-xs text-yellow-800">
					<strong>Perhatian:</strong> {validationMessage()}
				</p>
			</div>
		{/if}

		<!-- Summary Info -->
		{#if items.length > 0}
			<div class="rounded-md bg-blue-50 border border-blue-200 p-3">
				<div class="space-y-1 text-xs">
					<div class="flex justify-between">
						<span class="text-blue-700">Total Barang:</span>
						<span class="font-semibold text-blue-900">{items.length}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-blue-700">Total Diterima:</span>
						<span class="font-semibold text-blue-900">{totalQuantity()}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-blue-700">Gross Amount:</span>
						<span class="font-semibold text-blue-900">Rp {new Intl.NumberFormat('id-ID').format(grossAmount())}</span>
					</div>
				</div>
			</div>
		{/if}

		<Button
			variant="outline"
			class="w-full"
			onclick={handleSaveDraft}
			disabled={!isFormValid || isSubmitting}
		>
			<Save class="mr-2 h-4 w-4" />
			{isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
		</Button>
		
		<Button
			class="w-full"
			onclick={handleSubmitClick}
			disabled={!isFormValid || isSubmitting}
		>
			<Send class="mr-2 h-4 w-4" />
			Kirim untuk Approval
		</Button>
	</CardContent>
</Card>

<!-- Modals -->
<TransferReceiptConfirmSubmitModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirmSubmit}
	onCancel={handleCancelSubmit}
	itemCount={items.length}
	totalQuantity={totalQuantity()}
	grossAmount={grossAmount()}
/>

<TransferReceiptSuccessModal
	bind:open={showSuccessModal}
	receiptNumber={createdReceipt.number}
	receiptId={createdReceipt.id}
	onBackToList={handleBackToList}
/>