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
	import { useReadAllCentralVendors } from '../hooks/useVendorsCentralQueries.svelte';
	import type { CentralVendorItem } from '../types/vendor-central.types';
	import CentralVendorActionsCells from './CentralVendorActionsCells.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';

	let {
		searchName = $bindable(''),
		isActive = false
	}: {
		searchName?: string;
		isActive?: boolean;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('centralPage')) || 1);
	const pageLimit = $derived(Number(page.url.searchParams.get('centralLimit')) || 10);

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

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
				updateUrlParams(1, pageLimit);
			}
		}
	});

	const vendorsQuery = useReadAllCentralVendors(
		() => ({
			page: currentPage,
			limit: pageLimit,
			search: debouncedSearch || undefined
		}),
		() => isActive
	);

	const vendors = $derived(vendorsQuery.data?.data || []);
	const totalItems = $derived(vendorsQuery.data?.pagination?.total_items || 0);
	const totalPages = $derived(vendorsQuery.data?.pagination?.total_pages || 0);
	const isLoading = $derived(vendorsQuery.isLoading);
	const isError = $derived(vendorsQuery.isError);

	const pagination = $derived.by(() => {
		return {
			pageIndex: currentPage - 1,
			pageSize: pageLimit
		};
	});

	function updateUrlParams(newPage: number, newLimit: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('centralPage', String(newPage));
		params.set('centralLimit', String(newLimit));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(vendor: CentralVendorItem) {
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/master/vendor/central/${vendor.sap_vendor_code}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handleSendInvitation(vendor: CentralVendorItem) {
		console.log('Send invitation to vendor:', vendor);
		// TODO: Implement send invitation functionality
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageLimit);
	}

	function handlePageSizeChange(limit: number) {
		updateUrlParams(1, limit);
	}

	const columns: ColumnDef<CentralVendorItem>[] = [
		{
			accessorKey: 'vendor_code',
			header: 'Kode',
			enableSorting: false
		},
		{
			accessorKey: 'name1',
			header: 'Nama',
			enableSorting: false
		},
		{
			accessorKey: 'email',
			header: 'Email',
			enableSorting: false,
			cell: ({ row }) => row.original.email || '-'
		},
		{
			accessorKey: 'telf1',
			header: 'Telepon',
			enableSorting: false,
			cell: ({ row }) => row.original.telf1 || '-'
		},
		// {
		// 	id: 'invitation_status',
		// 	header: 'Status Registrasi',
		// 	enableSorting: false,
		// 	cell: () => 'Belum Diregistrasi'
		// },
		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(CentralVendorActionsCells, {
					vendor: row.original,
					onViewDetail: handleViewDetail,
					onSendInvitation: handleSendInvitation
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return vendors;
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
		get rowCount() {
			return totalItems;
		},
		get pageCount() {
			return totalPages;
		},
		getRowId: (originalRow) => originalRow.sap_vendor_code,
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
			if (newPagination.pageSize !== pageLimit) {
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

<Guard permissions={VENDOR_PERMISSIONS.VIEW}>
	<DataTable.Root>
		<DataTable.Header
			title="Master Data Vendor Pusat"
			description="Kelola data vendor pusat untuk kebutuhan material management."
			class="md:mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search
					bind:value={searchName}
					placeholder="Cari nama vendor..."
					debounce={500}
				/>
			{/snippet}
			{#snippet end()}
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>

		<DataTable.Content {table} {isLoading} {isError} />

		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</Guard>
