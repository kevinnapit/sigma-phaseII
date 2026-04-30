<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { useDeleteLocalVendor } from '../hooks/useVendorsLocalMutations.svelte';
	import type { LocalVendorItem } from '../types/vendor-local.types';

	let {
		open = $bindable(false),
		vendor,
		onSuccess
	}: {
		open?: boolean;
		vendor: LocalVendorItem | null;
		onSuccess?: () => void;
	} = $props();

	const deleteVendorMutation = useDeleteLocalVendor();

	async function handleDelete() {
		if (!vendor) return;

		try {
			await deleteVendorMutation.mutateAsync({
				uoid: vendor.uoid,
				i_version: vendor.i_version
			});
			toast.success('Vendor lokal berhasil dihapus');
			open = false;
			onSuccess?.();
		} catch (error) {
			console.error('Error deleting local vendor:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Gagal menghapus vendor lokal. Silakan coba lagi.';
			toast.error(errorMessage);
		}
	}

	function handleCancel() {
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Vendor Lokal</AlertDialog.Title>
			<AlertDialog.Description>
				{#if vendor}
					Apakah Anda yakin ingin menghapus vendor lokal <strong>{vendor.name}</strong> (Kode: {vendor.code})?
					<br /><br />
					Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data yang terkait dengan vendor
					ini.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleCancel}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleDelete}
				disabled={deleteVendorMutation.isPending}
				class="bg-red-600 hover:bg-red-700"
			>
				{deleteVendorMutation.isPending ? 'Menghapus...' : 'Hapus'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
