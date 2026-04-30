<script lang="ts">
	import { Plus } from 'lucide-svelte';
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
	import { useReadAllLocalVendors } from '../hooks/useVendorsLocalQueries.svelte';
	import type { LocalVendorItem } from '../types/vendor-local.types';
	import DeleteLocalVendorDialog from './DeleteLocalVendorDialog.svelte';
	import CreateVendorLocalForm from './CreateVendorLocalForm.svelte';
	import VendorActionsCells from './VendorActionsCells.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { PARTY_TYPE_ID } from '../constants/vendor-types';
	import Guard from '$lib/components/shared/guard.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';

	let {
		searchName = $bindable(''),
		filterValues = $bindable({}),
		isActive = false
	}: {
		searchName?: string;
		filterValues?: Record<string, string>;
		isActive?: boolean;
	} = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('localPage')) || 1);
	const pageLimit = $derived(Number(page.url.searchParams.get('localLimit')) || 10);

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({ left: [], right: ['actions'] });

	let debouncedSearch = $state('');
	let previousSearch = $state('');

	let deleteDialogOpen = $state(false);
	let createDialogOpen = $state(false);
	let selectedVendor = $state<LocalVendorItem | null>(null);

	// Party type filter options
	const partyTypesQuery = useMasterTypeByNameQuery(() => ({
		name: PARTY_TYPE_ID
	}));

	const partyTypeOptions = $derived([
		{ value: '', label: 'Semua' },
		...(partyTypesQuery.data?.values?.map((t: any) => ({ value: t.id, label: t.value })) ?? [])
	]);

	const filterOptions = $derived([
		{
			label: 'Status Aktif',
			value: 'is_active',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'true', label: 'Aktif' },
				{ value: 'false', label: 'Tidak Aktif' }
			]
		},
		{
			label: 'Tipe Pihak',
			value: 'party_type_id',
			options: partyTypeOptions
		},
		{
			label: 'Status Registrasi',
			value: 'vendor_registration_status',
			options: [
				{ value: '', label: 'Semua' },
				{ value: 'active', label: 'Aktif' },
				{ value: 'pending', label: 'Belum Diregistrasi' },
				{ value: 'sent', label: 'Sudah Diregistrasi' },
				{ value: 'suspended', label: 'Ditangguhkan' },
				{ value: 'expired', label: 'Kedaluwarsa' }
			]
		}
		// {
		// 	label: 'Pengguna Vendor',
		// 	value: 'has_vendor_user',
		// 	options: [
		// 		{ value: '', label: 'Semua' },
		// 		{ value: 'true', label: 'Memiliki Pengguna' },
		// 		{ value: 'false', label: 'Belum Memiliki Pengguna' }
		// 	]
		// }
	]);

	const sortingParams = $derived.by(() => {
		if (sorting.length === 0) return { order_by: undefined, order_direction: undefined };

		const firstSort = sorting[0];
		const columnId = firstSort.id;

		if (columnId !== 'code' && columnId !== 'name') {
			return { order_by: undefined, order_direction: undefined };
		}

		return {
			order_by: columnId as 'code' | 'name',
			order_direction: firstSort.desc ? ('desc' as const) : ('asc' as const)
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
				updateUrlParams(1, pageLimit);
			}
		}
	});

	const vendorsQuery = useReadAllLocalVendors(
		() => ({
			page: currentPage,
			limit: pageLimit,
			search: debouncedSearch || undefined,
			party_type_id: filterValues.party_type_id || undefined,
			vendor_registration_status: (filterValues.vendor_registration_status as any) || undefined,
			has_vendor_user:
				filterValues.has_vendor_user !== '' && filterValues.has_vendor_user !== undefined
					? filterValues.has_vendor_user === 'true'
					: undefined,
			is_active:
				filterValues.is_active !== '' && filterValues.is_active !== undefined
					? filterValues.is_active === 'true'
					: undefined,
			order_by: sortingParams.order_by,
			order_direction: sortingParams.order_direction
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
		params.set('localPage', String(newPage));
		params.set('localLimit', String(newLimit));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(vendor: LocalVendorItem) {
		const params = page.url.searchParams.toString();
		const detailUrl = `/dashboard/material-management/inventory/master/vendor/local/${vendor.uoid}${params ? `?${params}` : ''}`;
		goto(detailUrl);
	}

	function handleDelete(vendor: LocalVendorItem) {
		selectedVendor = vendor;
		deleteDialogOpen = true;
	}

	function handleAddVendor() {
		createDialogOpen = true;
	}

	function handlePageChange(page: number) {
		updateUrlParams(page, pageLimit);
	}

	function handlePageSizeChange(limit: number) {
		updateUrlParams(1, limit);
	}

	function handleFilterApply(filters: Record<string, string>) {
		filterValues = filters;
		if (currentPage !== 1) updateUrlParams(1, pageLimit);
	}

	const columns: ColumnDef<LocalVendorItem>[] = [
		{
			accessorKey: 'code',
			header: 'Kode',
			enableSorting: true
		},
		{
			accessorKey: 'name',
			header: 'Nama',
			enableSorting: true
		},
		{
			accessorKey: 'party_default_category',
			header: 'Tipe Pihak',
			enableSorting: false,
			cell: ({ row }) => row.original.party_default_category?.value || '-'
		},
		// {
		// 	accessorKey: 'email',
		// 	header: 'Email',
		// 	enableSorting: false,
		// 	cell: ({ row }) => row.original.addresses?.[0]?.email || '-'
		// },
		// {
		// 	accessorKey: 'phone',
		// 	header: 'Telepon',
		// 	enableSorting: false,
		// 	cell: ({ row }) =>
		// 		row.original.addresses?.[0]?.tel || row.original.addresses?.[0]?.mobile || '-'
		// },
		{
			accessorKey: 'is_active',
			header: 'Status Aktif',
			enableSorting: false,
			cell: ({ getValue }) => {
				const status = getValue() as boolean;
				return status ? 'Aktif' : 'Tidak Aktif';
			}
		},
		{
			accessorKey: 'vendor_user',
			header: 'Status Registrasi',
			enableSorting: false,
			cell: ({ row }) => {
				const vendorUser = row.original.vendor_user;
				// Updated logic: if registration_status exists (regardless of value), show as registered
				if (vendorUser?.registration_status) {
					return 'Sudah Diregistrasi';
				}
				return 'Belum Diregistrasi';
			}
		},

		{
			id: 'actions',
			header: 'Aksi',
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(VendorActionsCells, {
					vendor: row.original,
					onViewDetail: handleViewDetail,
					onDelete: handleDelete
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
			title="Master Data Vendor Lokal"
			description="Kelola data vendor lokal untuk kebutuhan material management."
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
				<DataTable.Filter
					filters={filterOptions}
					bind:values={filterValues}
					onApply={handleFilterApply}
				/>
				<Guard permissions={VENDOR_PERMISSIONS.CREATE}>
					<Button
						onclick={handleAddVendor}
						class="hidden gap-2 bg-[#0f4c2a] hover:bg-[#0d4023] md:flex"
					>
						<Plus class="h-4 w-4" />
						Tambah Vendor
					</Button>
				</Guard>
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<Guard permissions={VENDOR_PERMISSIONS.CREATE}>
			<div class="px-4 pb-3 md:hidden">
				<Button onclick={handleAddVendor} class="w-full gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
					<Plus class="h-4 w-4" />
					Tambah Vendor
				</Button>
			</div>
		</Guard>

		<DataTable.Content {table} {isLoading} {isError} />

		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>

	<DeleteLocalVendorDialog bind:open={deleteDialogOpen} vendor={selectedVendor} />
	<CreateVendorLocalForm bind:open={createDialogOpen} />
</Guard>
