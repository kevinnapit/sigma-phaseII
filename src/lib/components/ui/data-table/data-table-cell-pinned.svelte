<script lang="ts" generics="TData">
	import type { Cell } from '@tanstack/table-core';
	import TableCell from '../table/table-cell.svelte';
	import FlexRender from './flex-render.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		cell: Cell<TData, unknown>;
	};
	let { cell }: Props = $props();

	const pinned = $derived(cell.column.getIsPinned());
</script>

<TableCell
	data-pinned={pinned || undefined}
	class={cn(
		// Pin styling using data attributes
		'data-[pinned=left]:sticky data-[pinned=left]:left-0 data-[pinned=left]:z-10',
		'data-[pinned=right]:sticky data-[pinned=right]:right-0 data-[pinned=right]:z-10',
		// Background with gradient for smooth transition
		'data-[pinned=left]:bg-gradient-to-r data-[pinned=left]:from-background data-[pinned=left]:to-background',
		'data-[pinned=right]:bg-gradient-to-l data-[pinned=right]:from-background data-[pinned=right]:to-background',
		// Shadow for depth
		'data-[pinned=left]:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
		'data-[pinned=right]:shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]'
	)}
>
	<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
</TableCell>
