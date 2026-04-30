<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import { Input } from '$lib/components/ui/input';
	import {
		useCreateItemConversion,
		useUpdateItemConversion,
		useDeleteItemConversion
	} from '../../hooks/useItemMutations.svelte';
	import { useUomListQuery } from '../../hooks/useDetailedItemQueries.svelte.js';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { ITEM_PERMISSIONS } from '../../constants/item-permissions';
	import type { ItemConversion, ItemComprehensiveData } from '../../types/item.types';

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_CREATE));
	const canEdit = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_UPDATE));
	const canDelete = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_DELETE));

	let {
		conversions = [],
		itemId,
		item,
		onUpdateSuccess
	}: {
		conversions?: ItemConversion[];
		itemId: string;
		item: ItemComprehensiveData | null;
		onUpdateSuccess?: () => void;
	} = $props();

	const createMutation = useCreateItemConversion();
	const updateMutation = useUpdateItemConversion();
	const deleteMutation = useDeleteItemConversion();

	// Query untuk UOM
	const uomQuery = useUomListQuery(() => ({
		page: 1,
		page_size: 100
	}));

	const availableUOMs = $derived(
		(uomQuery.data?.data ?? []).map((uom) => ({
			id: uom.id,
			value: `${uom.code} - ${uom.name}`, // displayed in list, searchable by code and name
			label: uom.code // displayed in trigger after selection
		}))
	);

	// Get base UOM info from item
	const baseUomCode = $derived(item?.base_uom?.code || '-');
	const baseUomName = $derived(item?.base_uom?.name || '-');

	const columns = [
		{ key: 'qty_konversi', label: 'Qty Konversi' },
		{ key: 'uom', label: 'Satuan Konversi' },
		{ key: 'deskripsi_satuan_konversi', label: 'Deskripsi Satuan Konversi' },
		{ key: 'faktor', label: 'Faktor' },
		{ key: 'qty_satuan_dasar', label: 'Qty Satuan Dasar' },
		{ key: 'satuan_dasar', label: 'Satuan Dasar' },
		{ key: 'deskripsi_satuan_dasar', label: 'Deskripsi Satuan Dasar' }
	];

	function getRowId(item: ItemConversion) {
		return item.uoid || '';
	}

	async function handleSave(item: ItemConversion, isNew: boolean) {
		// Validation
		if (!item.fk_uom_conversion_id) {
			toast.error('Satuan konversi wajib dipilih');
			throw new Error('Satuan konversi wajib dipilih');
		}
		if (!item.qty_satuan_dasar || item.qty_satuan_dasar <= 0) {
			toast.error('Qty satuan dasar harus lebih dari 0');
			throw new Error('Qty satuan dasar harus lebih dari 0');
		}
		if (!item.qty_konversi || item.qty_konversi <= 0) {
			toast.error('Qty konversi harus lebih dari 0');
			throw new Error('Qty konversi harus lebih dari 0');
		}

		if (isNew) {
			// Create new conversion
			return new Promise<void>((resolve, reject) => {
				createMutation.mutate(
					{
						itemId,
						data: {
							fk_uom_conversion_id: item.fk_uom_conversion_id,
							qty_satuan_dasar: item.qty_satuan_dasar,
							qty_konversi: item.qty_konversi,
							deskripsi_satuan_dasar: baseUomName,
							deskripsi_satuan_konversi: item.deskripsi_satuan_konversi || ''
						}
					},
					{
						onSuccess: () => {
							toast.success('Konversi unit berhasil ditambahkan');
							onUpdateSuccess?.();
							resolve();
						},
						onError: (error: Error) => {
							toast.error(`Gagal menambahkan konversi unit: ${error.message}`);
							reject(error);
						}
					}
				);
			});
		} else {
			// Update existing conversion
			if (!item.uoid) {
				toast.error('ID konversi tidak ditemukan');
				throw new Error('ID konversi tidak ditemukan');
			}

			return new Promise<void>((resolve, reject) => {
				updateMutation.mutate(
					{
						itemId,
						conversionId: item.uoid,
						data: {
							fk_uom_conversion_id: item.fk_uom_conversion_id,
							qty_satuan_dasar: item.qty_satuan_dasar,
							qty_konversi: item.qty_konversi,
							deskripsi_satuan_dasar: baseUomName,
							deskripsi_satuan_konversi: item.deskripsi_satuan_konversi || '',
							i_version: item.i_version || 0
						}
					},
					{
						onSuccess: () => {
							toast.success('Konversi unit berhasil diperbarui');
							onUpdateSuccess?.();
							resolve();
						},
						onError: (error: Error) => {
							toast.error(`Gagal memperbarui konversi unit: ${error.message}`);
							reject(error);
						}
					}
				);
			});
		}
	}

	async function handleDelete(item: ItemConversion) {
		if (!item.uoid) {
			toast.error('ID konversi tidak ditemukan');
			throw new Error('ID konversi tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					itemId,
					conversionId: item.uoid
				},
				{
					onSuccess: () => {
						toast.success('Konversi unit berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus konversi unit: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Konversi Unit Item"
	description="Kelola konversi satuan untuk item ini."
	addButtonText="Tambah Konversi"
	data={conversions}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data konversi unit. Klik 'Tambah Konversi' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'qty_konversi'}
			{item.qty_konversi || 0}
		{:else if column.key === 'uom'}
			<span class="font-medium">{item.uom ? `${item.uom.code}` : '-'}</span>
		{:else if column.key === 'deskripsi_satuan_konversi'}
			{item.deskripsi_satuan_konversi || '-'}
		{:else if column.key === 'faktor'}
			<span class="text-center">=</span>
		{:else if column.key === 'qty_satuan_dasar'}
			{item.qty_satuan_dasar || 0}
		{:else if column.key === 'satuan_dasar'}
			<span class="font-medium">{baseUomCode}</span>
		{:else if column.key === 'deskripsi_satuan_dasar'}
			{item.deskripsi_satuan_dasar || '-'}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'qty_konversi'}
			<Input
				type="number"
				value={item.qty_konversi || 0}
				placeholder="0"
				min="0"
				step="0.01"
				class="max-w-24"
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				oninput={(e) => {
					const value = parseFloat((e.target as HTMLInputElement).value);
					updateField('qty_konversi', isNaN(value) ? 0 : value);
				}}
			/>
		{:else if column.key === 'uom'}
			<SelectField
				options={availableUOMs}
				value={item.fk_uom_conversion_id || ''}
				placeholder="Pilih satuan"
				searchPlaceholder="Cari satuan..."
				emptyMessage="Tidak ada satuan ditemukan."
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				isLoading={uomQuery.isLoading}
				onSelect={(value) => {
					updateField('fk_uom_conversion_id', value);
					const selected = (uomQuery.data?.data ?? []).find((uom) => uom.id === value);
					if (selected) {
						updateField('uom', {
							code: selected.code,
							name: selected.name,
							uoid: selected.id
						});
						updateField('deskripsi_satuan_konversi', selected.name);
					}
				}}
			/>
		{:else if column.key === 'deskripsi_satuan_konversi'}
			<Input type="text" value={item.deskripsi_satuan_konversi || ''} placeholder="-" disabled />
		{:else if column.key === 'faktor'}
			<!-- Faktor is read-only, calculated by backend -->
			<div class="flex items-center justify-center">
				<span class="text-gray-500">=</span>
			</div>
		{:else if column.key === 'qty_satuan_dasar'}
			<Input
				type="number"
				value={item.qty_satuan_dasar || 0}
				placeholder="0"
				min="0"
				step="0.01"
				class="max-w-24"
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				oninput={(e) => {
					const value = parseFloat((e.target as HTMLInputElement).value);
					updateField('qty_satuan_dasar', isNaN(value) ? 0 : value);
				}}
			/>
		{:else if column.key === 'satuan_dasar'}
			<!-- Satuan Dasar is read-only from item.base_uom -->
			<div class="flex items-center">
				<span class="font-medium text-gray-700">{baseUomCode}</span>
			</div>
		{:else if column.key === 'deskripsi_satuan_dasar'}
			<!-- Auto-filled from base UOM name, read-only -->
			<Input type="text" value={baseUomName} placeholder="-s" disabled />
		{/if}
	{/snippet}
</EditableTable>
