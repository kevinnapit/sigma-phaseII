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
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useCropListQuery } from '../../queries/useCropQueries.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { CROP_PERMISSIONS } from '../../constants/functional-admin-permissions';
	import Guard from '$lib/components/shared/guard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import CropForm from './crop-form.svelte';
	import CropConfirmDialog from './crop-confirm-dialog.svelte';

	type Crop = components['schemas']['CropItem'];

	const authCtx = getUserContext();

	const columns: ColumnDef<Crop>[] = [
		{
			accessorKey: 'value',
			header: 'Nama',
			enableSorting: false
		},
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: false
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					id: row.original.id,
					onUpdate: authCtx.hasPermission(CROP_PERMISSIONS.UPDATE)
						? () => openEdit(row.original)
						: undefined,
					onDelete: authCtx.hasPermission(CROP_PERMISSIONS.DELETE)
						? () => openDelete(row.original)
						: undefined
				})
		}
	];

	// State
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let searchValue = $state('');
	let columnPinning = $state<ColumnPinningState>({
		right: ['actions'],
		left: []
	});

	// Dialog State
	let dialogOpen = $state(false);
	let dialogMode = $state<'create' | 'edit'>('create');
	let selectedData = $state<Crop | null>(null);

	// Delete Dialog State
	let isDeleteDialogOpen = $state(false);
	let selectedForDelete = $state<Crop | null>(null);

	function openCreate() {
		selectedData = null;
		dialogMode = 'create';
		dialogOpen = true;
	}

	function openEdit(data: Crop) {
		selectedData = data;
		dialogMode = 'edit';
		dialogOpen = true;
	}

	function openDelete(data: Crop) {
		selectedForDelete = data;
		isDeleteDialogOpen = true;
	}

	// Query
	const queryParams = () => (searchValue ? { value: searchValue } : undefined);
	const cropQuery = useCropListQuery(queryParams);
	const dataCrop = $derived(cropQuery.data?.data ?? []);
	// let rowCount = $derived(cropQuery.data?.meta ?? 0);

	const table = createSvelteTable({
		get data() {
			return dataCrop;
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
	<CropForm bind:open={dialogOpen} mode={dialogMode} crops={selectedData} />
{/if}

<DataTable.Root>
	<DataTable.Header title="Panenan" description="Kelola data panenan anda">
		{#snippet actions()}
			<Guard permissions={CROP_PERMISSIONS.CREATE}>
				<Button onclick={openCreate}>
					<Plus class="h-4 w-4" />
					<span>Tambah Panenan</span>
				</Button>
			</Guard>
		{/snippet}
	</DataTable.Header>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchValue} debounce={100} placeholder="Cari nama panenan" />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={cropQuery.isLoading} isError={cropQuery.isError} />

	<!-- <DataTable.Footer>
		<DataTable.Pagination {table} isFetching={cropQuery.isFetching} />
	</DataTable.Footer> -->
</DataTable.Root>

{#if selectedForDelete}
	<CropConfirmDialog bind:open={isDeleteDialogOpen} crop={selectedForDelete} />
{/if}
