<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import ViewItemStorageLayouts from '$lib/features/material-management/inventory/master/item-storage-layout/components/ViewItemStorageLayouts.svelte';
	import ItemStorageLayoutStats from '$lib/features/material-management/inventory/master/item-storage-layout/components/ItemStorageLayoutStats.svelte';

	let searchQuery = $state('');
</script>

<div class="space-y-6">
	<PageHeader title="Rak Penyimpanan Barang" description="Kelola rak penyimpanan barang di gudang." />

	<ItemStorageLayoutStats />

	<ViewItemStorageLayouts bind:searchName={searchQuery} />
</div>
