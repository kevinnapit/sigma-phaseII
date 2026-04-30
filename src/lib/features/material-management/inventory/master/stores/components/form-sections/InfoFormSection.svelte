<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { useStoreDivisionListQuery } from '../../hooks/useDetailedStoresQueries.svelte';
	import { useReadAllStores } from '../../hooks/useStoresQueries.svelte';
	import { STORE_TYPE_NAMES } from '../../constants/store-types';
	import SelectForm from './SelectFormSection.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let {
		code = $bindable(''),
		name = $bindable(''),
		administrativeUnitId = $bindable(''),
		storeTypeId = $bindable(''),
		parentStoreId = $bindable(undefined),
		isActive = $bindable(true),
		errors = {},
		disabled = false,
		mode = 'create'
	}: {
		code: string;
		name: string;
		administrativeUnitId: string;
		storeTypeId: string;
		parentStoreId: string | undefined;
		isActive: boolean;
		errors: Record<string, string>;
		disabled?: boolean;
		mode?: 'create' | 'edit';
	} = $props();

	let debouncedParentStoreSearch = $state('');
	let parentStoreSearch = $state('');

	$effect(() => {
		parentStoreSearch;
		const timer = setTimeout(() => {
			debouncedParentStoreSearch = parentStoreSearch;
		}, 300);
		return () => clearTimeout(timer);
	});

	const administrativeUnitsQuery = useStoreDivisionListQuery(() => ({
		page_size: 100
	}));

	const storeTypesQuery = useMasterTypeByNameQuery(() => ({
		name: STORE_TYPE_NAMES.STORE_TYPE
	}));

	const parentStoresQuery = useReadAllStores(() => ({
		page: 1,
		size: 100,
		search: debouncedParentStoreSearch || undefined
	}));

	const userContext = getUserContext();

	const administrativeUnits = $derived.by(() => {
		const estateOption = userContext.estate
			? [{ value: userContext.estate.id, label: userContext.estate.name }]
			: [];
		const divisionOptions =
			administrativeUnitsQuery.data?.items?.map((unit: any) => ({
				value: unit.id,
				label: unit.name
			})) || [];
		return [...estateOption, ...divisionOptions];
	});

	const storeTypes = $derived(
		storeTypesQuery.data?.values?.map((type: any) => ({
			value: type.id,
			label: type.value
		})) || []
	);

	const parentStores = $derived(
		parentStoresQuery.data?.data?.map((store: any) => ({
			value: store.uoid,
			label: store.name
		})) || []
	);
</script>

<div class="grid gap-3 sm:grid-cols-2 sm:gap-4">
	<div class="space-y-1.5 sm:space-y-2">
		<Label for="code" class="text-sm">Kode Gudang <span class="text-red-500">*</span></Label>
		<Input
			id="code"
			name="code"
			bind:value={code}
			placeholder="Masukkan kode gudang"
			class="w-full text-sm"
			{disabled}
		/>
		{#if errors.code}
			<p class="text-xs text-red-500">{errors.code}</p>
		{/if}
	</div>

	<div class="space-y-1.5 sm:space-y-2">
		<Label for="name" class="text-sm">Nama Gudang <span class="text-red-500">*</span></Label>
		<Input
			id="name"
			name="name"
			bind:value={name}
			placeholder="Masukkan nama gudang"
			class="w-full text-sm"
			{disabled}
		/>
		{#if errors.name}
			<p class="text-xs text-red-500">{errors.name}</p>
		{/if}
	</div>

	<div class="space-y-1.5 sm:space-y-2">
		<Label for="administrative_unit_id" class="text-sm">
			Unit Administrasi <span class="text-red-500">*</span>
		</Label>
		<SelectForm
			bind:value={administrativeUnitId}
			options={administrativeUnits}
			{disabled}
			placeholder="Pilih unit administrasi"
			searchPlaceholder="Cari unit administrasi..."
			emptyText="Tidak ada unit administrasi ditemukan."
			isLoading={administrativeUnitsQuery.isLoading}
		/>
		{#if errors.administrative_unit_id}
			<p class="text-xs text-red-500">{errors.administrative_unit_id}</p>
		{/if}
	</div>

	<div class="space-y-1.5 sm:space-y-2">
		<Label for="store_type_id" class="text-sm"
			>Tipe Gudang <span class="text-red-500">*</span></Label
		>
		<SelectForm
			bind:value={storeTypeId}
			options={storeTypes}
			{disabled}
			placeholder="Pilih tipe gudang"
			searchPlaceholder="Cari tipe gudang..."
			emptyText="Tidak ada tipe gudang ditemukan."
			isLoading={storeTypesQuery.isLoading}
		/>
		{#if errors.store_type_id}
			<p class="text-xs text-red-500">{errors.store_type_id}</p>
		{/if}
	</div>

	<div class="space-y-1.5 sm:col-span-2 sm:space-y-2">
		<Label for="parent_store_id" class="text-sm">Gudang Induk (Opsional)</Label>
		<SelectForm
			bind:value={parentStoreId}
			options={parentStores}
			{disabled}
			placeholder="Pilih gudang induk"
			searchPlaceholder="Cari gudang..."
			emptyText="Tidak ada gudang ditemukan."
			isLoading={parentStoresQuery.isLoading}
			onSearchChange={(search) => (parentStoreSearch = search)}
		/>
		{#if errors.parent_store_id}
			<p class="text-xs text-red-500">{errors.parent_store_id}</p>
		{/if}
	</div>
</div>

<div class="flex items-center gap-2 pt-2">
	<Switch id="is_active" bind:checked={isActive} {disabled} />
	<Label for="is_active" class="text-sm">Status Aktif</Label>
</div>
