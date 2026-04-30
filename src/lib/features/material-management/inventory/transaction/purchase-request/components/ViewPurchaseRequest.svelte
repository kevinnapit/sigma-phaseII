<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		type ColumnFiltersState,
		getCoreRowModel,
		type ColumnPinningState
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { useReadAllPurchaseRequests } from '../hooks/usePurchaseRequestQueries.svelte';
	import { useSubmitPurchaseRequest, useCancelPurchaseRequest } from '../hooks/usePurchaseRequestMutations.svelte';
	import type { PurchaseRequestListItemExtended } from '../types/purchase-request.types';
	import PurchaseRequestActionsCells from './PurchaseRequestActionsCells.svelte';
	import ItemsListModal from './ItemsListModal.svelte';
	import TotalItemsCell from './TotalItemsCell.svelte';
	import CancelPurchaseRequestDialog from './CancelPurchaseRequestDialog.svelte';
	import TrackingModalV5 from './TrackingModalV5.svelte';
	import { toast } from 'svelte-sonner';
	import Guard from '$lib/components/shared/guard.svelte';
	import { PURCHASE_REQUEST_PERMISSIONS } from '../constants/purchase-request-permissions';

	let {
		searchName = $bindable('')
	}: {
		searchName?: string;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });
	let filterValues = $state<Record<string, string>>({});

	let debouncedSearch = $state('');
	let previousSearch = $state('');

	$effect(() => {
		searchName;
		const timer = setTimeout(() => {
			debouncedSearch = searchName;
		}, 500);

		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updateUrlParams(1, pageSize);
			}
		}
	});

	const purchaseRequestsQuery = useReadAllPurchaseRequests(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		source_type: filterValues.source_type || undefined,
		// Status bisa berisi approval_status atau follow_up_status
		approval_status: filterValues.status && !filterValues.status.startsWith('LPO_') && filterValues.status !== 'WAITING_SAP' && filterValues.status !== 'COMPLETED' ? filterValues.status : undefined,
		follow_up_status: filterValues.status && (filterValues.status.startsWith('LPO_') || filterValues.status === 'WAITING_SAP' || filterValues.status === 'COMPLETED') ? filterValues.status : undefined
	}));

	const purchaseRequests = $derived(purchaseRequestsQuery.data?.data || []);
	const totalItems = $derived(purchaseRequestsQuery.data?.paging?.total_item || 0);
	const totalPages = $derived(purchaseRequestsQuery.data?.paging?.total_page || 0);
	const isLoading = $derived(purchaseRequestsQuery.isLoading);
	const isError = $derived(purchaseRequestsQuery.isError);

	// Submit mutation
	const submitMutation = useSubmitPurchaseRequest();
	const cancelMutation = useCancelPurchaseRequest();

	// Track which PRs are being submitted
	let submittingIds = $state<Set<string>>(new Set());

	// Modal state
	let showItemsModal = $state(false);
	let selectedRequestId = $state('');
	let selectedPRNumber = $state('');
	
	// Cancel dialog state
	let showCancelDialog = $state(false);
	let selectedPRForCancel = $state<PurchaseRequestListItemExtended | null>(null);
	
	// Tracking modal state
	let showTrackingModal = $state(false);
	let selectedPRForTracking = $state<PurchaseRequestListItemExtended | null>(null);

	const pagination = $derived.by(() => {
		return {
			pageIndex: currentPage - 1,
			pageSize: pageSize
		};
	});

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(pr: PurchaseRequestListItemExtended) {
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/transaction/purchase-request/${pr.id}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/purchase-request/create');
	}

	function handleCreateBulk() {
		goto('/dashboard/material-management/inventory/transaction/purchase-request/create-bulk');
	}

	const filterOptions = [
		{
			label: 'Tipe Sumber',
			value: 'source_type',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'RFQ', label: 'RFQ' },
				{ value: 'REPEAT_ORDER', label: 'Repeat Order' },
				{ value: 'INTER_ESTATE', label: 'Antar Kebun' }
			]
		},
		{
			label: 'Status',
			value: 'status',
			options: [
				{ value: '', label: 'Semua' },
				// Status Permintaan
				{ value: 'DRAFT', label: 'MR Telah Dibuat, Menunggu Pengajuan' },
				{ value: 'PENDING_APPROVAL_LEVEL_1', label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I' },
				{ value: 'PENDING_APPROVAL_LEVEL_2', label: 'Menunggu Persetujuan MR oleh Manager Kebun' },
				{ value: 'APPROVED', label: 'MR Telah Disetujui' },
				{ value: 'REJECTED', label: 'MR Telah Ditolak' },
				{ value: 'CANCELLED', label: 'MR Telah Dibatalkan' },
				// Status Lanjutan
				{ value: 'LPO_CREATED', label: 'LPO Dibuat' },
				{ value: 'LPO_PENDING_APPROVAL', label: 'LPO Menunggu Persetujuan' },
				{ value: 'LPO_APPROVED', label: 'LPO Disetujui' },
				{ value: 'GRN_CREATED', label: 'Penerimaan Barang Dibuat' },
				{ value: 'WAITING_SAP', label: 'Menunggu SAP' },
				{ value: 'COMPLETED', label: 'Selesai' }
			]
		}
	];

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	async function handleSubmit(pr: PurchaseRequestListItemExtended) {
		// Add to submitting set
		submittingIds = new Set([...submittingIds, pr.id]);

		try {
			await submitMutation.mutateAsync(pr.id);
			toast.success(`PR ${pr.purchase_request_number} berhasil diajukan untuk approval`);
		} catch (error) {
			console.error('Error submitting PR:', error);
			toast.error(
				`Gagal mengajukan PR ${pr.purchase_request_number}: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			// Remove from submitting set
			const newSubmitting = new Set(submittingIds);
			newSubmitting.delete(pr.id);
			submittingIds = newSubmitting;
		}
	}

	function handleEdit(pr: PurchaseRequestListItemExtended) {
		goto(`/dashboard/material-management/inventory/transaction/purchase-request/${pr.id}/edit`);
	}

	function handleCancelClick(pr: PurchaseRequestListItemExtended) {
		selectedPRForCancel = pr;
		showCancelDialog = true;
	}

	async function handleCancelConfirm(reason: string) {
		if (!selectedPRForCancel) return;

		try {
			await cancelMutation.mutateAsync({
				id: selectedPRForCancel.id,
				payload: { cancelled_reason: reason }
			});
			toast.success(`PR ${selectedPRForCancel.purchase_request_number} berhasil dibatalkan`);
			showCancelDialog = false;
			selectedPRForCancel = null;
		} catch (error) {
			console.error('Error cancelling PR:', error);
			toast.error(
				`Gagal membatalkan PR: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function isSubmitting(prId: string) {
		return submittingIds.has(prId);
	}

	function handleShowItems(pr: PurchaseRequestListItemExtended) {
		selectedRequestId = pr.id;
		selectedPRNumber = pr.purchase_request_number;
		showItemsModal = true;
	}
	
	function handleShowTracking(pr: PurchaseRequestListItemExtended) {
		selectedPRForTracking = pr;
		showTrackingModal = true;
	}
	
	function getSourceTypeDisplay(sourceType: string): string {
		switch (sourceType) {
			case 'RFQ':
				return 'RFQ';
			case 'REPEAT_ORDER':
				return 'Repeat Order';
			case 'INTER_ESTATE':
				return 'Antar Kebun';
			default:
				return sourceType;
		}
	}

	function getStatusDisplay(status: string): string {
		switch (status) {
			case 'DRAFT':
				return 'MR Telah Dibuat, Menunggu Pengajuan';
			case 'PENDING_APPROVAL_LEVEL_1':
				return 'Menunggu Persetujuan MR oleh Askep/Tekniker I';
			case 'PENDING_APPROVAL_LEVEL_2':
				return 'Menunggu Persetujuan MR oleh Manager Kebun';
			case 'PENDING':
				return 'Menunggu Persetujuan MR oleh Manager Kebun';
			case 'APPROVED':
				return 'MR Telah Disetujui';
			case 'REJECTED':
				return 'MR Telah Ditolak';
			case 'CANCELLED':
				return 'MR Telah Dibatalkan';
			case 'PENDING_APPROVAL':
				return '-';
			default:
				return status;
		}
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageSize);
	}

	function handlePageSizeChange(size: number) {
		updateUrlParams(1, size);
	}

	const columns: ColumnDef<PurchaseRequestListItemExtended>[] = [
		{
			accessorKey: 'purchase_request_number',
			header: 'Nomor MR',
			enableSorting: false
		},
		{
			accessorKey: 'source_type',
			header: 'Tipe Sumber',
			enableSorting: false,
			cell: ({ row }) => {
				return getSourceTypeDisplay(row.original.source_type || '-');
			}
		},
		{
			accessorKey: 'purchase_request_date',
			header: 'Tanggal MR',
			enableSorting: false,
			cell: ({ row }) => {
				const date = new Date(row.original.purchase_request_date);
				return date.toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
			}
		},
		{
			accessorKey: 'requested_by',
			header: 'Diminta Oleh',
			enableSorting: false
		},
		{
			accessorKey: 'total_items',
			header: 'Total Barang',
			enableSorting: false,
			cell: ({ row }) =>
				renderComponent(TotalItemsCell, {
					totalItems: row.original.total_items,
					onClick: () => handleShowItems(row.original)
				})
		},
		{
			accessorKey: 'approval_status',
			header: 'Status Permintaan',
			enableSorting: false,
			cell: ({ row }) => {
				// Hanya tampilkan status approval Permintaan Barang
				return getStatusDisplay(row.original.approval_status);
			}
		},
		{
			accessorKey: 'remarks',
			header: 'Catatan Urgensi',
			enableSorting: false,
			cell: ({ row }) => row.original.remarks || '-'
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(PurchaseRequestActionsCells, {
					purchaseRequest: row.original,
					onViewDetail: handleViewDetail,
					onSubmit: handleSubmit,
					onEdit: handleEdit,
					onCancel: handleCancelClick,
					onTracking: handleShowTracking,
					isSubmitting: isSubmitting(row.original.id)
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return purchaseRequests;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnPinning() {
				return columnPinning;
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
		getRowId: (originalRow) => originalRow.id,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater) => {
			let newPagination: PaginationState;

			if (typeof updater === 'function') {
				newPagination = updater(pagination);
			} else {
				newPagination = updater;
			}

			if (newPagination.pageIndex !== currentPage - 1) {
				handlePageChange(newPagination.pageIndex + 1);
			}
			if (newPagination.pageSize !== pageSize) {
				handlePageSizeChange(newPagination.pageSize);
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
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
		}
	});
</script>

<Guard permissions={PURCHASE_REQUEST_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Permintaan Barang"
			description="Kelola permintaan barang"
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search bind:value={searchName} placeholder="Cari nomor MR..." debounce={500} />
			{/snippet}
			{#snippet end()}
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				/>
				<Guard permissions={PURCHASE_REQUEST_PERMISSIONS.CREATE}>
					<Button onclick={handleCreateNew} class="hidden md:flex">
						<Plus class="mr-2 h-4 w-4" />
						Buat Permintaan Barang
					</Button>
					<Button onclick={handleCreateBulk} variant="outline" class="hidden md:flex">
						<Plus class="mr-2 h-4 w-4" />
						Permintaan Banyak Item (HO)
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<Guard permissions={PURCHASE_REQUEST_PERMISSIONS.CREATE}>
			<div class="px-4 pb-3 md:hidden">
				<div class="space-y-2">
					<Button onclick={handleCreateNew} class="w-full">
						<Plus class="mr-2 h-4 w-4" />
						Buat Permintaan Barang
					</Button>
					<Button onclick={handleCreateBulk} variant="outline" class="w-full">
						<Plus class="mr-2 h-4 w-4" />
						Permintaan Banyak Item (HO)
					</Button>
				</div>
			</div>
		</Guard>

		<DataTable.Content {table} {isLoading} {isError} />

		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>

<!-- Items List Modal -->
<ItemsListModal
	bind:open={showItemsModal}
	requestId={selectedRequestId}
	prNumber={selectedPRNumber}
/>

<!-- Cancel Purchase Request Dialog -->
<CancelPurchaseRequestDialog
	bind:open={showCancelDialog}
	onConfirm={handleCancelConfirm}
	isSubmitting={cancelMutation.isPending}
/>

<!-- Tracking Modal - Use TrackingModalV5 for all PRs -->
<TrackingModalV5
	bind:open={showTrackingModal}
	requestId={selectedPRForTracking?.id || ''}
	prNumber={selectedPRForTracking?.purchase_request_number || ''}
/>
