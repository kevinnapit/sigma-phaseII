<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import StockReconciliationFormCard from '$lib/features/material-management/inventory/transaction/stock-reconciliation/components/StockReconciliationFormCard.svelte';
	import StockReconciliationItemsCard from '$lib/features/material-management/inventory/transaction/stock-reconciliation/components/StockReconciliationItemsCard.svelte';
	import StockReconciliationActionsCard from '$lib/features/material-management/inventory/transaction/stock-reconciliation/components/StockReconciliationActionsCard.svelte';
	import { useCreateStockReconciliation } from '$lib/features/material-management/inventory/transaction/stock-reconciliation/hooks/useStockReconciliationMutations.svelte';
	import { reconciliationScheduleItems } from '$lib/features/material-management/inventory/transaction/stock-reconciliation/api/stock-reconciliation.mock';
	import type { ReconciliationItem } from '$lib/features/material-management/inventory/transaction/stock-reconciliation/types/stock-reconciliation.types';
	import { toast } from 'svelte-sonner';

	// State form
	let formData = $state({
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '',
		to_date: '',
		entry_date: new Date().toISOString().split('T')[0],
		approved_date: new Date().toISOString().split('T')[0],
		verification_schedule_no: '',
		status: 'Disetujui',
		approved_by: '',
		remarks: ''
	});

	let items = $state<ReconciliationItem[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateStockReconciliation();

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/stock-reconciliation');
	}

	/**
	 * Ketika jadwal berubah, muat item dari jadwal yang dipilih
	 */
	function handleScheduleChange(schedule: string) {
		if (schedule && reconciliationScheduleItems[schedule]) {
			items = reconciliationScheduleItems[schedule].map((item) => ({ ...item }));
		} else {
			items = [];
		}
	}

	function handleEditItem(index: number, itemData: ReconciliationItem) {
		items = items.map((item, i) => (i === index ? itemData : item));
	}

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.verification_schedule_no) {
			newErrors.verification_schedule_no = 'No. Jadwal Verifikasi wajib dipilih';
		}

		if (!formData.entry_date) {
			newErrors.entry_date = 'Tanggal Entri wajib diisi';
		}

		if (!formData.approved_date) {
			newErrors.approved_date = 'Tanggal Disetujui wajib diisi';
		}

		if (items.length === 0) {
			newErrors.items = 'Daftar barang tidak boleh kosong';
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
			from_date: formData.from_date || undefined,
			to_date: formData.to_date || undefined,
			entry_date: formData.entry_date,
			approved_date: formData.approved_date,
			verification_schedule_no: formData.verification_schedule_no,
			approved_by: formData.approved_by,
			remarks: formData.remarks || undefined,
			items: items
		};

		await createMutation.mutateAsync(payload);
		goto('/dashboard/material-management/inventory/transaction/stock-reconciliation');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Buat Rekonsiliasi Stok"
			description="Buat rekonsiliasi stok inventaris gudang"
		/>
		<div class="mt-5 flex items-center gap-2 sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Form (2/3) -->
		<div class="lg:col-span-2">
			<StockReconciliationFormCard
				bind:formData
				bind:errors={formErrors}
				onScheduleChange={handleScheduleChange}
			/>
		</div>

		<!-- Tindakan (1/3) sticky -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<StockReconciliationActionsCard
					{items}
					{formData}
					onSave={handleSave}
					isSaving={createMutation.isPending}
				/>
			</div>
		</div>
	</div>

	<!-- Tabel Barang (Lebar Penuh) -->
	<div>
		<StockReconciliationItemsCard {items} onEditItem={handleEditItem} />
	</div>
</div>
