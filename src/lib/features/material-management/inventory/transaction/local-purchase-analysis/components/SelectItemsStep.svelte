<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { type ColumnDef, type VisibilityState, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { FileText, ShoppingCart, Send, Trash, LoaderCircle } from 'lucide-svelte';

	import { useReadEligiblePRs } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import { useCreateRepeatOrder } from '../../local-purchase-order/hooks/useLocalPurchaseOrderQueries.svelte';
	import type { EligiblePRItem } from '../types/local-purchase-analysis.types';
	import { SESSION_STORAGE_KEY } from '../constants/process-steps';
	import { LPO_SESSION_KEY } from '../../local-purchase-order/constants/session-storage';
	import { formatCurrency, formatDate } from '$lib/shared/utils';
	import LocalPurchaseApprovalStatusBadge from './LocalPurchaseApprovalStatusBadge.svelte';
	import RepeatOrderSuccessModal from './RepeatOrderSuccessModal.svelte';

	let searchName = $state('');
	let selectedItems = $state<EligiblePRItem[]>([]);
	let columnVisibility = $state<VisibilityState>({});

	// RO dialog state
	let showRODialog = $state(false);
	let roLpoDate = $state('');
	let roRequiredByDate = $state('');

	// RO success modal state
	let showROSuccessModal = $state(false);
	let createdLpos = $state<Array<{ id: string; lpo_number: string; approval_status: string }>>([]);

	const createROmutation = useCreateRepeatOrder();
	const isCreatingRO = $derived(createROmutation.isPending);

	// Business rule: items with NEEDS_APPROVAL can ONLY do RFQ
	const hasNeedsApprovalItem = $derived(
		selectedItems.some((item) => item.local_purchase_approval_status === 'NEEDS_APPROVAL')
	);
	const hasApprovedItem = $derived(
		selectedItems.some((item) => item.local_purchase_approval_status === 'APPROVED')
	);
	const hasMixedApprovalStatus = $derived(hasNeedsApprovalItem && hasApprovedItem);
	const hasNonROItem = $derived(selectedItems.some((item) => item.system_reference !== 'RO'));
	
	// Business rule: items with NEEDS_APPROVAL must have same department_destination
	const departmentDestinations = $derived(
		selectedItems
			.filter((item) => item.local_purchase_approval_status === 'NEEDS_APPROVAL')
			.map((item) => item.department_destination)
			.filter((dept) => dept != null)
	);
	const hasMixedDepartments = $derived(
		departmentDestinations.length > 0 && new Set(departmentDestinations).size > 1
	);
	
	const repeatOrderDisabledTitle = $derived(
		selectedItems.length > 0 && hasMixedApprovalStatus
			? 'Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses'
			: selectedItems.length > 0 && hasNeedsApprovalItem
				? 'Item dengan status "Perlu Izin" tidak dapat melakukan Repeat Order'
				: selectedItems.length > 0 && hasNonROItem
					? 'Repeat Order hanya bisa untuk item dengan Ref. Sistem RO'
					: undefined
	);

	// Load selected items from session storage on mount
	onMount(() => {
		const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (storedData) {
			const data = JSON.parse(storedData);
			selectedItems = data.items || [];
		}
	});

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

	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updateUrlParams(1, pageSize);
			}
		}
	});

	// Query eligible PRs
	const eligiblePRsQuery = useReadEligiblePRs(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined
	}));

	const items = $derived(eligiblePRsQuery.data?.data || []);
	const pagination = $derived(eligiblePRsQuery.data?.pagination);
	const totalItems = $derived(pagination?.total_records || 0);
	const totalPages = $derived(pagination?.total_pages || 0);
	const isLoading = $derived(eligiblePRsQuery.isLoading);
	const isError = $derived(eligiblePRsQuery.isError);

	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleSelectItem(item: EligiblePRItem, checked: boolean) {
		if (checked) {
			// Check if NEEDS_APPROVAL item has no department destination
			if (item.local_purchase_approval_status === 'NEEDS_APPROVAL' && !item.department_destination) {
				toast.error('Item dengan status "Perlu Izin" harus memiliki departemen tujuan');
				return;
			}
			
			// Check if mixing approval statuses
			const newSelection = [...selectedItems, item];
			const hasNeedsApproval = newSelection.some((i) => i.local_purchase_approval_status === 'NEEDS_APPROVAL');
			const hasApproved = newSelection.some((i) => i.local_purchase_approval_status === 'APPROVED');
			
			if (hasNeedsApproval && hasApproved) {
				toast.error('Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses');
				return;
			}
			
			// Check if mixing different departments for NEEDS_APPROVAL items
			if (item.local_purchase_approval_status === 'NEEDS_APPROVAL') {
				const existingDepartments = selectedItems
					.filter((i) => i.local_purchase_approval_status === 'NEEDS_APPROVAL')
					.map((i) => i.department_destination)
					.filter((dept) => dept != null);
				
				if (existingDepartments.length > 0 && item.department_destination) {
					const firstDept = existingDepartments[0];
					if (firstDept !== item.department_destination) {
						toast.error(`Item dengan departemen tujuan berbeda tidak dapat digabung. Departemen yang dipilih: ${firstDept}`);
						return;
					}
				}
			}
			
			selectedItems = newSelection;
		} else {
			selectedItems = selectedItems.filter((i) => i.uoid !== item.uoid);
		}
	}

	function isItemSelected(item: EligiblePRItem): boolean {
		return selectedItems.some((i) => i.uoid === item.uoid);
	}

	function handleRepeatOrder() {
		if (selectedItems.length === 0) {
			toast.error('Pilih minimal 1 item untuk melanjutkan');
			return;
		}
		// Business rule: cannot mix approval statuses
		if (hasMixedApprovalStatus) {
			toast.error('Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses');
			return;
		}
		// Business rule: items with NEEDS_APPROVAL status cannot do Repeat Order
		if (hasNeedsApprovalItem) {
			toast.error(
				'Item dengan status "Perlu Izin" tidak dapat melakukan Repeat Order. Gunakan Permintaan Harga (RFQ).'
			);
			return;
		}
		if (hasNonROItem) {
			toast.error('Repeat Order hanya bisa untuk item dengan Ref. Sistem RO');
			return;
		}
		const hasNoLastLpo = selectedItems.some((item) => !item.last_lpo_id);
		if (hasNoLastLpo) {
			toast.error('Beberapa item tidak memiliki LPO terakhir untuk Repeat Order');
			return;
		}
		roLpoDate = '';
		roRequiredByDate = '';
		showRODialog = true;
	}

	async function handleConfirmRO() {
		if (!roLpoDate) {
			toast.error('Tanggal LPO wajib diisi');
			return;
		}
		if (!roRequiredByDate) {
			toast.error('Tanggal dibutuhkan wajib diisi');
			return;
		}
		try {
			const now = new Date().toISOString().split('T')[0];
			const response = await createROmutation.mutateAsync({
				lpo_date: roLpoDate,
				published_at: now,
				required_by_date: roRequiredByDate,
				items: selectedItems.map((i) => ({
					last_lpo_id: i.last_lpo_id!,
					pr_detail_id: i.purchase_request_dtl_id
				}))
			});
			showRODialog = false;
			createdLpos = response.data.lpos.map((lpo) => ({
				id: lpo.id,
				lpo_number: lpo.lpo_number,
				approval_status: lpo.approval_status
			}));
			showROSuccessModal = true;
		} catch (error) {
			toast.error(
				`Gagal membuat Repeat Order: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function handleRequestForQuotation() {
		if (selectedItems.length === 0) {
			toast.error('Pilih minimal 1 item untuk melanjutkan');
			return;
		}
		// Business rule: cannot mix approval statuses
		if (hasMixedApprovalStatus) {
			toast.error('Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses');
			return;
		}
		// Business rule: cannot mix different departments for NEEDS_APPROVAL items
		if (hasMixedDepartments) {
			toast.error('Item dengan departemen tujuan berbeda tidak dapat digabung dalam satu RFQ');
			return;
		}
		const data = {
			items: selectedItems,
			processType: 'RFQ' as const,
			timestamp: Date.now()
		};
		sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
		toast.success(`${selectedItems.length} item dipilih untuk Permintaan Harga`);
		goto(
			'/dashboard/material-management/inventory/transaction/local-purchase-analysis/create?step=select-vendor'
		);
	}

	function handleClearSelection() {
		selectedItems = [];
		sessionStorage.removeItem(SESSION_STORAGE_KEY);
		toast.success('Pilihan item telah dihapus');
	}

	function handleCreateLPO() {
		if (selectedItems.length === 0) {
			toast.error('Pilih minimal 1 item untuk melanjutkan');
			return;
		}
		// Business rule: cannot mix approval statuses
		if (hasMixedApprovalStatus) {
			toast.error('Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses');
			return;
		}
		// Business rule: items with NEEDS_APPROVAL status cannot create LPO directly
		if (hasNeedsApprovalItem) {
			toast.error(
				'Item dengan status "Perlu Izin" tidak dapat langsung membuat LPO. Gunakan Permintaan Harga (RFQ).'
			);
			return;
		}
		// Build manual items from eligible PR items
		const manualItems = selectedItems.map((item) => ({
			item_id: item.item_uoid,
			item_code: item.item_code,
			item_name: item.item_name,
			qty: item.qty,
			uom: item.uom,
			uom_id: item.uom_uoid,
			purchase_request_dtl_id: item.purchase_request_dtl_id,
			purpose: item.purpose ?? ''
		}));
		// Store as manual LPO session — vendor will be selected in FormLPOStep
		sessionStorage.setItem(
			LPO_SESSION_KEY,
			JSON.stringify({
				vendor: null,
				selectedItems: [],
				isManual: true,
				manualItems,
				timestamp: Date.now()
			})
		);
		goto(
			'/dashboard/material-management/inventory/transaction/local-purchase-order/create?step=form-lpo'
		);
	}

	// Column definitions
	const columns: ColumnDef<EligiblePRItem>[] = [
		{
			id: 'select',
			header: 'Aksi',
			cell: ({ row }) => {
				const checked = isItemSelected(row.original);
				return renderComponent(Checkbox, {
					checked,
					onclick: (e: MouseEvent) => e.stopPropagation(),
					onCheckedChange: (value: boolean) => handleSelectItem(row.original, value),
					'aria-label': 'Select row'
				});
			},
			enableSorting: false,
			enableHiding: false
		},
		{ accessorKey: 'pr_number', header: 'No. MR', enableSorting: false },
		{
			accessorKey: 'pr_date',
			header: 'Tanggal MR',
			cell: ({ row }) => formatDate(row.original.pr_date),
			enableSorting: false
		},
		{
			accessorKey: 'reference_number',
			header: 'No. Referensi',
			cell: ({ row }) => row.original.reference_number || '-',
			enableSorting: false
		},
		{
			accessorKey: 'system_reference',
			header: 'Ref. Sistem',
			cell: ({ row }) => row.original.system_reference || '-',
			enableSorting: false
		},
		{
			accessorKey: 'local_purchase_approval_status',
			header: 'Status Izin',
			cell: ({ row }) =>
				renderComponent(LocalPurchaseApprovalStatusBadge, {
					status: row.original.local_purchase_approval_status
				}),
			enableSorting: false
		},
		{
			accessorKey: 'department_destination',
			header: 'Departemen Tujuan',
			cell: ({ row }) => row.original.department_destination || '-',
			enableSorting: false
		},
		{ accessorKey: 'item_code', header: 'Kode Item', enableSorting: false },
		{ accessorKey: 'item_name', header: 'Nama Item', enableSorting: false },
		{
			accessorKey: 'qty',
			header: 'Qty',
			cell: ({ row }) => `${row.original.qty} ${row.original.uom}`,
			enableSorting: false
		},
		{ accessorKey: 'purpose', header: 'Tujuan', enableSorting: false },
		{
			accessorKey: 'requirement_date',
			header: 'Tgl. Kebutuhan',
			cell: ({ row }) => formatDate(row.original.requirement_date),
			enableSorting: false
		},
		{ accessorKey: 'requested_by', header: 'Diminta Oleh', enableSorting: false },
		{
			accessorKey: 'last_lpo_number',
			header: 'No. LPO Terakhir',
			cell: ({ row }) => row.original.last_lpo_number || '-',
			enableSorting: false
		},
		{
			accessorKey: 'last_lpo_date',
			header: 'Tgl. LPO Terakhir',
			cell: ({ row }) =>
				row.original.last_lpo_date ? formatDate(row.original.last_lpo_date) : '-',
			enableSorting: false
		},
		{
			accessorKey: 'last_lpo_vendor_name',
			header: 'Vendor Terakhir',
			cell: ({ row }) => row.original.last_lpo_vendor_name || '-',
			enableSorting: false
		},
		{
			accessorKey: 'last_lpo_unit_price',
			header: 'Harga Terakhir',
			cell: ({ row }) =>
				row.original.last_lpo_unit_price
					? formatCurrency(row.original.last_lpo_unit_price, row.original.budget_currency || 'IDR')
					: '-',
			enableSorting: false
		}
	];

	// Table instance
	const table = createSvelteTable({
		get data() {
			return items;
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
				return { pageIndex: currentPage - 1, pageSize: pageSize };
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
	<!-- Action Buttons -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Pilih Aksi</Card.Title>
			<Card.Description>
				Pilih item dari tabel di bawah, kemudian pilih aksi yang akan dilakukan
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="-mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<!-- Selection status -->
				<div class="flex items-center gap-3">
					{#if selectedItems.length > 0}
						<Button variant="outline" size="icon" onclick={handleClearSelection}>
							<Trash class="h-4 w-4" />
						</Button>
						<p class="text-sm text-muted-foreground">{selectedItems.length} item dipilih</p>
					{:else}
						<p class="text-sm text-muted-foreground">Belum ada item yang dipilih</p>
					{/if}
				</div>
				<!-- Action buttons: full-width on mobile, auto on sm+ -->
				<div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-2">
					{#if hasMixedApprovalStatus}
						<div
							class="flex w-full items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 sm:w-auto"
						>
							<span class="font-semibold">Peringatan:</span>
							<span>Item "Perlu Izin" dan "Diizinkan" tidak dapat digabung</span>
						</div>
					{:else if hasNeedsApprovalItem}
						<div
							class="flex w-full items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 sm:w-auto"
						>
							<span class="font-semibold">Perlu Izin:</span>
							<span>Item yang dipilih hanya dapat diproses melalui RFQ</span>
						</div>
					{/if}
					<Button
						class="w-full sm:w-auto"
						onclick={handleRepeatOrder}
						disabled={selectedItems.length === 0 || hasMixedApprovalStatus || hasNeedsApprovalItem || hasNonROItem}
						title={repeatOrderDisabledTitle}
					>
						<FileText class="mr-2 h-4 w-4" />
						Repeat Order
					</Button>
					<Button
						class="w-full sm:w-auto"
						onclick={handleRequestForQuotation}
						disabled={selectedItems.length === 0 || hasMixedApprovalStatus}
						title={hasMixedApprovalStatus
							? 'Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses'
							: undefined}
					>
						<Send class="mr-2 h-4 w-4" />
						Permintaan Harga
					</Button>
					<Button
						variant="outline"
						class="w-full sm:w-auto"
						disabled={selectedItems.length === 0 || hasMixedApprovalStatus || hasNeedsApprovalItem}
						onclick={handleCreateLPO}
						title={hasMixedApprovalStatus
							? 'Item dengan status "Perlu Izin" dan "Diizinkan" tidak dapat digabung dalam satu proses'
							: hasNeedsApprovalItem
								? 'Item dengan status "Perlu Izin" tidak dapat langsung membuat LPO'
								: undefined}
					>
						<ShoppingCart class="mr-2 h-4 w-4" />
						Buat LPO
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Data Table -->
	<DataTable.Root>
		<DataTable.Header
			title="Permintaan Barang"
			description="Pilih item yang akan diproses untuk pembelian lokal."
			class="mb-4"
		/>
		<DataTable.Toolbar>
			{#snippet start()}
				<DataTable.Search bind:value={searchName} placeholder="Cari..." debounce={500} />
			{/snippet}
			{#snippet end()}
				<DataTable.ColumnToggle {table} />
			{/snippet}
		</DataTable.Toolbar>
		<DataTable.Content
			{table}
			{isLoading}
			{isError}
			onRowClick={(row) => handleSelectItem(row.original, !isItemSelected(row.original))}
		/>
		<DataTable.Footer>
			<DataTable.Pagination {table} isFetching={isLoading} />
		</DataTable.Footer>
	</DataTable.Root>
</div>

<!-- Repeat Order Dialog -->
<Dialog.Root bind:open={showRODialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Buat Repeat Order</Dialog.Title>
			<Dialog.Description>
				Buat LPO baru berdasarkan {selectedItems.length} item dari LPO sebelumnya.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-2">
			<div class="space-y-2">
				<Label for="ro-lpo-date">Tanggal LPO <span class="text-destructive">*</span></Label>
				<Input id="ro-lpo-date" type="date" bind:value={roLpoDate} disabled={isCreatingRO} />
			</div>
			<div class="space-y-2">
				<Label for="ro-required-date"
					>Tanggal Dibutuhkan <span class="text-destructive">*</span></Label
				>
				<Input
					id="ro-required-date"
					type="date"
					bind:value={roRequiredByDate}
					disabled={isCreatingRO}
				/>
			</div>
		</div>
		<Dialog.Footer class="gap-2">
			<Button variant="outline" onclick={() => (showRODialog = false)} disabled={isCreatingRO}>
				Batal
			</Button>
			<Button onclick={handleConfirmRO} disabled={isCreatingRO}>
				{#if isCreatingRO}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Membuat...
				{:else}
					Buat Repeat Order
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- RO Success Modal -->
<RepeatOrderSuccessModal bind:open={showROSuccessModal} lpos={createdLpos} />
