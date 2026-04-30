<script lang="ts" generics="TData">
	import type { Cell, Row } from '@tanstack/table-core';
	import TableRow from '../table/table-row.svelte';
	import TableCell from '../table/table-cell.svelte';
	import FlexRender from './flex-render.svelte';
	import { cn } from '$lib/utils';

	type RowMeta = { onRowClick?: (row: Row<TData>) => void };

	type Props = {
		row: Row<TData>;
		rowClass?: (row: Row<TData>) => string | undefined;
		onRowClick?: (row: Row<TData>) => void;
	};
	let { row, rowClass, onRowClick }: Props = $props();

	function buildStyle(cell: Cell<TData, unknown>): string {
		let base: Record<string, string | number> = {
			position: 'relative',
			'z-index': 0
		};
		const pinned = cell.column.getIsPinned();
		if (pinned) {
			base = {
				...base,
				position: 'sticky',
				'z-index': 2,
				'background-color': 'var(--muted)'
			};
			if (pinned === 'left') {
				// base.left = `${cell.column.getStart('left')}px`;
				base.left = `0px`;
			}
			if (pinned === 'right') {
				base.right = `${cell.column.getAfter('right')}px`;
			}
		}
		return Object.entries(base)
			.map(([key, value]) => `${key}: ${value}`)
			.join(';');
	}
</script>

<TableRow
	data-state={row.getIsSelected() && 'selected'}
	class={cn(onRowClick ? 'cursor-pointer' : '', rowClass?.(row))}
	onclick={() => onRowClick?.(row)}
>
	{#each row.getVisibleCells() as cell (cell.id)}
		<TableCell style={buildStyle(cell)}>
			<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
		</TableCell>
	{/each}
</TableRow>
<!-- {#if !header.isPlaceholder}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<TableHead colspan={header.colSpan} {style} {...props}>
					<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
				</TableHead>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="center">
			{#if header.column.getCanPin()}
				<DropdownMenu.Group class="justify-center">
					<DropdownMenu.Item
						onclick={() => {
							if (header.column.getIsPinned()) {
								header.column.pin(false);
							} else {
								header.column.pin('left');
							}
						}}
					>
						{#if header.column.getIsPinned()}
							<PinOff />
							Unpin Kolom
						{:else}
							<Pin />
							Pin Kolom
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			{/if}
			{#if header.column.getCanSort()}
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => header.column.toggleSorting(false)}>
						<ArrowDownNarrowWide />
						Urutkan Ascending
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => header.column.toggleSorting(true)}>
						<ArrowUpNarrowWide />
						Urutkan Descending
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if} -->
