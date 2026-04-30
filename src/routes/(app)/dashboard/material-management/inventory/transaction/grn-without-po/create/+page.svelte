<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import GRNWithoutPOFormCard from '$lib/features/material-management/inventory/transaction/grn-without-po/components/GRNWithoutPOFormCard.svelte';
	import GRNWithoutPOItemsCard from '$lib/features/material-management/inventory/transaction/grn-without-po/components/GRNWithoutPOItemsCard.svelte';
	import GRNWithoutPOActionsCard from '$lib/features/material-management/inventory/transaction/grn-without-po/components/GRNWithoutPOActionsCard.svelte';
	import { useCreateGRNWithoutPO } from '$lib/features/material-management/inventory/transaction/grn-without-po/hooks/useGRNWithoutPOMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'grn_without_po_draft';

	// Form state
	let formData = $state({
		date: new Date().toISOString().split('T')[0],
		delivery_date: '',
		store_id: '',
		store_name: '',
		supplier_id: '',
		supplier_name: '',
		ref_no: '',
		delivery_note_no: '',
		vehicle_no: '',
		transporter: 'None',
		remarks: '',
		grn_number: ''
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateGRNWithoutPO();

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
		goto('/dashboard/material-management/inventory/transaction/grn-without-po');
	}

	function handleClearDraft() {
		if (
			confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')
		) {
			formData = {
				date: new Date().toISOString().split('T')[0],
				delivery_date: '',
				store_id: '',
				store_name: '',
				supplier_id: '',
				supplier_name: '',
				ref_no: '',
				delivery_note_no: '',
				vehicle_no: '',
				transporter: 'None',
				remarks: '',
				grn_number: ''
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
		if (!formData.date) {
			newErrors.date = 'Tanggal wajib diisi';
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
				items: items.map((item) => ({
					item_code: item.item_code,
					item_name: item.item_name,
					item_uom: item.item_uom,
					grn_quantity: item.grn_quantity,
					accepted_quantity: item.accepted_quantity,
					unit_rate: item.unit_rate,
					total_value: item.total_value,
					batch_no: item.batch_no,
					batchwise_entries: item.batchwise_entries,
					exp_date: item.exp_date,
					mfd_date: item.mfd_date,
					offered_qty: item.offered_qty,
					storage: item.storage,
					percentage_amount: item.percentage_amount,
					additional_charges: item.additional_charges,
					total_amount: item.total_amount,
					batch_options: item.batch_options,
					available_storages: item.available_storages
				}))
			};

			await createMutation.mutateAsync(payload);
			clearDraft();
			goto('/dashboard/material-management/inventory/transaction/grn-without-po');
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
			items: items.map((item) => ({
				item_code: item.item_code,
				item_name: item.item_name,
				item_uom: item.item_uom,
				grn_quantity: item.grn_quantity,
				accepted_quantity: item.accepted_quantity,
				unit_rate: item.unit_rate,
				total_value: item.total_value,
				batch_no: item.batch_no,
				batchwise_entries: item.batchwise_entries,
				exp_date: item.exp_date,
				mfd_date: item.mfd_date,
				offered_qty: item.offered_qty,
				storage: item.storage,
				percentage_amount: item.percentage_amount,
				additional_charges: item.additional_charges,
				total_amount: item.total_amount,
				batch_options: item.batch_options,
				available_storages: item.available_storages
			}))
		};

		const result = await createMutation.mutateAsync(payload);
		clearDraft();

		return {
			grn_number: result?.grn_number || 'GRN/WPO/2026/0001',
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
			title="Buat Penerimaan Barang Tanpa PO"
			description="Buat penerimaan barang tanpa purchase order dari supplier"
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
		<!-- Detail GRN (2/3) -->
		<div class="lg:col-span-2">
			<GRNWithoutPOFormCard bind:formData bind:errors={formErrors} />
		</div>

		<!-- Kolom Tindakan (1/3) -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<GRNWithoutPOActionsCard
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
		<GRNWithoutPOItemsCard
			{items}
			onSaveItem={handleSaveItem}
			onEditItem={handleEditItem}
			onDeleteItem={handleDeleteItem}
		/>
	</div>
</div>
