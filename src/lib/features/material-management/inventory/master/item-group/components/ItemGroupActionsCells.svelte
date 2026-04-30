<script lang="ts">
	import { Eye, Pencil, Ellipsis } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { ItemGroupItem } from '../types/item-group.types';
	import { ITEM_GROUP_PERMISSIONS } from '../constants/item-group-permissions';

	let {
		itemGroup,
		onViewDetail,
		onEdit
	}: {
		itemGroup: ItemGroupItem;
		onViewDetail: (itemGroup: ItemGroupItem) => void;
		onEdit: (itemGroup: ItemGroupItem) => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="h-8 w-8 p-0">
				<span class="sr-only">Buka menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<Guard permissions={ITEM_GROUP_PERMISSIONS.ITEM_GROUP_VIEW_DETAIL}>
			<DropdownMenu.Item onclick={() => onViewDetail(itemGroup)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		<Guard permissions={ITEM_GROUP_PERMISSIONS.ITEM_GROUP_UPDATE}>
			<DropdownMenu.Item onclick={() => onEdit(itemGroup)}>
				<Pencil class="h-4 w-4" />
				Edit
			</DropdownMenu.Item>
		</Guard>
	</DropdownMenu.Content>
</DropdownMenu.Root>
