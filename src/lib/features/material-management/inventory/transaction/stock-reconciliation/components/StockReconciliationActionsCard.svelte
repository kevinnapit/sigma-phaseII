<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save } from 'lucide-svelte';
	import type { ReconciliationItem } from '../types/stock-reconciliation.types';

	let {
		items = [],
		formData = {},
		onSave,
		isSaving = false
	}: {
		items?: ReconciliationItem[];
		formData?: any;
		onSave?: () => Promise<any>;
		isSaving?: boolean;
	} = $props();

	const isFormValid = $derived(
		!!formData.verification_schedule_no &&
		!!formData.entry_date &&
		!!formData.approved_date &&
		items.length > 0
	);

	const validationMessage = $derived.by(() => {
		if (!formData.verification_schedule_no) return 'No. Jadwal Verifikasi wajib dipilih';
		if (!formData.entry_date) return 'Tanggal Entri wajib diisi';
		if (!formData.approved_date) return 'Tanggal Disetujui wajib diisi';
		if (items.length === 0) return 'Daftar barang tidak boleh kosong';
		return '';
	});

	const totalItems = $derived(items.length);

	const approvedItems = $derived(items.filter((i) => i.approved).length);

	const totalVariations = $derived(
		items.reduce((sum, item) => sum + (item.variations || 0), 0)
	);

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}

	async function handleSaveClick() {
		if (!isFormValid) return;
		try {
			await onSave?.();
		} catch (error) {
			console.error('Gagal menyimpan rekonsiliasi stok:', error);
		}
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
					<span class="font-medium">{totalItems} barang</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Item Disetujui:</span>
					<span class="font-medium">{approvedItems} / {totalItems}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Variasi:</span>
					<span
						class="font-semibold {totalVariations < 0
							? 'text-red-600'
							: totalVariations > 0
								? 'text-green-600'
								: ''}"
					>
						{totalVariations > 0 ? '+' : ''}{formatNumber(totalVariations)}
					</span>
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
		<Button
			class="w-full"
			onclick={handleSaveClick}
			disabled={!isFormValid || isSaving}
		>
			<Save class="mr-2 h-4 w-4" />
			{isSaving ? 'Menyimpan...' : 'Simpan Rekonsiliasi Stok'}
		</Button>
	</Card.Content>
</Card.Root>
