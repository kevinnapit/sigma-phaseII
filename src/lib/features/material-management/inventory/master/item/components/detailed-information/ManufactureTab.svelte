<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { EditableTable } from '$lib/components/shared';
	import {
		useCreateItemManufacture,
		useUpdateItemManufacture,
		useDeleteItemManufacture
	} from '../../hooks/useItemMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { ITEM_PERMISSIONS } from '../../constants/item-permissions';
	import type { ItemManufacture } from '../../types/item.types';

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_CREATE));
	const canEdit = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_UPDATE));
	const canDelete = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_DELETE));

	let {
		manufactures = [],
		itemId,
		onUpdateSuccess
	}: {
		manufactures?: ItemManufacture[];
		itemId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const createMutation = useCreateItemManufacture();
	const updateMutation = useUpdateItemManufacture();
	const deleteMutation = useDeleteItemManufacture();

	const columns = [
		{ key: 'name', label: 'Nama' },
		{ key: 'reference_code', label: 'Kode Referensi' }
	];

	function getRowId(item: ItemManufacture) {
		return item.uoid || '';
	}

	async function handleSave(item: ItemManufacture, isNew: boolean) {
		if (!item.name?.trim()) {
			toast.error('Nama manufaktur wajib diisi');
			throw new Error('Nama manufaktur wajib diisi');
		}

		if (isNew) {
			// Create new manufacture
			return new Promise<void>((resolve, reject) => {
				createMutation.mutate(
					{
						itemId,
						data: {
							name: item.name,
							reference_code: item.reference_code || ''
						}
					},
					{
						onSuccess: () => {
							toast.success('Manufaktur berhasil ditambahkan');
							onUpdateSuccess?.();
							resolve();
						},
						onError: (error: Error) => {
							toast.error(`Gagal menambahkan manufaktur: ${error.message}`);
							reject(error);
						}
					}
				);
			});
		} else {
			// Update existing manufacture
			if (!item.uoid) {
				toast.error('ID manufaktur tidak ditemukan');
				throw new Error('ID manufaktur tidak ditemukan');
			}

			return new Promise<void>((resolve, reject) => {
				updateMutation.mutate(
					{
						itemId,
						manufactureId: item.uoid,
						data: {
							name: item.name,
							reference_code: item.reference_code || '',
							i_version: item.i_version || 0
						}
					},
					{
						onSuccess: () => {
							toast.success('Manufaktur berhasil diperbarui');
							onUpdateSuccess?.();
							resolve();
						},
						onError: (error: Error) => {
							toast.error(`Gagal memperbarui manufaktur: ${error.message}`);
							reject(error);
						}
					}
				);
			});
		}
	}

	async function handleDelete(item: ItemManufacture) {
		if (!item.uoid) {
			toast.error('ID manufaktur tidak ditemukan');
			throw new Error('ID manufaktur tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					itemId,
					manufactureId: item.uoid
				},
				{
					onSuccess: () => {
						toast.success('Manufaktur berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus manufaktur: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Manufaktur"
	description="Informasi manufaktur barang"
	addButtonText="Tambah Manufaktur"
	data={manufactures}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data manufaktur. Klik 'Tambah Manufaktur' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'name'}
			<span class="font-medium">{item.name || '-'}</span>
		{:else if column.key === 'reference_code'}
			{item.reference_code || '-'}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'name'}
			<Input
				bind:value={item.name}
				placeholder="Nama manufaktur"
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('name', e.currentTarget.value)}
			/>
		{:else if column.key === 'reference_code'}
			<Input
				bind:value={item.reference_code}
				placeholder="Kode referensi"
				disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('reference_code', e.currentTarget.value)}
			/>
		{/if}
	{/snippet}
</EditableTable>
