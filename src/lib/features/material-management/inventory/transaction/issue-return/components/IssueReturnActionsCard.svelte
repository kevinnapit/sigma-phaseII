<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save, Send } from 'lucide-svelte';
	import IssueReturnConfirmSubmitModal from './IssueReturnConfirmSubmitModal.svelte';

	let {
		items = [],
		formData = {},
		onSubmit,
		isSubmitting = false
	}: {
		items?: any[];
		formData?: any;
		onSubmit?: () => Promise<any>;
		isSubmitting?: boolean;
	} = $props();

	// Modal states
	let showConfirmModal = $state(false);

	const isFormValid = $derived(
		formData.store_id && 
		formData.return_date && 
		items.length > 0
	);

	const validationMessage = $derived(() => {
		if (!formData.store_id) {
			return 'Gudang wajib dipilih';
		}
		if (!formData.return_date) {
			return 'Tanggal pengembalian wajib diisi';
		}
		if (items.length === 0) {
			return 'Minimal harus ada 1 item';
		}
		return '';
	});

	const totalQuantity = $derived(() => {
		return items.reduce((sum, item) => sum + (item.quantity_returned || 0), 0);
	});

	function handleSubmitClick() {
		if (!isFormValid) return;
		showConfirmModal = true;
	}

	async function handleConfirmSubmit() {
		showConfirmModal = false;
		
		try {
			await onSubmit?.();
			// Navigate back to list will be handled by parent
		} catch (error) {
			console.error('Error submitting return:', error);
		}
	}

	function handleCancelSubmit() {
		showConfirmModal = false;
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
			class="w-full"
			onclick={handleSubmitClick}
			disabled={!isFormValid || isSubmitting}
		>
			<Send class="mr-2 h-4 w-4" />
			{isSubmitting ? 'Memproses...' : 'Proses Pengembalian'}
		</Button>
	</CardContent>
</Card>

<!-- Modals -->
<IssueReturnConfirmSubmitModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirmSubmit}
	onCancel={handleCancelSubmit}
	itemCount={items.length}
	totalQuantity={totalQuantity()}
/>
