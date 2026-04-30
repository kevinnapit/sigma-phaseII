<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { useReadAllGRNReconditionedStock } from '../hooks/useGRNReconditionedStockQueries.svelte';
	import GRNReconditionedStockActionsCells from './GRNReconditionedStockActionsCells.svelte';
	import type { GRNReconditionedStock } from '../types/grn-reconditioned-stock.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let statusFilter = $state('all');

	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Query data
	const grnQuery = useReadAllGRNReconditionedStock(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		status: statusFilter !== 'all' ? statusFilter : undefined
	}));

	const grns = $derived(grnQuery.data?.data || []);
	const totalItems = $derived(grnQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(grnQuery.data?.pagination?.total_page || 0);

	// Status label map
	const statusLabelMap: Record<string, { label: string; class: string }> = {
		DRAFT: { label: 'Belum Diajukan', class: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
		PENDING_APPROVAL: {
			label: 'Menunggu Persetujuan Askep/Tekniker 1',
			class: 'bg-blue-50 text-blue-700 border-blue-200'
		},
		APPROVED: { label: 'Disetujui', class: 'bg-green-50 text-green-700 border-green-200' },
		REJECTED: { label: 'Ditolak', class: 'bg-red-50 text-red-700 border-red-200' }
	};

	// Define columns
	const columns: ColumnDef<GRNReconditionedStock>[] = [
		{
			accessorKey: 'grn_number',
			header: 'Nomor GRN',
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
			accessorKey: 'supplier_name',
			header: 'Supplier'
		},
		{
			id: 'total_items',
			header: 'Total Barang',
			cell: ({ row }) => {
				const n = (row.original as any).total_items ?? 0;
				return `${n} barang`;
			}
		},
		{
			accessorKey: 'gross_amount',
			header: 'Gross Amount',
			cell: ({ row }) =>
				`Rp ${new Intl.NumberFormat('id-ID').format(row.original.gross_amount)}`
		},
		{
			accessorKey: 'approval_status',
			header: 'Status',
			cell: ({ row }) => {
				const s = statusLabelMap[row.original.approval_status];
				return s ? s.label : row.original.approval_status;
			}
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(GRNReconditionedStockActionsCells, {
					grn: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return grns;
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

	function handleViewDetail(grn: GRNReconditionedStock) {
		goto(
			`/dashboard/material-management/inventory/transaction/grn-reconditioned-stock/${grn.id}`
		);
	}

	function handleFilterChange(newStatus: string) {
		statusFilter = newStatus;
		if (currentPage !== 1) {
			updateUrlParams(1, pageSize);
		}
	}

	function handleCreateNew() {
		goto(
			'/dashboard/material-management/inventory/transaction/grn-reconditioned-stock/create'
		);
	}
</script>

<DataTable.Root>
	<DataTable.Header
		title="Penerimaan Barang Re-Conditioned Stock"
		description="Kelola penerimaan barang re-conditioned stock"
		class="md:mb-4"
	/>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchQuery} placeholder="Cari GRN..." debounce={500} />
		{/snippet}
		{#snippet end()}
			<DataTable.Filter
				filters={[
					{
						label: 'Status',
						value: 'status',
						options: [
							{ value: 'all', label: 'Semua' },
							{ value: 'DRAFT', label: 'Belum Diajukan' },
							{
								value: 'PENDING_APPROVAL',
								label: 'Menunggu Persetujuan Askep/Tekniker 1'
							},
							{ value: 'APPROVED', label: 'Disetujui' },
							{ value: 'REJECTED', label: 'Ditolak' }
						]
					}
				]}
				values={{ status: statusFilter }}
				onApply={(filters) => handleFilterChange(filters.status || 'all')}
			/>
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat GRN Re-Conditioned Stock
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Mobile Create Button -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat GRN Re-Conditioned Stock
		</Button>
	</div>

	<DataTable.Content {table} isLoading={grnQuery.isLoading} isError={grnQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={grnQuery.isLoading} />
	</DataTable.Footer>
</DataTable.Root>
