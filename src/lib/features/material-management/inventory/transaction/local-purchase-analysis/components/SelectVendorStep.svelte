<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { type ColumnDef, type VisibilityState, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';
	import { ArrowLeft, ArrowRight, Trash } from 'lucide-svelte';
	import { useReadVendorUsersForRFQ } from '../hooks/useLocalPurchaseAnalysisQueries.svelte.js';
	import type {
		RFQVendorUser,
		VendorItem,
		SelectedPRItems
	} from '../types/local-purchase-analysis.types';
	import { SESSION_STORAGE_KEY, SESSION_STORAGE_VENDORS_KEY } from '../constants/process-steps';

	let searchName = $state('');
	let selectedVendors = $state<VendorItem[]>([]);
	let selectedItemsCount = $state(0);
	let columnVisibility = $state<VisibilityState>({});

	// URL params
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

	// Reset ke page 1 saat search berubah
	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updateUrlParams(1, pageSize);
			}
		}
	});

	// Load selected items from session storage
	onMount(() => {
		const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (storedData) {
			const data: SelectedPRItems = JSON.parse(storedData);
			selectedItemsCount = data.items.length;
		} else {
			// Jika tidak ada data, redirect ke step 1
			toast.error('Silakan pilih item terlebih dahulu');
			goto(
				'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=select-items'
			);
		}

		// Load selected vendors if exists
		const storedVendors = sessionStorage.getItem(SESSION_STORAGE_VENDORS_KEY);
		if (storedVendors) {
			const data = JSON.parse(storedVendors);
			selectedVendors = data.vendors;
		}
	});

	// Query vendor users for RFQ invitation
	const vendorsQuery = useReadVendorUsersForRFQ(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined
	}));

	const vendors = $derived(vendorsQuery.data?.data?.data || []);
	const pagination = $derived(vendorsQuery.data?.data?.pagination);
	const totalItems = $derived(pagination?.total_records || 0);
	const totalPages = $derived(pagination?.total_pages || 0);
	const isLoading = $derived(vendorsQuery.isLoading);
	const isError = $derived(vendorsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleSelectVendor(vendor: RFQVendorUser, checked: boolean) {
		if (checked) {
			selectedVendors = [
				...selectedVendors,
				{
					uoid: vendor.uoid,
					party_id: vendor.party_id,
					code: vendor.vendor_code,
					name: vendor.vendor_name,
					company_name: vendor.username,
					short_name: vendor.vendor_code,
					is_active: vendor.is_active,
					email: vendor.email
				}
			];
		} else {
			selectedVendors = selectedVendors.filter((v) => v.uoid !== vendor.uoid);
		}
	}

	function isVendorSelected(vendor: RFQVendorUser): boolean {
		return selectedVendors.some((v) => v.uoid === vendor.uoid);
	}

	function handleBack() {
		goto(
			'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=select-items'
		);
	}

	function handleNext() {
		if (selectedVendors.length === 0) {
			toast.error('Pilih minimal 1 vendor untuk melanjutkan');
			return;
		}

		// Simpan ke session storage
		const data = {
			vendors: selectedVendors,
			timestamp: Date.now()
		};
		sessionStorage.setItem(SESSION_STORAGE_VENDORS_KEY, JSON.stringify(data));

		toast.success(`${selectedVendors.length} vendor dipilih`);

		// Navigate to next step
		goto(
			'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=review-submit'
		);
	}

	function handleClearSelection() {
		selectedVendors = [];
		sessionStorage.removeItem(SESSION_STORAGE_VENDORS_KEY);
		toast.success('Pilihan vendor telah dihapus');
	}

	// Column definitions
	const columns: ColumnDef<RFQVendorUser>[] = [
		{
			id: 'select',
			header: 'Aksi',
			cell: ({ row }) => {
				const checked = isVendorSelected(row.original);
				return renderComponent(Checkbox, {
					checked,
					onclick: (e: MouseEvent) => e.stopPropagation(),
					onCheckedChange: (value: boolean) => handleSelectVendor(row.original, value),
					'aria-label': 'Select row'
				});
			},
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'vendor_code',
			header: 'Kode Vendor',
			enableSorting: false
		},
		{
			accessorKey: 'vendor_name',
			header: 'Nama Vendor',
			enableSorting: false
		},
		{
			accessorKey: 'email',
			header: 'Email',
			enableSorting: false
		},
		{
			accessorKey: 'is_active',
			header: 'Status',
			cell: ({ row }) => (row.original.is_active ? 'Aktif' : 'Tidak Aktif'),
			enableSorting: false
		}
	];

	// Table instance
	const table = createSvelteTable({
		get data() {
			return vendors;
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
				return {
					pageIndex: currentPage - 1,
					pageSize: pageSize
				};
			},
			get columnVisibility() {
				return columnVisibility;
			}
		},
		onPaginationChange: (updater) => {
			const newPagination =
				typeof updater === 'function'
					? updater({ pageIndex: currentPage - 1, pageSize: pageSize })
					: updater;
			updateUrlParams(newPagination.pageIndex + 1, newPagination.pageSize);
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		getRowId: (originalRow) => originalRow.uoid,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="space-y-6">
	<!-- Info Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Pilih Vendor</Card.Title>
			<Card.Description>
				Pilih vendor yang akan diundang untuk mengikuti tender. {selectedItemsCount} item telah dipilih
				dari tahap sebelumnya.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<!-- Mobile: stack vertically. sm+: single row with space-between -->
			<div class="-mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<!-- Selection status -->
				<div class="flex items-center gap-3">
					{#if selectedVendors.length > 0}
						<Button variant="outline" size="icon" onclick={handleClearSelection}>
							<Trash class="h-4 w-4" />
						</Button>
						<p class="text-sm text-muted-foreground">{selectedVendors.length} vendor dipilih</p>
					{:else}
						<p class="text-sm text-muted-foreground">Belum ada vendor yang dipilih</p>
					{/if}
				</div>
				<!-- Navigation buttons -->
				<div class="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-2">
					<Button variant="outline" class="w-full sm:w-auto" onclick={handleBack}>
						<ArrowLeft class="mr-2 h-4 w-4" />
						Kembali
					</Button>
					<Button
						class="w-full sm:w-auto"
						onclick={handleNext}
						disabled={selectedVendors.length === 0}
					>
						Lanjutkan
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Data Table -->
	<DataTable.Root>
		<DataTable.Header
			title="Daftar Vendor Lokal"
			description="Pilih vendor yang akan diundang untuk mengikuti tender."
			class="mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search bind:value={searchName} placeholder="Cari vendor..." debounce={500} />
			{/snippet}
			{#snippet end()}
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<DataTable.Content
			{table}
			{isLoading}
			{isError}
			onRowClick={(row) => handleSelectVendor(row.original, !isVendorSelected(row.original))}
		/>
		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</div>
