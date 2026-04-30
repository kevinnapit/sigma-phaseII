<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useDeleteCompanyMutation } from '../../queries/useOrganizationMutation.svelte';

	type CompanyItem = components['schemas']['CompanyItem'];

	let {
		open = $bindable(false),
		company
	}: {
		open: boolean;
		company: CompanyItem;
	} = $props();

	const deleteMutation = useDeleteCompanyMutation();
	const isPending = $derived(deleteMutation.isPending);

	async function handleConfirm() {
		if (!company) return;

		const result = await deleteMutation.mutateAsync({ id: company.id });

		if (result.error) {
			console.error(result.error);
			toast.error('Gagal menghapus data perusahaan');
			return;
		}

		toast.success('Data perusahaan berhasil dihapus');
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Data Perusahaan</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah kamu yakin ingin menghapus data perusahaan <strong>"{company?.name}"</strong>?
				Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data perusahaan.
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
