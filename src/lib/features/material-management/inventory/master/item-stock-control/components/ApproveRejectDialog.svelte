<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let {
		open = $bindable(false),
		type = 'approve',
		onConfirm,
		isSubmitting = false
	}: {
		open: boolean;
		type: 'approve' | 'reject';
		onConfirm: (reason?: string) => void;
		isSubmitting?: boolean;
	} = $props();

	let reason = $state('');

	function handleConfirm() {
		if (type === 'reject' && !reason.trim()) return;
		onConfirm(reason.trim() || undefined);
		reason = '';
	}

	function handleCancel() {
		open = false;
		reason = '';
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{type === 'approve' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan'}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if type === 'approve'}
					Apakah Anda yakin ingin menyetujui perubahan kontrol stok barang ini?
				{:else}
					Anda akan menolak perubahan kontrol stok barang ini. Silakan berikan alasan penolakan.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>

		{#if type === 'reject'}
			<div class="space-y-2 py-4">
				<Label for="reject-reason">Alasan Penolakan <span class="text-red-500">*</span></Label>
				<Textarea
					id="reject-reason"
					bind:value={reason}
					placeholder="Berikan alasan penolakan..."
					rows={4}
					disabled={isSubmitting}
				/>
			</div>
		{:else}
			<div class="space-y-2 py-4">
				<Label for="approve-reason">Catatan (opsional)</Label>
				<Textarea
					id="approve-reason"
					bind:value={reason}
					placeholder="Berikan catatan persetujuan..."
					rows={4}
					disabled={isSubmitting}
				/>
			</div>
		{/if}

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel} disabled={isSubmitting}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleConfirm}
				disabled={isSubmitting || (type === 'reject' && !reason.trim())}
				class={type === 'approve'
					? 'bg-[#116834] hover:bg-green-900'
					: 'bg-[#D12828] hover:bg-red-700'}
			>
				{type === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
