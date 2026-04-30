<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import PhysicalStocktakeFormCard from '$lib/features/material-management/inventory/transaction/physical-stocktake/components/PhysicalStocktakeFormCard.svelte';
	import PhysicalStocktakeItemsCard from '$lib/features/material-management/inventory/transaction/physical-stocktake/components/PhysicalStocktakeItemsCard.svelte';
	import PhysicalStocktakeActionsCard from '$lib/features/material-management/inventory/transaction/physical-stocktake/components/PhysicalStocktakeActionsCard.svelte';
	import { useCreatePhysicalStocktake } from '$lib/features/material-management/inventory/transaction/physical-stocktake/hooks/usePhysicalStocktakeMutations.svelte';
	import { scheduleItems } from '$lib/features/material-management/inventory/transaction/physical-stocktake/api/physical-stocktake.mock';
	import type { StocktakeItem } from '$lib/features/material-management/inventory/transaction/physical-stocktake/types/physical-stocktake.types';
	import { toast } from 'svelte-sonner';

	// State form
	let formData = $state({
		schedule: '',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '',
		to_date: '',
		entry_date: new Date().toISOString().split('T')[0],
		ref_no: '',
		status: '',
		verified_by: '',
		remarks: ''
	});

	let items = $state<StocktakeItem[]>([]);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreatePhysicalStocktake();

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/physical-stocktake');
	}

	/**
	 * Ketika jadwal berubah, muat item dari jadwal yang dipilih
	 */
	function handleScheduleChange(schedule: string) {
		if (schedule && scheduleItems[schedule]) {
			items = scheduleItems[schedule].map((item) => ({ ...item }));
		} else {
			items = [];
		}
	}

	function handleEditItem(index: number, itemData: StocktakeItem) {
		items = items.map((item, i) => (i === index ? itemData : item));
	}

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.schedule) {
			newErrors.schedule = 'Jadwal verifikasi stok wajib dipilih';
		}

		if (!formData.entry_date) {
			newErrors.entry_date = 'Tanggal entri wajib diisi';
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
			schedule: formData.schedule,
			store_id: formData.store_id,
			from_date: formData.from_date || undefined,
			to_date: formData.to_date || undefined,
			entry_date: formData.entry_date,
			ref_no: formData.ref_no || undefined,
			status: formData.status,
			verified_by: formData.verified_by,
			remarks: formData.remarks || undefined,
			items: items.map((item) => ({
				item_code: item.item_code,
				item_name: item.item_name,
				uom: item.uom,
				physical_stock: item.physical_stock,
				physical_value: item.physical_value
			}))
		};

		await createMutation.mutateAsync(payload);
		goto('/dashboard/material-management/inventory/transaction/physical-stocktake');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Buat Entri Stok Opname"
			description="Buat entri stok opname fisik inventaris gudang"
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
			<PhysicalStocktakeFormCard
				bind:formData
				bind:errors={formErrors}
				onScheduleChange={handleScheduleChange}
			/>
		</div>

		<!-- Tindakan (1/3) sticky -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<PhysicalStocktakeActionsCard
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
		<PhysicalStocktakeItemsCard
			{items}
			onEditItem={handleEditItem}
		/>
	</div>
</div>
