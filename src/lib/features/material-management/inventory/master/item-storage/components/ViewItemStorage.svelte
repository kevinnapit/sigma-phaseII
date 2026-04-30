<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { type ColumnDef, type SortingState, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Button } from '$lib/components/ui/button';
	import { useReadAllItemStorageAssignments } from '../hooks/useItemStorageQueries.svelte';
	import type { ItemStorageAssignment } from '../types/item-storage.types';
	import ItemStorageActionsCells from './ItemStorageActionsCells.svelte';

	let searchName = $state('');

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let sorting = $state<SortingState>([]);
	let debouncedSearch = $state('');

	$effect(() => {
		searchName;
		const timer = setTimeout(() => {
			debouncedSearch = searchName;
		}, 500);
		return () => clearTimeout(timer);
	});

	const assignmentsQuery = useReadAllItemStorageAssignments(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined
	}));

	const assignments = $derived(assignmentsQuery.data?.data || []);
	const totalItems = $derived(assignmentsQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(assignmentsQuery.data?.pagination?.total_page || 0);
	const isLoading = $derived(assignmentsQuery.isLoading);
	const isError = $derived(assignmentsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', newPage.toString());
		url.searchParams.set('size', newSize.toString());
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(assignment: ItemStorageAssignment) {
		goto(
			`/dashboard/material-management/inventory/master/item-storage/${assignment.id}`
		);
	}

	function handleAddAssignment() {
		goto('/dashboard/material-management/inventory/master/item-storage/create');
	}

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(new Date(dateString));
	}

	const columns: ColumnDef<ItemStorageAssignment>[] = [
		{
			accessorKey: 'assignment_number',
			header: 'No. Penugasan',
			enableSorting: true
		},
		{
			accessorKey: 'rack_name',
			header: 'Nama Rak',
			enableSorting: false
		},
		{
			accessorKey: 'cell_code',
			header: 'Cell',
			enableSorting: false
		},
		{
			accessorKey: 'cell_name',
			header: 'Nama Cell',
			enableSorting: false
		},
		{
			id: 'items_count',
			header: 'Jumlah Barang',
			cell: ({ row }) => `${row.original.items?.length ?? 0} barang`
		},
		{
			accessorKey: 'item_group_name',
			header: 'Grup Barang',
			enableSorting: false
		},
		{
			accessorKey: 'assigned_by',
			header: 'Ditugaskan Oleh',
			enableSorting: false
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(ItemStorageActionsCells, {
					assignment: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return assignments;
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
</script>

<DataTable.Root>
	<DataTable.Header
		title="Penyimpanan Barang"
		description="Kelola penugasan penyimpanan barang ke cell/rak di gudang."
		class="md:mb-4"
	/>
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchName}
				placeholder="Cari penugasan penyimpanan..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button
				onclick={handleAddAssignment}
				class="hidden gap-2 bg-[#0f4c2a] hover:bg-[#0d4023] md:flex"
			>
				<Plus class="h-4 w-4" />
				Tambah Penugasan
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleAddAssignment} class="w-full gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
			<Plus class="h-4 w-4" />
			Tambah Penugasan
		</Button>
	</div>

	<DataTable.Content {table} {isLoading} {isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
