<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		type ColumnFiltersState,
		getCoreRowModel,
		type ColumnPinningState
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Button } from '$lib/components/ui/button';
	import { useReadAllStores } from '../hooks/useStoresQueries.svelte';
	import type { StoreItem } from '../types/store.types';
	import EditStoreForm from './EditStoreForm.svelte';
	import DeleteStoreDialog from './DeleteStoreDialog.svelte';
	import CreateStoreForm from './CreateStoreForm.svelte';
	import StoreActionsCells from './StoreActionsCells.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { useStoreDivisionListQuery } from '../hooks/useDetailedStoresQueries.svelte';
	import { STORE_TYPE_NAMES } from '../constants/store-types';
	import Guard from '$lib/components/shared/guard.svelte';
	import { STORE_PERMISSIONS } from '../constants/store-permissions';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let {
		searchName = $bindable(''),
		filterValues = $bindable({}),
		parentStoreId = undefined
	}: {
		searchName?: string;
		filterValues?: Record<string, string>;
		parentStoreId?: string;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	let debouncedSearch = $state('');
	let previousSearch = $state('');

	let createFormOpen = $state(false);
	let editFormOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let selectedStore = $state<StoreItem | null>(null);

	// Filter data queries
	const administrativeUnitsQuery = useStoreDivisionListQuery(() => ({
		page: 1,
		page_size: 20
	}));
	const storeTypesQuery = useMasterTypeByNameQuery(() => ({
		name: STORE_TYPE_NAMES.STORE_TYPE
	}));
	const parentStoresQuery = useReadAllStores(() => ({ page: 1, size: 20, is_root: true }));

	const userContext = getUserContext();

	const administrativeUnitOptions = $derived.by(() => {
		const estateOption = userContext.estate
			? [{ value: userContext.estate.id, label: userContext.estate.name }]
			: [];
		const divisionOptions =
			administrativeUnitsQuery.data?.items?.map((u: any) => ({ value: u.id, label: u.name })) ?? [];
		return [{ value: '', label: 'Semua' }, ...estateOption, ...divisionOptions];
	});

	const storeTypeOptions = $derived([
		{ value: '', label: 'Semua' },
		...(storeTypesQuery.data?.values?.map((t: any) => ({ value: t.id, label: t.value })) ?? [])
	]);

	const parentStoreOptions = $derived([
		{ value: '', label: 'Semua' },
		...(parentStoresQuery.data?.data?.map((s: StoreItem) => ({
			value: s.uoid,
			label: `${s.code} - ${s.name}`
		})) ?? [])
	]);

	const filterOptions = $derived([
		{
			label: 'Unit Administrasi',
			value: 'administrative_unit_id',
			options: administrativeUnitOptions
		},
		{
			label: 'Tipe Gudang',
			value: 'store_type',
			options: storeTypeOptions
		},
		{
			label: 'Gudang Induk',
			value: 'parent_store_id',
			options: parentStoreOptions
		},
		{
			label: 'Status Aktif',
			value: 'is_active',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Aktif' },
				{ value: 'false', label: 'Tidak Aktif' }
			]
		},
		{
			label: 'Tanpa Gudang Induk',
			value: 'is_root',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Ya' },
				{ value: 'false', label: 'Tidak' }
			]
		},
		{
			label: 'Memiliki Sub-Gudang',
			value: 'has_children',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Ya' },
				{ value: 'false', label: 'Tidak' }
			]
		}
	]);

	const sortingParams = $derived.by(() => {
		if (sorting.length === 0) return { order_by: undefined, sort: undefined };

		const firstSort = sorting[0];
		const columnId = firstSort.id;

		if (columnId !== 'code' && columnId !== 'name') {
			return { order_by: undefined, sort: undefined };
		}

		return {
			order_by: columnId as 'code' | 'name',
			sort: firstSort.desc ? ('desc' as const) : ('asc' as const)
		};
	});

	$effect(() => {
		searchName;
		const timer = setTimeout(() => {
			debouncedSearch = searchName;
		}, 500);

		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updateUrlParams(1, pageSize);
			}
		}
	});

	const storesQuery = useReadAllStores(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		parent_store_id: filterValues.parent_store_id || parentStoreId,
		administrative_unit_id: filterValues.administrative_unit_id || undefined,
		store_type: filterValues.store_type || undefined,
		is_active:
			filterValues.is_active !== '' && filterValues.is_active !== undefined
				? filterValues.is_active === 'true'
				: undefined,
		is_root:
			filterValues.is_root !== '' && filterValues.is_root !== undefined
				? filterValues.is_root === 'true'
				: undefined,
		has_children:
			filterValues.has_children !== '' && filterValues.has_children !== undefined
				? filterValues.has_children === 'true'
				: undefined,
		order_by: sortingParams.order_by,
		sort: sortingParams.sort
	}));

	const stores = $derived(storesQuery.data?.data || []);
	const totalItems = $derived(storesQuery.data?.paging?.total_item || 0);
	const totalPages = $derived(storesQuery.data?.paging?.total_page || 0);
	const isLoading = $derived(storesQuery.isLoading);
	const isError = $derived(storesQuery.isError);

	const pagination = $derived.by(() => {
		return {
			pageIndex: currentPage - 1,
			pageSize: pageSize
		};
	});

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams();
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(store: StoreItem) {
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/master/store/${store.uoid}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handleEdit(store: StoreItem) {
		selectedStore = store;
		editFormOpen = true;
	}

	function handleDelete(store: StoreItem) {
		selectedStore = store;
		deleteDialogOpen = true;
	}

	function handleAddStore() {
		createFormOpen = true;
	}

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageSize);
	}

	function handlePageSizeChange(size: number) {
		updateUrlParams(1, size);
	}

	const columns: ColumnDef<StoreItem>[] = [
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: true
		},
		{
			accessorKey: 'name',
			header: 'Nama Gudang',
			enableSorting: true
		},
		{
			accessorKey: 'store_type.value',
			header: 'Tipe',
			enableSorting: false,
			cell: ({ row }) => row.original.store_type?.value || '-'
		},
		{
			accessorKey: 'administrative_unit.name',
			header: 'Unit Administrasi',
			enableSorting: false,
			cell: ({ row }) => row.original.administrative_unit?.name || '-'
		},
		{
			accessorKey: 'parent_store.name',
			header: 'Gudang Induk',
			enableSorting: false,
			cell: ({ row }) => row.original.parent_store?.name || '-'
		},
		{
			accessorKey: 'is_active',
			header: 'Status',
			enableSorting: false,
			cell: ({ getValue }) => {
				const status = getValue() as boolean;
				return status ? 'Aktif' : 'Tidak Aktif';
			}
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(StoreActionsCells, {
					store: row.original,
					onViewDetail: handleViewDetail,
					onEdit: handleEdit,
					onDelete: handleDelete
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return stores;
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
		manualSorting: true,
		get rowCount() {
			return totalItems;
		},
		get pageCount() {
			return totalPages;
		},
		getRowId: (originalRow) => originalRow.uoid,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater) => {
			let newPagination: PaginationState;

			if (typeof updater === 'function') {
				newPagination = updater(pagination);
			} else {
				newPagination = updater;
			}

			if (newPagination.pageIndex !== currentPage - 1) {
				handlePageChange(newPagination.pageIndex + 1);
			}
			if (newPagination.pageSize !== pageSize) {
				handlePageSizeChange(newPagination.pageSize);
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

<Guard permissions={STORE_PERMISSIONS.STORE_VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Master Data Gudang"
			description="Kelola data gudang untuk kebutuhan material management."
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search
					bind:value={searchName}
					placeholder="Cari nama gudang..."
					debounce={500}
				/>
			{/snippet}
			{#snippet end()}
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				/>
				<Guard permissions={STORE_PERMISSIONS.STORE_CREATE}>
					<Button
						onclick={handleAddStore}
						class="hidden gap-2 bg-[#0f4c2a] hover:bg-[#0d4023] md:flex"
					>
						<Plus class="h-4 w-4" />
						Tambah Gudang
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<Guard permissions={STORE_PERMISSIONS.STORE_CREATE}>
			<div class="px-4 pb-3 md:hidden">
				<Button onclick={handleAddStore} class="w-full gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
					<Plus class="h-4 w-4" />
					Tambah Gudang
				</Button>
			</div>
		</Guard>

		<DataTable.Content {table} {isLoading} {isError} />

		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>

	<!-- Dialog Components -->
	<CreateStoreForm bind:open={createFormOpen} />
	<EditStoreForm bind:open={editFormOpen} store={selectedStore} />
	<DeleteStoreDialog bind:open={deleteDialogOpen} store={selectedStore} />
</Guard>
