<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save, Send } from 'lucide-svelte';
	import BulkConfirmSubmitModal from './BulkConfirmSubmitModal.svelte';
	import BulkSuccessModal from './BulkSuccessModal.svelte';

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

	let showConfirmDialog = $state(false);
	let showSuccessDialog = $state(false);
	let createdRequestId = $state('');
	let createdRequestNumber = $state('');

	const isFormValid = $derived(
		formData.required_date && 
		items.length > 0 &&
		items.every(item => item.department_id)
	);

	const validationMessage = $derived(() => {
		if (!formData.required_date) {
			return 'Tanggal dibutuhkan wajib diisi';
		}
		if (items.length === 0) {
			return 'Minimal harus ada 1 item';
		}
		const itemsWithoutDept = items.filter(item => !item.department_id);
		if (itemsWithoutDept.length > 0) {
			return `${itemsWithoutDept.length} item belum memilih departemen tujuan`;
		}
		return '';
	});

	function handleSaveDraft() {
		if (!isFormValid) return;
		onSaveDraft?.();
	}

	function handleSubmitClick() {
		if (!isFormValid) return;
		showConfirmDialog = true;
	}

	async function handleConfirmSubmit() {
		showConfirmDialog = false;
		try {
			const result = await onSubmit?.();
			if (result?.id) {
				createdRequestId = result.id;
				createdRequestNumber = result.request_number || '';
				showSuccessDialog = true;
			}
		} catch (error) {
			console.error('Submit error:', error);
		}
	}

	function handleCancelSubmit() {
		showConfirmDialog = false;
	}

	function handleViewDetail() {
		// For now, redirect to list since we're using mock data
		// TODO: Navigate to detail when API is ready
		window.location.href = '/dashboard/material-management/inventory/transaction/purchase-request';
	}

	function handleSubmitAnother() {
		// Navigate to list page when "Ajukan" is clicked
		window.location.href = '/dashboard/material-management/inventory/transaction/purchase-request';
	}

	function handleBackToList() {
		window.location.href = '/dashboard/material-management/inventory/transaction/purchase-request';
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
			Kirim Permintaan
		</Button>
	</CardContent>
</Card>

<!-- Submit Confirmation Dialog -->
<BulkConfirmSubmitModal
	bind:open={showConfirmDialog}
	onConfirm={handleConfirmSubmit}
	onCancel={handleCancelSubmit}
	isSubmitting={isSubmitting}
	totalItems={items.length}
/>

<!-- Success Dialog -->
<BulkSuccessModal
	bind:open={showSuccessDialog}
	prNumber={createdRequestNumber}
	onViewDetail={handleViewDetail}
	onSubmit={handleSubmitAnother}
	onBackToList={handleBackToList}
/>
