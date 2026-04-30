<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { AlertCircle, Send } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		itemCount = 0,
		hasUrgentItems = false
	}: {
		open?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
		itemCount?: number;
		hasUrgentItems?: boolean;
	} = $props();

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			return;
		}
		open = newOpen;
	}
</script>

<AlertDialog.Root bind:open onOpenChange={handleOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
					<AlertCircle class="h-6 w-6 text-blue-600" />
				</div>
				<div>
					<AlertDialog.Title>Konfirmasi Pengiriman Permintaan</AlertDialog.Title>
					<AlertDialog.Description>
						Apakah Anda yakin ingin mengirim permintaan barang ini?
					</AlertDialog.Description>
				</div>
			</div>
		</AlertDialog.Header>

		<!-- Summary Info -->
		<div class="my-4 space-y-2 rounded-lg border bg-muted/50 p-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total Item:</span>
				<span class="font-semibold">{itemCount}</span>
			</div>
			{#if hasUrgentItems}
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Status:</span>
					<span class="font-semibold text-red-600">Mengandung Item Darurat</span>
				</div>
			{/if}
		</div>

		<p class="text-sm text-muted-foreground">
			Setelah dikirim, permintaan akan diproses dan tidak dapat dibatalkan. Pastikan semua informasi
			sudah benar.
		</p>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={onCancel}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action onclick={onConfirm}>
				<Send class="mr-2 h-4 w-4" />
				Ya, Kirim Permintaan
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
