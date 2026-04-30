<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { getMockPurchaseReturns } from '../api/purchase-return.mock';
	import PurchaseReturnActionsCells from './PurchaseReturnActionsCells.svelte';
	import type { PurchaseReturn } from '../types/purchase-return.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let returns = $state<PurchaseReturn[]>([]);
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
			const result = getMockPurchaseReturns(currentPage, pageSize, debouncedSearch || undefined);
			returns = result.data;
			totalItems = result.pagination.total_item;
			totalPages = result.pagination.total_page;
			isLoading = false;
		}, 300);
	});

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}

	// Define columns
	const columns: ColumnDef<PurchaseReturn>[] = [
		{
			accessorKey: 'return_number',
			header: 'No. Pengembalian',
			enableSorting: false
		},
		{
			accessorKey: 'return_date',
			header: 'Tanggal',
			cell: ({ row }) => {
				const date = new Date(row.original.return_date);
				return date.toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
			}
		},
		{
			accessorKey: 'supplier_name',
			header: 'Supplier'
		},
		{
			accessorKey: 'total_items',
			header: 'Total Barang',
			cell: ({ row }) => `${row.original.total_items} barang`
		},
		{
			accessorKey: 'gross_amount',
			header: 'Gross Amount',
			cell: ({ row }) => formatCurrency(row.original.gross_amount)
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(PurchaseReturnActionsCells, {
					purchaseReturn: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return returns;
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

	function handleViewDetail(purchaseReturn: PurchaseReturn) {
		goto(
			`/dashboard/material-management/inventory/transaction/purchase-return/${purchaseReturn.id}`
		);
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/purchase-return/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header
		title="Pengembalian Pembelian"
		description="Kelola pengembalian barang kepada supplier"
		class="md:mb-4"
	/>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchQuery}
				placeholder="Cari pengembalian..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat Pengembalian
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Mobile Create Button -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Pengembalian
		</Button>
	</div>

	<DataTable.Content {table} isLoading={isLoading} isError={false} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
