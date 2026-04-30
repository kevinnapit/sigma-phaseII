<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Eye, MoreHorizontal } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { LocalPurchaseItem } from '../types/local-purchase-item.types';

	interface Props {
		localPurchaseItem: LocalPurchaseItem;
		onViewDetail?: (localPurchaseItem: LocalPurchaseItem) => void;
	}

	let { localPurchaseItem, onViewDetail }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
			<span class="sr-only">Open menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(localPurchaseItem)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
