<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteGroupMutation } from '../../queries/useOrganizationMutation.svelte';

	type GroupResponse = components['schemas']['GroupItem'];

	let {
		open = $bindable(false),
		group
	}: {
		open: boolean;
		group: GroupResponse;
	} = $props();

	const deleteMutation = useDeleteGroupMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!group) return;

		const result = await deleteMutation.mutateAsync({ id: group.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus grup');
			return;
		}

		toast.success('Grup berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Grup</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus grup <strong>"{group?.name}"</strong>? Tindakan ini tidak
				dapat dibatalkan dan akan menghapus seluruh data grup.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isPending}>Batal</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleConfirm} disabled={isPending}>
				{isPending ? 'Menghapus...' : 'Hapus'}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
