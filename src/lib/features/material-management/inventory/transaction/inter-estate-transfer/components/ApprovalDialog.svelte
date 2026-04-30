<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { LoaderCircle } from 'lucide-svelte';

	let {
		open = $bindable(false),
		type,
		onConfirm,
		isSubmitting = false
	}: {
		open?: boolean;
		type: 'approve' | 'reject';
		onConfirm: (notes: string) => void;
		isSubmitting?: boolean;
	} = $props();

	let notes = $state('');

	function handleConfirm() {
		onConfirm(notes);
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			notes = '';
		}
	}

	const isApprove = $derived(type === 'approve');
	const title = $derived(isApprove ? 'Setujui Transfer' : 'Tolak Transfer');
	const description = $derived(
		isApprove
			? 'Apakah Anda yakin ingin menyetujui transfer antar kebun ini?'
			: 'Apakah Anda yakin ingin menolak transfer antar kebun ini?'
	);
	const confirmText = $derived(isApprove ? 'Setujui' : 'Tolak');
	const confirmClass = $derived(
		isApprove ? 'bg-[#116834] hover:bg-green-900' : 'bg-[#D12828] hover:bg-red-700'
	);
</script>

<Dialog.Root open={open} onOpenChange={handleOpenChange}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="notes">
					{isApprove ? 'Catatan (Opsional)' : 'Alasan Penolakan (Opsional)'}
				</Label>
				<Textarea
					id="notes"
					bind:value={notes}
					placeholder={isApprove
						? 'Tambahkan catatan persetujuan...'
						: 'Tambahkan alasan penolakan...'}
					rows={4}
					disabled={isSubmitting}
				/>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={isSubmitting}>
				Batal
			</Button>
			<Button onclick={handleConfirm} disabled={isSubmitting} class={confirmClass}>
				{#if isSubmitting}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					{isApprove ? 'Menyetujui...' : 'Menolak...'}
				{:else}
					{confirmText}
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
