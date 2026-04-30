<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import IssueReturnFormCard from '$lib/features/material-management/inventory/transaction/issue-return/components/IssueReturnFormCard.svelte';
	import IssueReturnItemsCard from '$lib/features/material-management/inventory/transaction/issue-return/components/IssueReturnItemsCard.svelte';
	import IssueReturnActionsCard from '$lib/features/material-management/inventory/transaction/issue-return/components/IssueReturnActionsCard.svelte';
	import { useCreateIssueReturn } from '$lib/features/material-management/inventory/transaction/issue-return/hooks/useIssueReturnMutations.svelte';
	import { toast } from 'svelte-sonner';

	const STORAGE_KEY = 'issue_return_draft';

	// Form state
	let formData = $state({
		return_date: new Date().toISOString().split('T')[0],
		store_id: '',
		store_name: '',
		return_by_id: '',
		return_by_name: '',
		remarks: ''
	});

	let items = $state<any[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateIssueReturn();

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
		goto('/dashboard/material-management/inventory/transaction/issue-return');
	}

	function handleClearDraft() {
		if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
			formData = {
				return_date: new Date().toISOString().split('T')[0],
				store_id: '',
				store_name: '',
				return_by_id: '',
				return_by_name: '',
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

		if (!formData.return_date) {
			newErrors.return_date = 'Tanggal pengembalian wajib diisi';
		}

		if (items.length === 0) {
			newErrors.items = 'Minimal harus ada 1 item';
		}

		formErrors = newErrors;
		return Object.keys(newErrors).length === 0;
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
				issue_number: item.issue_number,
				geographical_unit: item.geographical_unit,
				allocation_code: item.allocation_code,
				uom: item.uom,
				issue_quantity: item.issue_quantity,
				unit_rate: item.unit_rate,
				quantity_returned: item.quantity_returned,
				remarks: item.remarks
			}))
		};
		
		await createMutation.mutateAsync(payload);
		clearDraft();
		toast.success('Pengembalian berhasil diproses');
		
		// Navigate to list
		goto('/dashboard/material-management/inventory/transaction/issue-return');
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
			title="Buat Pengembalian Pengeluaran"
			description="Buat pengembalian barang yang telah dikeluarkan"
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
		<!-- Detail Pengembalian (2/3) -->
		<div class="lg:col-span-2">
			<IssueReturnFormCard
				bind:formData
				bind:errors={formErrors}
			/>
		</div>

		<!-- Kolom Tindakan (1/3) -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<IssueReturnActionsCard
					{items}
					{formData}
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
				/>
			</div>
		</div>
	</div>

	<!-- Cari & Tambah Barang (Full Width) -->
	<div>
		<IssueReturnItemsCard
			{items}
			onSaveItem={handleSaveItem}
			onEditItem={handleEditItem}
			onDeleteItem={handleDeleteItem}
		/>
	</div>
</div>
