<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Check, Pencil, X } from 'lucide-svelte';
	import { EditableField, EditableCombobox, EditableSwitch } from '$lib/components/shared/index.js';
	import { useUpdateStore } from '../hooks/useStoresMutations.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { useStoreDivisionListQuery } from '../hooks/useDetailedStoresQueries.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { useReadAllStores } from '../hooks/useStoresQueries.svelte';
	import { STORE_TYPE_NAME } from '../constants/store-types';
	import type { StoreItem } from '../types/store.types';

	let {
		store,
		onUpdateSuccess
	}: {
		store: StoreItem;
		onUpdateSuccess?: () => void;
	} = $props();

	let isEditing = $state(false);

	let formData = $state({
		code: '',
		name: '',
		administrative_unit_id: '',
		store_type_id: '',
		parent_store_id: '',
		is_active: true,
		i_version: 0
	});

	$effect(() => {
		if (store && !isEditing) {
			formData = {
				code: store.code,
				name: store.name,
				administrative_unit_id: store.administrative_unit_id,
				store_type_id: store.store_type_id,
				parent_store_id: store.parent_store_id || '',
				is_active: store.is_active,
				i_version: store.i_version
			};
		}
	});

	// Fetch store types
	const storeTypesQuery = useMasterTypeByNameQuery(() => ({
		name: STORE_TYPE_NAME
	}));
	const storeTypes = $derived(storeTypesQuery.data?.values || []);

	const userContext = getUserContext();

	// Fetch administrative units
	const adminUnitsQuery = useStoreDivisionListQuery(() => ({
		page: 1,
		page_size: 100
	}));
	const adminUnits = $derived.by(() => {
		const estateOption = userContext.estate
			? [{ id: userContext.estate.id, name: userContext.estate.name }]
			: [];
		const divisions = adminUnitsQuery.data?.items || [];
		return [...estateOption, ...divisions];
	});

	// Fetch parent stores
	const parentStoresQuery = useReadAllStores(() => ({
		page: 1,
		size: 100
	}));
	const parentStores = $derived(
		(parentStoresQuery.data?.data || []).filter((s) => s.uoid !== store.uoid)
	);

	const updateMutation = useUpdateStore();

	function handleEdit() {
		isEditing = true;
	}

	function handleCancel() {
		formData = {
			code: store.code,
			name: store.name,
			administrative_unit_id: store.administrative_unit_id,
			store_type_id: store.store_type_id,
			parent_store_id: store.parent_store_id || '',
			is_active: store.is_active,
			i_version: store.i_version
		};
		isEditing = false;
	}

	function handleSave() {
		if (
			!formData.code ||
			!formData.name ||
			!formData.administrative_unit_id ||
			!formData.store_type_id
		) {
			toast.error('Mohon lengkapi semua field yang wajib diisi');
			return;
		}

		const updateData = {
			code: formData.code,
			name: formData.name,
			administrative_unit_id: formData.administrative_unit_id,
			store_type_id: formData.store_type_id,
			parent_store_id: formData.parent_store_id || undefined,
			is_active: formData.is_active,
			i_version: formData.i_version
		};

		updateMutation.mutate(
			{
				uoid: store.uoid,
				data: updateData
			},
			{
				onSuccess: () => {
					toast.success('Informasi gudang berhasil diperbarui');
					isEditing = false;
					onUpdateSuccess?.();
				},
				onError: (error: Error) => {
					toast.error(`Gagal memperbarui gudang: ${error.message}`);
				}
			}
		);
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<Card.Title>Informasi Gudang</Card.Title>
				<Card.Description>Informasi dasar gudang</Card.Description>
			</div>
			<div class="flex gap-2">
				{#if isEditing}
					<Button
						variant="outline"
						size="sm"
						onclick={handleCancel}
						disabled={updateMutation.isPending}
					>
						<X class="mr-2 h-4 w-4" />
						Batal
					</Button>
					<Button
						size="sm"
						onclick={handleSave}
						disabled={updateMutation.isPending}
						class="bg-[#0f4c2a] hover:bg-[#0d4023]"
					>
						{#if updateMutation.isPending}
							Menyimpan...
						{:else}
							<Check class="mr-2 h-4 w-4" />
							Simpan
						{/if}
					</Button>
				{:else}
					<Button variant="outline" size="sm" onclick={handleEdit}>
						<Pencil class="mr-2 h-4 w-4" />
						Edit
					</Button>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
			<!-- Kode -->
			<EditableField
				label="Kode"
				bind:value={formData.code}
				placeholder="Masukkan kode gudang"
				{isEditing}
				disabled={updateMutation.isPending}
				id="code"
			/>

			<!-- Nama -->
			<EditableField
				label="Nama Gudang"
				bind:value={formData.name}
				placeholder="Masukkan nama gudang"
				{isEditing}
				disabled={updateMutation.isPending}
				id="name"
			/>

			<!-- Tipe Gudang -->
			<EditableCombobox
				label="Tipe Gudang"
				bind:value={formData.store_type_id}
				displayValue={store.store_type?.value}
				placeholder="Pilih tipe gudang"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={storeTypesQuery.isLoading}
				options={storeTypes.map((t) => ({ id: t.id, name: t.value || '' }))}
				id="store_type"
			/>

			<!-- Unit Administrasi -->
			<EditableCombobox
				label="Unit Administrasi"
				bind:value={formData.administrative_unit_id}
				displayValue={store.administrative_unit?.name}
				placeholder="Pilih unit administrasi"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={adminUnitsQuery.isLoading}
				options={adminUnits.map((u) => ({ id: u.id, name: u.name }))}
				id="admin_unit"
			/>

			<!-- Gudang Induk -->
			<EditableCombobox
				label="Gudang Induk"
				bind:value={formData.parent_store_id}
				displayValue={store.parent_store?.name}
				placeholder="Pilih gudang induk (opsional)"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={parentStoresQuery.isLoading}
				options={parentStores.map((s) => ({ id: s.uoid, name: s.name }))}
				id="parent_store"
				class="md:col-span-2"
			/>

			<!-- Status -->
			<EditableSwitch
				label="Status"
				bind:checked={formData.is_active}
				{isEditing}
				disabled={updateMutation.isPending}
				activeText="Aktif"
				inactiveText="Tidak Aktif"
				id="is_active"
				class="md:col-span-2"
			/>
		</div>
	</Card.Content>
</Card.Root>
