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
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { useReadAllRFQs } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import type { RFQItem } from '../types/local-purchase-analysis.types';
	import { formatDate, formatDateOnly } from '$lib/shared/utils';
	import { getRFQStatusDisplay, getRFQStepFromStatus } from '../constants/process-steps';
	import RFQActionsCells from './RFQActionsCells.svelte';
	import RFQItemsCell from './RFQItemsCell.svelte';
	import RFQVendorsCell from './RFQVendorsCell.svelte';
	import RFQApprovalStatusBadge from './RFQApprovalStatusBadge.svelte';
	import RFQDetailModal from './RFQDetailModal.svelte';
	import RFQTrackingModal from './RFQTrackingModal.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { LOCAL_PURCHASE_ANALYSIS_PERMISSIONS } from '../constants/local-purchase-analysis.permissions';
	import { useReadTrackingHistory } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';

	let searchName = $state('');
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	// Modal state
	let showDetailModal = $state(false);
	let selectedRfqId = $state('');
	let selectedRfqNumber = $state('');
	let modalMode = $state<'items' | 'vendors'>('items');

	// Tracking modal state
	let showTrackingModal = $state(false);
	let selectedRFQ = $state<RFQItem | null>(null);

	function handleShowItems(rfq: RFQItem) {
		selectedRfqId = rfq.uoid;
		selectedRfqNumber = rfq.rfq_number;
		modalMode = 'items';
		showDetailModal = true;
	}

	function handleShowVendors(rfq: RFQItem) {
		selectedRfqId = rfq.uoid;
		selectedRfqNumber = rfq.rfq_number;
		modalMode = 'vendors';
		showDetailModal = true;
	}

	function handleTracking(rfq: RFQItem) {
		selectedRFQ = rfq;
		showTrackingModal = true;
	}

	// URL params
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

	// Reset ke page 1 saat search berubah
	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updateUrlParams(1, pageSize);
			}
		}
	});

	// Query RFQs
	const rfqsQuery = useReadAllRFQs(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined
	}));

	// Query tracking history for selected RFQ
	const trackingQuery = useReadTrackingHistory(() => selectedRFQ?.uoid || '', () => !!selectedRFQ && showTrackingModal);

	const rfqs = $derived(rfqsQuery.data?.data || []);
	const pagination = $derived(rfqsQuery.data?.pagination);
	const totalItems = $derived(pagination?.total_records || 0);
	const totalPages = $derived(pagination?.total_pages || 0);
	const isLoading = $derived(rfqsQuery.isLoading);
	const isError = $derived(rfqsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleCreateProcess() {
		goto('/dashboard/material-management/inventory/transaction/local-purchase-analysis/create');
	}

	function handleViewDetail(rfq: RFQItem) {
		if (rfq.status === 'LPO_DIBUAT' && rfq.process_type === 'RO') {
			goto(
				`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${rfq.uoid}/ro-detail`
			);
			return;
		}
		const step = getRFQStepFromStatus(rfq.status);
		goto(
			`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${rfq.uoid}?step=${step}`
		);
	}

	// Column definitions
	const columns: ColumnDef<RFQItem>[] = [
		{
			accessorKey: 'rfq_number',
			header: 'No. Transaksi',
			enableSorting: false
		},
		{
			accessorKey: 'item_count',
			header: 'Jumlah Barang',
			cell: ({ row }) =>
				renderComponent(RFQItemsCell, {
					count: row.original.item_count,
					onClick: () => handleShowItems(row.original)
				}),
			enableSorting: false
		},
		{
			accessorKey: 'published_at',
			header: 'Tanggal Dibuat',
			cell: ({ row }) => (row.original.published_at ? formatDate(row.original.published_at) : '-'),
			enableSorting: false
		},
		{
			accessorKey: 'deadline_date',
			header: 'Deadline',
			cell: ({ row }) => formatDateOnly(row.original.deadline_date),
			enableSorting: false
		},
		{
			accessorKey: 'vendor_count',
			header: 'Vendor',
			cell: ({ row }) =>
				renderComponent(RFQVendorsCell, {
					count: row.original.vendor_count,
					onClick: () => handleShowVendors(row.original)
				}),
			enableSorting: false
		},
		{
			accessorKey: 'process_type',
			header: 'Tipe Proses',
			enableSorting: false
		},
		{
			accessorKey: 'approval_status_summary',
			header: 'Status Izin',
			cell: ({ row }) =>
				renderComponent(RFQApprovalStatusBadge, {
					status: row.original.approval_status_summary
				}),
			enableSorting: false
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => getRFQStatusDisplay(row.original.status),
			enableSorting: false
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(RFQActionsCells, {
					rfq: row.original,
					onViewDetail: handleViewDetail,
					onTracking: handleTracking
				})
		}
	];

	// Table instance
	const table = createSvelteTable({
		get data() {
			return rfqs;
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
				return {
					pageIndex: currentPage - 1,
					pageSize: pageSize
				};
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
				typeof updater === 'function'
					? updater({ pageIndex: currentPage - 1, pageSize: pageSize })
					: updater;
			updateUrlParams(newPagination.pageIndex + 1, newPagination.pageSize);
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onColumnPinningChange: (updater) => {
			if (typeof updater === 'function') {
				columnPinning = updater(columnPinning);
			} else {
				columnPinning = updater;
			}
		},
		getRowId: (originalRow) => originalRow.uoid,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Proses Pembelian Lokal"
			description="Kelola proses pembelian lokal melalui RFQ, Repeat Order, atau LPO langsung."
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search
					bind:value={searchName}
					placeholder="Cari Nomor Transaksi..."
					debounce={500}
				/>
			{/snippet}
			{#snippet end()}
				<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.CREATE}>
					<Button
						onclick={handleCreateProcess}
						class="hidden gap-2 bg-[#0f4c2a] hover:bg-[#0d4023] md:flex"
					>
						<Plus class="h-4 w-4" />
						Buat Proses Pembelian Lokal
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.CREATE}>
			<div class="px-4 pb-3 md:hidden">
				<Button onclick={handleCreateProcess} class="w-full gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
					<Plus class="h-4 w-4" />
					Buat Proses Pembelian Lokal
				</Button>
			</div>
		</Guard>
		<DataTable.Content {table} {isLoading} {isError} />
		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>

<RFQDetailModal
	bind:open={showDetailModal}
	rfqId={selectedRfqId}
	rfqNumber={selectedRfqNumber}
	mode={modalMode}
/>

<RFQTrackingModal
	bind:open={showTrackingModal}
	rfqId={selectedRFQ?.uoid || ''}
	rfqNumber={selectedRFQ?.rfq_number || ''}
	processType={selectedRFQ?.process_type || 'RFQ'}
	trackingData={trackingQuery.data?.data || []}
/>
