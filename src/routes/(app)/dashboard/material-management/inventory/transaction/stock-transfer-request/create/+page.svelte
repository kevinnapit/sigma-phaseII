<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import StockTransferFormCard from '$lib/features/material-management/inventory/transaction/stock-transfer-request/components/StockTransferFormCard.svelte';
	import StockTransferItemsCard from '$lib/features/material-management/inventory/transaction/stock-transfer-request/components/StockTransferItemsCard.svelte';
	import StockTransferActionsCard from '$lib/features/material-management/inventory/transaction/stock-transfer-request/components/StockTransferActionsCard.svelte';
	import { useCreateStockTransferRequest } from '$lib/features/material-management/inventory/transaction/stock-transfer-request/hooks/useStockTransferRequestMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'stock_transfer_request_draft';

	// Form state
	let formData = $state({
		request_date: new Date().toISOString().split('T')[0],
		from_estate_id: 'estate-001',
		to_estate_id: 'estate-001',
		from_store_id: '',
		from_store_name: '',
		to_store_id: '',
		to_store_name: '',
		reference_number: ''
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateStockTransferRequest();

	// Auto-save draft
	$effect(() => {
		formData;
		items;
		const timer = setTimeout(() => {
			saveDraft();
		}, 500);
		return () => clearTimeout(timer);
	});

	function saveDraft() {
		const draft = { formData, items };
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
	}

	function loadDraft() {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const draft = JSON.parse(stored);
				formData = draft.formData || formData;
				items = draft.items || [];
			} catch (error) {
				console.error('Error loading draft:', error);
			}
		}
	}

	function clearDraft() {
		sessionStorage.removeItem(STORAGE_KEY);
	}

	function handleBack() {
		if (items.length > 0) {
			if (!confirm('Anda memiliki item yang belum disimpan. Apakah Anda yakin ingin kembali?')) {
				return;
			}
		}
		clearDraft();
		goto('/dashboard/material-management/inventory/transaction/stock-transfer-request');
	}

	function handleClearDraft() {
		if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
			formData = {
				request_date: new Date().toISOString().split('T')[0],
				from_estate_id: 'estate-001',
				to_estate_id: 'estate-001',
				from_store_id: '',
				from_store_name: '',
				to_store_id: '',
				to_store_name: '',
				reference_number: '',
				remarks: ''
			};
			items = [];
			clearDraft();
			toast.success('Semua data telah dihapus');
		}
	}

	function handleSaveItem(itemData: any) {
		items = [...items, itemData];
	}

	function handleEditItem(index: number, itemData: any) {
		items[index] = itemData;
	}

	function handleDeleteItem(index: number) {
		if (confirm('Apakah Anda yakin ingin menghapus item ini dari daftar?')) {
			items = items.filter((_, i) => i !== index);
		}
	}

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.request_date) {
			newErrors.request_date = 'Tanggal permintaan wajib diisi';
		}

		if (!formData.from_store_id) {
			newErrors.from_store_id = 'Gudang asal wajib dipilih';
		}

		if (!formData.to_store_id) {
			newErrors.to_store_id = 'Gudang tujuan wajib dipilih';
		}

		if (formData.from_store_id && formData.to_store_id && formData.from_store_id === formData.to_store_id) {
			newErrors.to_store_id = 'Gudang tujuan harus berbeda dengan gudang asal';
		}

		if (items.length === 0) {
			newErrors.items = 'Minimal harus ada 1 item';
		}

		console.log('Validation errors:', newErrors);
		console.log('Form data for validation:', {
			request_date: formData.request_date,
			from_store_id: formData.from_store_id,
			to_store_id: formData.to_store_id,
			items_count: items.length,
			same_store: formData.from_store_id === formData.to_store_id
		});

		formErrors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSaveDraft() {
		console.log('handleSaveDraft called');
		console.log('Form data:', formData);
		console.log('Items:', items);
		
		if (!validateForm()) {
			toast.error('Mohon lengkapi data yang diperlukan');
			return;
		}

		try {
			const payload = { 
				...formData, 
				items: items.map(item => ({
					item_code: item.item_code,
					item_name: item.item_name,
					quantity: item.quantity,
					uom: item.uom,
					required_date: item.required_date,
					purpose: item.purpose
				}))
			};
			console.log('Draft payload:', payload);
			
			const result = await createMutation.mutateAsync(payload);
			console.log('Draft result:', result);
			clearDraft();
			
			// Navigate to list after saving draft
			goto('/dashboard/material-management/inventory/transaction/stock-transfer-request');
		} catch (error) {
			console.error('Error saving draft:', error);
		}
	}

	async function handleSubmit() {
		console.log('handleSubmit called');
		console.log('Form data:', formData);
		console.log('Items:', items);
		
		if (!validateForm()) {
			toast.error('Mohon lengkapi data yang diperlukan');
			return;
		}

		try {
			const payload = { 
				...formData, 
				items: items.map(item => ({
					item_code: item.item_code,
					item_name: item.item_name,
					quantity: item.quantity,
					uom: item.uom,
					required_date: item.required_date,
					purpose: item.purpose
				}))
			};
			console.log('Submit payload:', payload);
			
			const result = await createMutation.mutateAsync(payload);
			console.log('Submit result:', result);
			
			// Return result to be handled by ActionsCard
			return result;
		} catch (error) {
			console.error('Error submitting:', error);
			throw error;
		}
	}

	// Load draft on mount
	$effect(() => {
		loadDraft();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Buat Permintaan Transfer Stok"
			description="Buat permintaan transfer stok antar gudang"
		/>
		<div class="mt-5 flex items-center justify-between gap-2 sm:flex sm:flex-row-reverse sm:justify-end">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
			{#if items.length > 0}
				<Button variant="outline" size="sm" onclick={handleClearDraft}>
					<Trash class="mr-1 h-4 w-4" />
					Hapus Transaksi
				</Button>
			{/if}
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<StockTransferItemsCard
				{items}
				onSaveItem={handleSaveItem}
				onEditItem={handleEditItem}
				onDeleteItem={handleDeleteItem}
			/>
		</div>

		<div class="lg:col-span-1">
			<div class="sticky top-6 space-y-6">
				<StockTransferFormCard
					bind:formData
					bind:errors={formErrors}
				/>

				<StockTransferActionsCard
					{items}
					{formData}
					onSaveDraft={handleSaveDraft}
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
				/>
			</div>
		</div>
	</div>
</div>
