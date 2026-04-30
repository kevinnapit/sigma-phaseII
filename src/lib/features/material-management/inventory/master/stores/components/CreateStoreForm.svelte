<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { useCreateStore } from '../hooks/useStoresMutations.svelte';
	import { createStoreSchema, type CreateStoreSchema } from '../schemas/create-store.schema';
	import InfoFormSection from './form-sections/InfoFormSection.svelte';

	let {
		open = $bindable(false),
		onClose,
		onSuccess
	}: {
		open: boolean;
		onClose?: () => void;
		onSuccess?: () => void;
	} = $props();

	let formData = $state<CreateStoreSchema>({
		administrative_unit_id: '',
		code: '',
		is_active: true,
		name: '',
		parent_store_id: undefined,
		store_type_id: ''
	});

	let errors = $state<Record<string, string>>({});

	const createStoreMutation = useCreateStore();

	$effect(() => {
		if (open) {
			resetForm();
		}
	});

	function resetForm() {
		formData = {
			administrative_unit_id: '',
			code: '',
			is_active: true,
			name: '',
			parent_store_id: undefined,
			store_type_id: ''
		};
		errors = {};
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errors = {};

		const validation = createStoreSchema.safeParse(formData);
		if (!validation.success) {
			validation.error.issues.forEach((issue) => {
				if (issue.path[0]) {
					errors[issue.path[0] as string] = issue.message;
				}
			});
			return;
		}

		try {
			await createStoreMutation.mutateAsync(validation.data);
			toast.success('Gudang berhasil dibuat');
			resetForm();
			open = false;
			onSuccess?.();
		} catch (error) {
			console.error('Error creating store:', error);
			toast.error('Gagal membuat gudang');
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
			<Dialog.Title class="text-lg sm:text-xl">Tambah Gudang Baru</Dialog.Title>
			<Dialog.Description class="text-sm">
				Isi data gudang baru untuk sistem material management
			</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4 sm:space-y-6">
			<InfoFormSection
				bind:code={formData.code}
				bind:name={formData.name}
				bind:administrativeUnitId={formData.administrative_unit_id}
				bind:storeTypeId={formData.store_type_id}
				bind:parentStoreId={formData.parent_store_id}
				bind:isActive={formData.is_active}
				{errors}
				disabled={createStoreMutation.isPending}
				mode="create"
			/>

			<Dialog.Footer class="flex-col gap-2 sm:flex-row sm:gap-3">
				<Button type="button" variant="outline" onclick={handleCancel} class="w-full sm:w-auto">
					Batal
				</Button>
				<Button type="submit" disabled={createStoreMutation.isPending} class="w-full sm:w-auto">
					{createStoreMutation.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
