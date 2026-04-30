<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import {
		useUpdateLocalVendorBanks,
		useDeleteLocalVendorBank
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import { useBranchQuery } from '../../hooks/useDetailedVendorsQueries.svelte.js';
	import type { BankItem } from '../../types/vendor-local.types';

	let {
		banks = [],
		vendorId,
		onUpdateSuccess
	}: {
		banks?: BankItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const branchQuery = useBranchQuery();
	const availableBranches = $derived(
		(branchQuery.data?.data || []).map((branch) => ({
			id: branch.uoid,
			value: branch.name
		}))
	);

	const updateMutation = useUpdateLocalVendorBanks();
	const deleteMutation = useDeleteLocalVendorBank();

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.CREATE));
	const canEdit = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.UPDATE));
	const canDelete = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.DELETE));

	const columns = [
		{ key: 'branch_name', label: 'Bank' },
		{ key: 'account_number', label: 'No. Rekening' }
	];

	function getRowId(item: BankItem) {
		return item.party_bank_id || '';
	}

	async function handleSave(item: BankItem, isNew: boolean) {
		if (!item.branch_id) {
			toast.error('Mohon pilih cabang');
			throw new Error('Cabang wajib diisi');
		}
		if (!item.account_number) {
			toast.error('Mohon isi nomor rekening');
			throw new Error('Nomor rekening wajib diisi');
		}

		// Prepare data for API - send ALL existing data plus the new/edited one
		let allBankData: any[] = [];

		if (isNew) {
			// When adding new: send all existing data + new data
			allBankData = [
				...banks.map((b) => ({
					branch_id: b.branch_id,
					account_number: b.account_number,
					i_version: b.i_version || 0,
					party_bank_id: b.party_bank_id
				})),
				{
					branch_id: item.branch_id,
					account_number: item.account_number
				}
			];
		} else {
			// When editing: send all data with the edited one updated
			const itemId = getRowId(item);
			allBankData = banks.map((b) => {
				const bId = b.party_bank_id;
				if (bId === itemId) {
					// This is the edited row - use the edited data
					return {
						branch_id: item.branch_id,
						account_number: item.account_number,
						i_version: item.i_version || 0,
						party_bank_id: item.party_bank_id
					};
				} else {
					// Keep existing data unchanged - use ORIGINAL data from b
					return {
						branch_id: b.branch_id,
						account_number: b.account_number,
						i_version: b.i_version || 0,
						party_bank_id: bId
					};
				}
			});
		}

		return new Promise<void>((resolve, reject) => {
			updateMutation.mutate(
				{
					uoid: vendorId,
					data: { bank: allBankData }
				},
				{
					onSuccess: () => {
						toast.success(isNew ? 'Bank berhasil ditambahkan' : 'Bank berhasil diperbarui');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menyimpan bank: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}

	async function handleDelete(item: BankItem) {
		if (!item.party_bank_id) {
			toast.error('ID bank tidak ditemukan');
			throw new Error('ID bank tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					uoid: vendorId,
					bankId: item.party_bank_id || '',
					i_version: item.i_version || 0
				},
				{
					onSuccess: () => {
						toast.success('Bank berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus bank: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Bank"
	description="Informasi bank vendor"
	addButtonText="Tambah Bank"
	data={banks}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data bank. Klik 'Tambah Bank' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'branch_name'}
			<span class="font-medium">{item.branch_name || '-'}</span>
		{:else if column.key === 'account_number'}
			{item.account_number || '-'}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'branch_name'}
			<SelectField
				options={availableBranches}
				value={item.branch_id || ''}
				placeholder="Pilih bank"
				searchPlaceholder="Cari bank..."
				emptyMessage="Tidak ada bank ditemukan."
				disabled={updateMutation.isPending || deleteMutation.isPending}
				isLoading={branchQuery.isLoading}
				onSelect={(value) => {
					updateField('branch_id', value);
					const selected = branchQuery.data?.data.find((branch) => branch.uoid === value);
					if (selected) {
						updateField('branch_name', selected.name);
						updateField('bank_name', selected.bank.name);
						updateField('bank_id', selected.bank_id);
					}
				}}
			/>
		{:else if column.key === 'account_number'}
			<Input
				bind:value={item.account_number}
				placeholder="Nomor rekening"
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('account_number', e.currentTarget.value)}
			/>
		{/if}
	{/snippet}
</EditableTable>
