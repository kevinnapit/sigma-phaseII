<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Save } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		itemCount = 0,
		totalDebit = 0,
		totalCredit = 0
	}: {
		open?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
		itemCount?: number;
		totalDebit?: number;
		totalCredit?: number;
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
			<AlertDialog.Title>Konfirmasi Posting Akun Harian</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menyimpan posting akun harian ini?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<!-- Summary Info -->
		<div class="my-4 space-y-2 rounded-lg border bg-muted/50 p-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Jumlah Item:</span>
				<span class="font-semibold">{itemCount} item</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total Debit:</span>
				<span class="font-semibold">{formatCurrency(totalDebit)}</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total Kredit:</span>
				<span class="font-semibold">{formatCurrency(totalCredit)}</span>
			</div>
		</div>

		<p class="text-sm text-muted-foreground">
			Setelah disimpan, posting akun harian akan dicatat dalam sistem. Pastikan semua informasi
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
