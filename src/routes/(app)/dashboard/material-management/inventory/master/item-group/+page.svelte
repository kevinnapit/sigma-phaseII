<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import {
		ViewItemGroup,
		ItemGroupStats
	} from '$lib/features/material-management/inventory/master/item-group';
	import { ITEM_GROUP_PERMISSIONS } from '$lib/features/material-management/inventory/master/item-group/constants/item-group-permissions';

	let searchName = $state('');
</script>

<PageHeader
	title="Master Grup Barang"
	description="Kelola Grup Barang untuk manajemen material dan inventory."
/>

<div class="space-y-6">
	<Guard permissions={ITEM_GROUP_PERMISSIONS.ITEM_GROUP_VIEW}>
		<ItemGroupStats />
	</Guard>
	<ViewItemGroup bind:searchName />
</div>
