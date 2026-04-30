<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { getMockStockAdjustments } from '../api/stock-adjustment.mock';
	import StockAdjustmentActionsCells from './StockAdjustmentActionsCells.svelte';
	import type { StockAdjustment } from '../types/stock-adjustment.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let adjustments = $state<StockAdjustment[]>([]);
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
			const result = getMockStockAdjustments(currentPage, pageSize, debouncedSearch || undefined);
			adjustments = result.data;
			totalItems = result.pagination.total_item;
			totalPages = result.pagination.total_page;
			isLoading = false;
		}, 300);
	});

	function formatNumber(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}

	// Define columns
	const columns: ColumnDef<StockAdjustment>[] = [
		{
			accessorKey: 'adjustment_number',
			header: 'No. Penyesuaian',
			enableSorting: false
		},
		{
			accessorKey: 'date',
			header: 'Tanggal',
			cell: ({ row }) => {
				const date = new Date(row.original.date);
				return date.toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
			}
		},
		{
			accessorKey: 'allocation_code',
			header: 'Kode Alokasi',
			cell: ({ row }) => row.original.allocation_code || '-'
		},
		{
			accessorKey: 'total_items',
			header: 'Total Barang',
			cell: ({ row }) => `${row.original.total_items} barang`
		},
		{
			accessorKey: 'gross_amount',
			header: 'Gross Amount',
			cell: ({ row }) => {
				const val = row.original.gross_amount;
				const prefix = val > 0 ? '+' : '';
				return `${prefix}${formatNumber(val)}`;
			}
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(StockAdjustmentActionsCells, {
					stockAdjustment: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return adjustments;
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

	function handleViewDetail(stockAdjustment: StockAdjustment) {
		goto(
			`/dashboard/material-management/inventory/transaction/stock-adjustment/${stockAdjustment.id}`
		);
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/stock-adjustment/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header
		title="Penyesuaian Stok"
		description="Kelola penyesuaian stok inventaris gudang"
		class="md:mb-4"
	/>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchQuery}
				placeholder="Cari penyesuaian..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat Penyesuaian
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Mobile Create Button -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Penyesuaian
		</Button>
	</div>

	<DataTable.Content {table} isLoading={isLoading} isError={false} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
