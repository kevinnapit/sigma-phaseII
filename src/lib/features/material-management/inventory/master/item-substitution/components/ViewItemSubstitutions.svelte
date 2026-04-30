<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { type ColumnDef, type SortingState, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCw } from 'lucide-svelte';
	import { useReadAllItemSubstitutions } from '../hooks/useItemSubstitutionQueries.svelte';
	import type { ItemSubstitution } from '../types/item-substitution.types';
	import ItemSubstitutionActionsCells from './ItemSubstitutionActionsCells.svelte';

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

	const itemSubstitutionsQuery = useReadAllItemSubstitutions(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined
	}));

	const itemSubstitutions = $derived(itemSubstitutionsQuery.data?.data || []);
	const totalItems = $derived(itemSubstitutionsQuery.data?.pagination?.total_item || 0);
	const totalPages = $derived(itemSubstitutionsQuery.data?.pagination?.total_page || 0);
	const isLoading = $derived(itemSubstitutionsQuery.isLoading);
	const isError = $derived(itemSubstitutionsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', newPage.toString());
		url.searchParams.set('size', newSize.toString());
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(item: ItemSubstitution) {
		goto(
			`/dashboard/material-management/inventory/master/item-substitution/${item.id}`
		);
	}

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	const columns: ColumnDef<ItemSubstitution>[] = [
		{
			accessorKey: 'substitution_id',
			header: 'ID Substitusi',
			enableSorting: true
		},
		{
			accessorKey: 'description',
			header: 'Deskripsi',
			enableSorting: true
		},
		{
			accessorKey: 'status',
			header: 'Status'
		},
		{
			accessorKey: 'updated_at',
			header: 'Terakhir Diubah',
			cell: ({ row }) => formatDate(row.original.updated_at)
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(ItemSubstitutionActionsCells, {
					itemSubstitution: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return itemSubstitutions;
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
	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchName}
				placeholder="Cari kode material atau deskripsi..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button variant="outline" size="sm">
				<RefreshCw class="mr-2 h-4 w-4" />
				Sinkronisasi
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<DataTable.Content {table} {isLoading} {isError} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
