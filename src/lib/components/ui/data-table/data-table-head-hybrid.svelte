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

	// Check if this is the last pinned column (for shadow)
	const isLastPinned = $derived.by(() => {
		if (!pinned) return false;
		const pinnedColumns =
			header.getContext().table.getState().columnPinning[pinned as 'left' | 'right'] || [];
		const index = pinnedColumns.indexOf(header.column.id);
		return index === pinnedColumns.length - 1;
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
					data-last-pinned={isLastPinned || undefined}
					class={cn(
						'cursor-pointer transition-shadow',
						// Basic pinning
						'data-[pinned=left]:sticky data-[pinned=left]:left-0 data-[pinned=left]:z-10 data-[pinned=left]:bg-muted',
						'data-[pinned=right]:sticky data-[pinned=right]:right-0 data-[pinned=right]:z-10 data-[pinned=right]:bg-muted',
						// Shadow only on last pinned column
						'data-[pinned=left][data-last-pinned]:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
						'data-[pinned=right][data-last-pinned]:shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]'
					)}
				>
					<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
				</TableHead>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="center">
			{#if header.column.getCanPin()}
				<DropdownMenu.Group>
					<DropdownMenu.Item
						onclick={() => {
							header.column.pin(header.column.getIsPinned() ? false : 'left');
						}}
					>
						{#if header.column.getIsPinned()}
							<PinOff />
							Unpin Kolom
						{:else}
							<Pin />
							Pin Kiri
						{/if}
					</DropdownMenu.Item>
					{#if !header.column.getIsPinned()}
						<DropdownMenu.Item onclick={() => header.column.pin('right')}>
							<Pin class="rotate-90" />
							Pin Kanan
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			{/if}
			{#if header.column.getCanSort()}
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => header.column.toggleSorting(false)}>
						<ArrowDownNarrowWide />
						Ascending
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => header.column.toggleSorting(true)}>
						<ArrowUpNarrowWide />
						Descending
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
