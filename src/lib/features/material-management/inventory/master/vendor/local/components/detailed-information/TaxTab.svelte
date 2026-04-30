<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { EditableTable, SelectField } from '$lib/components/shared';
	import {
		useUpdateLocalVendorTaxRegistrations,
		useDeleteLocalVendorTaxRegistration
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { ADDITIONAL_CHARGE_DISCOUNT_TYPE_ID } from '../../constants/vendor-types';
	import type { TaxRegistrationItem } from '../../types/vendor-local.types';

	let {
		taxRegistrations = [],
		vendorId,
		onUpdateSuccess
	}: {
		taxRegistrations?: TaxRegistrationItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const taxTypesQuery = useMasterTypeByNameQuery(() => ({
		name: ADDITIONAL_CHARGE_DISCOUNT_TYPE_ID
	}));
	const availableTaxTypes = $derived(
		(taxTypesQuery.data?.values || []).map((tt) => ({ id: tt.id, value: tt.value }))
	);

	const updateMutation = useUpdateLocalVendorTaxRegistrations();
	const deleteMutation = useDeleteLocalVendorTaxRegistration();

	const authCtx = getUserContext();
	const canAdd = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.CREATE));
	const canEdit = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.UPDATE));
	const canDelete = $derived(authCtx.hasPermission(VENDOR_PERMISSIONS.DELETE));

	const columns = [
		{ key: 'additional_charge_discount_code', label: 'Pajak' },
		{ key: 'number', label: 'No. Registrasi' },
		{ key: 'date', label: 'Tanggal Registrasi' },
		{ key: 'expiry_date', label: 'Tanggal Kadaluarsa' }
	];

	function getRowId(item: TaxRegistrationItem) {
		return item.uoid || item.id || '';
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
			return '';
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

	async function handleSave(item: TaxRegistrationItem, isNew: boolean) {
		if (!item.additional_charge_discount_id) {
			toast.error('Mohon pilih jenis pajak');
			throw new Error('Jenis pajak wajib diisi');
		}
		if (!item.number) {
			toast.error('Mohon isi nomor registrasi');
			throw new Error('Nomor registrasi wajib diisi');
		}
		if (!item.date) {
			toast.error('Mohon isi tanggal registrasi');
			throw new Error('Tanggal registrasi wajib diisi');
		}
		if (!item.expiry_date) {
			toast.error('Mohon isi tanggal kadaluarsa');
			throw new Error('Tanggal kadaluarsa wajib diisi');
		}

		// Prepare data for API - send ALL existing data plus the new/edited one
		let allTaxData: any[] = [];

		if (isNew) {
			// When adding new: send all existing data + new data
			allTaxData = [
				...taxRegistrations.map((t) => ({
					additional_charge_discount_id: t.additional_charge_discount_id,
					number: t.number,
					date: formatDateForAPI(t.date),
					expiry_date: formatDateForAPI(t.expiry_date),
					i_version: t.i_version || 0,
					uoid: t.uoid || t.id
				})),
				{
					additional_charge_discount_id: item.additional_charge_discount_id,
					number: item.number,
					date: formatDateForAPI(item.date),
					expiry_date: formatDateForAPI(item.expiry_date)
				}
			];
		} else {
			// When editing: send all data with the edited one updated
			const itemId = getRowId(item);
			allTaxData = taxRegistrations.map((t) => {
				const tId = t.uoid || t.id;
				if (tId === itemId) {
					// This is the edited row - use the edited data
					return {
						additional_charge_discount_id: item.additional_charge_discount_id,
						number: item.number,
						date: formatDateForAPI(item.date),
						expiry_date: formatDateForAPI(item.expiry_date),
						i_version: item.i_version || 0,
						uoid: item.uoid || item.id
					};
				} else {
					// Keep existing data unchanged - use ORIGINAL data from t
					return {
						additional_charge_discount_id: t.additional_charge_discount_id,
						number: t.number,
						date: formatDateForAPI(t.date),
						expiry_date: formatDateForAPI(t.expiry_date),
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
					data: { tax: allTaxData }
				},
				{
					onSuccess: () => {
						toast.success(
							isNew
								? 'Registrasi pajak berhasil ditambahkan'
								: 'Registrasi pajak berhasil diperbarui'
						);
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menyimpan registrasi pajak: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}

	async function handleDelete(item: TaxRegistrationItem) {
		if (!item.uoid && !item.id) {
			toast.error('ID registrasi pajak tidak ditemukan');
			throw new Error('ID registrasi pajak tidak ditemukan');
		}

		return new Promise<void>((resolve, reject) => {
			deleteMutation.mutate(
				{
					uoid: vendorId,
					taxRegistrationUoid: item.uoid || item.id || '',
					i_version: item.i_version || 0
				},
				{
					onSuccess: () => {
						toast.success('Registrasi pajak berhasil dihapus');
						onUpdateSuccess?.();
						resolve();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menghapus registrasi pajak: ${error.message}`);
						reject(error);
					}
				}
			);
		});
	}
</script>

<EditableTable
	title="Registrasi Pajak"
	description="Informasi registrasi pajak vendor"
	addButtonText="Tambah Registrasi Pajak"
	data={taxRegistrations}
	{columns}
	{getRowId}
	onSave={handleSave}
	onDelete={handleDelete}
	isSaving={updateMutation.isPending || deleteMutation.isPending}
	{canAdd}
	{canEdit}
	{canDelete}
	emptyMessage="Tidak ada data registrasi pajak. Klik 'Tambah Registrasi Pajak' untuk menambah."
>
	{#snippet renderCell({ item, column })}
		{#if column.key === 'additional_charge_discount_code'}
			<span class="font-medium">{item.additional_charge_discount_code || '-'}</span>
		{:else if column.key === 'number'}
			{item.number || '-'}
		{:else if column.key === 'date'}
			{formatDate(item.date)}
		{:else if column.key === 'expiry_date'}
			{formatDate(item.expiry_date)}
		{/if}
	{/snippet}

	{#snippet renderEditCell({ item, column, updateField })}
		{#if column.key === 'additional_charge_discount_code'}
			<SelectField
				options={availableTaxTypes}
				value={item.additional_charge_discount_id || ''}
				placeholder="Pilih jenis pajak"
				searchPlaceholder="Cari jenis pajak..."
				emptyMessage="Tidak ada jenis pajak ditemukan."
				disabled={updateMutation.isPending || deleteMutation.isPending}
				isLoading={taxTypesQuery.isLoading}
				onSelect={(value) => {
					updateField('additional_charge_discount_id', value);
					const selected = availableTaxTypes.find((tt) => tt.id === value);
					if (selected) {
						updateField('additional_charge_discount_code', selected.value);
					}
				}}
			/>
		{:else if column.key === 'number'}
			<Input
				bind:value={item.number}
				placeholder="Nomor registrasi"
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('number', e.currentTarget.value)}
			/>
		{:else if column.key === 'date'}
			<Input
				type="date"
				value={formatDateForInput(item.date)}
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('date', e.currentTarget.value)}
			/>
		{:else if column.key === 'expiry_date'}
			<Input
				type="date"
				value={formatDateForInput(item.expiry_date)}
				disabled={updateMutation.isPending || deleteMutation.isPending}
				class="h-9"
				onchange={(e) => updateField('expiry_date', e.currentTarget.value)}
			/>
		{/if}
	{/snippet}
</EditableTable>
