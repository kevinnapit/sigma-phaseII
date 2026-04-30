<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save } from 'lucide-svelte';
	import PhysicalStocktakeConfirmModal from './PhysicalStocktakeConfirmModal.svelte';
	import type { StocktakeItem } from '../types/physical-stocktake.types';

	let {
		items = [],
		formData = {},
		onSave,
		isSaving = false
	}: {
		items?: StocktakeItem[];
		formData?: any;
		onSave?: () => Promise<any>;
		isSaving?: boolean;
	} = $props();

	let showConfirmModal = $state(false);

	const isFormValid = $derived(
		!!formData.schedule && !!formData.entry_date && items.length > 0
	);

	const validationMessage = $derived.by(() => {
		if (!formData.schedule) return 'Jadwal verifikasi stok wajib dipilih';
		if (!formData.entry_date) return 'Tanggal entri wajib diisi';
		if (items.length === 0) return 'Daftar barang tidak boleh kosong';
		return '';
	});

	const totalPhysicalStock = $derived(
		items.reduce((sum, item) => sum + (item.physical_stock || 0), 0)
	);

	const totalPhysicalValue = $derived(
		items.reduce((sum, item) => sum + (item.physical_value || 0), 0)
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
			console.error('Gagal menyimpan entri stok opname:', error);
		}
	}

	function handleCancel() {
		showConfirmModal = false;
	}

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Tindakan</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Ringkasan -->
		{#if items.length > 0}
			<div class="space-y-2 rounded-lg border bg-muted/50 p-3">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Barang:</span>
					<span class="font-medium">{items.length} barang</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Stok Fisik:</span>
					<span class="font-medium">{formatNumber(totalPhysicalStock)}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Nilai Fisik:</span>
					<span class="font-semibold">{formatNumber(totalPhysicalValue)}</span>
				</div>
			</div>
		{/if}

		<!-- Pesan Validasi -->
		{#if !isFormValid && validationMessage}
			<div class="rounded-md border border-yellow-200 bg-yellow-50 p-3">
				<p class="text-xs text-yellow-800">
					<strong>Perhatian:</strong>
					{validationMessage}
				</p>
			</div>
		{/if}

		<!-- Tombol Simpan -->
		<Button class="w-full" onclick={handleSaveClick} disabled={!isFormValid || isSaving}>
			<Save class="mr-2 h-4 w-4" />
			{isSaving ? 'Menyimpan...' : 'Simpan Entri Stok Opname'}
		</Button>
	</Card.Content>
</Card.Root>

<!-- Modal Konfirmasi -->
<PhysicalStocktakeConfirmModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
	itemCount={items.length}
	totalPhysicalStock={totalPhysicalStock}
	totalPhysicalValue={totalPhysicalValue}
/>
