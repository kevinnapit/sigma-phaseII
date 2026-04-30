<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Eye, MoreHorizontal } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { ItemSubstitution } from '../types/item-substitution.types';

	interface Props {
		itemSubstitution: ItemSubstitution;
		onViewDetail?: (itemSubstitution: ItemSubstitution) => void;
	}

	let { itemSubstitution, onViewDetail }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
			<span class="sr-only">Buka menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(itemSubstitution)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
