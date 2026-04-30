<script lang="ts" generics="TData extends RowData">
	import type { RowData, Table } from '@tanstack/table-core';
	import type { HTMLAttributes } from 'svelte/elements';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type Props<TData extends RowData> = HTMLAttributes<HTMLDivElement> & {
		table: Table<TData>;
		pageSizeOptions?: number[];
		isFetching?: boolean;
		showInfo?: boolean;
		showPageSize?: boolean;
	};

	let {
		table,
		pageSizeOptions = [10, 30, 50, 100],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		isFetching = false,
		showInfo = true,
		showPageSize = true,
		class: className,
		...restProps
	}: Props<TData> = $props();

	const info = $derived.by(() => {
		const pageIndex = table.getState().pagination.pageIndex;
		const pageSize = table.getState().pagination.pageSize;
		return {
			from: pageIndex * pageSize + 1,
			to: Math.min((pageIndex + 1) * pageSize, table.getRowCount()),
			total: table.getRowCount()
		};
	});

	const selectedCount = $derived(table.getFilteredSelectedRowModel().rows.length);
	const filteredCount = $derived(table.getFilteredRowModel().rows.length);
</script>

<div
	data-data-table-pagination
	class={cn('flex w-full flex-col items-center gap-2', className)}
	{...restProps}
>
	{#if selectedCount > 0}
		<div data-selection-info class="text-sm text-muted-foreground">
			{selectedCount} of {filteredCount} row(s) selected.
		</div>
	{/if}

	<div
		data-pagination-controls
		class="flex w-full flex-wrap justify-center gap-2 sm:justify-between"
	>
		{#if showPageSize}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="shrink">
							{table.getState().pagination.pageSize} / Halaman
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					{#each pageSizeOptions as size (size)}
						<DropdownMenu.CheckboxItem
							checked={table.getState().pagination.pageSize === size}
							onCheckedChange={() => table.setPageSize(size)}
						>
							{size}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}

		<Pagination.Root
			count={table.getRowCount()}
			perPage={table.getState().pagination.pageSize}
			page={table.getState().pagination.pageIndex + 1}
			class="ml-auto flex w-fit grow justify-start sm:justify-end"
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item title="Sebelumnya">
						<Pagination.PrevButton
							onclick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeftIcon />
							<span>Sebelumnya</span>
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item class="hidden sm:block">
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item class="hidden sm:block">
								<Pagination.Link
									{page}
									isActive={currentPage === page.value}
									onclick={() => table.setPageIndex(page.value - 1)}
								>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item title="Selanjutnya">
						<Pagination.NextButton
							onclick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span>Selanjutnya</span>
							<ChevronRightIcon />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</div>

	{#if showInfo}
		<div data-pagination-info class="text-sm text-muted-foreground">
			{info.from} s/d {info.to} dari {info.total} data
		</div>
	{/if}
</div>

<style>
	[data-data-table-pagination] {
		[data-pagination-controls] {
			&:not(:has(> :first-child)) {
				justify-content: center;
			}
		}
	}
</style>
