<script lang="ts">
	import { Eye, Ellipsis } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { ItemData, ItemComprehensiveData } from '../types/item.types';
	import { ITEM_PERMISSIONS } from '../constants/item-permissions';

	let {
		item,
		onViewDetail
	}: {
		item: ItemData | ItemComprehensiveData;
		onViewDetail: (item: ItemData | ItemComprehensiveData) => void;
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
		<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
			<DropdownMenu.Item onclick={() => onViewDetail(item)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
	</DropdownMenu.Content>
</DropdownMenu.Root>
