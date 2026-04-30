<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/auth/openapi.gen';
	import { useRevokeSessionMutation } from '../../queries/useSessionMutation';

	type SessionItem = components['schemas']['SessionInfo'];

	let {
		open = $bindable(false),
		session
	}: {
		open: boolean;
		session: SessionItem | null;
	} = $props();

	const deleteMutation = useRevokeSessionMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!session) return;

		const result = await deleteMutation.mutateAsync({ session_ids: [session.session_id] });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal mengakhiri sesi akun');
			return;
		}

		toast.success('Sesi akun berhasil diakhiri');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Akhiri Sesi Akun</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin mengakhiri sesi ini? Perangkat yang menggunakan sesi ini akan
				otomatis keluar.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isPending}>Batal</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleConfirm} disabled={isPending}>
				{isPending ? 'Memproses...' : 'Akhiri Sesi'}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
