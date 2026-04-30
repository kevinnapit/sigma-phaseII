<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { systemAdminKeys } from '../keys';
	import { env } from '$env/dynamic/public';

	type PermissionData = Schemas['PermissionData'] & { kind?: number };
	const userCtx = getUserContext();

	let {
		open = $bindable(false),
		permission = null
	}: { open?: boolean; permission: PermissionData | null } = $props();

	let loading = $state(false);
	const queryClient = useQueryClient();

	async function handleDelete() {
		if (!permission) return;

		loading = true;
		try {
			const { error } = await userCtx.client().DELETE('/api/system-admin/permissions/{id}', {
				params: { path: { id: permission.id } },
				baseUrl: env.PUBLIC_T2_API_URL
			});

			if (error) throw error;

			toast.success('Permission berhasil dihapus');
			await queryClient.invalidateQueries({ queryKey: systemAdminKeys.permissionsAll() });
			open = false;
		} catch (err) {
			console.error('Delete permission error:', err);
			toast.error('Gagal menghapus permission');
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		open = false;
	}
</script>

<AlertDialog bind:open>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Hapus Permission</AlertDialogTitle>
			<AlertDialogDescription>
				Apakah Anda yakin ingin menghapus permission <strong>{permission?.name}</strong>?
				Tindakan ini tidak dapat dibatalkan dan akan menghapus semua akses yang terkait dengan permission ini.
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel onclick={handleCancel}>Batal</AlertDialogCancel>
			<AlertDialogAction 
				onclick={handleDelete}
				disabled={loading}
				class="bg-destructive hover:bg-destructive/90"
			>
				{loading ? 'Menghapus...' : 'Hapus Permission'}
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>