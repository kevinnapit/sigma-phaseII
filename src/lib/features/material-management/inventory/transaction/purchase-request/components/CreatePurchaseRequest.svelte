<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import SearchItemCard from './SearchItemCard.svelte';
	import StockInformationCard from './StockInformationCard.svelte';
	import RequestDetailCard from './RequestDetailCard.svelte';
	import RequestFormCard from './RequestFormCard.svelte';
	import RequestSummaryCard from './RequestSummaryCard.svelte';
	import type { ItemComprehensiveData } from '$lib/features/material-management/inventory/master/item';
	import {
		purchaseRequestFormSchema,
		purchaseRequestPreviewSchema
	} from '../schemas/purchase-request.schema';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'purchase_request_draft';

	let selectedItem = $state<ItemComprehensiveData | null>(null);
	let requestDetailCardRef: any = $state(null);
	let searchItemCardRef: any = $state(null);

	// Form state untuk formulir permintaan (shared across all items)
	let warehouseId = $state('');
	let warehouseName = $state('');
	let referenceNumber = $state('');
	let targetDate = $state('');
	let staffName = $state('');
	let remarks = $state('');

	// Request list state
	let requestList = $state<any[]>([]);
	let editingIndex = $state<number | null>(null);

	// Form validation errors
	let formErrors = $state<Record<string, string>>({});

	// Load saved draft on mount
	onMount(() => {
		loadDraft();
	});

	// Auto-save draft whenever data changes
	$effect(() => {
		warehouseId;
		warehouseName;
		referenceNumber;
		targetDate;
		staffName;
		remarks;
		requestList;

		const timer = setTimeout(() => {
			saveDraft();
		}, 500);

		return () => clearTimeout(timer);
	});

	function saveDraft() {
		const draft = {
			warehouseId,
			warehouseName,
			referenceNumber,
			targetDate,
			staffName,
			remarks,
			requestList
		};
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
	}

	function loadDraft() {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const draft = JSON.parse(stored);
				warehouseId = draft.warehouseId || '';
				warehouseName = draft.warehouseName || '';
				referenceNumber = draft.referenceNumber || '';
				targetDate = draft.targetDate || '';
				staffName = draft.staffName || '';
				remarks = draft.remarks || '';
				requestList = draft.requestList || [];
			} catch (error) {
				console.error('Error loading draft:', error);
			}
		}
	}

	function clearDraft() {
		sessionStorage.removeItem(STORAGE_KEY);
	}

	function handleItemSelect(item: ItemComprehensiveData) {
		selectedItem = item;
		editingIndex = null;
	}

	function handleSaveItem(itemData: any) {
		if (editingIndex !== null) {
			requestList[editingIndex] = itemData;
			editingIndex = null;
		} else {
			requestList = [...requestList, itemData];
		}

		selectedItem = null;

		if (searchItemCardRef?.resetSearch) {
			searchItemCardRef.resetSearch();
		}
	}

	function handleEditItem(index: number) {
		const item = requestList[index];
		editingIndex = index;

		// Create a minimal ItemComprehensiveData object from saved item data
		selectedItem = {
			uoid: item.item_id,
			id: item.item_id,
			code: item.item_code,
			name: item.item_name,
			short_name: item.item_name,
			base_uom: {
				uoid: item.uom_id,
				code: item.uom,
				name: item.uom_name
			},
			business_location_id: '',
			conversion_uom_count: 0,
			conversions: [],
			i_version: 0,
			issue_rate: 0,
			item_class: {
				uoid: '',
				code: '',
				name: '',
				short_name: ''
			},
			item_class_vrl: {
				is_expiry_info_required: false,
				is_stock_storage_location_wise: false,
				is_technical_specification_required: false,
				movement_criteria: '',
				sanctioned_by: '',
				stock_issue_general_allocation: '',
				uoid: ''
			},
			item_usage_count: 0,
			item_vrl: {
				is_batch_required: false,
				is_expiry_date_required: false,
				is_manufacturing_date_required: false,
				is_non_stock_item: false,
				is_purchase_limit_required: false,
				is_stock_storage_location_wise: false,
				lead_time_external: 0,
				lead_time_internal: 0,
				uoid: ''
			},
			last_modified_time: '',
			manufactures: [],
			substitute_item_count: 0,
			substitutes: [],
			uom_links: [],
			usages: [],
			last_transaction: {
				transaction_date: '',
				days_since_transaction: ''
			}
		};

		// Load the item data into the form
		setTimeout(() => {
			if (requestDetailCardRef?.loadItemData) {
				requestDetailCardRef.loadItemData(item);
			}
		}, 100);
	}

	function handleDeleteItem(index: number) {
		if (confirm('Apakah Anda yakin ingin menghapus item ini dari daftar?')) {
			requestList = requestList.filter((_, i) => i !== index);
		}
	}

	function handlePreviewTransaction() {
		formErrors = {};

		const transactionData = {
			warehouse_id: warehouseId,
			warehouse_name: warehouseName,
			reference_number: referenceNumber || undefined,
			target_date: targetDate || undefined,
			staff_name: staffName,
			remarks: remarks || undefined,
			items: requestList
		};

		console.log('Transaction data:', JSON.stringify(transactionData, null, 2));
		console.log('Request list items:', requestList);

		const result = purchaseRequestPreviewSchema.safeParse(transactionData);

		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((err: any) => {
				const path = err.path.join('.');
				fieldErrors[path] = err.message;
				console.error('Validation error:', {
					path: err.path,
					message: err.message,
					received: err.received,
					expected: err.expected
				});
			});
			formErrors = fieldErrors;

			console.error('Full validation errors:', JSON.stringify(result.error.issues, null, 2));
			
			// Check if error is in items array
			const itemErrors = result.error.issues.filter((err: any) => err.path[0] === 'items');
			if (itemErrors.length > 0) {
				const firstError = itemErrors[0];
				if (typeof firstError.path[1] === 'number') {
					const itemIndex = firstError.path[1];
					const fieldName = String(firstError.path[2] || 'unknown');
					console.error(`Item #${itemIndex + 1} data:`, requestList[itemIndex]);
					toast.error(`Item #${itemIndex + 1} - Field "${fieldName}": ${firstError.message}`);
				} else {
					toast.error(firstError.message);
				}
			} else {
				toast.error('Silahkan lengkapi data anda');
			}
			return;
		}

		saveDraft();

		// Store in sessionStorage for preview page
		sessionStorage.setItem('purchase_request_preview', JSON.stringify(transactionData));

		// Navigate to preview page
		goto('/dashboard/material-management/inventory/transaction/purchase-request/preview');
	}

	function handleBack() {
		if (requestList.length > 0) {
			if (!confirm('Anda memiliki item yang belum disimpan. Apakah Anda yakin ingin kembali?')) {
				return;
			}
		}

		clearDraft();
		goto('/dashboard/material-management/inventory/transaction/purchase-request');
	}

	function handleClearDraft() {
		if (
			confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')
		) {
			warehouseId = '';
			warehouseName = '';
			referenceNumber = '';
			targetDate = '';
			staffName = '';
			remarks = '';
			requestList = [];
			selectedItem = null;
			editingIndex = null;

			clearDraft();

			alert('Semua data telah dihapus');
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Buat Permintaan Barang"
			description="Tambahkan item dan lengkapi detail permintaan barang"
		/>
		<div
			class="mt-5 flex items-center justify-between gap-2 sm:flex sm:flex-row-reverse sm:justify-end"
		>
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
			{#if requestList.length > 0}
				<Button variant="outline" size="sm" onclick={handleClearDraft}>
					<Trash class="mr-1 h-4 w-4" />
					Hapus Transaksi
				</Button>
			{/if}
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<SearchItemCard
				bind:this={searchItemCardRef}
				bind:selectedItem
				onItemSelect={handleItemSelect}
			/>

			{#if selectedItem}
				<StockInformationCard {selectedItem} />
			{/if}

			<RequestDetailCard
				bind:this={requestDetailCardRef}
				{selectedItem}
				onSaveItem={handleSaveItem}
			/>
		</div>

		<div class="lg:col-span-1">
			<div class="sticky top-6 space-y-6">
				<RequestFormCard
					bind:warehouseId
					bind:warehouseName
					bind:referenceNumber
					bind:targetDate
					bind:staffName
					bind:remarks
					bind:errors={formErrors}
				/>

				<RequestSummaryCard
					{requestList}
					onEditItem={handleEditItem}
					onDeleteItem={handleDeleteItem}
					onPreviewTransaction={handlePreviewTransaction}
				/>
			</div>
		</div>
	</div>
</div>
