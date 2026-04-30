<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		type ColumnPinningState,
		getCoreRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Button } from '$lib/components/ui/button';
	import { useReadAllItemStorageLayouts } from '../hooks/useItemStorageLayoutQueries.svelte';
	import type { ItemStorageLayout } from '../types/item-storage-layout.types';
	import ItemStorageLayoutActionsCells from './ItemStorageLayoutActionsCells.svelte';

	let {
		searchName = $bindable('')
	}: {
		searchName?: string;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	let debouncedSearch = $state('');
	let previousSearch = $state('');

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

	const layoutsQuery = useReadAllItemStorageLayouts(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		order_by: sortingParams.order_by,
		sort: sortingParams.sort
	}));

	const layouts = $derived(layoutsQuery.data?.data || []);
	const totalItems = $derived(layoutsQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(layoutsQuery.data?.pagination?.total_page || 0);
	const isLoading = $derived(layoutsQuery.isLoading);
	const isError = $derived(layoutsQuery.isError);

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

	function handleViewDetail(layout: ItemStorageLayout) {
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/master/item-storage-layout/${layout.uoid}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handleEdit(layout: ItemStorageLayout) {
		goto(`/dashboard/material-management/inventory/master/item-storage-layout/${layout.uoid}/edit`);
	}

	function handleAddLayout() {
		goto('/dashboard/material-management/inventory/master/item-storage-layout/create');
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageSize);
	}

	function handlePageSizeChange(size: number) {
		updateUrlParams(1, size);
	}

	const columns: ColumnDef<ItemStorageLayout>[] = [
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: true
		},
		{
			accessorKey: 'name',
			header: 'Nama Rak',
			enableSorting: true
		},
		{
			accessorKey: 'store.name',
			header: 'Gudang',
			enableSorting: false,
			cell: ({ row }) => row.original.store.name
		},
		{
			accessorKey: 'parent',
			header: 'Parent',
			enableSorting: false,
			cell: ({ row }) => row.original.parent?.name || '-'
		},
		{
			accessorKey: 'number_of_rows',
			header: 'Baris',
			enableSorting: false,
			cell: ({ row }) => row.original.number_of_rows
		},
		{
			accessorKey: 'number_of_columns',
			header: 'Kolom',
			enableSorting: false,
			cell: ({ row }) => row.original.number_of_columns
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
				renderComponent(ItemStorageLayoutActionsCells, {
					layout: row.original,
					onViewDetail: handleViewDetail,
					onEdit: handleEdit
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return layouts;
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

<DataTable.Root>
	<DataTable.Header
		title="Master Data Rak Penyimpanan"
		description="Kelola data rak penyimpanan untuk kebutuhan material management."
		class="md:mb-4"
	/>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchName} placeholder="Cari rak..." debounce={500} />
		{/snippet}
		{#snippet end()}
			<Button onclick={handleAddLayout} class="hidden gap-2 bg-[#0f4c2a] hover:bg-[#0d4023] md:flex">
				<Plus class="h-4 w-4" />
				Tambah Rak
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleAddLayout} class="w-full gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
			<Plus class="h-4 w-4" />
			Tambah Rak
		</Button>
	</div>

	<DataTable.Content {table} {isLoading} {isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
