<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import {
		useUpdateLocalVendorTransactionTypes,
		useDeleteLocalVendorTransactionType
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte.js';
	import { useAccountByModuleName } from '../../hooks/useDetailedVendorsQueries.svelte.js';
	import { TRANSACTION_TYPE_ID, PARTY_TYPE_ID } from '../../constants/vendor-types';
	import type { TransactionTypeItem } from '../../types/vendor-local.types';

	let {
		transactionTypes = [],
		vendorId,
		onUpdateSuccess
	}: {
		transactionTypes?: TransactionTypeItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const partyTypesQuery = useMasterTypeByNameQuery(() => ({
		name: PARTY_TYPE_ID
	}));
	const availablePartyTypes = $derived(
		(partyTypesQuery.data?.values || []).map((pt) => ({ id: pt.id, value: pt.value }))
	);

	const transactionTypesQuery = useMasterTypeByNameQuery(() => ({
		name: TRANSACTION_TYPE_ID
	}));
	const availableTransactionTypes = $derived(
		(transactionTypesQuery.data?.values || []).map((tt) => ({ id: tt.id, value: tt.value }))
	);

	const accountsQuery = useAccountByModuleName('inventory');
	const accounts = $derived(
		(accountsQuery.data?.data || []).map((a) => ({
			id: a.id,
			value: a.name
		}))
	);

	const updateMutation = useUpdateLocalVendorTransactionTypes();
	const deleteMutation = useDeleteLocalVendorTransactionType();

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.CREATE));
	const canEdit = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.UPDATE));
	const canDelete = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.DELETE));

	const columns = [
		{ key: 'party_type_value', label: 'Kategori' },
		{ key: 'transaction_type_value', label: 'Tipe Transaksi' },
		{ key: 'account_name', label: 'Akun' }
	];

	function getRowId(item: TransactionTypeItem) {
		return item.uoid || item.id || '';
	}

	async function handleSave(item: TransactionTypeItem, isNew: boolean) {
		if (!item.party_type_id) {
			toast.error('Mohon pilih kategori');
			throw new Error('Kategori wajib diisi');
		}
		if (!item.transaction_type_id) {
			toast.error('Mohon pilih tipe transaksi');
			throw new Error('Tipe transaksi wajib diisi');
		}
		if (!item.account_id) {
			toast.error('Mohon pilih akun');
			throw new Error('Akun wajib diisi');
		}

		// Prepare data for API - send ALL existing data plus the new/edited one
		let allTransactionData: any[] = [];

		if (isNew) {
			allTransactionData = [
				// Send all existing data
				...transactionTypes.map((t) => ({
					party_type_id: t.party_type_id,
					transaction_type_id: t.transaction_type_id,
					account_id: t.account_id,
					i_version: t.i_version || 0,
					uoid: t.uoid || t.id
				})),
				// Add new data
				{
					party_type_id: item.party_type_id,
					transaction_type_id: item.transaction_type_id,
					account_id: item.account_id
				}
			];
		} else {
			// When editing: send all data with the edited one updated
			const itemId = getRowId(item);
			allTransactionData = transactionTypes.map((t) => {
				const tId = t.uoid || t.id;
				if (tId === itemId) {
					// This is the edited row - use the edited data
					return {
						party_type_id: item.party_type_id,
						transaction_type_id: item.transaction_type_id,
						account_id: item.account_id,
						i_version: item.i_version || 0,
						uoid: item.uoid || item.id
					};
				} else {
					// Keep existing data unchanged - use ORIGINAL data from t
					return {
						party_type_id: t.party_type_id,
						transaction_type_id: t.transaction_type_id,
						account_id: t.account_id,
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
					data: { transaction_type: allTransactionData }
				},
				{
					onSuccess: () => {
						toast.success(
							isNew ? 'Tipe transaksi berhasil ditambahkan' : 'Tipe transaksi berhasil diperbarui'
						);
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menyimpan tipe transaksi: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}

	async function handleDelete(item: TransactionTypeItem) {
		if (!item.uoid && !item.id) {
			toast.error('ID tipe transaksi tidak ditemukan');
			throw new Error('ID tipe transaksi tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					uoid: vendorId,
					transactionTypeUoid: item.uoid || item.id || '',
					i_version: item.i_version || 0
				},
				{
					onSuccess: () => {
						toast.success('Tipe transaksi berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus tipe transaksi: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Tipe Transaksi"
	description="Informasi tipe transaksi vendor"
	addButtonText="Tambah Tipe Transaksi"
	data={transactionTypes}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data tipe transaksi. Klik 'Tambah Tipe Transaksi' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'party_type_value'}
			<span class="font-medium">{item.party_type_value || '-'}</span>
		{:else if column.key === 'transaction_type_value'}
			{item.transaction_type_value || '-'}
		{:else if column.key === 'account_name'}
			{item.account_name || '-'}
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
		{:else if column.key === 'transaction_type_value'}
			<SelectField
				options={availableTransactionTypes}
				value={item.transaction_type_id || ''}
				placeholder="Pilih tipe transaksi"
				searchPlaceholder="Cari tipe transaksi..."
				emptyMessage="Tidak ada tipe transaksi ditemukan."
				disabled={updateMutation.isPending || deleteMutation.isPending}
				isLoading={transactionTypesQuery.isLoading}
				onSelect={(value) => {
					updateField('transaction_type_id', value);
					const selected = availableTransactionTypes.find((tt) => tt.id === value);
					if (selected) {
						updateField('transaction_type_value', selected.value);
					}
				}}
			/>
		{:else if column.key === 'account_name'}
			<SelectField
				options={accounts}
				value={item.account_id || ''}
				placeholder="Pilih akun"
				searchPlaceholder="Cari akun..."
				emptyMessage="Tidak ada akun ditemukan."
				disabled={updateMutation.isPending || deleteMutation.isPending}
				isLoading={accountsQuery.isLoading}
				onSelect={(value) => {
					updateField('account_id', value);
					const selected = accounts.find((a) => a.id === value);
					if (selected) {
						updateField('account_name', selected.value);
					}
				}}
			/>
		{/if}
	{/snippet}
</EditableTable>
