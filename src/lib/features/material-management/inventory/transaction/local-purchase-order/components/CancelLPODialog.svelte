<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { LoaderCircle } from 'lucide-svelte';

	let {
		open = $bindable(false),
		lpoNumber,
		onConfirm,
		isSubmitting = false
	}: {
		open?: boolean;
		lpoNumber: string;
		onConfirm: (reason: string) => void;
		isSubmitting?: boolean;
	} = $props();

	let reason = $state('');
	let error = $state('');

	function handleConfirm() {
		if (!reason.trim()) {
			error = 'Alasan pembatalan wajib diisi';
			return;
		}

		onConfirm(reason);
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
			<AlertDialog.Title>Batalkan LPO</AlertDialog.Title>
			<AlertDialog.Description>
				Anda akan membatalkan LPO <strong>{lpoNumber}</strong>. Setelah dibatalkan, LPO tidak
				dapat diedit lagi. Tindakan ini tidak dapat dibatalkan.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="py-4">
			<div class="space-y-2">
				<Label for="cancel-reason">
					Alasan Pembatalan <span class="text-destructive">*</span>
				</Label>
				<Textarea
					id="cancel-reason"
					bind:value={reason}
					placeholder="Masukkan alasan pembatalan..."
					rows={4}
					disabled={isSubmitting}
					class={error ? 'border-destructive' : ''}
				/>
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}
			</div>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel} disabled={isSubmitting}>
				Batal
			</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleConfirm}
				disabled={isSubmitting}
				class="bg-destructive hover:bg-destructive/90"
			>
				{#if isSubmitting}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Membatalkan...
				{:else}
					Batalkan LPO
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
