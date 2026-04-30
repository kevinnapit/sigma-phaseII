<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteUomMutation } from '../../queries/useUomMutation.svelte';

	type UomItem = components['schemas']['UOMItem'];

	let {
		open = $bindable(false),
		uom
	}: {
		open: boolean;
		uom: UomItem;
	} = $props();

	const deleteMutation = useDeleteUomMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!uom) return;

		const result = await deleteMutation.mutateAsync({ id: uom.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus pengaturan satuan ukuran');
			return;
		}

		toast.success('Satuan ukuran berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Satuan Ukuran</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus satuan ukuran <strong>"{uom?.name}"</strong>? Tindakan ini
				tidak dapat dibatalkan dan akan menghapus seluruh data satuan ukuran.
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
