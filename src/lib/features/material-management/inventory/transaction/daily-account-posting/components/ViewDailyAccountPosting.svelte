<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import { getMockDailyAccountPostings } from '../api/daily-account-posting.mock';
	import DailyAccountPostingActionsCells from './DailyAccountPostingActionsCells.svelte';
	import type { DailyAccountPostingHeader } from '../types/daily-account-posting.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	// State
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let postings = $state<DailyAccountPostingHeader[]>([]);
	let totalItems = $state(0);
	let totalPages = $state(0);
	let isLoading = $state(true);

	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Load data
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			const result = getMockDailyAccountPostings(
				currentPage,
				pageSize,
				debouncedSearch || undefined
			);
			postings = result.data;
			totalItems = result.pagination.total_item;
			totalPages = result.pagination.total_page;
			isLoading = false;
		}, 300);
	});

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	// Define columns
	const columns: ColumnDef<DailyAccountPostingHeader>[] = [
		{
			accessorKey: 'posting_number',
			header: 'No. Posting',
			enableSorting: false
		},
		{
			accessorKey: 'administrative_unit',
			header: 'Unit Administratif',
			enableSorting: false
		},
		{
			accessorKey: 'process_date',
			header: 'Tanggal Proses',
			cell: ({ row }) => formatDate(row.original.process_date)
		},
		{
			accessorKey: 'total_items',
			header: 'Total Item',
			cell: ({ row }) => `${row.original.total_items} item`
		},
		{
			accessorKey: 'total_debit',
			header: 'Total Debit',
			cell: ({ row }) => formatCurrency(row.original.total_debit)
		},
		{
			accessorKey: 'total_credit',
			header: 'Total Kredit',
			cell: ({ row }) => formatCurrency(row.original.total_credit)
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(DailyAccountPostingActionsCells, {
					posting: row.original,
					onViewDetail: handleViewDetail
				})
		}
	];

	// Create table instance
	const table = createSvelteTable({
		get data() {
			return postings;
		},
		columns,
		state: {
			get pagination() {
				return {
					pageIndex: currentPage - 1,
					pageSize: pageSize
				};
			}
		},
		manualPagination: true,
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
		}
	});

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', newPage.toString());
		params.set('size', newSize.toString());
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleViewDetail(posting: DailyAccountPostingHeader) {
		goto(
			`/dashboard/material-management/inventory/transaction/daily-account-posting/${posting.id}`
		);
	}

	function handleCreateNew() {
		goto('/dashboard/material-management/inventory/transaction/daily-account-posting/create');
	}
</script>

<DataTable.Root>
	<DataTable.Header
		title="Posting Akun Harian"
		description="Kelola posting akun harian inventaris"
		class="md:mb-4"
	/>

	<DataTable.Toolbar>
		{#snippet start()}
			<DataTable.Search
				bind:value={searchQuery}
				placeholder="Cari posting akun..."
				debounce={500}
			/>
		{/snippet}
		{#snippet end()}
			<Button onclick={handleCreateNew} class="hidden md:flex">
				<Plus class="mr-2 h-4 w-4" />
				Buat Posting
			</Button>
			<DataTable.ColumnToggle {table} />
		{/snippet}
	</DataTable.Toolbar>

	<!-- Mobile Create Button -->
	<div class="px-4 pb-3 md:hidden">
		<Button onclick={handleCreateNew} class="w-full">
			<Plus class="mr-2 h-4 w-4" />
			Buat Posting
		</Button>
	</div>

	<DataTable.Content {table} isLoading={isLoading} isError={false} />

	<DataTable.Footer>
		<DataTable.Pagination {table} isFetching={isLoading} />
	</DataTable.Footer>
</DataTable.Root>
