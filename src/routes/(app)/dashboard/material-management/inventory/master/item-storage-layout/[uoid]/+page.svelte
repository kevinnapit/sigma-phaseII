<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { PageHeader, Guard } from '$lib/components/shared';
	import { Pencil, Trash2, ArrowLeft } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { ITEM_STORAGE_LAYOUT_PERMISSIONS } from '$lib/features/material-management/inventory/master/item-storage-layout/constants/item-storage-layout-permissions';
	import { useReadItemStorageLayoutDetail } from '$lib/features/material-management/inventory/master/item-storage-layout/hooks/useItemStorageLayoutQueries.svelte';
	import { useDeleteItemStorageLayout } from '$lib/features/material-management/inventory/master/item-storage-layout/hooks/useItemStorageLayoutMutations.svelte';
	import ItemStorageLayoutDetailView from '$lib/features/material-management/inventory/master/item-storage-layout/components/ItemStorageLayoutDetailView.svelte';

	const uoid = $derived(page.params.uoid);

	const layoutQuery = useReadItemStorageLayoutDetail(() => uoid);
	const deleteMutation = useDeleteItemStorageLayout();

	const layout = $derived(layoutQuery.data?.data);
	const isLoading = $derived(layoutQuery.isLoading);
	const isError = $derived(layoutQuery.isError);

	let showDeleteDialog = $state(false);

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/item-storage-layout');
	}

	function handleEdit() {
		goto(`/dashboard/material-management/inventory/master/item-storage-layout/${uoid}/edit`);
	}

	function handleDelete() {
		deleteMutation.mutate(uoid, {
			onSuccess: () => {
				showDeleteDialog = false;
				goto('/dashboard/material-management/inventory/master/item-storage-layout');
			}
		});
	}
</script>

<Guard permissions={ITEM_STORAGE_LAYOUT_PERMISSIONS.VIEW}>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<PageHeader title="Detail Rak Penyimpanan" description="Informasi lengkap rak penyimpanan" />
			<div class="flex gap-2">
				<Button variant="outline" onclick={handleBack}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Kembali
				</Button>
				<Guard permissions={ITEM_STORAGE_LAYOUT_PERMISSIONS.UPDATE}>
					<Button variant="outline" onclick={handleEdit} disabled={isLoading}>
						<Pencil class="mr-2 h-4 w-4" />
						Edit
					</Button>
				</Guard>
				<Guard permissions={ITEM_STORAGE_LAYOUT_PERMISSIONS.DELETE}>
					<Button
						variant="destructive"
						onclick={() => (showDeleteDialog = true)}
						disabled={isLoading}
					>
						<Trash2 class="mr-2 h-4 w-4" />
						Hapus
					</Button>
				</Guard>
			</div>
		</div>

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="text-muted-foreground">Memuat data...</div>
			</div>
		{:else if isError}
			<div class="flex items-center justify-center py-12">
				<div class="text-destructive">Gagal memuat data</div>
			</div>
		{:else if layout}
			<ItemStorageLayoutDetailView {layout} />
		{/if}
	</div>

	<!-- Delete Confirmation Dialog -->
	<AlertDialog.Root bind:open={showDeleteDialog}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Hapus Rak Penyimpanan</AlertDialog.Title>
				<AlertDialog.Description>
					Apakah Anda yakin ingin menghapus rak "{layout?.name}"? Tindakan ini tidak dapat
					dibatalkan.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
				<AlertDialog.Action
					onclick={handleDelete}
					disabled={deleteMutation.isPending}
					class="bg-destructive hover:bg-destructive/90"
				>
					{deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Guard>
