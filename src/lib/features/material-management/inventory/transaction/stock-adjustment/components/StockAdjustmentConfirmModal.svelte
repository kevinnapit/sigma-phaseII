<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Save } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		itemCount = 0,
		totalQuantity = 0,
		grossAmount = 0
	}: {
		open?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
		itemCount?: number;
		totalQuantity?: number;
		grossAmount?: number;
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
			<AlertDialog.Title>Konfirmasi Penyesuaian Stok</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menyimpan penyesuaian stok ini?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<!-- Summary Info -->
		<div class="my-4 space-y-2 rounded-lg border bg-muted/50 p-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Jumlah Barang:</span>
				<span class="font-semibold">{itemCount} barang</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total Quantity Penyesuaian:</span>
				<span
					class="font-semibold"
					class:text-red-600={totalQuantity < 0}
					class:text-green-600={totalQuantity > 0}
				>
					{totalQuantity > 0 ? '+' : ''}{formatNumber(totalQuantity)}
				</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Gross Amount:</span>
				<span
					class="font-semibold"
					class:text-red-600={grossAmount < 0}
					class:text-green-600={grossAmount > 0}
				>
					{grossAmount > 0 ? '+' : ''}{formatNumber(grossAmount)}
				</span>
			</div>
		</div>

		<p class="text-sm text-muted-foreground">
			Setelah disimpan, penyesuaian stok akan dicatat dalam sistem. Pastikan semua informasi sudah
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
