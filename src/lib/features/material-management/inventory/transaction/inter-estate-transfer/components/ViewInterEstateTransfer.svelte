<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { type ColumnDef, getCoreRowModel, type SortingState } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { useReadAllInterEstateTransfers } from '../hooks/useInterEstateTransferQueries.svelte';
	import InterEstateTransferActionsCells from './InterEstateTransferActionsCells.svelte';
	import type { InterEstateTransfer } from '../types/inter-estate-transfer.types';

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let statusFilter = $state('all');
	let sorting = $state<SortingState>([]);

	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	const transfersQuery = useReadAllInterEstateTransfers(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		status: statusFilter !== 'all' ? statusFilter : undefined
	}));

	const transfers = $derived(transfersQuery.data?.data || []);
	const totalItems = $derived(transfersQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(transfersQuery.data?.pagination?.total_page || 0);

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	function getStatusDisplay(status: string): string {
		switch (status) {
			case 'pending_approval':
				return 'Menunggu Persetujuan Manager Kebun Diminta';
			case 'approved':
				return 'Disetujui';
			case 'rejected':
				return 'Ditolak';
			case 'received':
				return 'Diterima';
			default:
				return status;
		}
	}

	const columns: ColumnDef<InterEstateTransfer>[] = [
		{
			accessorKey: 'document_number',
			header: 'No. Dokumen',
			cell: ({ row }) => row.original.document_number
		},
		{
			accessorKey: 'mr_number',
			header: 'No. Permintaan',
			cell: ({ row }) => row.original.mr_number
		},
		{
			accessorKey: 'request_date',
			header: 'Tanggal',
			cell: ({ row }) => formatDate(row.original.request_date)
		},
		{
			accessorKey: 'from_estate_name',
			header: 'Kebun Peminta',
			cell: ({ row }) => row.original.from_estate_name
		},
		{
			accessorKey: 'to_estate_name',
			header: 'Kebun Diminta',
			cell: ({ row }) => row.original.to_estate_name
		},
		{
			accessorKey: 'total_items',
			header: 'Jumlah Barang',
			cell: ({ row }) => `${row.original.total_items} barang`
		},
		{
			accessorKey: 'total_amount',
			header: 'Total Nilai',
			cell: ({ row }) => formatCurrency(row.original.total_amount)
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => getStatusDisplay(row.original.status)
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(InterEstateTransferActionsCells, {
					transfer: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return transfers;
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

	function updateUrlParams(newPage: number, newSize: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', newPage.toString());
		url.searchParams.set('size', newSize.toString());
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(transfer: InterEstateTransfer) {
		goto(
			`/dashboard/material-management/inventory/transaction/inter-estate-transfer/${transfer.id}`
		);
	}

	const statusOptions = [
		{ value: 'all', label: 'Semua Status' },
		{ value: 'pending_approval', label: 'Menunggu Approval' },
		{ value: 'approved', label: 'Disetujui' },
		{ value: 'rejected', label: 'Ditolak' },
		{ value: 'received', label: 'Diterima' }
	];
</script>

<DataTable.Root>
	<DataTable.Header
		title="Transfer Antar Kebun"
		description="Kelola permintaan transfer barang antar kebun"
		class="md:mb-4"
	/>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search bind:value={searchQuery} placeholder="Cari nomor dokumen, kebun..." debounce={500} />
		{/snippet}
		{#snippet end()}
			<select
				bind:value={statusFilter}
				class="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				{#each statusOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} isLoading={transfersQuery.isLoading} isError={transfersQuery.isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={transfersQuery.isLoading} />
	</DataTable.Footer>
</DataTable.Root>
