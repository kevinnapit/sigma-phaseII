<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Save } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		itemCount = 0,
		totalReturnedQty = 0,
		grossAmount = 0
	}: {
		open?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
		itemCount?: number;
		totalReturnedQty?: number;
		grossAmount?: number;
	} = $props();

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			return;
		}
		open = newOpen;
	}

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}
</script>

<AlertDialog.Root bind:open onOpenChange={handleOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Konfirmasi Pengembalian Pembelian</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menyimpan pengembalian pembelian ini?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<!-- Summary Info -->
		<div class="my-4 space-y-2 rounded-lg border bg-muted/50 p-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Jumlah Barang:</span>
				<span class="font-semibold">{itemCount} barang</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total Qty Dikembalikan:</span>
				<span class="font-semibold">{totalReturnedQty}</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Gross Amount:</span>
				<span class="font-semibold">{formatCurrency(grossAmount)}</span>
			</div>
		</div>

		<p class="text-sm text-muted-foreground">
			Setelah disimpan, pengembalian pembelian akan dicatat dalam sistem. Pastikan semua informasi
			sudah benar.
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
