<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { getMockPhysicalStocktakes } from '../api/physical-stocktake.mock';
	import PhysicalStocktakeActionsCells from './PhysicalStocktakeActionsCells.svelte';
	import type { PhysicalStocktake } from '../types/physical-stocktake.types';

	// Paginasi dari URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let stocktakes = $state<PhysicalStocktake[]>([]);
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
			const result = getMockPhysicalStocktakes(currentPage, pageSize, debouncedSearch || undefined);
			stocktakes = result.data;
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

	function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (status) {
			case 'Verifikasi Selesai':
				return 'default';
			case 'Dalam Proses':
				return 'secondary';
			case 'Ditangguhkan':
				return 'destructive';
			default:
				return 'outline';
		}
	}

	// Definisi kolom
	const columns: ColumnDef<PhysicalStocktake>[] = [
		{
			accessorKey: 'entry_number',
			header: 'Nomor Entri',
			enableSorting: false,
			cell: ({ row }) => row.original.entry_number
		},
		{
			accessorKey: 'schedule',
			header: 'Jadwal',
			cell: ({ row }) => row.original.schedule
		},
		{
			accessorKey: 'entry_date',
			header: 'Tanggal Entri',
			cell: ({ row }) => formatDate(row.original.entry_date)
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => row.original.status
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
				renderComponent(PhysicalStocktakeActionsCells, {
					stocktake: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Buat instance tabel
	const table = createSvelteTable({
		get data() {
			return stocktakes;
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

	function handleViewDetail(stocktake: PhysicalStocktake) {
		goto(
			`/dashboard/material-management/inventory/transaction/physical-stocktake/${stocktake.id}`
		);
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/physical-stocktake/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header
		title="Entri Stok Opname"
		description="Kelola entri stok opname fisik inventaris gudang"
		class="md:mb-4"
	/>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchQuery}
				placeholder="Cari entri stok opname..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat Entri Stok Opname
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Tombol Buat untuk Mobile -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Entri Stok Opname
		</Button>
	</div>

	<DataTable.Content {table} isLoading={isLoading} isError={false} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
