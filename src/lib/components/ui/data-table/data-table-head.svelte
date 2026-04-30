<script lang="ts" generics="TData">
	import type { Header } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import TableHead from '../table/table-head.svelte';
	import {
		ArrowDownNarrowWide,
		ArrowUpNarrowWide,
		Pin,
		PinOff,
		EyeOff,
		ChevronUp,
		ChevronDown,
		ChevronsUpDown
	} from 'lucide-svelte';
	import FlexRender from './flex-render.svelte';
	type Props = {
		header: Header<TData, unknown>;
	};
	let { header }: Props = $props();

	function buildStyle(header: Header<TData, unknown>): string {
		let base: Record<string, string | number> = {
			position: 'relative',
			'z-index': 0
		};
		const pinned = header.column.getIsPinned();
		if (pinned) {
			base = {
				...base,
				position: 'sticky',
				'z-index': 2,
				'background-color': 'var(--muted)'
			};
			if (pinned === 'left') {
				// base.left = `${header.column.getStart('left')}px`;
				base.left = `0px`;
			}
			if (pinned === 'right') {
				base.right = `${header.column.getAfter('right')}px`;
			}
		}
		return Object.entries(base)
			.map(([key, value]) => `${key}: ${value}`)
			.join(';');
	}
	const style = $derived.by(() => buildStyle(header));

	function getSortIcon() {
		const sortDirection = header.column.getIsSorted();
		if (sortDirection === 'asc') return ChevronUp;
		if (sortDirection === 'desc') return ChevronDown;
		return ChevronsUpDown;
	}

	const SortIcon = $derived(getSortIcon());
</script>

{#if !header.isPlaceholder}
	<TableHead colspan={header.colSpan} {style} class="bg-muted/40 font-semibold">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<div
						{...props}
						class="inline-flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted/50"
					>
						<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						{#if header.column.getCanSort()}
							<SortIcon class="h-4 w-4" />
						{/if}
					</div>
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
							Urutkan Menaik
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => header.column.toggleSorting(true)}>
							<ArrowUpNarrowWide />
							Urutkan Menurun
						</DropdownMenu.Item>
						{#if header.column.getIsSorted()}
							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={() => header.column.clearSorting()}>
								<ChevronsUpDown />
								Reset Urutan
							</DropdownMenu.Item>
						{/if}
					</DropdownMenu.Group>
				{/if}
				{#if header.column.getCanHide()}
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item onclick={() => header.column.toggleVisibility(false)}>
							<EyeOff />
							Sembunyikan Kolom
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</TableHead>
{/if}
