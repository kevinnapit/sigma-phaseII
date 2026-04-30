---
description: How to create a data table with TanStack Table and server-side pagination
---

# Create Data Table Workflow

This workflow guides creating a data table component with TanStack Table integration, server-side pagination, and shadcn-svelte.

## Data Table Structure

Tables use the composable pattern from `$lib/components/ui/data-table/`:

```svelte
<DataTable.Root>
  <DataTable.Header title="..." description="...">
    {#snippet actions()}...{/snippet}
  </DataTable.Header>
  <DataTable.Toolbar>
    {#snippet start()}<DataTable.Search .../>{/snippet}
    {#snippet end()}<DataTable.ColumnToggle .../>{/snippet}
  </DataTable.Toolbar>
  <DataTable.Content {table} isLoading={...} isError={...} />
  <DataTable.Footer>
    <DataTable.Pagination {table} isFetching={...} />
  </DataTable.Footer>
</DataTable.Root>
```

## Step 1: Set Up State

```typescript
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  type ColumnPinningState,
  getCoreRowModel
} from '@tanstack/table-core';

// Reactive state for table features
let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
let sorting = $state<SortingState>([]);
let columnFilters = $state<ColumnFiltersState>([]);
let columnVisibility = $state<VisibilityState>({});
let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });
let searchName = $state('');
```

## Step 2: Create Query with Reactive Params

```typescript
import { use{Entity}ListQuery } from '$lib/modules/{module}/queries/use{Entity}ListQuery.svelte';

const entityQuery = use{Entity}ListQuery(() => ({
  page: pagination.pageIndex + 1,  // API is 1-indexed
  page_size: pagination.pageSize,
  name: searchName || undefined    // Optional search filter
}));
```

## Step 3: Define Columns

Use types from OpenAPI generated schemas:

```typescript
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { renderComponent, DataTableActions } from '$lib/components/ui/data-table';

const columns: ColumnDef<components['schemas']['{EntityItem}']>[] = [
  {
    accessorKey: 'name',
    header: 'Nama',
    enableSorting: true
  },
  {
    accessorKey: 'nested.field',
    id: 'nested_field',
    header: 'Nested Value',
    cell: ({ getValue }) => getValue() || '-'
  },
  {
    accessorKey: 'created_at',
    header: 'Dibuat',
    enableSorting: true,
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue() as string).toLocaleDateString('id-ID') : '-'
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
  }
];
```

## Step 4: Create Table Instance

```typescript
import { createSvelteTable } from '$lib/components/ui/data-table';

const table = createSvelteTable({
  get data() {
    return entityQuery.data?.data ?? [];
  },
  columns,
  state: {
    get pagination() { return pagination; },
    get sorting() { return sorting; },
    get columnVisibility() { return columnVisibility; },
    get columnFilters() { return columnFilters; },
    get columnPinning() { return columnPinning; }
  },
  manualPagination: true,
  pageCount: entityQuery.data?.meta?.total_pages ?? 0,
  getRowId: (originalRow) => originalRow.id,
  getCoreRowModel: getCoreRowModel(),
  onPaginationChange: (updater) => {
    pagination = typeof updater === 'function' ? updater(pagination) : updater;
  },
  onSortingChange: (updater) => {
    sorting = typeof updater === 'function' ? updater(sorting) : updater;
  },
  onColumnFiltersChange: (updater) => {
    columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
  },
  onColumnPinningChange: (updater) => {
    columnPinning = typeof updater === 'function' ? updater(columnPinning) : updater;
  }
});
```

## Step 5: Render Table

```svelte
<script lang="ts">
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<DataTable.Root>
	<DataTable.Header title="Entity List" description="Manage entities.">
		{#snippet actions()}
			<Button onclick={() => (isDialogOpen = true)}>Add New</Button>
		{/snippet}
	</DataTable.Header>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchName} debounce={100} placeholder="Search..." />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={entityQuery.isLoading} isError={entityQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={entityQuery.isFetching} />
	</DataTable.Footer>
</DataTable.Root>
```

## Key Patterns

1. **Manual Pagination**: Always use `manualPagination: true` for server-side pagination
2. **Page Index**: TanStack uses 0-indexed, API typically uses 1-indexed
3. **Reactive State**: Use `$state` for all table state variables
4. **Getter Pattern**: Use `get` functions in state object for reactivity
5. **Column Pinning**: Pin action columns to right with `columnPinning: { right: ['actions'] }`
6. **Type Safety**: Use `components['schemas']` types for column definitions
7. **Loading States**: Pass `isLoading`, `isError`, `isFetching` to components

## Available Components

- `DataTable.Root` - Container
- `DataTable.Header` - Title, description, actions slot
- `DataTable.Toolbar` - Search and controls container
- `DataTable.Search` - Debounced search input
- `DataTable.ColumnToggle` - Show/hide columns dropdown
- `DataTable.Content` - Table body with loading/error states
- `DataTable.Footer` - Footer container
- `DataTable.Pagination` - Pagination controls
- `DataTable.Empty` - Empty state
- `DataTable.Loading` - Loading state
- `DataTable.Error` - Error state
