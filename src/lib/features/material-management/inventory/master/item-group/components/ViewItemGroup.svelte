<script lang="ts">
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
	import { useReadAllItemGroups } from '../hooks/useItemGroupQueries.svelte';
	import type { ItemGroupItem } from '../types/item-group.types';
	import ItemGroupActionsCells from './ItemGroupActionsCells.svelte';
	import EditItemGroupForm from './EditItemGroupForm.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { ITEM_GROUP_TYPE_NAMES } from '../constants/item-group-types';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ITEM_GROUP_PERMISSIONS } from '../constants/item-group-permissions';

	let {
		searchName = $bindable(''),
		filterValues = $bindable({})
	}: {
		searchName?: string;
		filterValues?: Record<string, string>;
	} = $props();

	// Edit modal state
	let editModalOpen = $state(false);
	let selectedItemGroup = $state<ItemGroupItem | null>(null);

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	let debouncedSearch = $state('');
	let previousSearch = $state('');

	// Valuation type filter options
	const valuationTypesQuery = useMasterTypeByNameQuery(() => ({
		name: ITEM_GROUP_TYPE_NAMES.VALUATION_TYPE
	}));

	const valuationTypeOptions = $derived([
		{ value: '', label: 'Semua' },
		...(valuationTypesQuery.data?.values?.map((t: any) => ({ value: t.id, label: t.value })) ?? [])
	]);

	// Parent item group filter with server-side search
	let parentGroupSearch = $state('');
	let selectedParentGroupId = $state(filterValues.has_parent_id ?? '');

	const parentGroupsQuery = useReadAllItemGroups(() => ({
		page: 1,
		size: 50,
		search: parentGroupSearch || undefined
	}));

	const parentGroupOptions = $derived(
		(parentGroupsQuery.data?.data ?? []).map((g: ItemGroupItem) => ({
			uoid: g.uoid,
			name: g.code,
			fullName: g.name
		}))
	);

	// Sync selectedParentGroupId into filterValues
	$effect(() => {
		filterValues.has_parent_id = selectedParentGroupId;
	});

	const filterOptions = $derived([
		{
			label: 'Status Aktif',
			value: 'is_active',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Aktif' },
				{ value: 'false', label: 'Diarsipkan' }
			]
		},
		{
			label: 'Status Parent',
			value: 'has_parent',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Memiliki Parent' },
				{ value: 'false', label: 'Root (Tanpa Parent)' }
			]
		},
		{
			label: 'Tipe Penilaian',
			value: 'valuation_type_id',
			options: valuationTypeOptions
		}
	]);

	const sortingParams = $derived.by(() => {
		if (sorting.length === 0) return { order_by: undefined, sort: undefined };
		const firstSort = sorting[0];
		const columnId = firstSort.id;
		if (columnId !== 'code' && columnId !== 'name') return { order_by: undefined, sort: undefined };
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

	const itemGroupsQuery = useReadAllItemGroups(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		valuation_type_id: filterValues.valuation_type_id || undefined,
		parent_id: selectedParentGroupId || undefined,
		has_parent:
			filterValues.has_parent !== '' && filterValues.has_parent !== undefined
				? filterValues.has_parent === 'true'
				: undefined,
		is_active:
			filterValues.is_active !== '' && filterValues.is_active !== undefined
				? filterValues.is_active === 'true'
				: undefined,
		order_by: sortingParams.order_by,
		sort: sortingParams.sort
	}));

	const itemGroups = $derived(itemGroupsQuery.data?.data || []);
	const totalItems = $derived(itemGroupsQuery.data?.paging?.total_item || 0);
	const totalPages = $derived(itemGroupsQuery.data?.paging?.total_page || 0);
	const isLoading = $derived(itemGroupsQuery.isLoading);
	const isError = $derived(itemGroupsQuery.isError);

	const pagination = $derived.by(() => {
		return {
			pageIndex: currentPage - 1,
			pageSize: pageSize
		};
	});

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(itemGroup: ItemGroupItem) {
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/master/item-group/${itemGroup.uoid}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handleEdit(itemGroup: ItemGroupItem) {
		selectedItemGroup = itemGroup;
		editModalOpen = true;
	}

	function handleEditSuccess() {
		// Refetch will happen automatically via query invalidation
		selectedItemGroup = null;
	}

	function handleEditClose() {
		selectedItemGroup = null;
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageSize);
	}

	function handlePageSizeChange(size: number) {
		updateUrlParams(1, size);
	}

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	const columns: ColumnDef<ItemGroupItem>[] = [
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: true
		},
		{
			accessorKey: 'name',
			header: 'Nama',
			enableSorting: true
		},
		{
			accessorKey: 'parent_item_class_name',
			header: 'Grup Barang',
			enableSorting: false,
			cell: ({ row }) => row.original.parent_item_class_name || '-'
		},
		{
			accessorKey: 'valuation_type_value',
			header: 'Tipe Penilaian',
			enableSorting: false
		},
		{
			accessorKey: 'frequency_of_valuation_value',
			header: 'Frekuensi Penilaian',
			enableSorting: false
		},
		{
			accessorKey: 'stock_account_name',
			header: 'Akun Stok',
			enableSorting: false
		},
		{
			accessorKey: 'stock_issue_account_name',
			header: 'Akun Pengeluaran Stok',
			enableSorting: false,
			cell: ({ row }) => row.original.stock_issue_account_name || '-'
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(ItemGroupActionsCells, {
					itemGroup: row.original,
					onViewDetail: handleViewDetail,
					onEdit: handleEdit
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return itemGroups;
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

<EditItemGroupForm
	bind:open={editModalOpen}
	itemGroup={selectedItemGroup}
	onSuccess={handleEditSuccess}
	onClose={handleEditClose}
/>

<Guard permissions={ITEM_GROUP_PERMISSIONS.ITEM_GROUP_VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Master Data Grup Barang"
			description="Kelola data grup barang untuk klasifikasi material."
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search bind:value={searchName} placeholder="Cari nama grup..." debounce={500} />
			{/snippet}
			{#snippet end()}
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				>
					{#snippet children()}
						<div class="space-y-2">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="text-sm leading-none font-medium">Grup Barang Parent</label>
							<SearchableCombobox
								bind:value={selectedParentGroupId}
								items={parentGroupOptions}
								isLoading={parentGroupsQuery.isLoading}
								onSearchChange={(s) => (parentGroupSearch = s)}
								placeholder="Semua grup barang..."
								searchPlaceholder="Cari kode grup..."
								renderSubtitle={(item) => (item as any).fullName}
								subtitleMaxLength={30}
							/>
						</div>
					{/snippet}
				</DataTable.Filter>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>

		<DataTable.Content {table} {isLoading} {isError} />

		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>
