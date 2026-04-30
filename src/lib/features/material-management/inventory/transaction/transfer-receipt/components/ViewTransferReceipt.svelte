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
	import { useReadAllTransferReceipts } from '../hooks/useTransferReceiptQueries.svelte';
	import TransferReceiptActionsCells from './TransferReceiptActionsCells.svelte';
	import type { TransferReceipt } from '../types/transfer-receipt.types';

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
	const receiptsQuery = useReadAllTransferReceipts(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		status: statusFilter !== 'all' ? statusFilter : undefined
	}));

	const receipts = $derived(receiptsQuery.data?.data || []);
	const totalItems = $derived(receiptsQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(receiptsQuery.data?.pagination?.total_page || 0);

	// Define columns
	const columns: ColumnDef<TransferReceipt>[] = [
		{
			accessorKey: 'grn_number',
			header: 'Nomor GRN',
			enableSorting: false
		},
		{
			accessorKey: 'grn_date',
			header: 'Tanggal GRN',
			cell: ({ row }) => {
				const date = new Date(row.original.grn_date);
				return date.toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
			}
		},
		{
			accessorKey: 'store_name',
			header: 'Gudang Tujuan'
		},
		{
			accessorKey: 'from_store_name',
			header: 'Gudang Asal'
		},
		{
			accessorKey: 'mr_no',
			header: 'Nomor MR'
		},
		{
			accessorKey: 'total_items',
			header: 'Jumlah Barang',
			cell: ({ row }) => `${row.original.total_items} barang`
		},
		{
			accessorKey: 'gross_amount',
			header: 'Gross Amount',
			cell: ({ row }) => `Rp ${new Intl.NumberFormat('id-ID').format(row.original.gross_amount)}`
		},
		{
			accessorKey: 'status_label',
			header: 'Status',
			cell: ({ row }) => {
				const statusMap: Record<string, { label: string; class: string }> = {
					DRAFT:            { label: 'Belum Diajukan',                          class: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
					PENDING_APPROVAL: { label: 'Menunggu Persetujuan Askep/Tekniker 1',   class: 'bg-blue-50 text-blue-700 border-blue-200' },
					APPROVED:         { label: 'Disetujui',                               class: 'bg-green-50 text-green-700 border-green-200' },
					REJECTED:         { label: 'Ditolak',                                 class: 'bg-red-50 text-red-700 border-red-200' }
				};
				const s = statusMap[row.original.status] ?? { label: row.original.status_label, class: '' };
				return s.label;
			}
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(TransferReceiptActionsCells, {
					transferReceipt: row.original,
					onViewDetail: handleViewDetail,
					onApprove: handleApprove,
					onReject: handleReject
				})
		}
	];

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return receipts;
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

	function handleViewDetail(transferReceipt: TransferReceipt) {
		goto(
			`/dashboard/material-management/inventory/transaction/transfer-receipt/${transferReceipt.id}`
		);
	}

	function handleApprove(transferReceipt: TransferReceipt) {
		// This will be handled by the actions cell component
		console.log('Approve:', transferReceipt.id);
	}

	function handleReject(transferReceipt: TransferReceipt) {
		// This will be handled by the actions cell component
		console.log('Reject:', transferReceipt.id);
	}

	function handleFilterChange(newStatus: string) {
		statusFilter = newStatus;
		// Reset to page 1 when filter changes
		if (currentPage !== 1) {
			updateUrlParams(1, pageSize);
		}
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/transfer-receipt/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header title="Penerimaan Barang Transfer" description="Kelola penerimaan barang dari transfer antar gudang" class="md:mb-4" />
	
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchQuery} placeholder="Cari penerimaan..." debounce={500} />
		{/snippet}
		{#snippet end()}
			<DataTable.Filter
				filters={[
					{
						label: 'Status',
						value: 'status',
						options: [
							{ value: 'all', label: 'Semua Status' },
							{ value: 'DRAFT', label: 'Belum Diajukan' },
							{ value: 'PENDING_APPROVAL', label: 'Menunggu Persetujuan Askep/Tekniker 1' },
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
				Buat Penerimaan
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Mobile Create Button -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Penerimaan
		</Button>
	</div>

	<DataTable.Content {table} isLoading={receiptsQuery.isLoading} isError={receiptsQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={receiptsQuery.isLoading} />
	</DataTable.Footer>
</DataTable.Root>