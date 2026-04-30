<script lang="ts">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		type ColumnFiltersState,
		getCoreRowModel,
		type ColumnPinningState
	} from '@tanstack/table-core';
	import {
		createSvelteTable,
		renderComponent,
		DataTableActions
	} from '$lib/components/ui/data-table/index.js';
	import { useKebangsaanListQuery } from '$lib/modules/functional-admin/index.svelte';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import NationalityForm from './nationality-form.svelte';
	import NationalityConfirmDialog from './nationality-confirm-dialog.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { NATIONALITY_PERMISSIONS } from '../../constants/functional-admin-permissions';
	import Guard from '$lib/components/shared/guard.svelte';

	type KebangsaanItem = components['schemas']['KebangsaanItem'];

	const authCtx = getUserContext();

	// State
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let search = $state('');
	let columnPinning = $state<ColumnPinningState>({
		left: [],
		right: ['actions']
	});

	// Dialog state
	let dialogOpen = $state(false);
	let dialogMode = $state<'create' | 'edit'>('create');
	let selectedNationality = $state<KebangsaanItem | null>(null);

	// Delete dialog state
	let isDeleteDialogOpen = $state(false);
	let selectedForDelete = $state<KebangsaanItem | null>(null);

	// Query with reactive params
	const query = useKebangsaanListQuery(() => ({
		page: pagination.pageIndex + 1,
		page_size: pagination.pageSize,
		name: search || undefined
	}));

	const data = $derived(query.data?.data ?? []);
	let rowCount = $derived(query.data?.meta?.total_items ?? 0);

	function openCreate() {
		selectedNationality = null;
		dialogMode = 'create';
		dialogOpen = true;
	}

	function openEdit(nationality: KebangsaanItem) {
		selectedNationality = nationality;
		dialogMode = 'edit';
		dialogOpen = true;
	}

	function openDelete(item: KebangsaanItem) {
		selectedForDelete = item;
		isDeleteDialogOpen = true;
	}

	const columns: ColumnDef<KebangsaanItem>[] = [
		{
			accessorKey: 'name',
			header: 'Kebangsaan',
			enableSorting: false
		},
		{
			accessorKey: 'country_name',
			header: 'Negara',
			enableSorting: false,
			cell: ({ getValue }) => getValue() || '-'
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					id: row.original.id,
					onUpdate: authCtx.hasPermission(NATIONALITY_PERMISSIONS.UPDATE)
						? () => openEdit(row.original)
						: undefined,

					onDelete: authCtx.hasPermission(NATIONALITY_PERMISSIONS.DELETE)
						? () => openDelete(row.original)
						: undefined
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return data;
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
		get rowCount() {
			return rowCount;
		},
		getRowId: (originalRow) => originalRow.id,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
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

{#if dialogOpen}
	<NationalityForm bind:open={dialogOpen} mode={dialogMode} nationality={selectedNationality} />
{/if}

<DataTable.Root>
	<DataTable.Header title="Daftar Kebangsaan" description="Kelola data kebangsaan anda">
		{#snippet actions()}
			<Guard permissions={NATIONALITY_PERMISSIONS.CREATE}>
				<Button onclick={openCreate}>
					<Plus class="h-4 w-4" />
					<span>Tambah Kebangsaan</span>
				</Button>
			</Guard>
		{/snippet}
	</DataTable.Header>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={search} debounce={100} placeholder="Cari kebangsaan..." />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={query.isLoading} isError={query.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={query.isFetching} />
	</DataTable.Footer>
</DataTable.Root>

{#if selectedForDelete}
	<NationalityConfirmDialog bind:open={isDeleteDialogOpen} nationality={selectedForDelete} />
{/if}
