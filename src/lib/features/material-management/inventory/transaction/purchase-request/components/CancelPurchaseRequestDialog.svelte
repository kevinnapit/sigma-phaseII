<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { LoaderCircle } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		isSubmitting = false
	}: {
		open: boolean;
		onConfirm?: (reason: string) => void;
		isSubmitting?: boolean;
	} = $props();

	let reason = $state('');
	let error = $state('');

	function handleConfirm() {
		if (!reason.trim()) {
			error = 'Alasan pembatalan wajib diisi';
			return;
		}

		onConfirm?.(reason);
	}

	function handleCancel() {
		reason = '';
		error = '';
		open = false;
	}

	// Reset when dialog opens
	$effect(() => {
		if (open) {
			reason = '';
			error = '';
		}
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Batalkan Permintaan Barang</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin membatalkan permintaan barang ini? Tindakan ini tidak dapat
				dibatalkan.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="py-4 space-y-2">
			<Label for="reason">
				Alasan Pembatalan <span class="text-destructive">*</span>
			</Label>
			<Textarea
				id="reason"
				bind:value={reason}
				placeholder="Masukkan alasan pembatalan..."
				rows={4}
				disabled={isSubmitting}
			/>
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel} disabled={isSubmitting}>
				Batal
			</AlertDialog.Cancel>
			<Button
				onclick={handleConfirm}
				disabled={isSubmitting}
				variant="destructive"
				class="bg-[#D12828] hover:bg-red-700"
			>
				{#if isSubmitting}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Membatalkan...
				{:else}
					Ya, Batalkan
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
