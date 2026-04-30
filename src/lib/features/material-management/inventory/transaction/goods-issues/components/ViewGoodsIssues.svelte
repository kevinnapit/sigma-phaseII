<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		type ColumnDef,
		type VisibilityState,
		type ColumnPinningState,
		getCoreRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { useReadAllGoodsIssues } from '../hooks/useGoodsIssuesQueries.svelte';
	import type { GoodsIssueItem } from '../types/goods-issues.types';
	import { formatDate } from '$lib/shared/utils';
	import GoodsIssuesActionsCells from './GoodsIssuesActionsCells.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { GOODS_ISSUES_PERMISSIONS } from '../constants/goods-issues-permissions';

	let searchName = $state('');
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	// URL params as single source of truth
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// Debounced search
	let debouncedSearch = $state('');
	let previousSearch = $state('');

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

	const issuesQuery = useReadAllGoodsIssues(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined
	}));

	const issues = $derived(issuesQuery.data?.data || []);
	const totalItems = $derived(issuesQuery.data?.pagination?.total_items || 0);
	const totalPages = $derived(issuesQuery.data?.pagination?.total_pages || 0);
	const isLoading = $derived(issuesQuery.isLoading);
	const isError = $derived(issuesQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(issue: GoodsIssueItem) {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/goods-issues/${issue.uoid}${params ? `?${params}` : ''}`
		);
	}

	const columns: ColumnDef<GoodsIssueItem>[] = [
		{
			accessorKey: 'issue_number',
			header: 'Nomor Pengeluaran',
			enableSorting: false
		},
		{
			accessorKey: 'date',
			header: 'Tanggal',
			cell: ({ row }) => (row.original.date ? formatDate(row.original.date) : '-'),
			enableSorting: false
		},
		{
			accessorKey: 'issued_by',
			header: 'Dikeluarkan Oleh',
			cell: ({ row }) => row.original.issued_by || '-',
			enableSorting: false
		},
		{
			accessorKey: 'received_by',
			header: 'Diterima Oleh',
			cell: ({ row }) => row.original.received_by || '-',
			enableSorting: false
		},
		{
			id: 'total_items',
			header: 'Jumlah Item',
			cell: ({ row }) => row.original.details?.length ?? 0,
			enableSorting: false
		},
		{
			accessorKey: 'remarks',
			header: 'Keterangan',
			cell: ({ row }) => row.original.remarks || '-',
			enableSorting: false
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(GoodsIssuesActionsCells, {
					issue: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return issues;
		},
		columns,
		manualPagination: true,
		get rowCount() {
			return totalItems;
		},
		get pageCount() {
			return totalPages;
		},
		state: {
			get pagination() {
				return { pageIndex: currentPage - 1, pageSize };
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnPinning() {
				return columnPinning;
			}
		},
		onPaginationChange: (updater) => {
			const newPagination =
				typeof updater === 'function' ? updater({ pageIndex: currentPage - 1, pageSize }) : updater;
			updateUrlParams(newPagination.pageIndex + 1, newPagination.pageSize);
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onColumnPinningChange: (updater) => {
			columnPinning = typeof updater === 'function' ? updater(columnPinning) : updater;
		},
		getRowId: (originalRow) => originalRow.uoid,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<Guard permissions={GOODS_ISSUES_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Pengeluaran Barang"
			description="Daftar pengeluaran barang dari gudang."
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search
					bind:value={searchName}
					placeholder="Cari nomor pengeluaran..."
					debounce={500}
				/>
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
</Guard>
