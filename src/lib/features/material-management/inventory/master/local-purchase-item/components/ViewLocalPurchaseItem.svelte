<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { RefreshCw } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		type ColumnDef,
		type PaginationState,
		type ColumnPinningState,
		getCoreRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Button } from '$lib/components/ui/button';
	import Guard from '$lib/components/shared/guard.svelte';
	import { useReadAllLocalPurchaseItems } from '../hooks/useLocalPurchaseItemQueries.svelte';
	import { useSyncFromSap, useAutoPublish } from '../hooks/useLocalPurchaseItemMutations.svelte';
	import type { LocalPurchaseItemData } from '../types/local-purchase-item.types';
	import { LOCAL_PURCHASE_ITEM_PERMISSIONS } from '../constants/local-purchase-item-permissions';
	import LocalPurchaseItemActionsCells from './LocalPurchaseItemActionsCells.svelte';

	let searchName = $state('');
	let debouncedSearch = $state('');
	let previousSearch = $state('');

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('limit')) || 10);

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

	const itemsQuery = useReadAllLocalPurchaseItems(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined
	}));

	const items = $derived(itemsQuery.data?.data ?? []);
	const totalCount = $derived(itemsQuery.data?.total_count ?? 0);
	const totalPages = $derived(Math.ceil(totalCount / pageSize));
	const isLoading = $derived(itemsQuery.isLoading);
	const isError = $derived(itemsQuery.isError);

	const pagination = $derived.by(
		() => ({ pageIndex: currentPage - 1, pageSize }) satisfies PaginationState
	);

	const sapSyncMutation = useSyncFromSap();
	const autoPublishMutation = useAutoPublish();
	const isSyncing = $derived(sapSyncMutation.isPending || autoPublishMutation.isPending);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('limit', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(item: LocalPurchaseItemData) {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/master/local-purchase-item/${item.uoid}${params ? `?${params}` : ''}`
		);
	}

	async function handleSync() {
		try {
			// Step 1 — tarik dari SAP ke staging, toast langsung saat selesai
			const sapResult = await sapSyncMutation.mutateAsync();
			const { total_fetched, total_inserted, total_updated, total_failed } = sapResult;
			toast.success(
				`Sinkronisasi SAP berhasil: ${total_fetched} diambil, ${total_inserted} ditambah, ${total_updated} diperbarui, ${total_failed} gagal`
			);

			// Step 2 — publish dari staging ke procurement source
			const publishResult = await autoPublishMutation.mutateAsync();
			const { total_processed, total_published, total_skipped } = publishResult;
			toast.success(
				`Publikasi ke pengadaan lokal berhasil: ${total_processed} diproses, ${total_published} dipublikasi, ${total_skipped} dilewati`
			);
		} catch (err: any) {
			toast.error(err?.message || 'Gagal melakukan sinkronisasi');
		}
	}

	let columnVisibility = $state<Record<string, boolean>>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	const columns: ColumnDef<LocalPurchaseItemData>[] = [
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
			accessorKey: 'decision',
			header: 'Keputusan',
			enableSorting: false,
			cell: ({ row }) => (row.original.decision === 'ALLOWED' ? 'Diizinkan' : row.original.decision)
		},
		{
			accessorKey: 'is_active',
			header: 'Status',
			enableSorting: false,
			cell: ({ row }) => (row.original.is_active ? 'Aktif' : 'Tidak Aktif')
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(LocalPurchaseItemActionsCells, {
					item: row.original,
					onViewDetail: handleViewDetail
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
			return totalCount;
		},
		get pageCount() {
			return totalPages;
		},
		getRowId: (row) => row.uoid,
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

<Guard permissions={LOCAL_PURCHASE_ITEM_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Barang Pembelian Lokal"
			description="Daftar barang yang diizinkan untuk pembelian lokal pada purchase request."
			class="md:mb-3"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search bind:value={searchName} placeholder="Cari barang..." debounce={500} />
			{/snippet}
			{#snippet end()}
				<Guard permissions={LOCAL_PURCHASE_ITEM_PERMISSIONS.SYNC}>
					<Button
						variant="outline"
						size="sm"
						onclick={handleSync}
						disabled={isSyncing}
						title="Sinkronkan data dari SAP"
					>
						<RefreshCw class="h-4 w-4 {isSyncing ? 'animate-spin' : ''}" />
						<span class="ml-1 hidden sm:inline">Sinkronisasi</span>
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<DataTable.Content {table} {isLoading} {isError} />
		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>
