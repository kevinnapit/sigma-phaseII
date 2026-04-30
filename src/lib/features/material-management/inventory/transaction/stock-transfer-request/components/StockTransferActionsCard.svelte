<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save, Send } from 'lucide-svelte';
	import SubmitConfirmationDialog from './SubmitConfirmationDialog.svelte';
	import SuccessDialog from './SuccessDialog.svelte';

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
		formData.from_store_id && 
		formData.to_store_id && 
		formData.from_store_id !== formData.to_store_id &&
		formData.request_date && 
		items.length > 0
	);

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
		window.location.href = `/dashboard/material-management/inventory/transaction/stock-transfer-request/${createdRequestId}`;
	}

	function handleSubmitAnother() {
		// Reload page to create another request
		window.location.reload();
	}

	function handleBackToList() {
		window.location.href = '/dashboard/material-management/inventory/transaction/stock-transfer-request';
	}
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Tindakan</CardTitle>
	</CardHeader>
	<CardContent class="space-y-3">
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
<SubmitConfirmationDialog
	bind:open={showConfirmDialog}
	onConfirm={handleConfirmSubmit}
	onCancel={handleCancelSubmit}
	{isSubmitting}
	totalItems={items.length}
/>

<!-- Success Dialog -->
<SuccessDialog
	bind:open={showSuccessDialog}
	requestNumber={createdRequestNumber}
	onViewDetail={handleViewDetail}
	onSubmitAnother={handleSubmitAnother}
	onBackToList={handleBackToList}
/>