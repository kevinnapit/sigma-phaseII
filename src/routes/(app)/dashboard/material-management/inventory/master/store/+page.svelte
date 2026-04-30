<script lang="ts">
	import Guard from '$lib/components/shared/guard.svelte';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import ViewStores from '$lib/features/material-management/inventory/master/stores/components/ViewStores.svelte';
	import StoreStats from '$lib/features/material-management/inventory/master/stores/components/StoreStats.svelte';
	import { STORE_PERMISSIONS } from '$lib/features/material-management/inventory/master/stores/constants/store-permissions';

	let searchQuery = $state('');
</script>

<div class="space-y-6">
	<PageHeader title="Master Gudang" description="Kelola data master gudang inventaris." />

	<Guard permissions={STORE_PERMISSIONS.STORE_VIEW}>
		<StoreStats />
	</Guard>

	<ViewStores bind:searchName={searchQuery} />
</div>
