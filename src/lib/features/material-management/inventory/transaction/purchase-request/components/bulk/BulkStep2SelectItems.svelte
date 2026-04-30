<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import SearchItemCard from '../SearchItemCard.svelte';
	import StockInformationCard from '../StockInformationCard.svelte';
	import BulkItemCart, { type CartItem } from './BulkItemCart.svelte';
	import AddItemModal from './AddItemModal.svelte';
	import type { ItemComprehensiveData } from '$lib/features/material-management/inventory/master/item';

	let {
		cartItems = $bindable([]),
		onBack,
		onNext
	}: {
		cartItems?: CartItem[];
		onBack: () => void;
		onNext: () => void;
	} = $props();

	let selectedItem = $state<ItemComprehensiveData | null>(null);
	let showAddModal = $state(false);
	let editingIndex = $state<number | null>(null);
	let searchItemCardRef: any = $state(null);

	function handleItemSelect(item: ItemComprehensiveData) {
		if (!item) {
			console.error('handleItemSelect called with null item');
			return;
		}
		
		console.log('Item selected:', item.code, item.name);
		console.log('Opening modal...');
		
		// Set selected item for modal
		selectedItem = item;
		editingIndex = null;
		
		// Force modal to open
		showAddModal = true;
		
		console.log('Modal state:', showAddModal);
		console.log('Selected item:', selectedItem);
	}

	function handleAddItem(quantity: number) {
		if (!selectedItem) {
			console.error('No selected item');
			return;
		}

		console.log('Adding item:', selectedItem.code, 'with quantity:', quantity);

		const newItem: CartItem = {
			item_id: selectedItem.uoid || selectedItem.id,
			item_code: selectedItem.code,
			item_name: selectedItem.name,
			quantity,
			uom: selectedItem.base_uom?.code || 'UNIT',
			uom_name: selectedItem.base_uom?.name || 'Unit',
			uom_id: selectedItem.base_uom?.uoid || 'default-uom-id'
		};

		if (editingIndex !== null) {
			cartItems[editingIndex] = newItem;
			editingIndex = null;
		} else {
			cartItems = [...cartItems, newItem];
		}

		// Clear selection
		selectedItem = null;
		if (searchItemCardRef?.resetSearch) {
			searchItemCardRef.resetSearch();
		}
	}

	function handleEditItem(index: number) {
		const item = cartItems[index];
		editingIndex = index;

		// Create minimal ItemComprehensiveData from cart item
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
		} as ItemComprehensiveData;

		// Set quantity for editing
		showAddModal = true;
	}

	function handleDeleteItem(index: number) {
		if (confirm('Hapus item ini dari keranjang?')) {
			cartItems = cartItems.filter((_, i) => i !== index);
		}
	}

	function handleNext() {
		if (cartItems.length === 0) {
			alert('Tambahkan minimal 1 item untuk melanjutkan');
			return;
		}
		onNext();
	}
</script>

<div class="space-y-6">
	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Left: Search & Stock Info -->
		<div class="space-y-6 lg:col-span-2">
			<SearchItemCard
				bind:this={searchItemCardRef}
				onItemSelect={handleItemSelect}
			/>

			{#if selectedItem && !showAddModal}
				<StockInformationCard {selectedItem} />
			{/if}
		</div>

		<!-- Right: Cart -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<BulkItemCart
					bind:items={cartItems}
					onEdit={handleEditItem}
					onDelete={handleDeleteItem}
				/>

				{#if cartItems.length > 0}
					<div class="space-y-2">
						<Button onclick={onBack} variant="outline" class="w-full">
							<ArrowLeft class="mr-2 h-4 w-4" />
							Kembali
						</Button>
						<Button onclick={handleNext} class="w-full">
							Lanjut ke Review
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Add Item Modal -->
<AddItemModal bind:open={showAddModal} item={$state.snapshot(selectedItem)} onAdd={handleAddItem} />
