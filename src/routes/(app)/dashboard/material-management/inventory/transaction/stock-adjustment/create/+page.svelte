<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import StockAdjustmentFormCard from '$lib/features/material-management/inventory/transaction/stock-adjustment/components/StockAdjustmentFormCard.svelte';
	import StockAdjustmentItemsCard from '$lib/features/material-management/inventory/transaction/stock-adjustment/components/StockAdjustmentItemsCard.svelte';
	import StockAdjustmentActionsCard from '$lib/features/material-management/inventory/transaction/stock-adjustment/components/StockAdjustmentActionsCard.svelte';
	import { useCreateStockAdjustment } from '$lib/features/material-management/inventory/transaction/stock-adjustment/hooks/useStockAdjustmentMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'stock_adjustment_draft';

	// Form state
	let formData = $state({
		date: new Date().toISOString().split('T')[0],
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		allocation_code: '',
		ref_no: '',
		account: '',
		remarks: ''
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateStockAdjustment();

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
		goto('/dashboard/material-management/inventory/transaction/stock-adjustment');
	}

	function handleClearDraft() {
		if (
			confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')
		) {
			formData = {
				date: new Date().toISOString().split('T')[0],
				store_id: 'store-gudang',
				store_name: 'GUDANG',
				allocation_code: '',
				ref_no: '',
				account: '',
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

		if (!formData.date) {
			newErrors.date = 'Tanggal wajib diisi';
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
			date: formData.date,
			allocation_code: formData.allocation_code || undefined,
			ref_no: formData.ref_no || undefined,
			account: formData.account || undefined,
			remarks: formData.remarks || undefined,
			items: items.map((item) => ({
				grn_no: item.grn_no,
				item_code: item.item_code,
				batch_no: item.batch_no,
				item_uom: item.item_uom,
				stk_qty: item.stk_qty,
				stk_value: item.stk_value,
				unit_rate: item.unit_rate,
				quantity: item.quantity,
				value: item.value,
				remarks: item.remarks
			}))
		};

		await createMutation.mutateAsync(payload);
		clearDraft();
		goto('/dashboard/material-management/inventory/transaction/stock-adjustment');
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
			title="Buat Penyesuaian Stok"
			description="Buat penyesuaian stok inventaris gudang"
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
			<StockAdjustmentFormCard bind:formData bind:errors={formErrors} />
		</div>

		<!-- Actions (1/3) sticky -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<StockAdjustmentActionsCard
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
		<StockAdjustmentItemsCard
			{items}
			onSaveItem={handleSaveItem}
			onEditItem={handleEditItem}
			onDeleteItem={handleDeleteItem}
		/>
	</div>
</div>
