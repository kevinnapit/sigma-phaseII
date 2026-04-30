<script lang="ts">
	import { Eye, Pencil, Trash2, Ellipsis } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { StoreItem } from '../types/store.types';
	import { STORE_PERMISSIONS } from '../constants/store-permissions';

	interface Props {
		store: StoreItem;
		onViewDetail: (store: StoreItem) => void;
		onEdit: (store: StoreItem) => void;
		onDelete: (store: StoreItem) => void;
	}

	let { store, onViewDetail, onEdit, onDelete }: Props = $props();
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
		<Guard permissions={STORE_PERMISSIONS.STORE_VIEW_DETAIL}>
			<DropdownMenu.Item onclick={() => onViewDetail(store)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		<Guard permissions={STORE_PERMISSIONS.STORE_UPDATE}>
			<DropdownMenu.Item onclick={() => onEdit(store)}>
				<Pencil class="h-4 w-4" />
				Edit
			</DropdownMenu.Item>
		</Guard>
		<!-- <Guard permissions={STORE_PERMISSIONS.STORE_DELETE}>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={() => onDelete(store)} variant="destructive">
				<Trash2 class="h-4 w-4" />
				Hapus
			</DropdownMenu.Item>
		</Guard> -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
