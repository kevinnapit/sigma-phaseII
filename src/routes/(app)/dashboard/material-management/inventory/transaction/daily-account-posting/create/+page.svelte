<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import DailyAccountPostingFormCard from '$lib/features/material-management/inventory/transaction/daily-account-posting/components/DailyAccountPostingFormCard.svelte';
	import DailyAccountPostingItemsCard from '$lib/features/material-management/inventory/transaction/daily-account-posting/components/DailyAccountPostingItemsCard.svelte';
	import DailyAccountPostingActionsCard from '$lib/features/material-management/inventory/transaction/daily-account-posting/components/DailyAccountPostingActionsCard.svelte';
	import { useCreateDailyAccountPosting } from '$lib/features/material-management/inventory/transaction/daily-account-posting/hooks/useDailyAccountPostingMutations.svelte';
	import { generateMockItems } from '$lib/features/material-management/inventory/transaction/daily-account-posting/api/daily-account-posting.mock';
	import type { DailyAccountPostingItem } from '$lib/features/material-management/inventory/transaction/daily-account-posting/types/daily-account-posting.types';

	// Form state
	let formData = $state({
		administrative_unit: 'Aek Loba',
		store: 'GUDANG',
		process_date: new Date().toISOString().split('T')[0],
		remarks: ''
	});

	let items = $state<DailyAccountPostingItem[]>([]);
	let isLoadingItems = $state(false);
	let formErrors = $state<Record<string, string>>({});

	const createMutation = useCreateDailyAccountPosting();

	function handleBack() {
		if (items.length > 0) {
			if (!confirm('Anda memiliki data yang belum disimpan. Apakah Anda yakin ingin kembali?')) {
				return;
			}
		}
		goto('/dashboard/material-management/inventory/transaction/daily-account-posting');
	}

	function handleLoadItems() {
		isLoadingItems = true;
		setTimeout(() => {
			items = generateMockItems(formData.administrative_unit, formData.process_date);
			isLoadingItems = false;
		}, 500);
	}

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.administrative_unit) {
			newErrors.administrative_unit = 'Unit administratif wajib dipilih';
		}

		if (!formData.process_date) {
			newErrors.process_date = 'Tanggal proses wajib diisi';
		}

		formErrors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSave() {
		if (!validateForm()) {
			return;
		}

		const payload = {
			administrative_unit: formData.administrative_unit,
			store: formData.store,
			process_date: formData.process_date,
			remarks: formData.remarks || undefined,
			items
		};

		await createMutation.mutateAsync(payload);
		goto('/dashboard/material-management/inventory/transaction/daily-account-posting');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Buat Posting Akun Harian"
			description="Buat posting akun harian untuk inventaris"
		/>
		<div
			class="mt-5 flex items-center justify-between gap-2 sm:flex sm:flex-row-reverse sm:justify-end"
		>
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Form (2/3) -->
		<div class="lg:col-span-2">
			<DailyAccountPostingFormCard bind:formData bind:errors={formErrors} />
		</div>

		<!-- Actions (1/3) sticky -->
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<DailyAccountPostingActionsCard
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
		<DailyAccountPostingItemsCard
			{items}
			onLoadItems={handleLoadItems}
			{isLoadingItems}
		/>
	</div>
</div>
