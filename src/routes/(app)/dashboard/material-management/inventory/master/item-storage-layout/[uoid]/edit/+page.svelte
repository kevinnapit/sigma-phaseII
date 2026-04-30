<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { PageHeader, Guard } from '$lib/components/shared';
	import { ITEM_STORAGE_LAYOUT_PERMISSIONS } from '$lib/features/material-management/inventory/master/item-storage-layout/constants/item-storage-layout-permissions';
	import { useReadItemStorageLayoutDetail } from '$lib/features/material-management/inventory/master/item-storage-layout/hooks/useItemStorageLayoutQueries.svelte';
	import EditItemStorageLayoutForm from '$lib/features/material-management/inventory/master/item-storage-layout/components/EditItemStorageLayoutForm.svelte';

	const uoid = $derived(page.params.uoid);

	const layoutQuery = useReadItemStorageLayoutDetail(() => uoid);

	const layout = $derived(layoutQuery.data?.data);
	const isLoading = $derived(layoutQuery.isLoading);
	const isError = $derived(layoutQuery.isError);

	function handleSuccess() {
		goto(`/dashboard/material-management/inventory/master/item-storage-layout/${uoid}`);
	}
</script>

<Guard permissions={ITEM_STORAGE_LAYOUT_PERMISSIONS.UPDATE}>
	<div class="space-y-6">
		<PageHeader title="Edit Rak Penyimpanan" description="Perbarui informasi rak penyimpanan" />

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="text-muted-foreground">Memuat data...</div>
			</div>
		{:else if isError}
			<div class="flex items-center justify-center py-12">
				<div class="text-destructive">Gagal memuat data</div>
			</div>
		{:else if layout}
			<EditItemStorageLayoutForm {layout} onSuccess={handleSuccess} />
		{/if}
	</div>
</Guard>
