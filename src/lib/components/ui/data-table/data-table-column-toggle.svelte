<script lang="ts" generics="TData extends RowData">
	import type { RowData, Table } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Settings2 } from 'lucide-svelte';

	type Props<TData extends RowData> = {
		table: Table<TData>;
		label?: string;
	};

	let { table, label = 'Kolom' }: Props<TData> = $props();

	const hideableColumns = $derived(table.getAllColumns().filter((col) => col.getCanHide()));
</script>

{#if hideableColumns.length > 0}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline">
					<span class="hidden sm:block">{label}</span>
					<Settings2 class="h-4 w-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#each hideableColumns as column (column.id)}
				<DropdownMenu.CheckboxItem
					class="capitalize"
					checked={column.getIsVisible()}
					onCheckedChange={(value) => column.toggleVisibility(!!value)}
				>
					{column.columnDef.header}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
