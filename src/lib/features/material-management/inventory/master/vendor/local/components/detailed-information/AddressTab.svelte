<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Check, Pencil, Plus, Trash2, X } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { EditableField, EditableCombobox } from '$lib/components/shared/index.js';
	import {
		useUpdateLocalVendorAddresses,
		useDeleteLocalVendorAddress
	} from '../../hooks/useVendorsLocalMutations.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { COUNTRY_TYPE_ID, COMMUNICATION_TYPE_ID } from '../../constants/vendor-types';
	import { addressSchema } from '../../schemas/create-vendor.schema';
	import Guard from '$lib/components/shared/guard.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import type { AddressItem } from '../../types/vendor-local.types';

	let {
		addresses = [],
		vendorId,
		onUpdateSuccess
	}: {
		addresses?: AddressItem[];
		vendorId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const primaryAddress = $derived(addresses[0] || null);
	const hasAddress = $derived(!!primaryAddress);

	let isEditing = $state(false);
	let deleteDialogOpen = $state(false);
	let errors = $state<Record<string, string>>({});

	let formData = $state({
		address: '',
		address_type: 'Default',
		city: '',
		communication_type_ids: [] as string[],
		contact_person: '',
		country_id: '',
		designation: '',
		email: '',
		email_alt: '',
		fax: '',
		i_version: 0,
		link_id: '',
		mobile: '',
		remarks: '',
		state: '',
		tel: '',
		url: '',
		zip: ''
	});

	// Update form data when address changes or when entering edit mode
	$effect(() => {
		if (!isEditing && primaryAddress) {
			// Extract communication_type_ids from communication_types array if available
			const commTypeIds = primaryAddress.communication_types
				? primaryAddress.communication_types.map((ct) => ct.id)
				: primaryAddress.communication_type_ids || [];

			formData = {
				address: primaryAddress.address || '',
				address_type: primaryAddress.address_type || 'Default',
				city: primaryAddress.city || '',
				communication_type_ids: commTypeIds,
				contact_person: primaryAddress.contact_person || '',
				country_id: primaryAddress.country_id || '',
				designation: primaryAddress.designation || '',
				email: primaryAddress.email || '',
				email_alt: primaryAddress.email_alt || '',
				fax: primaryAddress.fax || '',
				i_version: primaryAddress.i_version || 0,
				link_id: primaryAddress.uoid || '',
				mobile: primaryAddress.mobile || '',
				remarks: primaryAddress.remarks || '',
				state: primaryAddress.state || '',
				tel: primaryAddress.tel || '',
				url: primaryAddress.url || '',
				zip: primaryAddress.zip || ''
			};
		} else if (!isEditing && !primaryAddress) {
			// Reset to empty form when no address
			formData = {
				address: '',
				address_type: 'Default',
				city: '',
				communication_type_ids: [],
				contact_person: '',
				country_id: '',
				designation: '',
				email: '',
				email_alt: '',
				fax: '',
				i_version: 0,
				link_id: '',
				mobile: '',
				remarks: '',
				state: '',
				tel: '',
				url: '',
				zip: ''
			};
		}
	});

	const countriesQuery = useMasterTypeByNameQuery(() => ({
		name: COUNTRY_TYPE_ID
	}));
	const countries = $derived(countriesQuery.data?.values || []);

	const communicationTypesQuery = useMasterTypeByNameQuery(() => ({
		name: COMMUNICATION_TYPE_ID
	}));
	const communicationTypes = $derived(communicationTypesQuery.data?.values || []);
	const selectedCommunicationTypes = $derived(
		communicationTypes.filter((ct) => formData.communication_type_ids.includes(ct.id))
	);

	const updateMutation = useUpdateLocalVendorAddresses();
	const deleteMutation = useDeleteLocalVendorAddress();

	function handleEdit() {
		isEditing = true;
	}

	function handleCancel() {
		// Reset errors
		errors = {};

		// Reset form data
		if (primaryAddress) {
			// Extract communication_type_ids from communication_types array if available
			const commTypeIds = primaryAddress.communication_types
				? primaryAddress.communication_types.map((ct) => ct.id)
				: primaryAddress.communication_type_ids || [];

			formData = {
				address: primaryAddress.address || '',
				address_type: primaryAddress.address_type || 'Default',
				city: primaryAddress.city || '',
				communication_type_ids: commTypeIds,
				contact_person: primaryAddress.contact_person || '',
				country_id: primaryAddress.country_id || '',
				designation: primaryAddress.designation || '',
				email: primaryAddress.email || '',
				email_alt: primaryAddress.email_alt || '',
				fax: primaryAddress.fax || '',
				i_version: primaryAddress.i_version || 0,
				link_id: primaryAddress.uoid || '',
				mobile: primaryAddress.mobile || '',
				remarks: primaryAddress.remarks || '',
				state: primaryAddress.state || '',
				tel: primaryAddress.tel || '',
				url: primaryAddress.url || '',
				zip: primaryAddress.zip || ''
			};
		} else {
			formData = {
				address: '',
				address_type: 'Default',
				city: '',
				communication_type_ids: [],
				contact_person: '',
				country_id: '',
				designation: '',
				email: '',
				email_alt: '',
				fax: '',
				i_version: 0,
				link_id: '',
				mobile: '',
				remarks: '',
				state: '',
				tel: '',
				url: '',
				zip: ''
			};
		}
		isEditing = false;
	}

	function handleSave() {
		// Reset errors
		errors = {};

		// Prepare data for validation
		const dataToValidate = {
			address: formData.address,
			address_type: formData.address_type,
			city: formData.city,
			communication_type_ids: formData.communication_type_ids,
			contact_person: formData.contact_person,
			country_id: formData.country_id,
			designation: formData.designation,
			email: formData.email,
			email_alt: formData.email_alt,
			fax: formData.fax,
			mobile: formData.mobile,
			remarks: formData.remarks,
			state: formData.state,
			tel: formData.tel,
			url: formData.url,
			zip: formData.zip
		};

		// Validate with Zod schema
		const validation = addressSchema.safeParse(dataToValidate);
		if (!validation.success) {
			validation.error.issues.forEach((issue) => {
				if (issue.path[0]) {
					errors[issue.path[0] as string] = issue.message;
				}
			});
			toast.error('Silahkan Lengkapi Data');
			return;
		}

		const addressData: any = {
			address: formData.address,
			address_type: formData.address_type,
			city: formData.city,
			communication_type_ids: formData.communication_type_ids,
			contact_person: formData.contact_person,
			country_id: formData.country_id,
			designation: formData.designation,
			email: formData.email,
			email_alt: formData.email_alt,
			fax: formData.fax,
			mobile: formData.mobile,
			remarks: formData.remarks,
			state: formData.state,
			tel: formData.tel,
			url: formData.url,
			zip: formData.zip
		};

		if (hasAddress && formData.link_id) {
			addressData.link_id = formData.link_id;
			addressData.i_version = formData.i_version;
		}

		updateMutation.mutate(
			{
				uoid: vendorId,
				data: { address: [addressData] }
			},
			{
				onSuccess: () => {
					toast.success(hasAddress ? 'Alamat berhasil diperbarui' : 'Alamat berhasil ditambahkan');
					isEditing = false;
					errors = {};
					onUpdateSuccess?.();
				},
				onError: (error: Error) => {
					toast.error(`Gagal menyimpan alamat: ${error.message}`);
				}
			}
		);
	}

	function handleDeleteClick() {
		deleteDialogOpen = true;
	}

	async function handleDeleteConfirm() {
		if (!primaryAddress) return;

		try {
			await deleteMutation.mutateAsync({
				uoid: vendorId,
				linkId: primaryAddress.uoid,
				i_version: primaryAddress.i_version || 0
			});
			toast.success('Alamat berhasil dihapus');
			deleteDialogOpen = false;
			onUpdateSuccess?.();
		} catch (error) {
			console.error('Error deleting address:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Gagal menghapus alamat. Silakan coba lagi.';
			toast.error(errorMessage);
		}
	}

	function toggleCommunicationType(typeId: string) {
		if (formData.communication_type_ids.includes(typeId)) {
			formData.communication_type_ids = formData.communication_type_ids.filter(
				(id) => id !== typeId
			);
		} else {
			formData.communication_type_ids = [...formData.communication_type_ids, typeId];
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<Card.Title>Alamat</Card.Title>
				<Card.Description>Informasi alamat vendor</Card.Description>
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
				{:else if !hasAddress}
					<Guard permissions={VENDOR_PERMISSIONS.CREATE}>
						<Button variant="outline" size="sm" onclick={handleEdit}>
							<Plus class="mr-2 h-4 w-4" />
							Tambah Alamat
						</Button>
					</Guard>
				{:else}
					<Guard permissions={VENDOR_PERMISSIONS.UPDATE}>
						<Button variant="outline" size="sm" onclick={handleEdit}>
							<Pencil class="mr-2 h-4 w-4" />
							Edit
						</Button>
					</Guard>
					<Guard permissions={VENDOR_PERMISSIONS.DELETE}>
						<Button
							variant="outline"
							size="sm"
							onclick={handleDeleteClick}
							class="text-red-600 hover:text-red-700"
						>
							<Trash2 class="mr-2 h-4 w-4" />
							Hapus
						</Button>
					</Guard>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
			<!-- Tipe -->
			<EditableCombobox
				label="Tipe"
				bind:value={formData.address_type}
				displayValue={formData.address_type || 'Default'}
				placeholder="Pilih tipe alamat"
				{isEditing}
				disabled={updateMutation.isPending}
				options={[{ id: 'Default', name: 'Default' }]}
				id="address_type"
			/>

			<!-- Nama Kontak -->
			<EditableField
				label="Nama Kontak"
				bind:value={formData.contact_person}
				placeholder="Masukkan nama kontak"
				{isEditing}
				disabled={updateMutation.isPending}
				id="contact_person"
			/>

			<!-- Alamat -->
			<EditableField
				label="Alamat"
				bind:value={formData.address}
				placeholder="Masukkan alamat lengkap"
				{isEditing}
				disabled={updateMutation.isPending}
				multiline={true}
				rows={3}
				id="address"
			/>

			<!-- Catatan -->
			<EditableField
				label="Catatan"
				bind:value={formData.remarks}
				placeholder="Masukkan catatan (opsional)"
				{isEditing}
				disabled={updateMutation.isPending}
				multiline={true}
				rows={3}
				id="remarks"
			/>

			<!-- Kota -->
			<EditableField
				label="Kota"
				bind:value={formData.city}
				placeholder="Masukkan kota"
				{isEditing}
				disabled={updateMutation.isPending}
				id="city"
			/>

			<!-- Provinsi -->
			<EditableField
				label="Provinsi"
				bind:value={formData.state}
				placeholder="Masukkan provinsi"
				{isEditing}
				disabled={updateMutation.isPending}
				id="state"
			/>

			<!-- Kode Pos -->
			<EditableField
				label="Kode Pos"
				bind:value={formData.zip}
				placeholder="Masukkan kode pos"
				{isEditing}
				disabled={updateMutation.isPending}
				id="zip"
			/>

			<!-- Negara -->
			<div class="space-y-2">
				<EditableCombobox
					label="Negara"
					bind:value={formData.country_id}
					displayValue={primaryAddress?.country_value}
					placeholder="Pilih negara"
					{isEditing}
					disabled={updateMutation.isPending}
					isLoading={countriesQuery.isLoading}
					required={true}
					options={countries.map((c) => ({ id: c.id, name: c.value || '' }))}
					id="country"
				/>
				{#if errors.country_id}
					<p class="text-xs text-red-500">{errors.country_id}</p>
				{/if}
			</div>

			<!-- Telepon -->
			<EditableField
				label="Telepon"
				bind:value={formData.tel}
				placeholder="Masukkan nomor telepon"
				{isEditing}
				disabled={updateMutation.isPending}
				type="tel"
				id="tel"
			/>

			<!-- Ponsel -->
			<EditableField
				label="Ponsel"
				bind:value={formData.mobile}
				placeholder="Masukkan nomor ponsel"
				{isEditing}
				disabled={updateMutation.isPending}
				type="tel"
				id="mobile"
			/>

			<!-- Fax -->
			<EditableField
				label="Fax"
				bind:value={formData.fax}
				placeholder="Masukkan nomor fax"
				{isEditing}
				disabled={updateMutation.isPending}
				type="tel"
				id="fax"
			/>

			<!-- Email -->
			<div class="space-y-2">
				<EditableField
					label="Email"
					bind:value={formData.email}
					placeholder="Masukkan email"
					{isEditing}
					disabled={updateMutation.isPending}
					type="email"
					id="email"
				/>
				{#if errors.email}
					<p class="text-xs text-red-500">{errors.email}</p>
				{/if}
			</div>

			<!-- Email Alternatif -->
			<div class="space-y-2">
				<EditableField
					label="Email Alternatif"
					bind:value={formData.email_alt}
					placeholder="Masukkan email alternatif"
					{isEditing}
					disabled={updateMutation.isPending}
					type="email"
					id="email_alt"
				/>
				{#if errors.email_alt}
					<p class="text-xs text-red-500">{errors.email_alt}</p>
				{/if}
			</div>

			<!-- Situs Web -->
			<div class="space-y-2">
				<EditableField
					label="Situs Web"
					bind:value={formData.url}
					placeholder="Masukkan URL situs web"
					{isEditing}
					disabled={updateMutation.isPending}
					id="url"
				/>
				{#if errors.url}
					<p class="text-xs text-red-500">{errors.url}</p>
				{/if}
			</div>

			<!-- Opsi Pengiriman -->
			<div class="space-y-2">
				<Label class="text-sm font-medium text-gray-700">Opsi Pengiriman</Label>
				{#if isEditing}
					<div class="space-y-2">
						{#if communicationTypes.length > 0}
							{#each communicationTypes as commType}
								<div class="flex items-center gap-2">
									<Checkbox
										id={`comm-${commType.id}`}
										checked={formData.communication_type_ids.includes(commType.id)}
										onCheckedChange={() => toggleCommunicationType(commType.id)}
										disabled={updateMutation.isPending}
									/>
									<Label for={`comm-${commType.id}`} class="text-sm font-normal">
										{commType.value}
									</Label>
								</div>
							{/each}
						{:else}
							<p class="text-sm text-gray-400">
								{communicationTypesQuery.isLoading
									? 'Memuat...'
									: 'Tidak ada opsi pengiriman tersedia'}
							</p>
						{/if}
					</div>
				{:else}
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<div class="space-y-1">
							{#if selectedCommunicationTypes.length > 0}
								{#each selectedCommunicationTypes as commType}
									<div class="flex items-center gap-2">
										<div
											class="flex h-4 w-4 items-center justify-center rounded border border-[#0f4c2a] bg-[#0f4c2a]"
										>
											<Check class="h-3 w-3 text-white" />
										</div>
										<span class="text-sm text-gray-900">{commType.value}</span>
									</div>
								{/each}
							{:else}
								<p class="text-sm text-gray-400">Tidak ada opsi pengiriman</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Jabatan -->
			<EditableField
				label="Jabatan"
				bind:value={formData.designation}
				placeholder="Masukkan jabatan"
				{isEditing}
				disabled={updateMutation.isPending}
				id="designation"
			/>
		</div>
	</Card.Content>
</Card.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Alamat</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleDeleteConfirm}
				disabled={deleteMutation.isPending}
				class="bg-red-600 hover:bg-red-700"
			>
				{deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
