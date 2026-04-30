<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteCropMutation } from '../../queries/useCropMutation.svelte';

	type Crop = components['schemas']['CropItem'];

	let {
		open = $bindable(false),
		crop
	}: {
		open: boolean;
		crop: Crop;
	} = $props();

	const deleteMutation = useDeleteCropMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!crop) return;

		const result = await deleteMutation.mutateAsync({ id: crop.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus data panenan');
			return;
		}

		toast.success('Data panenan berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Panenan</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus data panenan <strong>"{crop?.value}"</strong>? Tindakan
				ini tidak dapat dibatalkan dan akan menghapus seluruh data panenan.
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
