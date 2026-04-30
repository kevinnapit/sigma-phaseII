<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import {
		useUpdateLocalVendorCustomProperties,
		useDeleteLocalVendorCustomProperty
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { CUSTOM_PROPERTY_TYPE_ID } from '../../constants/vendor-types';
	import type { CustomPropertyItem } from '../../types/vendor-local.types';

	let {
		customProperties = [],
		vendorId,
		onUpdateSuccess
	}: {
		customProperties?: CustomPropertyItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const customPropertyTypesQuery = useMasterTypeByNameQuery(() => ({
		name: CUSTOM_PROPERTY_TYPE_ID
	}));
	const availableCustomPropertyTypes = $derived(
		(customPropertyTypesQuery.data?.values || []).map((cpt) => ({ id: cpt.id, value: cpt.value }))
	);

	const updateMutation = useUpdateLocalVendorCustomProperties();
	const deleteMutation = useDeleteLocalVendorCustomProperty();

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.CREATE));
	const canEdit = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.UPDATE));
	const canDelete = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.DELETE));

	const columns = [
		{ key: 'custom_property_value', label: 'Properti Kustom' },
		{ key: 'value', label: 'Nilai' }
	];

	function getRowId(item: CustomPropertyItem) {
		return item.uoid || item.id || '';
	}

	async function handleSave(item: CustomPropertyItem, isNew: boolean) {
		if (!item.custom_property_id) {
			toast.error('Mohon pilih properti kustom');
			throw new Error('Properti kustom wajib diisi');
		}
		if (!item.value) {
			toast.error('Mohon isi nilai');
			throw new Error('Nilai wajib diisi');
		}

		// Prepare data for API - send ALL existing data plus the new/edited one
		let allCustomPropertyData: any[] = [];

		if (isNew) {
			// When adding new: send all existing data + new data
			allCustomPropertyData = [
				...customProperties.map((cp) => ({
					custom_property_id: cp.custom_property_id,
					value: cp.value,
					i_version: cp.i_version || 0,
					uoid: cp.uoid || cp.id
				})),
				{
					custom_property_id: item.custom_property_id,
					value: item.value
				}
			];
		} else {
			// When editing: send all data with the edited one updated
			const itemId = getRowId(item);
			allCustomPropertyData = customProperties.map((cp) => {
				const cpId = cp.uoid || cp.id;
				if (cpId === itemId) {
					// This is the edited row - use the edited data
					return {
						custom_property_id: item.custom_property_id,
						value: item.value,
						i_version: item.i_version || 0,
						uoid: item.uoid || item.id
					};
				} else {
					// Keep existing data unchanged - use ORIGINAL data from cp
					return {
						custom_property_id: cp.custom_property_id,
						value: cp.value,
						i_version: cp.i_version || 0,
						uoid: cpId
					};
				}
			});
		}

		return new Promise<void>((resolve, reject) => {
			updateMutation.mutate(
				{
					uoid: vendorId,
					data: { property: allCustomPropertyData }
				},
				{
					onSuccess: () => {
						toast.success(
							isNew ? 'Properti kustom berhasil ditambahkan' : 'Properti kustom berhasil diperbarui'
						);
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menyimpan properti kustom: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}

	async function handleDelete(item: CustomPropertyItem) {
		if (!item.uoid && !item.id) {
			toast.error('ID properti kustom tidak ditemukan');
			throw new Error('ID properti kustom tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					uoid: vendorId,
					customPropertyUoid: item.uoid || item.id || '',
					i_version: item.i_version || 0
				},
				{
					onSuccess: () => {
						toast.success('Properti kustom berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus properti kustom: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Properti Kustom"
	description="Informasi properti kustom vendor"
	addButtonText="Tambah Properti Kustom"
	data={customProperties}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada properti kustom. Klik 'Tambah Properti Kustom' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'custom_property_value'}
			<span class="font-medium">{item.custom_property_value || '-'}</span>
		{:else if column.key === 'value'}
			{item.value || '-'}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'custom_property_value'}
			<SelectField
				options={availableCustomPropertyTypes}
				value={item.custom_property_id || ''}
				placeholder="Pilih properti kustom"
				searchPlaceholder="Cari properti kustom..."
				emptyMessage="Tidak ada properti kustom ditemukan."
				disabled={updateMutation.isPending || deleteMutation.isPending}
				isLoading={customPropertyTypesQuery.isLoading}
				onSelect={(value) => {
					updateField('custom_property_id', value);
					const selected = availableCustomPropertyTypes.find((cpt) => cpt.id === value);
					if (selected) {
						updateField('custom_property_value', selected.value);
					}
				}}
			/>
		{:else if column.key === 'value'}
			<Input
				bind:value={item.value}
				placeholder="Nilai"
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('value', e.currentTarget.value)}
			/>
		{/if}
	{/snippet}
</EditableTable>
