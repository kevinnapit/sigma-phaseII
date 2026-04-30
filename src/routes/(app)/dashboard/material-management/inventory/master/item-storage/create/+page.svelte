<script lang="ts">
	import { goto } from '$app/navigation';
	import { PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import ItemStorageFormCard from '$lib/features/material-management/inventory/master/item-storage/components/ItemStorageFormCard.svelte';
	import ItemStorageActionsCard from '$lib/features/material-management/inventory/master/item-storage/components/ItemStorageActionsCard.svelte';
	import { useCreateItemStorageAssignment } from '$lib/features/material-management/inventory/master/item-storage/hooks/useItemStorageMutations.svelte';
	import type { ItemStorageAssignmentCreatePayload } from '$lib/features/material-management/inventory/master/item-storage/types/item-storage.types';

	const LIST_URL = '/dashboard/material-management/inventory/master/item-storage';

	let formData = $state<ItemStorageAssignmentCreatePayload>({
		rack_id: '',
		cell_id: '',
		items: [{ item_code: '', item_name: '' }],
		notes: ''
	});

	let errors = $state<Record<string, string>>({});

	const createMutation = useCreateItemStorageAssignment();

	function validate(): boolean {
		const newErrors: Record<string, string> = {};
		if (!formData.rack_id) newErrors.rack_id = 'Rak wajib dipilih';
		if (!formData.cell_id) newErrors.cell_id = 'Cell wajib dipilih';
		const filled = formData.items.filter((i) => i.item_code.trim() && i.item_name.trim());
		if (filled.length === 0) newErrors.items = 'Minimal 1 barang wajib diisi';
		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSave() {
		if (!validate()) {
			toast.error('Mohon lengkapi semua field yang wajib diisi');
			return;
		}
		const payload: ItemStorageAssignmentCreatePayload = {
			...formData,
			items: formData.items.filter((i) => i.item_code.trim() && i.item_name.trim())
		};
		createMutation.mutateAsync(payload).then(() => goto(LIST_URL));
	}

	function handleBack() {
		goto(LIST_URL);
	}
</script>

<div class="space-y-6">
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Tambah Penugasan Penyimpanan"
			description="Pilih rak dan cell, lalu assign barang ke dalamnya."
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:justify-end sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<ItemStorageFormCard bind:formData bind:errors />
		</div>
		<div class="lg:col-span-1">
			<div class="sticky top-6">
				<ItemStorageActionsCard
					{formData}
					isPending={createMutation.isPending}
					onSave={handleSave}
				/>
			</div>
		</div>
	</div>
</div>
