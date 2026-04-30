<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import TransferReceiptFormCard from '$lib/features/material-management/inventory/transaction/transfer-receipt/components/TransferReceiptFormCard.svelte';
	import TransferReceiptItemsCard from '$lib/features/material-management/inventory/transaction/transfer-receipt/components/TransferReceiptItemsCard.svelte';
	import TransferReceiptActionsCard from '$lib/features/material-management/inventory/transaction/transfer-receipt/components/TransferReceiptActionsCard.svelte';
	import { useCreateTransferReceipt } from '$lib/features/material-management/inventory/transaction/transfer-receipt/hooks/useTransferReceiptMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'transfer_receipt_draft';

	// Form state
	let formData = $state({
		grn_date: new Date().toISOString().split('T')[0],
		delivery_date: new Date().toISOString().split('T')[0],
		store_id: '',
		store_name: '',
		administrative_unit_id: '',
		administrative_unit_name: '',
		from_store_id: '',
		from_store_name: '',
		ref_no: '',
		delivery_note_no: '',
		vehicle_no: '',
		transporter: '',
		mr_no: '',
		remarks: ''
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateTransferReceipt();

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
		goto('/dashboard/material-management/inventory/transaction/transfer-receipt');
	}

	function handleClearDraft() {
		if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
			formData = {
				grn_date: new Date().toISOString().split('T')[0],
				delivery_date: new Date().toISOString().split('T')[0],
				store_id: '',
				store_name: '',
				administrative_unit_id: '',
				administrative_unit_name: '',
				from_store_id: '',
				from_store_name: '',
				ref_no: '',
				delivery_note_no: '',
				vehicle_no: '',
				transporter: '',
				mr_no: '',
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
		items = items.map((item, i) => i === index ? itemData : item);
	}

	function handleDeleteItem(index: number) {
		if (confirm('Apakah Anda yakin ingin menghapus item ini dari daftar?')) {
			items = items.filter((_, i) => i !== index);
		}
	}

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.store_id) {
			newErrors.store_id = 'Gudang wajib dipilih';
		}

		if (!formData.administrative_unit_id) {
			newErrors.administrative_unit_id = 'Unit administratif wajib dipilih';
		}

		if (!formData.from_store_id) {
			newErrors.from_store_id = 'Gudang asal wajib dipilih';
		}

		if (!formData.grn_date) {
			newErrors.grn_date = 'Tanggal GRN wajib diisi';
		}

		if (!formData.delivery_date) {
			newErrors.delivery_date = 'Tanggal pengiriman wajib diisi';
		}

		if (!formData.mr_no) {
			newErrors.mr_no = 'Nomor MR wajib dipilih';
		}

		if (items.length === 0) {
			newErrors.items = 'Minimal harus ada 1 item';
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
					item_uom: item.item_uom,
					mr_quantity: item.mr_quantity,
					grn_quantity: item.grn_quantity,
					grn_uom: item.grn_uom,
					accepted_quantity: item.accepted_quantity,
					unit_rate: item.unit_rate,
					batch_no: item.batch_no,
					code: item.code,
					mfd_date: item.mfd_date,
					exp_date: item.exp_date,
					storage: item.storage,
					percentage_amount: item.percentage_amount,
					mr_allocation: item.mr_allocation
				}))
			};
			
			await createMutation.mutateAsync(payload);
			clearDraft();
			
			// Navigate to list after saving draft
			goto('/dashboard/material-management/inventory/transaction/transfer-receipt');
		} catch (error) {
			console.error('Error saving draft:', error);
		}
	}

	async function handleSubmit() {
		if (!validateForm()) {
			toast.error('Mohon lengkapi data yang diperlukan');
			return;
		}

		const payload = { 
			...formData, 
			items: items.map(item => ({
				item_code: item.item_code,
				item_name: item.item_name,
				item_uom: item.item_uom,
				mr_quantity: item.mr_quantity,
				grn_quantity: item.grn_quantity,
				grn_uom: item.grn_uom,
				accepted_quantity: item.accepted_quantity,
				unit_rate: item.unit_rate,
				batch_no: item.batch_no,
				code: item.code,
				mfd_date: item.mfd_date,
				exp_date: item.exp_date,
				storage: item.storage,
				percentage_amount: item.percentage_amount,
				mr_allocation: item.mr_allocation
			}))
		};
		
		const result = await createMutation.mutateAsync(payload);
		clearDraft();
		
		// Return the result for the success modal
		return {
			grn_number: result?.grn_number || 'GRN/TR/2026/0001',
			id: result?.id || '1'
		};
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
			title="Buat Penerimaan Barang Transfer"
			description="Buat penerimaan barang dari transfer antar gudang"
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
		<!-- Detail Penerimaan (2/3) -->
		<div class="lg:col-span-2">
			<TransferReceiptFormCard
				bind:formData
				bind:errors={formErrors}
			/>
		</div>

		<!-- Kolom Tindakan (1/3) -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<TransferReceiptActionsCard
					{items}
					{formData}
					onSaveDraft={handleSaveDraft}
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
				/>
			</div>
		</div>
	</div>

	<!-- Cari & Tambah Barang (Full Width) -->
	<div>
		<TransferReceiptItemsCard
			{items}
			onSaveItem={handleSaveItem}
			onEditItem={handleEditItem}
			onDeleteItem={handleDeleteItem}
		/>
	</div>
</div>