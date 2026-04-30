<script lang="ts" generics="TData extends RowData">
	import { createTable, type RowData } from '@tanstack/table-core';
	// import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input/index';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Snippet } from 'svelte';
	import { ChevronLeftIcon, ChevronRightIcon, Settings2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import DataTableTableHeader from './data-table-head.svelte';
	import DataTableTableRow from './data-table-row.svelte';

	type Table<TData extends RowData> = ReturnType<typeof createTable<TData>>;

	type DataTableProps<TData extends RowData> = {
		table: Table<TData>;
		title?: string;
		description?: string;
		Action?: Snippet;
		search?: string;
		isLoading?: boolean;
		isError?: boolean;
		searchPlaceholder?: string;
		isFetching?: boolean;
	};

	let {
		table,
		title,
		description,
		Action,
		search = $bindable(),
		isLoading,
		isError,
		searchPlaceholder = 'Cari data...',
		isFetching
	}: DataTableProps<TData> = $props();

	const hasHideableColumns = $derived(table.getAllColumns().some((col) => col.getCanHide()));

	const hasAdditionalContent = $derived(typeof search !== 'undefined');

	const hasHeader = $derived(!!title || !!description || typeof Action === 'function');

	const info = $derived.by(() => ({
		from: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
		to:
			table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
			table.getState().pagination.pageSize,
		total: table.getRowCount()
	}));
</script>

<Card.Root>
	{#if hasHeader}
		<Card.Header>
			{#if title}
				<Card.Title>{title}</Card.Title>
			{/if}
			{#if description}
				<Card.Description>{description}</Card.Description>
			{/if}
			{#if Action}
				<Card.Action>
					{@render Action?.()}
				</Card.Action>
			{/if}
		</Card.Header>
	{/if}
	<Card.Content>
		<div class="space-y-4">
			{#if hasAdditionalContent}
				<div class="flex items-center justify-between gap-2">
					{#if typeof search !== 'undefined'}
						<Input
							placeholder={searchPlaceholder}
							bind:value={search}
							class="w-full max-w-sm sm:max-w-lg"
						/>
					{/if}
					{#if hasHideableColumns}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" class="ml-auto">
										<span class="hidden sm:block">Kolom</span>
										<Settings2 class="h-4 w-4" />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								{#each table
									.getAllColumns()
									.filter((col) => col.getCanHide()) as column (column.id)}
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
				</div>
			{/if}
			<div class="flex h-[calc(70svh)] grow overflow-y-auto rounded-md border bg-background">
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
							<Table.Row>
								<Table.Cell colspan={table.getAllColumns().length} class="h-24 text-center"
									>Memuat...</Table.Cell
								>
							</Table.Row>
						{:else if isError}
							<Table.Row>
								<Table.Cell
									colspan={table.getAllColumns().length}
									class="h-24 text-center text-red-500"
								>
									Terjadi kesalahan saat memuat data.
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each table.getRowModel().rows as row (row.id)}
								<DataTableTableRow {row} />
								<!-- <Table.Row data-state={row.getIsSelected() && 'selected'}>
									{#each row.getVisibleCells() as cell (cell.id)}
										<Table.Cell>
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
										</Table.Cell>
									{/each}
								</Table.Row> -->
							{:else}
								<Table.Row>
									<Table.Cell colspan={table.getAllColumns().length} class="h-24 text-center"
										>Tidak ada data.</Table.Cell
									>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="w-full justify-end">
		<div class="flex w-full flex-col items-center justify-center space-x-2">
			{#if table.getFilteredSelectedRowModel().rows.length}
				<div class="text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			{/if}
			<div class="flex w-full flex-wrap justify-center gap-2 sm:justify-between">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="shrink">
								{table.getState().pagination.pageSize} / Halaman
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						{#each [10, 20, 30, 40, 50] as column, i (i)}
							<DropdownMenu.CheckboxItem
								class="capitalize"
								checked={table.getState().pagination.pageSize === column}
								onCheckedChange={() => (table.getState().pagination.pageSize = column)}
							>
								{column}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<div class="grid w-fit overflow-x-auto">
					<Pagination.Root
						count={table.getRowCount()}
						perPage={table.getState().pagination.pageSize}
						class="flex w-fit items-end justify-end"
					>
						{#snippet children({ pages, currentPage })}
							<Pagination.Content>
								<Pagination.Item title="Sebelumnya">
									<Pagination.PrevButton
										onclick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage() || isFetching}
									>
										<ChevronLeftIcon />
										<span class=""> Sebelumnya </span>
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
												disabled={isFetching}
												isActive={currentPage === page.value}
												onclick={() => table.setPageIndex(page.value)}
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item title="Selanjutnya">
									<Pagination.NextButton
										onclick={() => table.nextPage()}
										disabled={!table.getCanNextPage() || isFetching}
									>
										<span class=""> Selanjutnya </span>
										<ChevronRightIcon />
									</Pagination.NextButton>
								</Pagination.Item>
							</Pagination.Content>
						{/snippet}
					</Pagination.Root>
				</div>
			</div>
			<div class="mt-2 text-sm text-muted-foreground">
				{info.from} s/d {info.to} dari {info.total} data
			</div>
		</div>
	</Card.Footer>
</Card.Root>
