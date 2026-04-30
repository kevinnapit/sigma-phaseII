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
	import { useReadAllItems } from '../hooks/useItemQueries.svelte';
	import type { ItemComprehensiveData, ItemData } from '../types/item.types';
	import ItemActionsCells from './ItemActionsCells.svelte';
	import SubstituteCountCell from './SubstituteCountCell.svelte';
	import ConversionCountCell from './ConversionCountCell.svelte';
	import SubstitutesListModal from './SubstitutesListModal.svelte';
	import ConversionsListModal from './ConversionsListModal.svelte';
	import { useReadAllItemGroups } from '../../item-group/hooks/useItemGroupQueries.svelte';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ITEM_PERMISSIONS } from '../constants/item-permissions';
	import type { ItemGroupItem } from '../../item-group/types/item-group.types';
	import { Search, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import ItemCodeRequestDialog from '$lib/features/material-management/inventory/transaction/purchase-request/components/ItemCodeRequestDialog.svelte';

	let {
		searchName = $bindable(''),
		filterValues = $bindable({})
	}: {
		searchName?: string;
		filterValues?: Record<string, string>;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	let debouncedSearch = $state('');
	let previousSearch = $state('');

	// Modal states
	let showSubstitutesModal = $state(false);
	let showConversionsModal = $state(false);
	let showItemCodeRequestDialog = $state(false);
	let selectedItemId = $state('');
	let selectedItemCode = $state('');
	let selectedItemName = $state('');

	// Item group (item_class_id) filter with server-side search
	let itemGroupSearch = $state('');
	let selectedItemGroupId = $state(filterValues.item_class_id ?? '');

	// Keep filterValues.item_class_id in sync with selectedItemGroupId
	$effect(() => {
		filterValues.item_class_id = selectedItemGroupId;
	});

	const itemGroupsQuery = useReadAllItemGroups(() => ({
		page: 1,
		size: 50,
		search: itemGroupSearch || undefined
	}));

	// Map item groups to { uoid, name } where name shows the code for display
	const itemGroupOptions = $derived(
		(itemGroupsQuery.data?.data ?? []).map((g: ItemGroupItem) => ({
			uoid: g.uoid,
			name: g.code,
			fullName: g.name
		}))
	);

	const filterOptions = [
		{
			label: 'Status Aktif',
			value: 'is_active',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Aktif' },
				{ value: 'false', label: 'Diarsipkan' }
			]
		},
		{
			label: 'Barang Kritikal',
			value: 'is_critical',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Kritikal' },
				{ value: 'false', label: 'Tidak Kritikal' }
			]
		},
		{
			label: 'Tanggal Kedaluwarsa',
			value: 'has_expiry',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Memerlukan Kedaluwarsa' },
				{ value: 'false', label: 'Tidak Memerlukan' }
			]
		},
		{
			label: 'Status Pergerakan',
			value: 'movement_status',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'FAST', label: 'Fast Moving' },
				{ value: 'SLOW', label: 'Slow Moving' },
				{ value: 'NO_DATA', label: 'Tidak Ada Data' }
			]
		},
		// {
		// 	label: 'Non-Stok',
		// 	value: 'is_non_stock',
		// 	options: [
		// 		{ value: '', label: 'Semua' },
		// 		{ value: 'true', label: 'Non-Stok' },
		// 		{ value: 'false', label: 'Stok' }
		// 	]
		// },
		{
			label: 'Konversi',
			value: 'has_conversion',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Memiliki Konversi' },
				{ value: 'false', label: 'Tidak Ada Konversi' }
			]
		}
	];

	const sortingParams = $derived.by(() => {
		if (sorting.length === 0) return { order_by: undefined, sort: undefined };

		const firstSort = sorting[0];
		const columnId = firstSort.id;

		if (columnId !== 'code' && columnId !== 'name') {
			return { order_by: undefined, sort: undefined };
		}

		return {
			order_by: columnId as 'code' | 'name',
			sort: firstSort.desc ? ('desc' as const) : ('asc' as const)
		};
	});

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

	const itemsQuery = useReadAllItems(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined,
		item_class_id: selectedItemGroupId || undefined,
		is_active:
			filterValues.is_active !== '' && filterValues.is_active !== undefined
				? filterValues.is_active === 'true'
				: undefined,
		is_critical:
			filterValues.is_critical !== '' && filterValues.is_critical !== undefined
				? filterValues.is_critical === 'true'
				: undefined,
		has_expiry:
			filterValues.has_expiry !== '' && filterValues.has_expiry !== undefined
				? filterValues.has_expiry === 'true'
				: undefined,
		movement_status: filterValues.movement_status || undefined,
		is_non_stock:
			filterValues.is_non_stock !== '' && filterValues.is_non_stock !== undefined
				? filterValues.is_non_stock === 'true'
				: undefined,
		has_conversion:
			filterValues.has_conversion !== '' && filterValues.has_conversion !== undefined
				? filterValues.has_conversion === 'true'
				: undefined,
		order_by: sortingParams.order_by,
		sort: sortingParams.sort
	}));

	const items = $derived(itemsQuery.data?.data || []);
	const totalItems = $derived(itemsQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(itemsQuery.data?.pagination?.total_page || 0);
	const isLoading = $derived(itemsQuery.isLoading);
	const isError = $derived(itemsQuery.isError);

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

	function handleViewDetail(item: ItemComprehensiveData | ItemData) {
		const itemId = 'uoid' in item ? item.uoid : '';
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/master/item/${itemId}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageSize);
	}

	function handlePageSizeChange(size: number) {
		updateUrlParams(1, size);
	}

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		selectedItemGroupId = filters.item_class_id ?? '';
		if (currentPage !== 1) updateUrlParams(1, pageSize);
	}

	function handleShowSubstitutes(item: ItemComprehensiveData) {
		selectedItemId = item.uoid;
		selectedItemCode = item.code;
		selectedItemName = item.name;
		showSubstitutesModal = true;
	}

	function handleShowConversions(item: ItemComprehensiveData) {
		selectedItemId = item.uoid;
		selectedItemCode = item.code;
		selectedItemName = item.name;
		showConversionsModal = true;
	}

	const columns: ColumnDef<ItemComprehensiveData>[] = [
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: true,
			cell: ({ row }) => row.original.code
		},
		{
			accessorKey: 'name',
			header: 'Nama',
			enableSorting: true,
			cell: ({ row }) => row.original.name
		},
		{
			accessorKey: 'item_class',
			header: 'Grup Barang',
			enableSorting: false,
			cell: ({ row }) => {
				const itemClass = row.original.item_class;
				return itemClass ? `${itemClass.code} - ${itemClass.name}` : '-';
			}
		},
		{
			accessorKey: 'base_uom.code',
			header: 'Satuan Dasar',
			enableSorting: false,
			cell: ({ row }) => row.original.base_uom?.code || '-'
		},
		{
			id: 'conversion_uom',
			header: 'Jumlah Konversi',
			enableSorting: false,
			cell: ({ row }) =>
				renderComponent(ConversionCountCell, {
					count: row.original.conversion_uom_count || 0,
					onClick: () => handleShowConversions(row.original)
				})
		},
		{
			accessorKey: 'substitute_item_count',
			header: 'Jumlah Substitusi',
			enableSorting: false,
			cell: ({ row }) =>
				renderComponent(SubstituteCountCell, {
					count: row.original.substitute_item_count ?? 0,
					onClick: () => handleShowSubstitutes(row.original)
				})
		},
		{
			accessorKey: 'item_vrl.is_batch_required',
			header: 'Batch',
			enableSorting: false,
			cell: ({ row }) => (row.original.item_vrl?.is_batch_required ? 'Iya' : 'Tidak')
		},
		{
			id: 'critical',
			header: 'Barang Kritikal',
			enableSorting: false,
			cell: ({ row }) => (row.original.critical_item?.is_critical ? 'Iya' : 'Tidak')
		},
		{
			accessorKey: 'movement_status',
			header: 'Status Pergerakan',
			enableSorting: false,
			cell: ({ row }) => {
				const status = row.original.movement_status;
				if (status === 'FAST') return 'Fast';
				if (status === 'SLOW') return 'Slow';
				if (status === 'NO_DATA') return 'Tidak Ada Data';
				return '-';
			}
		},
		{
			id: 'last_transaction',
			header: 'Transaksi Terakhir',
			enableSorting: false,
			cell: ({ row }) => {
				const issueDate = row.original.last_transaction?.transaction_date;
				if (!issueDate) return '-';
				return new Date(issueDate).toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				});
			}
		},
		{
			id: 'transaction_duration',
			header: 'Durasi Transaksi',
			enableSorting: false,
			cell: ({ row }) => {
				const days = row.original.last_transaction?.days_since_transaction;
				if (days == null) return '-';
				return `${days} hari`;
			}
		},
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(ItemActionsCells, {
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
		getRowId: (originalRow) => originalRow.uoid,
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

<Guard permissions={ITEM_PERMISSIONS.BARANG_VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Master Data Barang"
			description="Kelola data master barang untuk inventaris."
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search
					bind:value={searchName}
					placeholder="Cari nama barang..."
					debounce={500}
				/>
			{/snippet}
			{#snippet end()}
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				>
					{#snippet children()}
						<div class="space-y-2">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="mb-1 text-sm leading-none font-medium">Grup Barang</label>
							<SearchableCombobox
								bind:value={selectedItemGroupId}
								items={itemGroupOptions}
								isLoading={itemGroupsQuery.isLoading}
								onSearchChange={(s) => (itemGroupSearch = s)}
								placeholder="Semua grup barang..."
								searchPlaceholder="Cari kode grup..."
								renderSubtitle={(item) => (item as any).fullName}
								subtitleMaxLength={30}
							/>
						</div>
					{/snippet}
				</DataTable.Filter>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>

		{#if isLoading}
			<DataTable.Content {table} {isLoading} {isError} />
		{:else if isError}
			<DataTable.Content {table} {isLoading} {isError} />
		{:else if items.length === 0}
			<!-- Custom Empty State with Item Code Request Button -->
			<div class="rounded-md border">
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Search class="h-16 w-16 text-muted-foreground/30" />
					<p class="mt-4 text-sm font-medium text-muted-foreground">
						{#if debouncedSearch}
							Tidak ada barang ditemukan untuk "{debouncedSearch}"
						{:else}
							Belum ada data barang
						{/if}
					</p>
					<p class="mt-1 text-xs text-muted-foreground">
						{#if debouncedSearch}
							Coba kata kunci lain atau ajukan permintaan kode barang baru
						{:else}
							Mulai dengan menambahkan barang baru
						{/if}
					</p>
					<Button variant="outline" size="sm" class="mt-4" onclick={() => (showItemCodeRequestDialog = true)}>
						<Plus class="mr-2 h-4 w-4" />
						Permintaan Kode Barang
					</Button>
				</div>
			</div>
		{:else}
			<DataTable.Content {table} {isLoading} {isError} />
		{/if}

		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>

<!-- Substitutes List Modal -->
<SubstitutesListModal
	bind:open={showSubstitutesModal}
	itemId={selectedItemId}
	itemCode={selectedItemCode}
	itemName={selectedItemName}
/>

<!-- Conversions List Modal -->
<ConversionsListModal
	bind:open={showConversionsModal}
	itemId={selectedItemId}
	itemCode={selectedItemCode}
	itemName={selectedItemName}
/>

<!-- Item Code Request Dialog -->
<ItemCodeRequestDialog bind:open={showItemCodeRequestDialog} />
