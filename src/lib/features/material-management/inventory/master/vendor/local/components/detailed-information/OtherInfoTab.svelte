<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { EditableTable } from '$lib/components/shared';
	import {
		useUpdateLocalVendorOtherInfos,
		useDeleteLocalVendorOtherInfo
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import type { OtherInfoItem } from '../../types/vendor-local.types';

	let {
		otherInfos = [],
		vendorId,
		onUpdateSuccess
	}: {
		otherInfos?: OtherInfoItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const updateMutation = useUpdateLocalVendorOtherInfos();
	const deleteMutation = useDeleteLocalVendorOtherInfo();

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.CREATE));
	const canEdit = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.UPDATE));
	const canDelete = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.DELETE));

	const columns = [
		{ key: 'date', label: 'Tanggal' },
		{ key: 'remarks', label: 'Catatan' }
	];

	function getRowId(item: OtherInfoItem) {
		return item.uoid || '';
	}

	function formatDate(dateString: string): string {
		if (!dateString) return '-';
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('id-ID', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			});
		} catch (e) {
			return dateString;
		}
	}

	function formatDateForInput(dateString: string): string {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return date.toISOString().split('T')[0];
		} catch (e) {
			return dateString;
		}
	}

	function formatDateForAPI(dateString: string): string {
		if (!dateString) return '';

		if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
			return dateString;
		}

		try {
			const date = new Date(dateString);
			return date.toISOString().split('T')[0];
		} catch (e) {
			return dateString;
		}
	}

	async function handleSave(item: OtherInfoItem, isNew: boolean) {
		if (!item.date) {
			toast.error('Mohon isi tanggal');
			throw new Error('Tanggal wajib diisi');
		}
		if (!item.remarks) {
			toast.error('Mohon isi catatan');
			throw new Error('Catatan wajib diisi');
		}

		// Prepare data for API - send ALL existing data plus the new/edited one
		let allOtherInfoData: any[] = [];

		if (isNew) {
			// When adding new: send all existing data + new data
			allOtherInfoData = [
				...otherInfos.map((info) => ({
					date: formatDateForAPI(info.date),
					remarks: info.remarks,
					i_version: info.i_version || 0,
					uoid: info.uoid
				})),
				{
					date: formatDateForAPI(item.date),
					remarks: item.remarks
				}
			];
		} else {
			// When editing: send all data with the edited one updated
			const itemId = getRowId(item);
			allOtherInfoData = otherInfos.map((info) => {
				const infoId = info.uoid;
				if (infoId === itemId) {
					// This is the edited row - use the edited data
					return {
						date: formatDateForAPI(item.date),
						remarks: item.remarks,
						i_version: item.i_version || 0,
						uoid: item.uoid
					};
				} else {
					// Keep existing data unchanged - use ORIGINAL data from info
					return {
						date: formatDateForAPI(info.date),
						remarks: info.remarks,
						i_version: info.i_version || 0,
						uoid: infoId
					};
				}
			});
		}

		return new Promise<void>((resolve, reject) => {
			updateMutation.mutate(
				{
					uoid: vendorId,
					data: { other_info: allOtherInfoData }
				},
				{
					onSuccess: () => {
						toast.success(
							isNew ? 'Informasi berhasil ditambahkan' : 'Informasi berhasil diperbarui'
						);
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menyimpan informasi: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}

	async function handleDelete(item: OtherInfoItem) {
		if (!item.uoid) {
			toast.error('ID informasi tidak ditemukan');
			throw new Error('ID informasi tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					uoid: vendorId,
					infoId: item.uoid || '',
					i_version: item.i_version || 0
				},
				{
					onSuccess: () => {
						toast.success('Informasi berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus informasi: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Informasi Lainnya"
	description="Informasi tambahan vendor"
	addButtonText="Tambah Informasi"
	data={otherInfos}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada informasi lainnya. Klik 'Tambah Informasi' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'date'}
			<span class="font-medium">{formatDate(item.date)}</span>
		{:else if column.key === 'remarks'}
			{item.remarks || '-'}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'date'}
			<Input
				type="date"
				value={formatDateForInput(item.date)}
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('date', e.currentTarget.value)}
			/>
		{:else if column.key === 'remarks'}
			<Input
				bind:value={item.remarks}
				placeholder="Catatan"
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('remarks', e.currentTarget.value)}
			/>
		{/if}
	{/snippet}
</EditableTable>
