<script lang="ts" generics="TData extends RowData">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import type { RowData, Table as TTable } from '@tanstack/table-core';
	import * as Table from '$lib/components/ui/table/index.js';
	import DataTableTableRow from './data-table-row.svelte';
	import DataTableTableHeader from './data-table-head.svelte';
	import DataTableLoading from './data-table-loading.svelte';
	import DataTableError from './data-table-error.svelte';
	import DataTableEmpty from './data-table-empty.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		table: TTable<TData>;
		height?: string;
		isLoading?: boolean;
		isError?: boolean;
		onRowClick?: (row: import('@tanstack/table-core').Row<TData>) => void;
		rowClass?: (row: import('@tanstack/table-core').Row<TData>) => string | undefined;
		Loading?: Snippet<[{ table: TTable<TData> }]>;
		Error?: Snippet<[{ table: TTable<TData> }]>;
		Empty?: Snippet<[{ table: TTable<TData> }]>;
	};

	let {
		table,
		height = 'max-h-[70svh]',
		class: className,
		isLoading,
		isError,
		onRowClick,
		rowClass,
		Loading = DefaultLoading,
		Error = DefaultError,
		Empty = DefaultEmpty,
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
	<div data-table-viewport class="flex overflow-y-auto rounded-md border bg-background {height}">
		<Table.Root>
			<Table.Header class="sticky top-0 z-10 bg-card">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<DataTableTableHeader {header} />
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body class="overflow-y-auto">
				{#if isLoading}
					{@render Loading?.({ table })}
				{:else if isError}
					{@render Error?.({ table })}
				{:else}
					{#each table.getRowModel().rows as row (row.id)}
						<DataTableTableRow {row} {onRowClick} {rowClass} />
					{:else}
						{@render Empty?.({ table })}
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
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
