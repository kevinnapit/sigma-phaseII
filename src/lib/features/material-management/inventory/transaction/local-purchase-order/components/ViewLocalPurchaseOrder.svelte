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
	import {
		useReadAllLPOs,
		useSubmitLPO,
		useCancelLPO,
		useReadLPOTrackingHistory
	} from '../hooks/useLocalPurchaseOrderQueries.svelte';
	import type { LPOListItem } from '../types/local-purchase-order.types';
	import LPOStats from './LPOStats.svelte';
	import LPOActionsCells from './LPOActionsCells.svelte';
	import LPOItemsCell from './LPOItemsCell.svelte';
	import LPOItemsModal from './LPOItemsModal.svelte';
	import LPOTrackingModal from './LPOTrackingModal.svelte';
	import CancelLPODialog from './CancelLPODialog.svelte';
	import { toast } from 'svelte-sonner';
	import Guard from '$lib/components/shared/guard.svelte';
	import { LOCAL_PURCHASE_ORDER_PERMISSIONS } from '../constants/local-purchase-order-permissions';

	// URL params
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let searchValue = $state('');
	let debouncedSearch = $state('');
	let previousSearch = $state('');
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });
	let filterValues = $state<Record<string, string>>({});

	$effect(() => {
		searchValue;
		const timer = setTimeout(() => {
			debouncedSearch = searchValue;
		}, 500);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) updateUrlParams(1, pageSize);
		}
	});

	const lpoQuery = useReadAllLPOs(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		approval_status: filterValues.approval_status || undefined
	}));

	const submitMutation = useSubmitLPO();
	const cancelMutation = useCancelLPO();
	let submittingId = $state<string | null>(null);

	// Modal state
	let showItemsModal = $state(false);
	let selectedLpoId = $state('');
	let selectedLpoNumber = $state('');

	// Cancel dialog state
	let showCancelDialog = $state(false);
	let lpoToCancel = $state<LPOListItem | null>(null);

	// Tracking modal state
	let showTrackingModal = $state(false);
	let selectedLPO = $state<LPOListItem | null>(null);

	// Query tracking history for selected LPO (must be after selectedLPO declaration)
	const trackingQuery = useReadLPOTrackingHistory(() => selectedLPO?.id || '', () => !!selectedLPO && showTrackingModal);

	function handleShowItems(lpo: LPOListItem) {
		selectedLpoId = lpo.id;
		selectedLpoNumber = lpo.lpo_number;
		showItemsModal = true;
	}

	const lpos = $derived(lpoQuery.data?.data || []);
	const totalItems = $derived(lpoQuery.data?.paging?.total_item || 0);
	const totalPages = $derived(lpoQuery.data?.paging?.total_page || 0);
	const isLoading = $derived(lpoQuery.isLoading);
	const isError = $derived(lpoQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(lpo: LPOListItem) {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/local-purchase-order/${lpo.id}${params ? `?${params}` : ''}`
		);
	}

	async function handleSubmit(lpo: LPOListItem) {
		submittingId = lpo.id;
		try {
			await submitMutation.mutateAsync(lpo.id);
			toast.success(`LPO ${lpo.lpo_number} berhasil diajukan untuk persetujuan`);
		} catch (error) {
			toast.error(
				`Gagal mengajukan LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			submittingId = null;
		}
	}

	function handleEdit(lpo: LPOListItem) {
		goto(
			`/dashboard/material-management/inventory/transaction/local-purchase-order/${lpo.id}/edit`
		);
	}

	function handleCancelClick(lpo: LPOListItem) {
		lpoToCancel = lpo;
		showCancelDialog = true;
	}

	function handleTracking(lpo: LPOListItem) {
		selectedLPO = lpo;
		showTrackingModal = true;
	}

	async function handleCancelConfirm(reason: string) {
		if (!lpoToCancel) return;

		try {
			await cancelMutation.mutateAsync({ lpoId: lpoToCancel.id, params: { reason } });
			toast.success(`LPO ${lpoToCancel.lpo_number} berhasil dibatalkan`);
			showCancelDialog = false;
			lpoToCancel = null;
		} catch (error) {
			toast.error(
				`Gagal membatalkan LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	const statusLabelMap: Record<string, string> = {
		DRAFT: 'Draft',
		PENDING_APPROVAL: 'Menunggu Persetujuan Manager Kebun',
		APPROVED: 'Disetujui',
		REJECTED: 'Ditolak',
		CANCELLED: 'Dibatalkan'
	};

	const filterOptions = [
		{
			label: 'Status',
			value: 'approval_status',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'DRAFT', label: 'Draft' },
				{ value: 'PENDING_APPROVAL', label: 'Menunggu Persetujuan Manager Kebun' },
				{ value: 'APPROVED', label: 'Disetujui' },
				{ value: 'REJECTED', label: 'Ditolak' },
				{ value: 'CANCELLED', label: 'Dibatalkan' }
			]
		}
	];

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	const columns: ColumnDef<LPOListItem>[] = [
		{ accessorKey: 'lpo_number', header: 'Nomor LPO', enableSorting: false },
		{
			accessorKey: 'lpo_date',
			header: 'Tanggal LPO',
			cell: ({ row }) => formatDate(row.original.lpo_date),
			enableSorting: false
		},
		{
			id: 'supplier',
			header: 'Vendor',
			cell: ({ row }) => `${row.original.supplier_name} (${row.original.supplier_code})`,
			enableSorting: false
		},
		{
			accessorKey: 'item_count',
			header: 'Jumlah Barang',
			cell: ({ row }) =>
				renderComponent(LPOItemsCell, {
					count: row.original.item_count,
					onClick: () => handleShowItems(row.original)
				}),
			enableSorting: false
		},
		{
			accessorKey: 'total_amount',
			header: 'Total Nilai Harga',
			cell: ({ row }) => formatCurrency(row.original.total_amount),
			enableSorting: false
		},
		{
			accessorKey: 'required_by_date',
			header: 'Tanggal Dibutuhkan',
			cell: ({ row }) => formatDate(row.original.required_by_date),
			enableSorting: false
		},
		{
			accessorKey: 'reference_number',
			header: 'Referensi LPO',
			cell: ({ row }) => row.original.lpo_type || '-',
			enableSorting: false
		},
		{
			accessorKey: 'approval_status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.original.approval_status;
				return statusLabelMap[status] ?? status;
			},
			enableSorting: false
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(LPOActionsCells, {
					lpo: row.original,
					onViewDetail: handleViewDetail,
					onSubmit: handleSubmit,
					onEdit: handleEdit,
					onCancel: handleCancelClick,
					onTracking: handleTracking,
					isSubmitting: submittingId === row.original.id
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return lpos;
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
				return { pageIndex: currentPage - 1, pageSize };
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnPinning() {
				return columnPinning;
			}
		},
		onPaginationChange: (updater) => {
			const next =
				typeof updater === 'function' ? updater({ pageIndex: currentPage - 1, pageSize }) : updater;
			updateUrlParams(next.pageIndex + 1, next.pageSize);
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onColumnPinningChange: (updater) => {
			columnPinning = typeof updater === 'function' ? updater(columnPinning) : updater;
		},
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="space-y-6">
	<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.VIEW}>
		<LPOStats />
	</Guard>

	<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.VIEW}>
		<DataTable.Root>
			<DataTable.Header
				title="Daftar Order Pembelian Lokal"
				description="Kelola order pembelian lokal"
				class="md:mb-4"
			/>
			<DataTable.Toolbar>
				{#snippet start()}
					<DataTable.Search
						bind:value={searchValue}
						placeholder="Cari berdasarkan nomor LPO"
						debounce={500}
					/>
				{/snippet}
				{#snippet end()}
					<DataTable.Filter
						filters={filterOptions}
						bind:values={filterValues}
						onApply={handleFilterApply}
					/>
					<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
						<Button
							class="hidden md:flex"
							onclick={() =>
								goto(
									'/dashboard/material-management/inventory/transaction/local-purchase-order/create?step=select-vendor-items'
								)}
						>
							<Plus class="mr-2 h-4 w-4" />
							Buat Order Pembelian Lokal
						</Button>
					</Guard>
					<DataTable.ColumnToggle {table} />
				{/snippet}
			</DataTable.Toolbar>
			<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
				<div class="px-4 pb-3 md:hidden">
					<Button
						class="w-full"
						onclick={() =>
							goto(
								'/dashboard/material-management/inventory/transaction/local-purchase-order/create?step=select-vendor-items'
							)}
					>
						<Plus class="mr-2 h-4 w-4" />
						Buat Order Pembelian Lokal
					</Button>
				</div>
			</Guard>
			<DataTable.Content {table} {isLoading} {isError} />
			<DataTable.Footer>
				<DataTable.Pagination {table} isFetching={isLoading} />
			</DataTable.Footer>
		</DataTable.Root>
	</Guard>
</div>

<LPOItemsModal bind:open={showItemsModal} lpoId={selectedLpoId} lpoNumber={selectedLpoNumber} />

<LPOTrackingModal
	bind:open={showTrackingModal}
	lpoId={selectedLPO?.id || ''}
	lpoNumber={selectedLPO?.lpo_number || ''}
	lpoType={selectedLPO?.lpo_type === 'LPOM' ? 'LPOM' : 'LPO'}
	trackingData={trackingQuery.data?.data || []}
/>

<!-- Cancel LPO Dialog -->
{#if lpoToCancel}
	<CancelLPODialog
		bind:open={showCancelDialog}
		lpoNumber={lpoToCancel.lpo_number}
		onConfirm={handleCancelConfirm}
		isSubmitting={cancelMutation.isPending}
	/>
{/if}
