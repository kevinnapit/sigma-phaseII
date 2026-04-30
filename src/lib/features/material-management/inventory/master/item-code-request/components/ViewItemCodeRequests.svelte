<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate } from '$lib/shared/utils';
	import { useReadAllItemCodeRequests } from '../hooks/useItemCodeRequestQueries.svelte';
	import type { ItemCodeRequest } from '../types/item-code-request.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let statusFilter = $state<string>('');

	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Query data using TanStack Query
	const requestsQuery = useReadAllItemCodeRequests(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined,
		status: statusFilter || undefined
	}));

	const data = $derived(requestsQuery.data?.data || []);
	const totalItems = $derived(requestsQuery.data?.pagination?.total_records || 0);
	const totalPages = $derived(requestsQuery.data?.pagination?.total_pages || 0);
	
	// Debug log
	$effect(() => {
		console.log('Item Code Request Query:', {
			isLoading: requestsQuery.isLoading,
			isError: requestsQuery.isError,
			data: requestsQuery.data,
			dataLength: data.length
		});
	});

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'PENDING':
				return { variant: 'outline' as const, class: 'bg-yellow-50 text-yellow-700 border-yellow-300', text: 'Menunggu' };
			case 'IN_REVIEW':
				return { variant: 'outline' as const, class: 'bg-blue-50 text-blue-700 border-blue-300', text: 'Sedang Direview' };
			case 'APPROVED':
				return { variant: 'default' as const, class: 'bg-green-100 text-green-800 border-green-300', text: 'Disetujui' };
			case 'REJECTED':
				return { variant: 'destructive' as const, class: '', text: 'Ditolak' };
			default:
				return { variant: 'outline' as const, class: '', text: status };
		}
	}

	// Define columns
	const columns: ColumnDef<ItemCodeRequest>[] = [
		{
			accessorKey: 'request_number',
			header: 'No. Permintaan',
			enableSorting: false
		},
		{
			accessorKey: 'item_name',
			header: 'Nama Barang',
			enableSorting: false
		},
		{
			accessorKey: 'uom',
			header: 'Satuan',
			cell: ({ row }) => row.original.uom,
			enableSorting: false
		},
		{
			accessorKey: 'department_destination',
			header: 'Departemen Tujuan',
			enableSorting: false
		},
		{
			accessorKey: 'requested_by_name',
			header: 'Diminta Oleh',
			enableSorting: false
		},
		{
			accessorKey: 'requested_at',
			header: 'Tanggal Permintaan',
			cell: ({ row }) => formatDate(row.original.requested_at),
			enableSorting: false
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				return renderSnippet(statusBadgeSnippet, row.original.status);
			},
			enableSorting: false
		},
		{
			accessorKey: 'approved_item_code',
			header: 'Kode Barang',
			cell: ({ row }) => row.original.approved_item_code || '-',
			enableSorting: false
		}
	];

	// Table instance
	const table = createSvelteTable({
		get data() {
			return data;
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
				return { pageIndex: currentPage - 1, pageSize: pageSize };
			}
		},
		onPaginationChange: (updater) => {
			const newPagination =
				typeof updater === 'function'
					? updater({ pageIndex: currentPage - 1, pageSize: pageSize })
					: updater;
			updateUrlParams(newPagination.pageIndex + 1, newPagination.pageSize);
		},
		getRowId: (originalRow) => originalRow.uoid,
		getCoreRowModel: getCoreRowModel()
	});

	function handleRowClick(row: ItemCodeRequest) {
		goto(`/dashboard/material-management/inventory/transaction/item-code-request/${row.uoid}`);
	}
</script>

{#snippet statusBadgeSnippet(status: string)}
	{@const badgeProps = getStatusBadge(status)}
	<Badge variant={badgeProps.variant} class={badgeProps.class}>{badgeProps.text}</Badge>
{/snippet}

<DataTable.Root>
	<DataTable.Header title="Permintaan Kode Barang" description="Kelola permintaan kode barang baru dari user" />

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchQuery} placeholder="Cari permintaan..." />
		{/snippet}
		{#snippet end()}
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content
		{table}
		isLoading={requestsQuery.isLoading}
		isError={requestsQuery.isError}
		onRowClick={(row) => handleRowClick(row.original)}
	/>

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={requestsQuery.isLoading} />
	</DataTable.Footer>
</DataTable.Root>
