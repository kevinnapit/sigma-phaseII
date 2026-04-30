<script lang="ts" generics="TData">
	import type { Header } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import TableHead from '../table/table-head.svelte';
	import { ArrowDownNarrowWide, ArrowUpNarrowWide, Pin, PinOff } from 'lucide-svelte';
	import FlexRender from './flex-render.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		header: Header<TData, unknown>;
	};
	let { header }: Props = $props();

	const pinned = $derived(header.column.getIsPinned());

	// Get position index for multi-column pinning
	const pinIndex = $derived.by(() => {
		if (!pinned) return undefined;
		const pinnedColumns =
			header.getContext().table.getState().columnPinning[pinned as 'left' | 'right'] || [];
		return pinnedColumns.indexOf(header.column.id);
	});
</script>

{#if !header.isPlaceholder}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<TableHead
					colspan={header.colSpan}
					{...props}
					data-pinned={pinned || undefined}
					data-pin-index={pinIndex}
					class={cn(
						'cursor-pointer',
						'data-[pinned]:sticky data-[pinned]:z-10 data-[pinned]:bg-muted'
					)}
				>
					<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
				</TableHead>
			{/snippet}
		</DropdownMenu.Trigger>
		<!-- Menu content same as before -->
	</DropdownMenu.Root>
{/if}

<style>
	/* First/Last pseudo-class approach (inspired by your example) */
	[data-pinned='left']:first-of-type {
		left: 0;
		box-shadow: 2px 0 4px -2px rgba(0, 0, 0, 0.1);
	}

	[data-pinned='right']:last-of-type {
		right: 0;
		box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.1);
	}

	/* Multi-column pinning using :has() selector */
	th:has(+ th[data-pinned='left'])[data-pinned='left'],
	td:has(+ td[data-pinned='left'])[data-pinned='left'] {
		box-shadow: 2px 0 4px -2px rgba(0, 0, 0, 0.1);
	}

	th[data-pinned='right']:has(+ th:not([data-pinned])),
	td[data-pinned='right']:has(+ td:not([data-pinned])) {
		box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.1);
	}
</style>
