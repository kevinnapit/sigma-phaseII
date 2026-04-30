<script lang="ts">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		type ColumnFiltersState,
		type ColumnPinningState,
		getCoreRowModel
	} from '@tanstack/table-core';

	import {
		createSvelteTable,
		renderComponent,
		DataTableActions
	} from '$lib/components/ui/data-table/index.js';

	import * as DataTable from '$lib/components/ui/data-table/data-table';

	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';

	import { useUomListQuery } from '../../index.svelte';

	import UomConfirmDialog from './uom-confirm-dialog.svelte';
	import UomForm from './uom-form.svelte';

	type UomResponse = components['schemas']['UOMItem'];

	// Table state
	let pagination = $state<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let searchName = $state('');

	let columnPinning = $state<ColumnPinningState>({
		left: [],
		right: ['actions']
	});

	// Dialog state
	let dialogOpen = $state(false);
	let dialogMode = $state<'create' | 'edit'>('create');
	let selectedUom = $state<UomResponse | null>(null);

	// Delete dialog state
	let isDeleteDialogOpen = $state(false);
	let selectedForDelete = $state<UomResponse | null>(null);

	const uomQuery = useUomListQuery(() => ({
		name: searchName || undefined,
		page: pagination.pageIndex + 1,
		page_size: pagination.pageSize
	}));

	function openCreate() {
		selectedUom = null;
		dialogMode = 'create';
		dialogOpen = true;
	}

	function openEdit(uom: UomResponse) {
		selectedUom = uom;
		dialogMode = 'edit';
		dialogOpen = true;
	}

	function openDelete(item: UomResponse) {
		selectedForDelete = item;
		isDeleteDialogOpen = true;
	}

	// Table columns
	const columns: ColumnDef<UomResponse>[] = [
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: false
		},
		{
			accessorKey: 'name',
			header: 'Nama',
			enableSorting: false
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					id: row.original.id,
					onUpdate: () => openEdit(row.original),
					onDelete: () => openDelete(row.original)
				})
		}
	];

	// Table instance
	const table = createSvelteTable({
		get data() {
			return uomQuery.data?.data ?? [];
		},

		get pageCount() {
			return uomQuery.data?.meta?.total_pages ?? -1;
		},

		get rowCount() {
			return uomQuery.data?.meta?.total_items ?? 0;
		},

		columns,

		state: {
			get pagination() {
				return pagination;
			},

			get sorting() {
				return sorting;
			},

			get columnVisibility() {
				return columnVisibility;
			},

			get columnFilters() {
				return columnFilters;
			},

			get columnPinning() {
				return columnPinning;
			}
		},

		manualPagination: true,

		getRowId: (originalRow) => originalRow.id,

		getCoreRowModel: getCoreRowModel(),

		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
		},

		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},

		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},

		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},

		onColumnPinningChange: (updater) => {
			if (typeof updater === 'function') {
				columnPinning = updater(columnPinning);
			} else {
				columnPinning = updater;
			}
		}
	});
</script>

<UomForm bind:open={dialogOpen} mode={dialogMode} uom={selectedUom} />

<DataTable.Root>
	<DataTable.Header title="Satuan Ukuran" description="Kelola data satuan ukuran.">
		{#snippet actions()}
			<Button onclick={openCreate}>
				<Plus class="h-4 w-4" />
				<span>Tambah Satuan Ukuran</span>
			</Button>
		{/snippet}
	</DataTable.Header>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchName} debounce={100} placeholder="Cari Satuan Ukuran" />
		{/snippet}

		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={uomQuery.isLoading} isError={uomQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={uomQuery.isFetching} />
	</DataTable.Footer>
</DataTable.Root>

{#if selectedForDelete}
	<UomConfirmDialog bind:open={isDeleteDialogOpen} uom={selectedForDelete} />
{/if}
