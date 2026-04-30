<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		type ColumnDef,
		type SortingState,
		getCoreRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { useReadAllLocalPurchaseItems } from '../hooks/useLocalPurchaseItemQueries.svelte';
	import type { LocalPurchaseItem } from '../types/local-purchase-item.types';
	import LocalPurchaseItemActionsCells from './LocalPurchaseItemActionsCells.svelte';

	let {
		searchName = $bindable('')
	}: {
		searchName?: string;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let debouncedSearch = $state('');

	$effect(() => {
		searchName;
		const timer = setTimeout(() => {
			debouncedSearch = searchName;
		}, 500);
		return () => clearTimeout(timer);
	});

	const localPurchaseItemsQuery = useReadAllLocalPurchaseItems(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined
	}));

	const localPurchaseItems = $derived(localPurchaseItemsQuery.data?.data || []);
	const totalItems = $derived(localPurchaseItemsQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(localPurchaseItemsQuery.data?.pagination?.total_page || 0);
	const isLoading = $derived(localPurchaseItemsQuery.isLoading);
	const isError = $derived(localPurchaseItemsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', newPage.toString());
		url.searchParams.set('size', newSize.toString());
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(item: LocalPurchaseItem) {
		goto(`/dashboard/material-management/inventory/master/local-purchase-item/${item.uoid}`);
	}

	const columns: ColumnDef<LocalPurchaseItem>[] = [
		{
			accessorKey: 'code',
			header: 'Kode Barang',
			enableSorting: true
		},
		{
			accessorKey: 'name',
			header: 'Nama Barang',
			enableSorting: true
		},
		{
			accessorKey: 'is_field_item',
			header: 'Barang di Lapangan',
			cell: ({ row }) => (row.original.is_field_item ? 'Ya' : 'Tidak')
		},
		{
			accessorKey: 'decision',
			header: 'Keputusan'
		},
		{
			accessorKey: 'status',
			header: 'Status'
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(LocalPurchaseItemActionsCells, {
					localPurchaseItem: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return localPurchaseItems;
		},
		columns,
		state: {
			get pagination() {
				return {
					pageIndex: currentPage - 1,
					pageSize: pageSize
				};
			},
			get sorting() {
				return sorting;
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
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				const newState = updater({
					pageIndex: currentPage - 1,
					pageSize: pageSize
				});
				updateUrlParams(newState.pageIndex + 1, newState.pageSize);
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		}
	});
</script>

<DataTable.Root>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchName} placeholder="Cari barang..." debounce={500} />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} {isLoading} {isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
