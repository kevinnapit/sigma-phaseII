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
	import { useGroupListQuery } from '$lib/modules/functional-admin/index.svelte';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import GroupForm from './group-form.svelte';
	import GroupConfirmDialog from './group-confirm-dialog.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { GROUP_PERMISSIONS } from '../../constants/functional-admin-permissions';
	import Guard from '$lib/components/shared/guard.svelte';

	type GroupItem = components['schemas']['GroupItem'];

	const authCtx = getUserContext();

	// Table State
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

	// Dialog State
	let dialogOpen = $state(false);
	let dialogMode = $state<'create' | 'edit'>('create');
	let selectedGrowthStage = $state<GroupItem | null>(null);

	// Delete Dialog State
	let isDeleteDialogOpen = $state(false);
	let selectedForDelete = $state<GroupItem | null>(null);

	function openCreate() {
		selectedGrowthStage = null;
		dialogMode = 'create';
		dialogOpen = true;
	}

	function openEdit(growthStage: GroupItem) {
		selectedGrowthStage = growthStage;
		dialogMode = 'edit';
		dialogOpen = true;
	}

	function openDelete(item: GroupItem) {
		selectedForDelete = item;
		isDeleteDialogOpen = true;
	}

	// Query
	const queryParams = () => ({
		page: pagination.pageIndex + 1,
		page_size: pagination.pageSize,
		name: searchName || undefined
	});

	const groupQuery = useGroupListQuery(queryParams);

	const data = $derived(groupQuery.data?.data ?? []);
	let rowCount = $derived(groupQuery.data?.meta?.total_items ?? 0);

	// Columns
	const columns: ColumnDef<GroupItem>[] = [
		{
			accessorKey: 'name',
			header: 'Nama',
			enableSorting: false
		},
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: false
		},
		{
			accessorKey: 'company.name',
			id: 'company',
			header: 'Perusahaan',
			enableSorting: false,
			cell: ({ getValue }) => getValue() || '-'
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					id: row.original.id,
					onUpdate: authCtx.hasPermission(GROUP_PERMISSIONS.UPDATE)
						? () => openEdit(row.original)
						: undefined,

					onDelete: authCtx.hasPermission(GROUP_PERMISSIONS.DELETE)
						? () => openDelete(row.original)
						: undefined
				})
		}
	];

	// Table Instance
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
	<GroupForm bind:open={dialogOpen} mode={dialogMode} group={selectedGrowthStage} />
{/if}

<DataTable.Root>
	<DataTable.Header title="Grup" description="Kelola data grup anda">
		{#snippet actions()}
			<Guard permissions={GROUP_PERMISSIONS.CREATE}>
				<Button onclick={openCreate}>
					<Plus class="h-4 w-4" />
					<span>Tambah Grup</span>
				</Button>
			</Guard>
		{/snippet}
	</DataTable.Header>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchName} debounce={100} placeholder="Cari Grup" />
		{/snippet}

		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={groupQuery.isLoading} isError={groupQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={groupQuery.isFetching} />
	</DataTable.Footer>
</DataTable.Root>

{#if selectedForDelete}
	<GroupConfirmDialog bind:open={isDeleteDialogOpen} group={selectedForDelete} />
{/if}
