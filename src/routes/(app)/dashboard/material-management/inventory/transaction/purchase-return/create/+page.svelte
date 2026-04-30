<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import PurchaseReturnFormCard from '$lib/features/material-management/inventory/transaction/purchase-return/components/PurchaseReturnFormCard.svelte';
	import PurchaseReturnItemsCard from '$lib/features/material-management/inventory/transaction/purchase-return/components/PurchaseReturnItemsCard.svelte';
	import PurchaseReturnActionsCard from '$lib/features/material-management/inventory/transaction/purchase-return/components/PurchaseReturnActionsCard.svelte';
	import { useCreatePurchaseReturn } from '$lib/features/material-management/inventory/transaction/purchase-return/hooks/usePurchaseReturnMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'purchase_return_draft';

	// Form state
	let formData = $state({
		return_date: new Date().toISOString().split('T')[0],
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		supplier_id: '',
		supplier_name: '',
		return_account: '',
		remarks: ''
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreatePurchaseReturn();

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
		goto('/dashboard/material-management/inventory/transaction/purchase-return');
	}

	function handleClearDraft() {
		if (
			confirm(
				'Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.'
			)
		) {
			formData = {
				return_date: new Date().toISOString().split('T')[0],
				store_id: 'store-gudang',
				store_name: 'GUDANG',
				supplier_id: '',
				supplier_name: '',
				return_account: '',
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
		items = items.map((item, i) => (i === index ? itemData : item));
	}

	function handleDeleteItem(index: number) {
		if (confirm('Apakah Anda yakin ingin menghapus item ini dari daftar?')) {
			items = items.filter((_, i) => i !== index);
		}
	}

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.supplier_id) {
			newErrors.supplier_id = 'Supplier wajib dipilih';
		}

		if (!formData.return_date) {
			newErrors.return_date = 'Tanggal pengembalian wajib diisi';
		}

		if (items.length === 0) {
			newErrors.items = 'Minimal harus ada 1 item';
		}

		formErrors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSave() {
		if (!validateForm()) {
			toast.error('Mohon lengkapi data yang diperlukan');
			return;
		}

		const payload = {
			store_id: formData.store_id,
			supplier_id: formData.supplier_id,
			return_date: formData.return_date,
			return_account: formData.return_account || undefined,
			remarks: formData.remarks || undefined,
			items: items.map((item) => ({
				grn_no: item.grn_no,
				item_code: item.item_code,
				item_name: item.item_name,
				item_uom: item.item_uom,
				grn_qty: item.grn_qty,
				accepted_qty: item.accepted_qty,
				returned_qty: item.returned_qty,
				batchwise_entries: item.batchwise_entries || [],
				rate: item.rate,
				total: item.total,
				reason: item.reason
			}))
		};

		await createMutation.mutateAsync(payload);
		clearDraft();
		goto('/dashboard/material-management/inventory/transaction/purchase-return');
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
			title="Buat Pengembalian Pembelian"
			description="Buat pengembalian barang kepada supplier"
		/>
		<div
			class="mt-5 flex items-center justify-between gap-2 sm:flex sm:flex-row-reverse sm:justify-end"
		>
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
		<!-- Form (2/3) -->
		<div class="lg:col-span-2">
			<PurchaseReturnFormCard bind:formData bind:errors={formErrors} />
		</div>

		<!-- Actions (1/3) sticky -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<PurchaseReturnActionsCard
					{items}
					{formData}
					onSave={handleSave}
					isSaving={createMutation.isPending}
				/>
			</div>
		</div>
	</div>

	<!-- Items Table (Full Width) -->
	<div>
		<PurchaseReturnItemsCard
			{items}
			{formData}
			onSaveItem={handleSaveItem}
			onEditItem={handleEditItem}
			onDeleteItem={handleDeleteItem}
		/>
	</div>
</div>
