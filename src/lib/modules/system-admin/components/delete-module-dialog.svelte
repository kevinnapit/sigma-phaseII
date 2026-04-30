<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { useDeleteModuleMutation } from '../index.svelte';

	type ModuleNodeWithContext = Schemas['ModuleNodeWithContext'];

	type Props = {
		open: boolean;
		module: ModuleNodeWithContext | null;
	};

	let { open = $bindable(), module }: Props = $props();

	const deleteMutation = useDeleteModuleMutation({
		onSuccess: ({ error }) => {
			if (error) {
				toast.error('Gagal menghapus module');
				return;
			}
			toast.success('Module berhasil dihapus');
			open = false;
		},
		onError: () => {
			toast.error('Gagal menghapus module');
		}
	});

	function handleConfirm() {
		if (!module) return;
		deleteMutation.mutate(module.id);
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Module</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus module <strong>"{module?.name}"</strong>? Tindakan ini
				tidak dapat dibatalkan dan akan menghapus seluruh sub-module dan permission di dalamnya.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleteMutation.isPending}>Batal</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleConfirm} disabled={deleteMutation.isPending}>
				{deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
