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
	import { useCompanyListQuery } from '$lib/modules/functional-admin/index.svelte';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import CompanyForm from './company-form.svelte';
	import CompanyConfirmDialog from './company-confirm-dialog.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { COMPANY_PERMISSIONS } from '../../constants/functional-admin-permissions';

	type CompanyItem = components['schemas']['CompanyItem'];

	const authCtx = getUserContext();

	// State
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
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
	let selectedUom = $state<CompanyItem | null>(null);

	// Delete dialog state
	let isDeleteDialogOpen = $state(false);
	let selectedForDelete = $state<CompanyItem | null>(null);

	// Query
	const queryParams = () => ({
		page: pagination.pageIndex + 1,
		page_size: pagination.pageSize,
		name: searchName || undefined
	});

	const companyQuery = useCompanyListQuery(queryParams);

	const data = $derived(companyQuery.data?.data ?? []);
	let rowCount = $derived(companyQuery.data?.meta?.total_items ?? 0);

	function openCreate() {
		selectedUom = null;
		dialogMode = 'create';
		dialogOpen = true;
	}

	function openEdit(uom: CompanyItem) {
		selectedUom = uom;
		dialogMode = 'edit';
		dialogOpen = true;
	}

	function openDelete(item: CompanyItem) {
		selectedForDelete = item;
		isDeleteDialogOpen = true;
	}

	const columns: ColumnDef<CompanyItem>[] = [
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
			id: 'city',
			header: 'Kota',
			cell: ({ row }) => row.original.address?.city || '-'
		},
		{
			id: 'is_external',
			header: 'Tipe',
			cell: ({ row }) => (row.original.is_external ? 'Eksternal' : 'Internal')
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					id: row.original.id,
					onUpdate: authCtx.hasPermission(COMPANY_PERMISSIONS.UPDATE)
						? () => openEdit(row.original)
						: undefined,

					onDelete: authCtx.hasPermission(COMPANY_PERMISSIONS.DELETE)
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

<CompanyForm bind:open={dialogOpen} mode={dialogMode} company={selectedUom} />

<DataTable.Root>
	<DataTable.Header title="Daftar Perusahaan" description="Kelola data perusahaan anda">
		{#snippet actions()}
			<Guard permissions={COMPANY_PERMISSIONS.CREATE}>
				<Button onclick={openCreate}>
					<Plus class="h-4 w-4" />
					<span>Tambah Perusahaan</span>
				</Button>
			</Guard>
		{/snippet}
	</DataTable.Header>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchName} debounce={100} placeholder="Cari nama perusahaan" />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={companyQuery.isLoading} isError={companyQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={companyQuery.isFetching} />
	</DataTable.Footer>
</DataTable.Root>

{#if selectedForDelete}
	<CompanyConfirmDialog bind:open={isDeleteDialogOpen} company={selectedForDelete} />
{/if}
