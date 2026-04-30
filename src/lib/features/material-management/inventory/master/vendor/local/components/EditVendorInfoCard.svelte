<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Check, Pencil, X } from 'lucide-svelte';
	import { EditableField, EditableCombobox, EditableSwitch } from '$lib/components/shared/index.js';
	import { useUpdateLocalVendor } from '../hooks/useVendorsLocalMutations.svelte';
	import { useAccountByModuleName } from '../hooks/useDetailedVendorsQueries.svelte.js';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte.js';
	import { PARTY_TYPE_ID } from '../constants/vendor-types';
	import Guard from '$lib/components/shared/guard.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import type { LocalVendorItem } from '../types/vendor-local.types';

	let {
		vendor,
		onUpdateSuccess
	}: {
		vendor: LocalVendorItem;
		onUpdateSuccess?: () => void;
	} = $props();

	let isEditing = $state(false);

	let formData = $state({
		code: '',
		name: '',
		short_name: '',
		company_name: '',
		license_registration_number: '',
		notes: '',
		is_active: true,
		fk_party_default_category_id: '',
		fk_default_account_id: ''
	});

	$effect(() => {
		if (vendor && !isEditing) {
			formData = {
				code: vendor.code,
				name: vendor.name,
				short_name: vendor.short_name,
				company_name: vendor.company_name,
				license_registration_number: vendor.license_registration_number || '',
				notes: vendor.notes || '',
				is_active: vendor.is_active,
				fk_party_default_category_id: vendor.fk_party_default_category_id || '',
				fk_default_account_id: vendor.fk_default_account_id || ''
			};
		}
	});

	const categoriesQuery = useMasterTypeByNameQuery(() => ({
		name: PARTY_TYPE_ID
	}));
	const categories = $derived(categoriesQuery.data?.values || []);

	const accountsQuery = useAccountByModuleName('inventory');
	const accounts = $derived(accountsQuery.data?.data || []);

	const updateMutation = useUpdateLocalVendor();

	function handleEdit() {
		isEditing = true;
	}

	function handleCancel() {
		formData = {
			code: vendor.code,
			name: vendor.name,
			short_name: vendor.short_name,
			company_name: vendor.company_name,
			license_registration_number: vendor.license_registration_number || '',
			notes: vendor.notes || '',
			is_active: vendor.is_active,
			fk_party_default_category_id: vendor.fk_party_default_category_id || '',
			fk_default_account_id: vendor.fk_default_account_id || ''
		};
		isEditing = false;
	}

	function handleSave() {
		if (!formData.code || !formData.name || !formData.short_name || !formData.company_name) {
			toast.error('Mohon lengkapi semua field yang wajib diisi');
			return;
		}

		updateMutation.mutate(
			{
				uoid: vendor.uoid,
				data: formData,
				i_version: vendor.i_version
			},
			{
				onSuccess: () => {
					toast.success('Informasi vendor berhasil diperbarui');
					isEditing = false;
					onUpdateSuccess?.();
				},
				onError: (error: Error) => {
					toast.error(`Gagal memperbarui vendor: ${error.message}`);
				}
			}
		);
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row justify-between gap-4 sm:items-center">
			<div>
				<Card.Title>Informasi Vendor</Card.Title>
				<Card.Description>Informasi dasar vendor</Card.Description>
			</div>
			<div class="flex gap-2">
				{#if isEditing}
					<Button
						variant="outline"
						size="sm"
						onclick={handleCancel}
						disabled={updateMutation.isPending}
					>
						<X class="mr-2 h-4 w-4" />
						Batal
					</Button>
					<Guard permissions={VENDOR_PERMISSIONS.UPDATE}>
						<Button
							size="sm"
							onclick={handleSave}
							disabled={updateMutation.isPending}
							class="bg-[#0f4c2a] hover:bg-[#0d4023]"
						>
							{#if updateMutation.isPending}
								Menyimpan...
							{:else}
								<Check class="mr-2 h-4 w-4" />
								Simpan
							{/if}
						</Button>
					</Guard>
				{:else}
					<Guard permissions={VENDOR_PERMISSIONS.UPDATE}>
						<Button variant="outline" size="sm" onclick={handleEdit}>
							<Pencil class="mr-2 h-4 w-4" />
							Edit
						</Button>
					</Guard>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
			<!-- Kode -->
			<EditableField
				label="Kode"
				bind:value={formData.code}
				placeholder="Masukkan kode vendor"
				{isEditing}
				disabled={updateMutation.isPending}
				id="code"
			/>

			<!-- Nama Singkat -->
			<EditableField
				label="Nama Singkat"
				bind:value={formData.short_name}
				placeholder="Masukkan nama singkat"
				{isEditing}
				disabled={updateMutation.isPending}
				id="short_name"
			/>

			<!-- Nama -->
			<EditableField
				label="Nama"
				bind:value={formData.name}
				placeholder="Masukkan nama vendor"
				{isEditing}
				disabled={updateMutation.isPending}
				id="name"
			/>

			<!-- Nama Perusahaan -->
			<EditableField
				label="Nama Perusahaan"
				bind:value={formData.company_name}
				placeholder="Masukkan nama perusahaan"
				{isEditing}
				disabled={updateMutation.isPending}
				id="company_name"
			/>

			<!-- Akun Default -->
			<EditableCombobox
				label="Akun Default"
				bind:value={formData.fk_default_account_id}
				displayValue={vendor.default_account
					? `${vendor.default_account.code} - ${vendor.default_account.name}`
					: undefined}
				placeholder="Pilih akun"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={accountsQuery.isLoading}
				options={accounts.map((a) => ({ id: a.id, name: `${a.code} - ${a.name}` }))}
				id="account"
			/>

			<!-- Kategori Standar -->
			<EditableCombobox
				label="Kategori Standar"
				bind:value={formData.fk_party_default_category_id}
				displayValue={vendor.party_default_category?.value}
				placeholder="Pilih kategori"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={categoriesQuery.isLoading}
				options={categories.map((c) => ({ id: c.id, name: c.value || '' }))}
				id="category"
			/>

			<!-- No. Lisensi/Registrasi -->
			<EditableField
				label="No. Lisensi/Registrasi"
				bind:value={formData.license_registration_number}
				placeholder="Masukkan nomor lisensi"
				{isEditing}
				disabled={updateMutation.isPending}
				id="license"
			/>

			<!-- Status Registrasi -->
			<div class="space-y-2">
				<span class="text-sm font-medium">Status Registrasi</span>
				<div class="flex items-center">
					{#if vendor.vendor_user?.registration_status}
						<span class="text-sm font-medium text-green-600">Sudah Diregistrasi</span>
					{:else}
						<span class="text-sm text-gray-500">Belum Diregistrasi</span>
					{/if}
				</div>
			</div>

			<!-- Catatan (hanya tampil saat editing) -->
			{#if isEditing}
				<EditableField
					label="Catatan"
					bind:value={formData.notes}
					placeholder="Masukkan catatan (opsional)"
					{isEditing}
					disabled={updateMutation.isPending}
					multiline={true}
					rows={3}
					id="notes"
					class="md:col-span-2"
				/>
			{/if}

			<!-- Status -->
			<EditableSwitch
				label="Status"
				bind:checked={formData.is_active}
				{isEditing}
				disabled={updateMutation.isPending}
				activeText="Aktif"
				inactiveText="Tidak Aktif"
				id="is_active"
				class="md:col-span-2"
			/>
		</div>
	</Card.Content>
</Card.Root>
