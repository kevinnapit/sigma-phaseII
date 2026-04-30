<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save, Send } from 'lucide-svelte';
	import GRNReconditionedStockConfirmSubmitModal from './GRNReconditionedStockConfirmSubmitModal.svelte';
	import GRNReconditionedStockSuccessModal from './GRNReconditionedStockSuccessModal.svelte';

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
	let createdGRN = $state({ number: '', id: '' });

	// Validation: supplier_id, date, items.length > 0 (NO store_id validation)
	const isFormValid = $derived(
		!!formData.supplier_id && !!formData.date && items.length > 0
	);

	const validationMessage = $derived.by(() => {
		if (!formData.supplier_id) return 'Supplier wajib dipilih';
		if (!formData.date) return 'Tanggal wajib diisi';
		if (items.length === 0) return 'Minimal harus ada 1 item';
		return '';
	});

	const totalQuantity = $derived(
		items.reduce((sum: number, item: any) => sum + (item.accepted_quantity || 0), 0)
	);

	const grossAmount = $derived(
		items.reduce((sum: number, item: any) => sum + (item.total_amount || 0), 0)
	);

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

			createdGRN = {
				number: result?.grn_number || 'GRN/RCS/2026/0001',
				id: result?.id || '1'
			};

			showSuccessModal = true;
		} catch (error) {
			console.error('Error submitting GRN Re-Conditioned Stock:', error);
		}
	}

	function handleCancelSubmit() {
		showConfirmModal = false;
	}

	function handleBackToList() {
		showSuccessModal = false;
		window.location.href =
			'/dashboard/material-management/inventory/transaction/grn-reconditioned-stock';
	}
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Tindakan</CardTitle>
	</CardHeader>
	<CardContent class="space-y-3">
		<!-- Validation Message -->
		{#if !isFormValid && validationMessage}
			<div class="rounded-md border border-yellow-200 bg-yellow-50 p-3">
				<p class="text-xs text-yellow-800">
					<strong>Perhatian:</strong>
					{validationMessage}
				</p>
			</div>
		{/if}

		<!-- Summary Info -->
		{#if items.length > 0}
			<div class="rounded-md border border-blue-200 bg-blue-50 p-3">
				<div class="space-y-1 text-xs">
					<div class="flex justify-between">
						<span class="text-blue-700">Total Barang:</span>
						<span class="font-semibold text-blue-900">{items.length}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-blue-700">Total Diterima:</span>
						<span class="font-semibold text-blue-900">{totalQuantity}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-blue-700">Gross Amount:</span>
						<span class="font-semibold text-blue-900"
							>Rp {new Intl.NumberFormat('id-ID').format(grossAmount)}</span
						>
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
<GRNReconditionedStockConfirmSubmitModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirmSubmit}
	onCancel={handleCancelSubmit}
	itemCount={items.length}
	{totalQuantity}
	{grossAmount}
/>

<GRNReconditionedStockSuccessModal
	bind:open={showSuccessModal}
	grnNumber={createdGRN.number}
	grnId={createdGRN.id}
	onBackToList={handleBackToList}
/>
