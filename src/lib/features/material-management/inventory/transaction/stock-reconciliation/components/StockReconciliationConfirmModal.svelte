<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Save } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		itemCount = 0,
		approvedCount = 0,
		totalVariations = 0
	}: {
		open?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
		itemCount?: number;
		approvedCount?: number;
		totalVariations?: number;
	} = $props();

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			return;
		}
		open = newOpen;
	}

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}
</script>

<AlertDialog.Root bind:open onOpenChange={handleOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Konfirmasi Rekonsiliasi Stok</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menyimpan rekonsiliasi stok ini?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<!-- Ringkasan -->
		<div class="my-4 space-y-2 rounded-lg border bg-muted/50 p-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Jumlah Barang:</span>
				<span class="font-semibold">{itemCount} barang</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Item Disetujui:</span>
				<span class="font-semibold">{approvedCount} barang</span>
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

		<p class="text-sm text-muted-foreground">
			Setelah disimpan, rekonsiliasi stok akan dicatat dalam sistem. Pastikan semua informasi sudah
			benar.
		</p>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={onCancel}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action onclick={onConfirm}>
				<Save class="mr-2 h-4 w-4" />
				Ya, Simpan
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
