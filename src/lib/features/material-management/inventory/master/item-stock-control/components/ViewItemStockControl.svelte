<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Plus, RefreshCw } from 'lucide-svelte';
	import { type ColumnDef, type PaginationState, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { useReadAllStockControls } from '../hooks/useItemStockControlQueries.svelte';
	import { useDeactivateStockControl } from '../hooks/useItemStockControlMutations.svelte';
	import { useRefreshStockControlUsage } from '../hooks/useItemStockControlMutations.svelte';
	import type {
		ItemUsageWithRequest,
		CreateStockControlPayload
	} from '../types/item-stock-control.types';
	import { getApprovalStatusLabel } from '../types/item-stock-control.types';
	import ItemStockControlActionsCells from './ItemStockControlActionsCells.svelte';
	import CreateStockControlModal from './CreateStockControlModal.svelte';
	import CreateSuccessModal from './CreateSuccessModal.svelte';
	import { toast } from 'svelte-sonner';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ITEM_STOCK_CONTROL_PERMISSIONS } from '../constants/item-stock-control-permissions';

	interface Props {
		searchName?: string;
		filterValues?: Record<string, string>;
		onCreateRequest?: (
			payload: CreateStockControlPayload
		) => Promise<{ request_id: string; item_code: string; item_name: string }>;
		onSubmitRequest?: (requestId: string) => Promise<void>;
		isCreating?: boolean;
		submittingIds?: Set<string>;
	}

	let {
		searchName = $bindable(''),
		filterValues = $bindable({}),
		onCreateRequest,
		onSubmitRequest,
		isCreating = false,
		submittingIds = new Set()
	}: Props = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('limit')) || 10);

	let debouncedSearch = $state('');
	let previousSearch = $state('');
	let columnVisibility = $state<Record<string, boolean>>({});
	let columnPinning = $state<{ left?: string[]; right?: string[] }>({
		left: [],
		right: ['actions']
	});

	// Create modal state
	let createModalOpen = $state(false);
	let selectedSourceRow = $state<ItemUsageWithRequest | null>(null);

	// Success modal state
	let successModalOpen = $state(false);
	let createdRequest = $state<{ request_id: string; item_code: string; item_name: string } | null>(
		null
	);

	// Deactivate dialog state
	const deactivateMutation = useDeactivateStockControl();
	const refreshMutation = useRefreshStockControlUsage();
	let deactivateDialogOpen = $state(false);
	let deactivateReason = $state('');
	let deactivateTarget = $state<ItemUsageWithRequest | null>(null);

	const pagination = $derived.by(
		() => ({ pageIndex: currentPage - 1, pageSize }) satisfies PaginationState
	);

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
			if (currentPage !== 1) updateUrlParams(1, pageSize);
		}
	});

	const filterOptions = [
		{
			label: 'Status Persetujuan',
			value: 'approval_status',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'NO_REQUEST', label: 'Belum Dibuat' },
				{ value: 'DRAFT', label: 'Belum Diajukan' },
				{ value: 'PENDING_APPROVAL_LEVEL_1', label: 'Menunggu Persetujuan Manajer' },
				{ value: 'PENDING_APPROVAL_LEVEL_2', label: 'Menunggu Persetujuan Staff HO' },
				{ value: 'APPROVED', label: 'Disetujui' },
				{ value: 'REJECTED', label: 'Ditolak' },
				{ value: 'NONACTIVE', label: 'Tidak Aktif' }
			]
		},
		{
			label: 'Departemen',
			value: 'department_code',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'agriculture', label: 'Agriculture' },
				{ value: 'finance', label: 'Finance' },
				{ value: 'general', label: 'General' },
				{ value: 'it', label: 'IT' },
				{ value: 'purchase', label: 'Purchase' },
				{ value: 'sales', label: 'Sales' },
				{ value: 'technic', label: 'Technic' }
			]
		}
	];

	const stockControlsQuery = useReadAllStockControls(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined,
		approval_status: (filterValues.approval_status as any) || undefined,
		department_code: filterValues.department_code || undefined
	}));

	const items = $derived(stockControlsQuery.data?.data ?? []);
	const totalItems = $derived(stockControlsQuery.data?.paging?.total_item ?? 0);
	const totalPages = $derived(stockControlsQuery.data?.paging?.total_page ?? 0);
	const isLoading = $derived(stockControlsQuery.isLoading);
	const isError = $derived(stockControlsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('limit', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	function handleViewDetail(item: ItemUsageWithRequest) {
		const id = item.latest_request_id || item.item_id;
		goto(`/dashboard/material-management/inventory/master/item-stock-control/detail/${id}`);
	}

	function handleOpenCreateFromRow(item: ItemUsageWithRequest) {
		selectedSourceRow = item;
		createModalOpen = true;
	}

	function handleOpenCreateManual() {
		selectedSourceRow = null;
		createModalOpen = true;
	}

	async function handleModalSubmit(payload: CreateStockControlPayload) {
		if (!onCreateRequest) return;
		const result = await onCreateRequest(payload);
		createdRequest = result;
		createModalOpen = false;
		successModalOpen = true;
	}

	async function handleSubmitFromCell(item: ItemUsageWithRequest) {
		if (!onSubmitRequest || !item.latest_request_id) return;
		await onSubmitRequest(item.latest_request_id);
	}

	function handleBackToList() {
		successModalOpen = false;
		createdRequest = null;
	}

	function handleOpenDeactivate(item: ItemUsageWithRequest) {
		deactivateTarget = item;
		deactivateReason = '';
		deactivateDialogOpen = true;
	}

	async function handleRefreshUsage() {
		try {
			await refreshMutation.mutateAsync();
			toast.success('Data pemakaian berhasil disinkronkan');
		} catch (err: any) {
			toast.error(err?.message || 'Gagal menyinkronkan data pemakaian');
		}
	}

	async function handleConfirmDeactivate() {
		if (!deactivateTarget?.latest_request_id || !deactivateReason.trim()) return;
		try {
			await deactivateMutation.mutateAsync({
				requestId: deactivateTarget.latest_request_id,
				reason: deactivateReason.trim()
			});
			toast.success('Kontrol stok berhasil dinonaktifkan');
			deactivateDialogOpen = false;
			deactivateTarget = null;
			deactivateReason = '';
		} catch (err: any) {
			toast.error(err?.message || 'Gagal menonaktifkan kontrol stok');
		}
	}

	const columns: ColumnDef<ItemUsageWithRequest>[] = [
		{
			accessorKey: 'item_code',
			header: 'Kode Barang',
			enableSorting: false
		},
		{
			accessorKey: 'item_name',
			header: 'Nama Barang',
			enableSorting: false
		},
		{
			accessorKey: 'total_usage',
			header: 'Referensi Sistem',
			enableSorting: false,
			cell: ({ row }) => {
				const totalUsage = row.original.total_usage;

				if (!totalUsage) return '-';

				const uom = row.original.item_uom || '';
				const value = parseFloat(totalUsage);
				const displayValue = !isNaN(value) ? value.toFixed(0) : '0';

				return uom ? `${displayValue} ${uom}` : displayValue;
			}
		},
		{
			accessorKey: 'approved_min_stock',
			header: 'Stok Min. Disetujui',
			enableSorting: false,
			cell: ({ row }) => {
				const approved = row.original.approved_min_stock;
				if (!approved) return '-';
				const uom = row.original.item_uom || '';
				const value = parseFloat(approved);
				const displayValue = !isNaN(value) ? value.toFixed(0) : '0';
				return uom ? `${displayValue} ${uom}` : displayValue;
			}
		},
		{
			accessorKey: 'item_class',
			header: 'Grup Barang',
			enableSorting: false,
			cell: ({ row }) => {
				const { item_class_code, item_class_name } = row.original;
				if (!item_class_code && !item_class_name) return '-';
				if (!item_class_code) return item_class_name;
				if (!item_class_name) return item_class_code;
				return `${item_class_code} - ${item_class_name}`;
			}
		},
		{
			accessorKey: 'department_code',
			header: 'Departemen',
			enableSorting: false,
			cell: ({ row }) => row.original.department_code
		},
		{
			accessorKey: 'approval_status',
			header: 'Status Persetujuan',
			enableSorting: false,
			cell: ({ row }) => {
				const { latest_request_status, approval_status } = row.original;
				if (latest_request_status === 'NONACTIVE') return 'Tidak Aktif';
				if (latest_request_status === 'APPROVED') return 'Disetujui';
				const statusToShow = latest_request_status || approval_status;
				return getApprovalStatusLabel(statusToShow);
			}
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(ItemStockControlActionsCells, {
					item: row.original,
					onViewDetail: handleViewDetail,
					onCreateRequest: handleOpenCreateFromRow,
					onSubmit: handleSubmitFromCell,
					onDeactivate: handleOpenDeactivate,
					isSubmitting: submittingIds.has(row.original.latest_request_id)
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return items;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnPinning() {
				return columnPinning;
			}
		},
		manualPagination: true,
		get rowCount() {
			return totalItems;
		},
		get pageCount() {
			return totalPages;
		},
		getRowId: (row) => row.item_id,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater) => {
			const next = typeof updater === 'function' ? updater(pagination) : updater;
			if (next.pageIndex !== currentPage - 1) updateUrlParams(next.pageIndex + 1, pageSize);
			if (next.pageSize !== pageSize) updateUrlParams(1, next.pageSize);
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onColumnPinningChange: (updater) => {
			columnPinning = typeof updater === 'function' ? updater(columnPinning) : updater;
		}
	});
</script>

<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Master Kontrol Stok Barang"
			description="Kelola kontrol stok barang untuk manajemen material dan inventory."
			class="md:mb-3"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search bind:value={searchName} placeholder="Cari barang..." debounce={500} />
			{/snippet}
			{#snippet end()}
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				/>
				<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.CREATE}>
					<Button
						variant="outline"
						size="sm"
						onclick={handleRefreshUsage}
						disabled={refreshMutation.isPending}
						title="Sinkronkan data pemakaian"
					>
						<RefreshCw class="h-4 w-4 {refreshMutation.isPending ? 'animate-spin' : ''}" />
						<span class="ml-1 hidden sm:inline">Sinkronisasi</span>
					</Button>
				</Guard>
				<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.CREATE}>
					<Button
						size="sm"
						onclick={handleOpenCreateManual}
						disabled={isCreating}
						class="hidden md:flex"
					>
						<Plus class="mr-1 h-4 w-4" />
						Tambah
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.CREATE}>
			<div class="px-4 pb-3 md:hidden">
				<Button size="sm" onclick={handleOpenCreateManual} disabled={isCreating} class="w-full">
					<Plus class="mr-1 h-4 w-4" />
					Tambah
				</Button>
			</div>
		</Guard>
		<DataTable.Content {table} {isLoading} {isError} />
		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>

<CreateStockControlModal
	bind:open={createModalOpen}
	sourceRow={selectedSourceRow}
	onSubmit={handleModalSubmit}
	isSubmitting={isCreating}
/>

<CreateSuccessModal bind:open={successModalOpen} {createdRequest} onBackToList={handleBackToList} />

<AlertDialog.Root bind:open={deactivateDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Nonaktifkan Kontrol Stok</AlertDialog.Title>
			<AlertDialog.Description>
				Nonaktifkan kontrol stok untuk <strong
					>{deactivateTarget?.item_code} - {deactivateTarget?.item_name}</strong
				>. Masukkan alasan penonaktifan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2 py-2">
			<Label for="deactivate-reason-list">Alasan *</Label>
			<Textarea
				id="deactivate-reason-list"
				bind:value={deactivateReason}
				placeholder="Masukkan alasan penonaktifan..."
				class="min-h-[100px]"
				disabled={deactivateMutation.isPending}
			/>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				disabled={deactivateMutation.isPending}
				onclick={() => {
					deactivateReason = '';
					deactivateTarget = null;
				}}
			>
				Batal
			</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleConfirmDeactivate}
				disabled={deactivateMutation.isPending || !deactivateReason.trim()}
				class="bg-destructive hover:bg-destructive/90"
			>
				Nonaktifkan
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
