<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import {
		type ColumnDef,
		getCoreRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { getMockStockTransferRequests } from '../api/stock-transfer-request.mock';
	import StockTransferRequestActionsCells from './StockTransferRequestActionsCells.svelte';
	import type { StockTransferRequest } from '../types/stock-transfer-request.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let statusFilter = $state('all');
	let requests = $state<StockTransferRequest[]>([]);
	let totalItems = $state(0);
	let totalPages = $state(0);
	let isLoading = $state(true);

	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Load data
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			const result = getMockStockTransferRequests(
				currentPage,
				pageSize,
				debouncedSearch || undefined,
				statusFilter !== 'all' ? statusFilter : undefined
			);
			requests = result.data;
			totalItems = result.pagination.total_item;
			totalPages = result.pagination.total_page;
			isLoading = false;
		}, 300);
	});

	// Define columns
	const columns: ColumnDef<StockTransferRequest>[] = [
		{
			accessorKey: 'request_number',
			header: 'No. Permintaan',
			enableSorting: false
		},
		{
			accessorKey: 'request_date',
			header: 'Tanggal',
			cell: ({ row }) => {
				const date = new Date(row.original.request_date);
				return date.toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
			}
		},
		{
			accessorKey: 'from_store_name',
			header: 'Gudang Asal'
		},
		{
			accessorKey: 'to_store_name',
			header: 'Gudang Tujuan'
		},
		{
			accessorKey: 'requester_name',
			header: 'Diminta Oleh'
		},
		{
			accessorKey: 'total_items',
			header: 'Jumlah Item',
			cell: ({ row }) => `${row.original.total_items} item`
		},
		{
			accessorKey: 'status_label',
			header: 'Status',
			cell: ({ row }) => row.original.status_label
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(StockTransferRequestActionsCells, {
					request: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return requests;
		},
		columns,
		state: {
			get pagination() {
				return {
					pageIndex: currentPage - 1,
					pageSize: pageSize
				};
			}
		},
		manualPagination: true,
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
		}
	});

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', newPage.toString());
		params.set('size', newSize.toString());
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(request: StockTransferRequest) {
		goto(
			`/dashboard/material-management/inventory/transaction/stock-transfer-request/${request.id}`
		);
	}

	function handleFilterChange(newStatus: string) {
		statusFilter = newStatus;
		// Reset to page 1 when filter changes
		if (currentPage !== 1) {
			updateUrlParams(1, pageSize);
		}
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/stock-transfer-request/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header title="Permintaan Transfer Stok" description="Kelola permintaan transfer stok antar gudang" class="md:mb-4" />
	
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchQuery} placeholder="Cari permintaan..." debounce={500} />
		{/snippet}
		{#snippet end()}
			<DataTable.Filter
				filters={[
					{
						label: 'Status',
						value: 'status',
						options: [
							{ value: 'all', label: 'Semua Status' },
							{ value: 'draft', label: 'Belum Diajukan' },
							{ value: 'pending_approval', label: 'Menunggu Approval' },
							{ value: 'approved', label: 'Disetujui' },
							{ value: 'rejected', label: 'Ditolak' }
						]
					}
				]}
				values={{ status: statusFilter }}
				onApply={(filters) => handleFilterChange(filters.status || 'all')}
			/>
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat Permintaan
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Mobile Create Button -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Permintaan
		</Button>
	</div>

	<DataTable.Content {table} isLoading={isLoading} isError={false} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>

