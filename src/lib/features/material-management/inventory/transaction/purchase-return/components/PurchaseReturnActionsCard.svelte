<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save } from 'lucide-svelte';
	import PurchaseReturnConfirmModal from './PurchaseReturnConfirmModal.svelte';

	let {
		items = [],
		formData = {},
		onSave,
		isSaving = false
	}: {
		items?: any[];
		formData?: any;
		onSave?: () => Promise<any>;
		isSaving?: boolean;
	} = $props();

	let showConfirmModal = $state(false);

	const isFormValid = $derived(
		!!formData.supplier_id && !!formData.return_date && items.length > 0
	);

	const validationMessage = $derived(() => {
		if (!formData.supplier_id) return 'Supplier wajib dipilih';
		if (!formData.return_date) return 'Tanggal pengembalian wajib diisi';
		if (items.length === 0) return 'Minimal harus ada 1 item';
		return '';
	});

	const totalReturnedQty = $derived(
		items.reduce((sum: number, item: any) => sum + (item.returned_qty || 0), 0)
	);

	const grossAmount = $derived(
		items.reduce((sum: number, item: any) => sum + (item.total || 0), 0)
	);

	function handleSaveClick() {
		if (!isFormValid) return;
		showConfirmModal = true;
	}

	async function handleConfirm() {
		showConfirmModal = false;
		try {
			await onSave?.();
		} catch (error) {
			console.error('Error saving purchase return:', error);
		}
	}

	function handleCancel() {
		showConfirmModal = false;
	}

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Tindakan</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Summary -->
		{#if items.length > 0}
			<div class="space-y-2 rounded-lg border bg-muted/50 p-3">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Barang:</span>
					<span class="font-medium">{items.length} barang</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Qty Kembali:</span>
					<span class="font-medium">{totalReturnedQty}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Gross Amount:</span>
					<span class="font-semibold">{formatCurrency(grossAmount)}</span>
				</div>
			</div>
		{/if}

		<!-- Validation Message -->
		{#if !isFormValid && validationMessage()}
			<div class="rounded-md border border-yellow-200 bg-yellow-50 p-3">
				<p class="text-xs text-yellow-800">
					<strong>Perhatian:</strong>
					{validationMessage()}
				</p>
			</div>
		{/if}

		<!-- Save Button -->
		<Button
			class="w-full"
			onclick={handleSaveClick}
			disabled={!isFormValid || isSaving}
		>
			<Save class="mr-2 h-4 w-4" />
			{isSaving ? 'Menyimpan...' : 'Simpan Pengembalian'}
		</Button>
	</Card.Content>
</Card.Root>

<!-- Confirm Modal -->
<PurchaseReturnConfirmModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
	itemCount={items.length}
	totalReturnedQty={totalReturnedQty}
	grossAmount={grossAmount}
/>
