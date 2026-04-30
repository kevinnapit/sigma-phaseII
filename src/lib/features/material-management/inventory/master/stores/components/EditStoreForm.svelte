<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { useUpdateStore } from '../hooks/useStoresMutations.svelte';
	import { updateStoreSchema, type UpdateStoreSchema } from '../schemas/create-store.schema';
	import InfoFormSection from './form-sections/InfoFormSection.svelte';
	import type { StoreItem } from '../types/store.types';

	let {
		open = $bindable(false),
		store,
		onClose,
		onSuccess
	}: {
		open?: boolean;
		store: StoreItem | null;
		onClose?: () => void;
		onSuccess?: () => void;
	} = $props();

	let formData = $state<UpdateStoreSchema | null>(null);
	let errors = $state<Record<string, string>>({});

	const updateStoreMutation = useUpdateStore();

	$effect(() => {
		if (store && open) {
			formData = {
				administrative_unit_id: store.administrative_unit_id ?? '',
				code: store.code ?? '',
				i_version: store.i_version ?? 0,
				is_active: store.is_active === true,
				name: store.name ?? '',
				parent_store_id: store.parent_store_id || undefined,
				store_type_id: store.store_type_id ?? ''
			};
			errors = {};
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!formData || !store) return;

		errors = {};

		const validation = updateStoreSchema.safeParse(formData);
		if (!validation.success) {
			validation.error.issues.forEach((issue) => {
				if (issue.path[0]) {
					errors[issue.path[0] as string] = issue.message;
				}
			});
			return;
		}

		try {
			await updateStoreMutation.mutateAsync({
				uoid: store.uoid,
				data: validation.data
			});
			toast.success('Gudang berhasil diperbarui');
			open = false;
			onSuccess?.();
		} catch (error) {
			console.error('Error updating store:', error);
			toast.error('Gagal memperbarui gudang');
		}
	}

	function handleCancel() {
		open = false;
		onClose?.();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] max-w-2xl overflow-y-auto p-4 sm:p-6">
		<Dialog.Header class="space-y-2 sm:space-y-3">
			<Dialog.Title class="text-lg sm:text-xl">Edit Gudang</Dialog.Title>
			<Dialog.Description class="text-sm">
				Perbarui informasi gudang. Klik simpan untuk menyimpan perubahan.
			</Dialog.Description>
		</Dialog.Header>

		{#if store && formData}
			<form onsubmit={handleSubmit} class="space-y-4 sm:space-y-6">
				<InfoFormSection
					bind:code={formData.code}
					bind:name={formData.name}
					bind:administrativeUnitId={formData.administrative_unit_id}
					bind:storeTypeId={formData.store_type_id}
					bind:parentStoreId={formData.parent_store_id}
					bind:isActive={formData.is_active}
					{errors}
					disabled={updateStoreMutation.isPending}
					mode="edit"
				/>

				<Dialog.Footer class="flex-col gap-2 sm:flex-row sm:gap-3">
					<Button type="button" variant="outline" onclick={handleCancel} class="w-full sm:w-auto">
						Batal
					</Button>
					<Button type="submit" disabled={updateStoreMutation.isPending} class="w-full sm:w-auto">
						{updateStoreMutation.isPending ? 'Menyimpan...' : 'Simpan'}
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
