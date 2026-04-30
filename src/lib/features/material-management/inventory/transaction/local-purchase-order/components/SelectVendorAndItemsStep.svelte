<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';
	import { ArrowRight, Check, ChevronsUpDown, Search, Trash } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { useReadWinnerVendors } from '../hooks/useLocalPurchaseOrderQueries.svelte';
	import type { LPOWinnerVendor, LPOWinnerItem } from '../types/local-purchase-order.types';
	import { LPO_SESSION_KEY } from '../constants/session-storage';

	// Vendor combobox state
	let vendorPopoverOpen = $state(false);
	let vendorSearch = $state('');
	let debouncedVendorSearch = $state('');
	let selectedVendor = $state<LPOWinnerVendor | null>(null);

	// Item selection state
	let selectedItems = $state<LPOWinnerItem[]>([]);

	// Debounce vendor search
	$effect(() => {
		vendorSearch;
		const timer = setTimeout(() => {
			debouncedVendorSearch = vendorSearch;
		}, 400);
		return () => clearTimeout(timer);
	});

	// Query winner vendors with search
	const vendorsQuery = useReadWinnerVendors(() => ({
		page: 1,
		size: 20,
		search: debouncedVendorSearch || undefined
	}));

	const vendors = $derived(vendorsQuery.data?.data || []);
	const isVendorLoading = $derived(vendorsQuery.isLoading);

	// Items from selected vendor
	const vendorItems = $derived(selectedVendor?.items || []);

	// URL params for item table pagination
	const currentPage = $derived(Number(page.url.searchParams.get('ipage')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('isize')) || 10);

	const pagedItems = $derived(
		vendorItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);
	const totalItemPages = $derived(Math.ceil(vendorItems.length / pageSize));

	onMount(() => {
		const stored = sessionStorage.getItem(LPO_SESSION_KEY);
		if (stored) {
			const data = JSON.parse(stored);
			selectedVendor = data.vendor ?? null;
			selectedItems = data.selectedItems ?? [];
		}
	});

	function handleSelectVendor(vendor: LPOWinnerVendor) {
		if (selectedVendor?.vendor_id !== vendor.vendor_id) {
			selectedVendor = vendor;
			selectedItems = [];
		}
		vendorPopoverOpen = false;
		vendorSearch = '';
	}

	function handleToggleItem(item: LPOWinnerItem) {
		const exists = selectedItems.some((i) => i.quotation_detail_id === item.quotation_detail_id);
		if (exists) {
			selectedItems = selectedItems.filter(
				(i) => i.quotation_detail_id !== item.quotation_detail_id
			);
		} else {
			selectedItems = [...selectedItems, item];
		}
	}

	function isItemSelected(item: LPOWinnerItem): boolean {
		return selectedItems.some((i) => i.quotation_detail_id === item.quotation_detail_id);
	}

	function handleClearSelection() {
		selectedItems = [];
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	function updateItemPage(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('ipage', String(newPage));
		params.set('isize', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleNext() {
		if (!selectedVendor) {
			toast.error('Pilih vendor terlebih dahulu');
			return;
		}
		if (selectedItems.length === 0) {
			toast.error('Pilih minimal 1 item untuk dilanjutkan');
			return;
		}
		sessionStorage.setItem(
			LPO_SESSION_KEY,
			JSON.stringify({ vendor: selectedVendor, selectedItems, timestamp: Date.now() })
		);
		goto(
			'/dashboard/material-management/inventory/transaction/local-purchase-order/create?step=form-lpo'
		);
	}

	// Item table columns
	const itemColumns: ColumnDef<LPOWinnerItem>[] = [
		{
			id: 'select',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: isItemSelected(row.original),
					onCheckedChange: () => handleToggleItem(row.original),
					'aria-label': 'Pilih item'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{ accessorKey: 'rfq_number', header: 'No. Proses Pembelian Lokal', enableSorting: false },
		{ accessorKey: 'pr_number', header: 'No. Permintaan Barang', enableSorting: false },
		{ accessorKey: 'item_code', header: 'Kode Item', enableSorting: false },
		{ accessorKey: 'item_name', header: 'Nama Item', enableSorting: false },
		{
			accessorKey: 'qty',
			header: 'Qty',
			cell: ({ row }) => `${row.original.qty} ${row.original.uom}`,
			enableSorting: false
		},
		{
			accessorKey: 'pr_purpose',
			header: 'Tujuan',
			cell: ({ row }) => row.original.pr_purpose || '-',
			enableSorting: false
		},
		{
			accessorKey: 'local_purchase_approval_status',
			header: 'Status Izin',
			cell: ({ row }) => {
				const status = row.original.local_purchase_approval_status;
				if (status === 'APPROVED') return 'Diizinkan';
				if (status === 'NEEDS_APPROVAL') return 'Perlu Izin';
				if (status === 'NOT_ALLOWED') return 'Tidak Diizinkan';
				return 'Diizinkan'; // Default
			},
			enableSorting: false
		},
		{
			accessorKey: 'unit_price',
			header: 'Harga Satuan',
			cell: ({ row }) => formatCurrency(row.original.unit_price),
			enableSorting: false
		},
		{
			accessorKey: 'total_price',
			header: 'Total',
			cell: ({ row }) => formatCurrency(row.original.total_price),
			enableSorting: false
		}
	];

	const itemTable = createSvelteTable({
		get data() {
			return pagedItems;
		},
		columns: itemColumns,
		manualPagination: true,
		get rowCount() {
			return vendorItems.length;
		},
		get pageCount() {
			return totalItemPages;
		},
		state: {
			get pagination() {
				return { pageIndex: currentPage - 1, pageSize };
			}
		},
		onPaginationChange: (updater) => {
			const next =
				typeof updater === 'function' ? updater({ pageIndex: currentPage - 1, pageSize }) : updater;
			updateItemPage(next.pageIndex + 1, next.pageSize);
		},
		getRowId: (row) => row.quotation_detail_id,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="space-y-6">
	<!-- Pilih Vendor Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Pilih Vendor</Card.Title>
			<Card.Description>Cari dan pilih vendor yang pernah memenangkan tender</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-1.5">
				<label class="text-sm font-medium" for="vendor-select">
					Vendor <span class="text-destructive">*</span>
				</label>

				<Popover.Root bind:open={vendorPopoverOpen}>
					<Popover.Trigger id="vendor-select" class="w-full">
						<Button variant="outline" role="combobox" class="w-full justify-between font-normal">
							{#if selectedVendor}
								<span>
									{selectedVendor.vendor_name}
									<span class="ml-1 text-muted-foreground">({selectedVendor.vendor_code})</span>
								</span>
							{:else}
								<span class="text-muted-foreground">Pilih vendor...</span>
							{/if}
							<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-[--radix-popover-trigger-width] p-0" align="start">
						<div class="flex items-center border-b px-3">
							<Search class="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
							<input
								class="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
								placeholder="Cari vendor..."
								bind:value={vendorSearch}
							/>
						</div>
						<div class="max-h-64 overflow-y-auto p-1">
							{#if isVendorLoading}
								<div class="py-6 text-center text-sm text-muted-foreground">Memuat...</div>
							{:else if vendors.length === 0}
								<div class="py-6 text-center text-sm text-muted-foreground">
									Vendor tidak ditemukan
								</div>
							{:else}
								{#each vendors as vendor}
									<button
										class={cn(
											'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent',
											selectedVendor?.vendor_id === vendor.vendor_id && 'bg-accent'
										)}
										onclick={() => handleSelectVendor(vendor)}
									>
										<Check
											class={cn(
												'h-4 w-4 shrink-0',
												selectedVendor?.vendor_id === vendor.vendor_id ? 'opacity-100' : 'opacity-0'
											)}
										/>
										<div class="min-w-0 flex-1">
											<p class="truncate font-medium">{vendor.vendor_name}</p>
											<p class="text-xs text-muted-foreground">
												{vendor.vendor_code} &nbsp;·&nbsp; {vendor.item_count} item
											</p>
										</div>
									</button>
								{/each}
							{/if}
						</div>
					</Popover.Content>
				</Popover.Root>
			</div>

			{#if selectedVendor}
				<p class="text-sm text-muted-foreground">
					<span class="font-medium text-foreground">{selectedVendor.item_count} item tersedia</span>
					&nbsp;·&nbsp; dari {selectedVendor.rfqs.length} Permintaan Harga
				</p>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Item Table (shown after vendor selected) — header & table in one card -->
	{#if selectedVendor}
		<DataTable.Root>
			<DataTable.Header
				title="Item Tersedia"
				description="Pilih item yang akan dimasukkan ke LPO"
			/>
			<div class="flex flex-col gap-3 px-6 pb-3 sm:flex-row sm:items-center sm:justify-between">
				<!-- Selection status -->
				<div class="flex items-center gap-2">
					{#if selectedItems.length > 0}
						<Button variant="outline" size="icon" onclick={handleClearSelection}>
							<Trash class="h-4 w-4" />
						</Button>
						<p class="text-sm text-muted-foreground">{selectedItems.length} item dipilih</p>
					{:else}
						<p class="text-sm text-muted-foreground">Belum ada item yang dipilih</p>
					{/if}
				</div>
				<!-- Navigation buttons -->
				<div class="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
					<Button
						variant="outline"
						class="w-full sm:w-auto"
						onclick={() =>
							goto('/dashboard/material-management/inventory/transaction/local-purchase-order')}
					>
						Kembali
					</Button>
					<Button
						class="w-full sm:w-auto"
						onclick={handleNext}
						disabled={!selectedVendor || selectedItems.length === 0}
					>
						Lanjut ke Form LPO
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
			<DataTable.Content
				table={itemTable}
				isLoading={false}
				isError={false}
				onRowClick={(row) => handleToggleItem(row.original)}
			/>
			<DataTable.Footer>
				<DataTable.Pagination table={itemTable} isFetching={false} />
			</DataTable.Footer>
		</DataTable.Root>
	{:else}
		<div class="flex justify-end">
			<Button
				variant="outline"
				onclick={() =>
					goto('/dashboard/material-management/inventory/transaction/local-purchase-order')}
			>
				Kembali
			</Button>
		</div>
	{/if}
</div>
