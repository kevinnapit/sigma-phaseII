<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteUserMutation } from '../../queries/useUserMutation.svelte';

	type User = components['schemas']['UserData'];

	let {
		open = $bindable(false),
		user
	}: {
		open: boolean;
		user: User;
	} = $props();

	const deleteMutation = useDeleteUserMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!user) return;

		const result = await deleteMutation.mutateAsync({ userId: user.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus data pengguna');
			return;
		}

		toast.success('Data pengguna berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Data Pengguna</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus data pengguna <strong>"{user?.name}"</strong>? Tindakan
				ini tidak dapat dibatalkan dan akan menghapus seluruh data pengguna.
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
