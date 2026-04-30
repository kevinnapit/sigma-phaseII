<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Pencil, Check, X, Plus, Trash2, Upload } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { EditableField, EditableSwitch, EditableCombobox } from '$lib/components/shared/index.js';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ITEM_PERMISSIONS } from '../constants/item-permissions';
	import {
		useCreateItemVRL,
		useUpdateItemVRL,
		useDeleteItemVRL
	} from '../hooks/useItemMutations.svelte';
	import { useAlokasiUmumListQuery } from '../hooks/useDetailedItemQueries.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { MASTER_VALUE_TYPE } from '../constants/master-value-types';
	import type { ItemVRLDetailData } from '../types/item.types';

	let {
		itemVRL,
		itemId,
		onUpdateSuccess
	}: {
		itemVRL: ItemVRLDetailData | null;
		itemId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	const hasVRL = $derived(!!itemVRL);

	let isEditing = $state(false);
	let deleteDialogOpen = $state(false);
	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);
	let alokasiSearchQuery = $state('');

	// Query for Alokasi Umum list with search support
	const alokasiQuery = useAlokasiUmumListQuery(() => ({
		page: 1,
		page_size: 100,
		name: alokasiSearchQuery || undefined
	}));
	const alokasiList = $derived(alokasiQuery.data?.data || []);
	const alokasiItems = $derived(
		alokasiList.map((item) => ({
			uoid: item.id,
			name: item.name
		}))
	);

	// Query for Valuation Type (frontend search)
	const valuationTypesQuery = useMasterTypeByNameQuery(() => ({
		name: MASTER_VALUE_TYPE.VALUATION_TYPE
	}));
	const valuationTypes = $derived(
		valuationTypesQuery.data?.values?.map((type: any) => ({
			id: type.id,
			name: type.value
		})) || []
	);

	// Query for Frequency of Valuation (frontend search)
	const frequenciesQuery = useMasterTypeByNameQuery(() => ({
		name: MASTER_VALUE_TYPE.FREQUENCY_OF_VALUATION
	}));
	const frequencies = $derived(
		frequenciesQuery.data?.values?.map((freq: any) => ({
			id: freq.id,
			name: freq.value
		})) || []
	);

	let formData = $state({
		fk_default_general_allocation_hdrid: '',
		fk_master_value_frequency_of_valuation_id: '',
		fk_master_value_valuation_type_id: '',
		is_manufacturing_date_required: false,
		is_non_stock_item: false,
		is_stock_storage_location_wise: false,
		item_image: '',
		lead_time_external: '0',
		lead_time_internal: '0',
		sanctioned_by: '',
		technical_specification: '',
		tolerance_percentage: '0',
		i_version: 0
	});

	// Update form data when itemVRL changes or when entering edit mode
	$effect(() => {
		if (!isEditing && itemVRL) {
			formData = {
				fk_default_general_allocation_hdrid: itemVRL.fk_default_general_allocation_hdrid || '',
				fk_master_value_frequency_of_valuation_id:
					itemVRL.fk_master_value_frequency_of_valuation_id || '',
				fk_master_value_valuation_type_id: itemVRL.fk_master_value_valuation_type_id || '',
				is_manufacturing_date_required: itemVRL.is_manufacturing_date_required,
				is_non_stock_item: itemVRL.is_non_stock_item,
				is_stock_storage_location_wise: itemVRL.is_stock_storage_location_wise,
				item_image: itemVRL.image?.item_image || '',
				lead_time_external: String(itemVRL.lead_time_external || 0),
				lead_time_internal: String(itemVRL.lead_time_internal || 0),
				sanctioned_by: itemVRL.sanctioned_by || '',
				technical_specification: itemVRL.technical_specification || '',
				tolerance_percentage: String(itemVRL.tolerance?.tolerance_percentage || 0),
				i_version: itemVRL.i_version || 0
			};
			// Set image preview if exists
			if (itemVRL.image?.item_image) {
				imagePreview = `data:image/jpeg;base64,${itemVRL.image.item_image}`;
			} else {
				imagePreview = null;
			}
		} else if (!isEditing && !itemVRL) {
			// Reset to empty form when no VRL
			formData = {
				fk_default_general_allocation_hdrid: '',
				fk_master_value_frequency_of_valuation_id: '',
				fk_master_value_valuation_type_id: '',
				is_manufacturing_date_required: false,
				is_non_stock_item: false,
				is_stock_storage_location_wise: false,
				item_image: '',
				lead_time_external: '0',
				lead_time_internal: '0',
				sanctioned_by: '',
				technical_specification: '',
				tolerance_percentage: '0',
				i_version: 0
			};
			imagePreview = null;
		}
	});

	const createMutation = useCreateItemVRL();
	const updateMutation = useUpdateItemVRL();
	const deleteMutation = useDeleteItemVRL();

	function handleEdit() {
		isEditing = true;
	}

	function handleCancel() {
		// Reset form data
		if (itemVRL) {
			formData = {
				fk_default_general_allocation_hdrid: itemVRL.fk_default_general_allocation_hdrid || '',
				fk_master_value_frequency_of_valuation_id:
					itemVRL.fk_master_value_frequency_of_valuation_id || '',
				fk_master_value_valuation_type_id: itemVRL.fk_master_value_valuation_type_id || '',
				is_manufacturing_date_required: itemVRL.is_manufacturing_date_required,
				is_non_stock_item: itemVRL.is_non_stock_item,
				is_stock_storage_location_wise: itemVRL.is_stock_storage_location_wise,
				item_image: itemVRL.image?.item_image || '',
				lead_time_external: String(itemVRL.lead_time_external || 0),
				lead_time_internal: String(itemVRL.lead_time_internal || 0),
				sanctioned_by: itemVRL.sanctioned_by || '',
				technical_specification: itemVRL.technical_specification || '',
				tolerance_percentage: String(itemVRL.tolerance?.tolerance_percentage || 0),
				i_version: itemVRL.i_version || 0
			};
			if (itemVRL.image?.item_image) {
				imagePreview = `data:image/jpeg;base64,${itemVRL.image.item_image}`;
			} else {
				imagePreview = null;
			}
		} else {
			formData = {
				fk_default_general_allocation_hdrid: '',
				fk_master_value_frequency_of_valuation_id: '',
				fk_master_value_valuation_type_id: '',
				is_manufacturing_date_required: false,
				is_non_stock_item: false,
				is_stock_storage_location_wise: false,
				item_image: '',
				lead_time_external: '0',
				lead_time_internal: '0',
				sanctioned_by: '',
				technical_specification: '',
				tolerance_percentage: '0',
				i_version: 0
			};
			imagePreview = null;
		}
		imageFile = null;
		isEditing = false;
	}

	async function handleImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error('File harus berupa gambar');
			return;
		}

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			toast.error('Ukuran file maksimal 2MB');
			return;
		}

		imageFile = file;

		// Convert to base64 for preview and API
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			imagePreview = result;
			// Extract base64 data (remove data:image/...;base64, prefix)
			const base64Data = result.split(',')[1];
			formData.item_image = base64Data;
		};
		reader.readAsDataURL(file);
	}

	function handleSave() {
		const isPending = createMutation.isPending || updateMutation.isPending;
		if (isPending) return;

		// Prepare data for API
		const vrlData: any = {
			fk_default_general_allocation_hdrid:
				formData.fk_default_general_allocation_hdrid || undefined,
			fk_master_value_frequency_of_valuation_id:
				formData.fk_master_value_frequency_of_valuation_id || undefined,
			fk_master_value_valuation_type_id: formData.fk_master_value_valuation_type_id || undefined,
			is_manufacturing_date_required: formData.is_manufacturing_date_required,
			is_non_stock_item: formData.is_non_stock_item,
			is_stock_storage_location_wise: formData.is_stock_storage_location_wise,
			item_image: formData.item_image || undefined,
			lead_time_external: parseInt(formData.lead_time_external) || 0,
			lead_time_internal: parseInt(formData.lead_time_internal) || 0,
			sanctioned_by: formData.sanctioned_by || undefined,
			technical_specification: formData.technical_specification || undefined,
			tolerance_percentage: parseFloat(formData.tolerance_percentage) || 0
		};

		if (hasVRL) {
			// Update existing VRL
			vrlData.i_version = formData.i_version;
			updateMutation.mutate(
				{ itemId, data: vrlData },
				{
					onSuccess: () => {
						toast.success('Detail informasi berhasil diperbarui');
						isEditing = false;
						imageFile = null;
						onUpdateSuccess?.();
					},
					onError: (error: Error) => {
						toast.error(`Gagal memperbarui detail informasi: ${error.message}`);
					}
				}
			);
		} else {
			// Create new VRL
			createMutation.mutate(
				{ itemId, data: vrlData },
				{
					onSuccess: () => {
						toast.success('Detail informasi berhasil ditambahkan');
						isEditing = false;
						imageFile = null;
						onUpdateSuccess?.();
					},
					onError: (error: Error) => {
						toast.error(`Gagal menambahkan detail informasi: ${error.message}`);
					}
				}
			);
		}
	}

	function handleDeleteClick() {
		deleteDialogOpen = true;
	}

	async function handleDeleteConfirm() {
		if (!itemVRL) return;

		try {
			await deleteMutation.mutateAsync({
				itemId,
				i_version: itemVRL.i_version || 0
			});
			toast.success('Detail informasi berhasil dihapus');
			deleteDialogOpen = false;
			onUpdateSuccess?.();
		} catch (error) {
			console.error('Error deleting VRL:', error);
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Gagal menghapus detail informasi. Silakan coba lagi.';
			toast.error(errorMessage);
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<Card.Title>Detail Informasi</Card.Title>
				<Card.Description>Informasi tambahan dan pengaturan barang</Card.Description>
			</div>
			<div class="flex gap-2">
				{#if isEditing}
					<Button
						variant="outline"
						size="sm"
						onclick={handleCancel}
						disabled={createMutation.isPending || updateMutation.isPending}
					>
						<X class="mr-2 h-4 w-4" />
						Batal
					</Button>
					<Guard
						permissions={hasVRL
							? ITEM_PERMISSIONS.DETAIL_BARANG_UPDATE
							: ITEM_PERMISSIONS.DETAIL_BARANG_CREATE}
					>
						<Button
							size="sm"
							onclick={handleSave}
							disabled={createMutation.isPending || updateMutation.isPending}
							class="bg-[#0f4c2a] hover:bg-[#0d4023]"
						>
							{#if createMutation.isPending || updateMutation.isPending}
								Menyimpan...
							{:else}
								<Check class="mr-2 h-4 w-4" />
								Simpan
							{/if}
						</Button>
					</Guard>
				{:else}
					<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_UPDATE}>
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
			<!-- Jenis Penilaian -->
			<EditableCombobox
				label="Jenis Penilaian"
				bind:value={formData.fk_master_value_valuation_type_id}
				displayValue={itemVRL?.valuation_type?.value}
				placeholder="Pilih jenis penilaian"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				isLoading={valuationTypesQuery.isLoading}
				options={valuationTypes}
				id="valuation_type"
			/>

			<!-- Alokasi Bawaan -->
			{#if isEditing}
				<div class="space-y-2">
					<SearchableCombobox
						bind:value={formData.fk_default_general_allocation_hdrid}
						items={alokasiItems}
						isLoading={alokasiQuery.isLoading}
						onSearchChange={(search) => {
							alokasiSearchQuery = search;
						}}
						label="Alokasi Bawaan"
						placeholder="Pilih alokasi bawaan"
						searchPlaceholder="Cari alokasi..."
						disabled={createMutation.isPending || updateMutation.isPending}
					/>
				</div>
			{:else}
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700">Alokasi Bawaan</p>
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						<p class="text-sm font-medium text-gray-900">
							{itemVRL?.default_general_allocation
								? `${itemVRL.default_general_allocation.name}`
								: '-'}
						</p>
					</div>
				</div>
			{/if}

			<!-- Frekuensi Penilaian -->
			<EditableCombobox
				label="Frekuensi Penilaian"
				bind:value={formData.fk_master_value_frequency_of_valuation_id}
				displayValue={itemVRL?.frequency_of_valuation?.value}
				placeholder="Pilih frekuensi penilaian"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				isLoading={frequenciesQuery.isLoading}
				options={frequencies}
				id="frequency"
			/>

			<!-- Waktu Tunggu [Eksternal] -->
			<EditableField
				label="Waktu Tunggu [Eksternal]"
				bind:value={formData.lead_time_external}
				placeholder="0"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				type="number"
				id="lead_time_external"
			/>

			<!-- Waktu Tunggu [Internal] -->
			<EditableField
				label="Waktu Tunggu [Internal]"
				bind:value={formData.lead_time_internal}
				placeholder="0"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				type="number"
				id="lead_time_internal"
			/>

			<!-- Toleransi Kuantitas Diterima (%) -->
			<EditableField
				label="Toleransi Kuantitas Diterima (%)"
				bind:value={formData.tolerance_percentage}
				placeholder="0"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				type="number"
				id="tolerance"
			/>

			<!-- Spesifikasi Teknis -->
			<EditableField
				label="Spesifikasi Teknis"
				bind:value={formData.technical_specification}
				placeholder="Masukkan spesifikasi teknis"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				multiline={true}
				rows={3}
				id="technical_spec"
			/>

			<!-- Disetujui Oleh -->
			<EditableField
				label="Disetujui Oleh"
				bind:value={formData.sanctioned_by}
				placeholder="Masukkan nama yang menyetujui"
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				id="sanctioned_by"
			/>

			<!-- Apakah Diperlukan Tanggal Produksi? -->
			<EditableSwitch
				label="Apakah Diperlukan Tanggal Produksi?"
				bind:checked={formData.is_manufacturing_date_required}
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				activeText="Iya"
				inactiveText="Tidak"
				id="manufacturing_date"
			/>

			<!-- Apakah Barang Tidak Bernilai? -->
			<EditableSwitch
				label="Apakah Barang Tidak Bernilai?"
				bind:checked={formData.is_non_stock_item}
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				activeText="Iya"
				inactiveText="Tidak"
				id="non_stock"
			/>

			<!-- Apakah Penyimpanan Stok Diperlukan? -->
			<EditableSwitch
				label="Apakah Penyimpanan Stok Diperlukan?"
				bind:checked={formData.is_stock_storage_location_wise}
				{isEditing}
				disabled={createMutation.isPending || updateMutation.isPending}
				activeText="Iya"
				inactiveText="Tidak"
				id="stock_storage"
			/>

			<!-- Gambar -->
			<div class="space-y-2 md:col-span-2">
				<p class="text-sm font-medium text-gray-700">Gambar</p>
				{#if isEditing}
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<input
								type="file"
								id="image-upload"
								accept="image/*"
								onchange={handleImageChange}
								class="hidden"
								disabled={createMutation.isPending || updateMutation.isPending}
							/>
							<Button
								variant="outline"
								size="sm"
								onclick={() => document.getElementById('image-upload')?.click()}
								disabled={createMutation.isPending || updateMutation.isPending}
							>
								<Upload class="mr-2 h-4 w-4" />
								Upload Gambar
							</Button>
							<span class="text-sm text-gray-500">
								{imageFile ? imageFile.name : 'Tidak ada file dipilih'}
							</span>
						</div>
						{#if imagePreview}
							<div class="mt-2">
								<img
									src={imagePreview}
									alt="Preview"
									class="h-32 w-32 rounded-md border object-cover"
								/>
							</div>
						{/if}
						<p class="text-xs text-gray-500">Format: JPG, PNG. Maksimal 2MB</p>
					</div>
				{:else}
					<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
						{#if imagePreview}
							<img src={imagePreview} alt="Item" class="h-32 w-32 rounded-md border object-cover" />
						{:else}
							<p class="text-sm font-medium text-gray-400">Tidak ada gambar</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Detail Informasi</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menghapus detail informasi ini? Tindakan ini tidak dapat dibatalkan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
			<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_DELETE}>
				<AlertDialog.Action
					onclick={handleDeleteConfirm}
					disabled={deleteMutation.isPending}
					class="bg-red-600 hover:bg-red-700"
				>
					{deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
				</AlertDialog.Action>
			</Guard>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
