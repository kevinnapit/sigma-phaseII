<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ViewItems, ItemStats } from '$lib/features/material-management/inventory/master/item';
	import { ITEM_PERMISSIONS } from '$lib/features/material-management/inventory/master/item/constants/item-permissions';
	import { onMount } from 'svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	let searchName = $state('');
	
	const queryClient = useQueryClient();
	
	// Clear any stale queries on mount
	onMount(() => {
		// Invalidate all item queries to ensure fresh data
		queryClient.invalidateQueries({ queryKey: ['material-management', 'items'] });
	});
</script>

<PageHeader
	title="Master Barang"
	description="Kelola Barang untuk manajemen material dan inventory."
/>

<div class="space-y-6">
	<Guard permissions={ITEM_PERMISSIONS.BARANG_VIEW}>
		<ItemStats />
	</Guard>
	<ViewItems bind:searchName />
</div>
