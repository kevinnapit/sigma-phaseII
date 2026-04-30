<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { ItemStorageLayout } from '../types/item-storage-layout.types';

	interface Props {
		layout: ItemStorageLayout;
		onViewDetail?: (layout: ItemStorageLayout) => void;
		onEdit?: (layout: ItemStorageLayout) => void;
		onDelete?: (layout: ItemStorageLayout) => void;
	}

	let { layout, onViewDetail, onEdit, onDelete }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
			<span class="sr-only">Open menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(layout)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => onEdit?.(layout)}>
			<Pencil class="mr-2 h-4 w-4" />
			Edit
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => onDelete?.(layout)} class="text-destructive">
			<Trash2 class="mr-2 h-4 w-4" />
			Hapus
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
