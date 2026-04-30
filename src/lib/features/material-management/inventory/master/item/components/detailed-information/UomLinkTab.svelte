<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import {
		useCreateItemUOMLink,
		useUpdateItemUOMLink,
		useDeleteItemUOMLink
	} from '../../hooks/useItemMutations.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte.js';
	import { useUomListQuery } from '../../hooks/useDetailedItemQueries.svelte.js';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { ITEM_PERMISSIONS } from '../../constants/item-permissions';
	import { MASTER_VALUE_TYPE } from '../../constants/master-value-types';
	import type { ItemUOMLink } from '../../types/item.types';

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_CREATE));
	const canEdit = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_UPDATE));
	const canDelete = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_DELETE));

	let {
		uomLinks = [],
		itemId,
		onUpdateSuccess
	}: {
		uomLinks?: ItemUOMLink[];
		itemId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const createMutation = useCreateItemUOMLink();
	const updateMutation = useUpdateItemUOMLink();
	const deleteMutation = useDeleteItemUOMLink();

	// Query untuk Stores Movement Type
	const movementTypesQuery = useMasterTypeByNameQuery(() => ({
		name: MASTER_VALUE_TYPE.STORES_MOVEMENT_TYPE
	}));
	const movementTypes = $derived(movementTypesQuery.data?.values || []);

	const availableMovementTypes = $derived(
		movementTypes.map((type) => ({
			id: type.id,
			value: type.value || ''
		}))
	);

	// Query untuk UOM
	const uomQuery = useUomListQuery(() => ({
		page: 1,
		page_size: 100
	}));

	const availableUOMs = $derived(
		(uomQuery.data?.data ?? []).map((uom) => ({
			id: uom.id,
			value: uom.name
		}))
	);

	const columns = [
		{ key: 'stores_movement_type', label: 'Tipe Pergerakan' },
		{ key: 'uom', label: 'Satuan' }
	];

	function getRowId(item: ItemUOMLink) {
		return item.uoid || '';
	}

	async function handleSave(item: ItemUOMLink, isNew: boolean) {
		if (!item.fk_master_value_stores_movement_type_id) {
			toast.error('Tipe pergerakan wajib dipilih');
			throw new Error('Tipe pergerakan wajib dipilih');
		}
		if (!item.fk_uom_hdrid) {
			toast.error('Satuan wajib dipilih');
			throw new Error('Satuan wajib dipilih');
		}

		if (isNew) {
			// Create new UOM link
			return new Promise<void>((resolve, reject) => {
				createMutation.mutate(
					{
						itemId,
						data: {
							fk_master_value_stores_movement_type_id: item.fk_master_value_stores_movement_type_id,
							fk_uom_hdrid: item.fk_uom_hdrid
						}
					},
					{
						onSuccess: () => {
							toast.success('Pemetaan satuan berhasil ditambahkan');
							onUpdateSuccess?.();
							resolve();
						},
						onError: (error: Error) => {
							toast.error(`Gagal menambahkan pemetaan satuan: ${error.message}`);
							reject(error);
						}
					}
				);
			});
		} else {
			// Update existing UOM link
			if (!item.uoid) {
				toast.error('ID pemetaan satuan tidak ditemukan');
				throw new Error('ID pemetaan satuan tidak ditemukan');
			}

			return new Promise<void>((resolve, reject) => {
				updateMutation.mutate(
					{
						itemId,
						linkId: item.uoid,
						data: {
							fk_master_value_stores_movement_type_id: item.fk_master_value_stores_movement_type_id,
							fk_uom_hdrid: item.fk_uom_hdrid,
							i_version: item.i_version || 0
						}
					},
					{
						onSuccess: () => {
							toast.success('Pemetaan satuan berhasil diperbarui');
							onUpdateSuccess?.();
							resolve();
						},
						onError: (error: Error) => {
							toast.error(`Gagal memperbarui pemetaan satuan: ${error.message}`);
							reject(error);
						}
					}
				);
			});
		}
	}

	async function handleDelete(item: ItemUOMLink) {
		if (!item.uoid) {
			toast.error('ID pemetaan satuan tidak ditemukan');
			throw new Error('ID pemetaan satuan tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					itemId,
					linkId: item.uoid
				},
				{
					onSuccess: () => {
						toast.success('Pemetaan satuan berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus pemetaan satuan: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Pemetaan Transaksi Satuan"
	description="Informasi pemetaan satuan untuk transaksi"
	addButtonText="Tambah Pemetaan"
	data={uomLinks}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data pemetaan satuan. Klik 'Tambah Pemetaan' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'stores_movement_type'}
			<span class="font-medium">{item.stores_movement_type?.value || '-'}</span>
		{:else if column.key === 'uom'}
			{item.uom ? `${item.uom.name}` : '-'}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'stores_movement_type'}
			<SelectField
				options={availableMovementTypes}
				value={item.fk_master_value_stores_movement_type_id || ''}
				placeholder="Pilih tipe pergerakan"
				searchPlaceholder="Cari tipe pergerakan..."
				emptyMessage="Tidak ada tipe pergerakan ditemukan."
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				isLoading={movementTypesQuery.isLoading}
				onSelect={(value) => {
					updateField('fk_master_value_stores_movement_type_id', value);
					const selected = movementTypes.find((type) => type.id === value);
					if (selected) {
						updateField('stores_movement_type', {
							code: selected.code,
							uoid: selected.id,
							value: selected.value
						});
					}
				}}
			/>
		{:else if column.key === 'uom'}
			<SelectField
				options={availableUOMs}
				value={item.fk_uom_hdrid || ''}
				placeholder="Pilih satuan"
				searchPlaceholder="Cari satuan..."
				emptyMessage="Tidak ada satuan ditemukan."
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				isLoading={uomQuery.isLoading}
				onSelect={(value) => {
					updateField('fk_uom_hdrid', value);
					const selected = (uomQuery.data?.data ?? []).find((uom) => uom.id === value);
					if (selected) {
						updateField('uom', {
							code: selected.code,
							name: selected.name,
							uoid: selected.id
						});
					}
				}}
			/>
		{/if}
	{/snippet}
</EditableTable>
