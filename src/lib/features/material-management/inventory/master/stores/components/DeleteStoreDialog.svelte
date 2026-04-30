<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { useDeleteStore } from '../hooks/useStoresMutations.svelte';
	import type { StoreItem } from '../types/store.types';

	let {
		open = $bindable(false),
		store,
		onSuccess
	}: {
		open?: boolean;
		store: StoreItem | null;
		onSuccess?: () => void;
	} = $props();

	const deleteStoreMutation = useDeleteStore();

	async function handleDelete() {
		if (!store) return;

		try {
			await deleteStoreMutation.mutateAsync({
				uoid: store.uoid,
				i_version: store.i_version
			});
			toast.success('Gudang berhasil dihapus');
			open = false;
			onSuccess?.();
		} catch (error) {
			console.error('Error deleting store:', error);
			toast.error('Gagal menghapus gudang');
		}
	}

	function handleCancel() {
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Gudang</AlertDialog.Title>
			<AlertDialog.Description>
				{#if store}
					Apakah Anda yakin ingin menghapus gudang <strong>{store.name}</strong> (Kode: {store.code})?
					<br /><br />
					Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data yang terkait dengan gudang
					ini.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleDelete}
				disabled={deleteStoreMutation.isPending}
				class="bg-red-600 hover:bg-red-700"
			>
				{deleteStoreMutation.isPending ? 'Menghapus...' : 'Hapus'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
