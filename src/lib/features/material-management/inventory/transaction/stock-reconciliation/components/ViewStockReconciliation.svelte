<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { getMockStockReconciliations } from '../api/stock-reconciliation.mock';
	import StockReconciliationActionsCells from './StockReconciliationActionsCells.svelte';
	import type { StockReconciliation } from '../types/stock-reconciliation.types';

	// Paginasi dari URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let reconciliations = $state<StockReconciliation[]>([]);
	let totalItems = $state(0);
	let totalPages = $state(0);
	let isLoading = $state(true);

	// Debounce pencarian
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Muat data
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			const result = getMockStockReconciliations(
				currentPage,
				pageSize,
				debouncedSearch || undefined
			);
			reconciliations = result.data;
			totalItems = result.pagination.total_item;
			totalPages = result.pagination.total_page;
			isLoading = false;
		}, 300);
	});

	function formatDate(iso: string) {
		if (!iso) return '-';
		return new Date(iso).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	// Definisi kolom
	const columns: ColumnDef<StockReconciliation>[] = [
		{
			accessorKey: 'reconciliation_number',
			header: 'No. Rekonsiliasi',
			enableSorting: false,
			cell: ({ row }) => row.original.reconciliation_number
		},
		{
			accessorKey: 'verification_schedule_no',
			header: 'Jadwal Verifikasi',
			cell: ({ row }) => row.original.verification_schedule_no
		},
		{
			accessorKey: 'entry_date',
			header: 'Tanggal Entri',
			cell: ({ row }) => formatDate(row.original.entry_date)
		},
		{
			accessorKey: 'total_items',
			header: 'Total Barang',
			cell: ({ row }) => `${row.original.total_items} barang`
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(StockReconciliationActionsCells, {
					reconciliation: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Buat instance tabel
	const table = createSvelteTable({
		get data() {
			return reconciliations;
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

	function handleViewDetail(reconciliation: StockReconciliation) {
		goto(
			`/dashboard/material-management/inventory/transaction/stock-reconciliation/${reconciliation.id}`
		);
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/stock-reconciliation/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header
		title="Rekonsiliasi Stok"
		description="Kelola rekonsiliasi stok inventaris gudang"
		class="md:mb-4"
	/>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchQuery}
				placeholder="Cari rekonsiliasi stok..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat Rekonsiliasi Stok
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Tombol Buat untuk Mobile -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Rekonsiliasi Stok
		</Button>
	</div>

	<DataTable.Content {table} isLoading={isLoading} isError={false} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
