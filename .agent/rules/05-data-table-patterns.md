# Data Table Patterns

Data tables use TanStack Table Core with shadcn-svelte components for server-side pagination, sorting, and filtering.

## Component Architecture

```
src/lib/components/ui/data-table/
├── data-table.svelte.ts       # createSvelteTable factory
├── svelte-table.svelte        # Legacy table wrapper
├── data-table.ts              # Component re-exports
├── data-table-root.svelte     # Container
├── data-table-header.svelte   # Title + actions
├── data-table-toolbar.svelte  # Search + controls
├── data-table-content.svelte  # Table body
├── data-table-footer.svelte   # Footer container
├── data-table-pagination.svelte
├── data-table-column-toggle.svelte
├── data-table-search.svelte
├── data-table-empty.svelte
├── data-table-loading.svelte
├── data-table-error.svelte
├── render-component.ts        # Cell rendering helper
└── data-table-actions.svelte  # Row action buttons
```

## Table Creation Pattern

### 1. Setup State

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

// All state must be reactive with $state
let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
let sorting = $state<SortingState>([]);
let columnFilters = $state<ColumnFiltersState>([]);
let columnVisibility = $state<VisibilityState>({});
let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });
let searchTerm = $state('');
```

### 2. Create Query with Reactive Params

```typescript
const dataQuery = useEntityListQuery(() => ({
  // API uses 1-indexed pages, TanStack uses 0-indexed
  page: pagination.pageIndex + 1,
  page_size: pagination.pageSize,
  search: searchTerm || undefined,
  // Add sorting params if supported by API
  sort_by: sorting[0]?.id,
  sort_order: sorting[0]?.desc ? 'desc' : 'asc'
}));
```

### 3. Define Columns

```typescript
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { renderComponent, DataTableActions } from '$lib/components/ui/data-table';

// Use generated schema types
const columns: ColumnDef<components['schemas']['EntityItem']>[] = [
  // Basic text column
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true
  },

  // Nested property with custom ID
  {
    accessorKey: 'category.name',
    id: 'category',
    header: 'Category',
    cell: ({ getValue }) => getValue() || '-'
  },

  // Formatted date
  {
    accessorKey: 'created_at',
    header: 'Created',
    enableSorting: true,
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue() as string).toLocaleDateString('id-ID') : '-'
  },

  // Number formatting
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
        .format(getValue() as number)
  },

  // Boolean with icon/badge
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ getValue }) => getValue() ? '✓ Active' : '✗ Inactive'
  },

  // Custom component via renderComponent
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => renderComponent(StatusBadge, { status: row.original.status })
  },

  // Action buttons (always last, pinned right)
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
  }
];
```

### 4. Create Table Instance

```typescript
import { createSvelteTable } from '$lib/components/ui/data-table';

const table = createSvelteTable({
  // Data from query
  get data() {
    return dataQuery.data?.data ?? [];
  },

  columns,

  // State getters for reactivity
  state: {
    get pagination() { return pagination; },
    get sorting() { return sorting; },
    get columnVisibility() { return columnVisibility; },
    get columnFilters() { return columnFilters; },
    get columnPinning() { return columnPinning; }
  },

  // Server-side pagination config
  manualPagination: true,
  pageCount: dataQuery.data?.meta?.total_pages ?? 0,

  // Stable row identity
  getRowId: (originalRow) => originalRow.id,
  getCoreRowModel: getCoreRowModel(),

  // State handlers (update reactive $state)
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

### 5. Render Table

```svelte
<script lang="ts">
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import Button from '$lib/components/ui/button/button.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { Permissions } from '$lib/generated/permissions';
</script>

<DataTable.Root>
	<!-- Header with title and action buttons -->
	<DataTable.Header title="Entities" description="Manage your entities.">
		{#snippet actions()}
			<Guard permissions={Permissions.ENTITY_CREATE}>
				<Button onclick={() => (isDialogOpen = true)}>Add Entity</Button>
			</Guard>
		{/snippet}
	</DataTable.Header>

	<!-- Toolbar with search and column controls -->
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchTerm} debounce={300} placeholder="Search entities..." />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Main table content -->
	<DataTable.Content {table} isLoading={dataQuery.isLoading} isError={dataQuery.isError} />

	<!-- Footer with pagination -->
	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={dataQuery.isFetching} />
	</DataTable.Footer>
</DataTable.Root>
```

## Custom Cell Rendering

### Using renderComponent

```typescript
import { renderComponent } from '$lib/components/ui/data-table';
import StatusBadge from './status-badge.svelte';

{
  id: 'status',
  cell: ({ row }) => renderComponent(StatusBadge, {
    status: row.original.status,
    id: row.original.id
  })
}
```

### Custom Actions Component

Create module-specific action buttons:

```svelte
<!-- entity-table-actions.svelte -->
<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { MoreHorizontal } from 'lucide-svelte';

	let {
		id,
		onView,
		onEdit,
		onDelete
	}: {
		id: string;
		onView?: () => void;
		onEdit?: () => void;
		onDelete?: () => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item onclick={onView}>View</DropdownMenu.Item>
		<DropdownMenu.Item onclick={onEdit}>Edit</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={onDelete} class="text-destructive">Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

## Best Practices

1. **Use getter pattern** for state in table options (`get data()`, `get pagination()`)
2. **Prefer manual pagination** for server-side data
3. **Page index conversion**: TanStack is 0-indexed, APIs typically 1-indexed
4. **Debounce search**: Use `debounce` prop on Search component
5. **Pin action columns**: Always put actions on right with `columnPinning.right`
6. **Type columns properly**: Use `components['schemas']` for type safety
7. **Stable row IDs**: Always provide `getRowId` for proper row tracking
8. **Handle loading states**: Pass `isLoading`, `isError`, `isFetching` to components
9. **Use renderComponent**: For custom cell components, not inline functions
