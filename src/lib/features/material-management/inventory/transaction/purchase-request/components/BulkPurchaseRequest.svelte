<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import BulkItemsCard from './bulk/BulkItemsCard.svelte';
	import BulkFormCard from './bulk/BulkFormCard.svelte';
	import BulkActionsCard from './bulk/BulkActionsCard.svelte';
	import { useCreateBulkPurchaseRequest } from '../hooks/usePurchaseRequestMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'bulk_purchase_request_ho_draft';

	// Form state
	let formData = $state({
		warehouse_name: 'Gudang',
		staff_name: '',
		reference_number: '',
		required_date: new Date().toISOString().split('T')[0],
		notes: '',
		is_urgent: false
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateBulkPurchaseRequest();

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
		goto('/dashboard/material-management/inventory/transaction/purchase-request');
	}

	function handleClearDraft() {
		if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
			formData = {
				warehouse_name: 'Gudang',
				staff_name: '',
				reference_number: '',
				required_date: new Date().toISOString().split('T')[0],
				notes: '',
				is_urgent: false
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

		if (!formData.required_date) {
			newErrors.required_date = 'Tanggal dibutuhkan wajib diisi';
		}

		if (items.length === 0) {
			newErrors.items = 'Minimal harus ada 1 item';
		}

		// Validate each item has department
		const itemsWithoutDept = items.filter(item => !item.department_id);
		if (itemsWithoutDept.length > 0) {
			newErrors.items = 'Semua item harus memiliki departemen tujuan';
		}

		formErrors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSaveDraft() {
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
					department_id: item.department_id,
					department_name: item.department_name,
					purpose: item.purpose
				}))
			};
			
			const result = await createMutation.mutateAsync(payload);
			clearDraft();
			
			// Navigate to list after saving draft
			goto('/dashboard/material-management/inventory/transaction/purchase-request');
		} catch (error) {
			console.error('Error saving draft:', error);
		}
	}

	async function handleSubmit() {
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
					department_id: item.department_id,
					department_name: item.department_name,
					purpose: item.purpose
				}))
			};
			
			const result = await createMutation.mutateAsync(payload);
			
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
			title="Permintaan Banyak Item - Kantor Pusat"
			description="Permintaan multiple items sekaligus ke 1 departemen yang sama"
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
			<BulkItemsCard
				{items}
				onSaveItem={handleSaveItem}
				onEditItem={handleEditItem}
				onDeleteItem={handleDeleteItem}
			/>
		</div>

		<div class="lg:col-span-1">
			<div class="sticky top-6 space-y-6">
				<BulkFormCard
					bind:formData
					bind:errors={formErrors}
				/>

				<BulkActionsCard
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

