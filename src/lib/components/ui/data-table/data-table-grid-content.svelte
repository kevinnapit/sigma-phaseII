<script lang="ts" generics="TData extends RowData">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import type { RowData, Table as TTable, Row } from '@tanstack/table-core';
	import DataTableLoading from './data-table-loading.svelte';
	import DataTableError from './data-table-error.svelte';
	import DataTableEmpty from './data-table-empty.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		table: TTable<TData>;
		height?: string;
		gridClass?: string;
		isLoading?: boolean;
		isError?: boolean;
		Loading?: Snippet<[{ table: TTable<TData> }]>;
		Error?: Snippet<[{ table: TTable<TData> }]>;
		Empty?: Snippet<[{ table: TTable<TData> }]>;
		child: Snippet<[{ row: Row<TData> }]>;
	};

	let {
		table,
		height = 'calc(70svh)',
		class: className,
		gridClass = 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
		isLoading,
		isError,
		Loading = DefaultLoading,
		Error = DefaultError,
		Empty = DefaultEmpty,
		child,
		...restProps
	}: Props = $props();
</script>

<div
	data-data-table-content
	class={cn(
		'px-6',
		'[div[data-data-table-root]:not(:has([data-data-table-footer]))_&]:pb-6',
		className
	)}
	{...restProps}
>
	<div
		data-table-viewport
		class="flex flex-col overflow-y-auto rounded-md bg-background"
		style="height: {height}"
	>
		{#if isLoading}
			<div class="flex h-full w-full items-center justify-center">
				{@render Loading?.({ table })}
			</div>
		{:else if isError}
			<div class="flex h-full w-full items-center justify-center">
				{@render Error?.({ table })}
			</div>
		{:else if table.getRowModel().rows.length === 0}
			<div class="flex h-full w-full items-center justify-center">
				{@render Empty?.({ table })}
			</div>
		{:else}
			<div class={cn(gridClass)}>
				{#each table.getRowModel().rows as row (row.id)}
					{@render child({ row })}
				{/each}
			</div>
		{/if}
	</div>
</div>

{#snippet DefaultLoading({ table }: { table: TTable<TData> })}
	<DataTableLoading colspan={table.getAllColumns().length} />
{/snippet}
{#snippet DefaultError({ table }: { table: TTable<TData> })}
	<DataTableError colspan={table.getAllColumns().length} />
{/snippet}
{#snippet DefaultEmpty({ table }: { table: TTable<TData> })}
	<DataTableEmpty colspan={table.getAllColumns().length} />
{/snippet}
