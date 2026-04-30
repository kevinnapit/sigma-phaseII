<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteNationalityMutation } from '../../queries/useGeneralMutation.svelte';

	type KebangsaanItem = components['schemas']['KebangsaanItem'];

	let {
		open = $bindable(false),
		nationality
	}: {
		open: boolean;
		nationality: KebangsaanItem;
	} = $props();

	const deleteMutation = useDeleteNationalityMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!nationality) return;

		const result = await deleteMutation.mutateAsync({ id: nationality.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus kebangsaan');
			return;
		}

		toast.success('Kebangsaan berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Kebangsaan</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus kebangsaan <strong>"{nationality?.name}"</strong>?
				Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data kebangsaan.
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
