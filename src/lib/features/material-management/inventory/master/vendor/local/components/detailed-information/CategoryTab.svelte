<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import {
		useUpdateLocalVendorPartyTypes,
		useDeleteLocalVendorPartyType
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { PARTY_TYPE_ID } from '../../constants/vendor-types';
	import type { PartyTypeItem } from '../../types/vendor-local.types';

	let {
		partyTypes = [],
		vendorId,
		onUpdateSuccess
	}: {
		partyTypes?: PartyTypeItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const partyTypesQuery = useMasterTypeByNameQuery(() => ({
		name: PARTY_TYPE_ID
	}));
	const availablePartyTypes = $derived(
		(partyTypesQuery.data?.values || []).map((pt) => ({ id: pt.id, value: pt.value }))
	);

	const updateMutation = useUpdateLocalVendorPartyTypes();
	const deleteMutation = useDeleteLocalVendorPartyType();

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.CREATE));
	const canEdit = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.UPDATE));
	const canDelete = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.DELETE));

	const columns = [
		{ key: 'party_type_value', label: 'Kategori' },
		{ key: 'payee', label: 'Penerima Pembayaran' },
		{ key: 'credit_period_in_days', label: 'Periode Kredit (Hari)', align: 'right' as const }
	];

	function getRowId(item: PartyTypeItem) {
		return item.uoid || item.id || '';
	}

	async function handleSave(item: PartyTypeItem, isNew: boolean) {
		if (!item.party_type_id) {
			toast.error('Mohon pilih kategori');
			throw new Error('Kategori wajib diisi');
		}
		if (!item.payee) {
			toast.error('Mohon isi penerima pembayaran');
			throw new Error('penerima pembayaran wajib diisi');
		}
		if (!item.credit_period_in_days) {
			toast.error('Mohon isi periode kredit');
			throw new Error('periode kredit wajib diisi');
		}

		// Prepare data for API - send ALL existing data plus the new/edited one
		let allCategoryData: any[] = [];

		if (isNew) {
			allCategoryData = [
				// Send all existing data
				...partyTypes.map((t) => ({
					party_type_id: t.party_type_id,
					payee: t.payee,
					credit_period_in_days: t.credit_period_in_days,
					i_version: t.i_version || 0,
					uoid: t.uoid || t.id
				})),
				// Add new data
				{
					party_type_id: item.party_type_id,
					payee: item.payee,
					credit_period_in_days: item.credit_period_in_days
				}
			];
		} else {
			// When editing: send all data with the edited one updated
			const itemId = getRowId(item);
			allCategoryData = partyTypes.map((t) => {
				const tId = t.uoid || t.id;
				if (tId === itemId) {
					// This is the edited row - use the edited data
					return {
						party_type_id: item.party_type_id,
						payee: item.payee,
						credit_period_in_days: item.credit_period_in_days,
						i_version: item.i_version || 0,
						uoid: item.uoid || item.id
					};
				} else {
					// Keep existing data unchanged - use ORIGINAL data from t
					return {
						party_type_id: t.party_type_id,
						payee: t.payee,
						credit_period_in_days: t.credit_period_in_days,
						i_version: t.i_version || 0,
						uoid: tId
					};
				}
			});
		}

		return new Promise<void>((resolve, reject) => {
			updateMutation.mutate(
				{
					uoid: vendorId,
					data: { category: allCategoryData }
				},
				{
					onSuccess: () => {
						toast.success(isNew ? 'Kategori berhasil ditambahkan' : 'Kategori berhasil diperbarui');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menyimpan kategori: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}

	async function handleDelete(item: PartyTypeItem) {
		if (!item.uoid && !item.id) {
			toast.error('ID kategori tidak ditemukan');
			throw new Error('ID kategori tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					uoid: vendorId,
					partyTypeUoid: item.uoid || item.id || '',
					i_version: item.i_version || 0
				},
				{
					onSuccess: () => {
						toast.success('Kategori berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus kategori: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Kategori"
	description="Informasi kategori vendor"
	addButtonText="Tambah Kategori"
	data={partyTypes}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data kategori. Klik 'Tambah Kategori' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'party_type_value'}
			<span class="font-medium">{item.party_type_value || '-'}</span>
		{:else if column.key === 'payee'}
			{item.payee || '-'}
		{:else if column.key === 'credit_period_in_days'}
			{item.credit_period_in_days || 0}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'party_type_value'}
			<SelectField
				options={availablePartyTypes}
				value={item.party_type_id || ''}
				placeholder="Pilih kategori"
				searchPlaceholder="Cari kategori..."
				emptyMessage="Tidak ada kategori ditemukan."
				disabled={updateMutation.isPending || deleteMutation.isPending}
				isLoading={partyTypesQuery.isLoading}
				onSelect={(value) => {
					updateField('party_type_id', value);
					const selected = availablePartyTypes.find((pt) => pt.id === value);
					if (selected) {
						updateField('party_type_value', selected.value);
					}
				}}
			/>
		{:else if column.key === 'payee'}
			<Input
				bind:value={item.payee}
				placeholder="Penerima pembayaran"
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('payee', e.currentTarget.value)}
			/>
		{:else if column.key === 'credit_period_in_days'}
			<Input
				type="number"
				bind:value={item.credit_period_in_days}
				placeholder="0"
				disabled={updateMutation.isPending || deleteMutation.isPending}
				min="0"
				class="h-9 text-right"
				onchange={(e) => updateField('credit_period_in_days', parseInt(e.currentTarget.value) || 0)}
			/>
		{/if}
	{/snippet}
</EditableTable>
