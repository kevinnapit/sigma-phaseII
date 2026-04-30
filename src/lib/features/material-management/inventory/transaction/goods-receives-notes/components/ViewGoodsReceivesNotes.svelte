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
	import { toast } from 'svelte-sonner';
	import { useReadAllGRNs, useSubmitGRN } from '../hooks/useGoodsReceivesNotesQueries.svelte';
	import type { GRNItem } from '../types/goods-receives-notes.types';
	import { formatDate } from '$lib/shared/utils';
	import GRNActionsCells from './GRNActionsCells.svelte';
	import GRNItemsCell from './GRNItemsCell.svelte';
	import GRNItemsModal from './GRNItemsModal.svelte';
	import GRNStats from './GRNStats.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { GOODS_RECEIVES_NOTES_PERMISSIONS } from '../constants/goods-receives-notes-permissions';

	let searchName = $state('');
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });
	let filterValues = $state<Record<string, string>>({});

	// Modal state
	let showItemsModal = $state(false);
	let selectedGrnId = $state('');
	let selectedGrnNumber = $state('');
	let submittingGrnId = $state('');

	const submitMutation = useSubmitGRN();

	const statusLabelMap: Record<string, string> = {
		DRAFT: 'Belum Diajukan',
		PENDING_APPROVAL: 'Menunggu Persetujuan Askep/Tekniker I',
		APPROVED: 'Disetujui',
		REJECTED: 'Ditolak',
		CANCELLED: 'Dibatalkan'
	};

	function getStatusLabel(status: string): string {
		return statusLabelMap[status] ?? status;
	}

	function handleShowItems(grn: GRNItem) {
		selectedGrnId = grn.id;
		selectedGrnNumber = grn.grn_number;
		showItemsModal = true;
	}

	// URL params as single source of truth
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

	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updateUrlParams(1, pageSize);
			}
		}
	});

	const grnsQuery = useReadAllGRNs(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		approval_status: filterValues.approval_status || undefined
	}));

	const grns = $derived(grnsQuery.data?.data || []);
	const totalItems = $derived(grnsQuery.data?.pagination?.total_items || 0);
	const totalPages = $derived(grnsQuery.data?.pagination?.total_pages || 0);
	const isLoading = $derived(grnsQuery.isLoading);
	const isError = $derived(grnsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(grn: GRNItem) {
		goto(`/dashboard/material-management/inventory/transaction/goods-receives-notes/${grn.id}`);
	}

	async function handleSubmit(grn: GRNItem) {
		submittingGrnId = grn.id;
		try {
			await submitMutation.mutateAsync(grn.id);
			toast.success(`GRN ${grn.grn_number} berhasil diajukan untuk persetujuan`);
		} catch (error) {
			toast.error(
				`Gagal mengajukan GRN: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			submittingGrnId = '';
		}
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/goods-receives-notes/create');
	}

	const filterOptions = [
		{
			label: 'Status',
			value: 'approval_status',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'DRAFT', label: 'Belum Diajukan' },
				{ value: 'PENDING_APPROVAL', label: 'Menunggu Persetujuan Askep/Tekniker I' },
				{ value: 'APPROVED', label: 'Disetujui' },
				{ value: 'REJECTED', label: 'Ditolak' }
			]
		}
	];

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	const columns: ColumnDef<GRNItem>[] = [
		{
			accessorKey: 'grn_number',
			header: 'Nomor Penerimaan',
			enableSorting: false
		},
		// {
		// 	id: 'lpo_number',
		// 	header: 'No. LPO',
		// 	cell: () => '-'
		// },
		{
			accessorKey: 'date',
			header: 'Tanggal Penerimaan',
			cell: ({ row }) => (row.original.date ? formatDate(row.original.date) : '-'),
			enableSorting: false
		},
		{
			accessorKey: 'supplier_name',
			header: 'Vendor',
			enableSorting: false
		},
		{
			accessorKey: 'total_items',
			header: 'Jumlah Barang',
			cell: ({ row }) =>
				renderComponent(GRNItemsCell, {
					totalItems: row.original.total_items,
					onClick: () => handleShowItems(row.original)
				}),
			enableSorting: false
		},
		{
			accessorKey: 'gross_total',
			header: 'Total Nilai',
			cell: ({ row }) => formatCurrency(row.original.gross_total),
			enableSorting: false
		},
		{
			accessorKey: 'approval_status',
			header: 'Status',
			cell: ({ row }) => getStatusLabel(row.original.approval_status),
			enableSorting: false
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(GRNActionsCells, {
					grn: row.original,
					onViewDetail: handleViewDetail,
					onSubmit: handleSubmit,
					isSubmitting: submittingGrnId === row.original.id
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return grns;
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
			const newPagination =
				typeof updater === 'function' ? updater({ pageIndex: currentPage - 1, pageSize }) : updater;
			updateUrlParams(newPagination.pageIndex + 1, newPagination.pageSize);
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onColumnPinningChange: (updater) => {
			columnPinning = typeof updater === 'function' ? updater(columnPinning) : updater;
		},
		getRowId: (originalRow) => originalRow.id,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.VIEW}>
	<GRNStats />
</Guard>

<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Penerimaan Barang Lokal"
			description="Kelola penerimaan barang dari Local Purchase Order."
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search
					bind:value={searchName}
					placeholder="Cari nomor penerimaan..."
					debounce={500}
				/>
			{/snippet}
			{#snippet end()}
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				/>
				<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.CREATE}>
					<Button size="sm" onclick={handleCreateNew} class="hidden md:flex">
						<Plus class="mr-2 h-4 w-4" />
						Buat Penerimaan Barang
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.CREATE}>
			<div class="px-4 pb-3 md:hidden">
				<Button size="sm" onclick={handleCreateNew} class="w-full">
					<Plus class="mr-2 h-4 w-4" />
					Buat Penerimaan Barang
				</Button>
			</div>
		</Guard>
		<DataTable.Content {table} {isLoading} {isError} />
		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>

<GRNItemsModal bind:open={showItemsModal} grnId={selectedGrnId} grnNumber={selectedGrnNumber} />
