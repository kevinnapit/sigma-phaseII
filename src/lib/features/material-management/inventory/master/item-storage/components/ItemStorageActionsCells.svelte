<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Eye, MoreHorizontal } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { ItemStorageAssignment } from '../types/item-storage.types';

	interface Props {
		assignment: ItemStorageAssignment;
		onViewDetail?: (assignment: ItemStorageAssignment) => void;
	}

	let { assignment, onViewDetail }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
			<span class="sr-only">Buka menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(assignment)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
