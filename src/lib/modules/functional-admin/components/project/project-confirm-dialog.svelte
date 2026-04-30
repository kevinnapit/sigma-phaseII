<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteProjectMutation } from '../../queries/useProjectMutation.svelte';

	type ProjectItem = components['schemas']['ProjectItem'];

	let {
		open = $bindable(false),
		project
	}: {
		open: boolean;
		project: ProjectItem;
	} = $props();

	const deleteMutation = useDeleteProjectMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!project) return;

		const result = await deleteMutation.mutateAsync({ id: project.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus proyek');
			return;
		}

		toast.success('Proyek berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Proyek</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus proyek <strong>"{project?.name}"</strong>? Tindakan ini
				tidak dapat dibatalkan dan akan menghapus seluruh data proyek.
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
