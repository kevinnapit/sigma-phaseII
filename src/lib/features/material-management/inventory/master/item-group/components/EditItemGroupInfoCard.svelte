<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Check, Pencil, X } from 'lucide-svelte';
	import { EditableField, EditableCombobox } from '$lib/components/shared/index.js';
	import { useUpdateItemGroup } from '../hooks/useItemGroupMutations.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { ITEM_GROUP_TYPE_NAMES } from '../constants/item-group-types';
	import type { ItemGroupItem } from '../types/item-group.types';

	let {
		itemGroup,
		onUpdateSuccess
	}: {
		itemGroup: ItemGroupItem;
		onUpdateSuccess?: () => void;
	} = $props();

	let isEditing = $state(false);

	let formData = $state({
		code: '',
		name: '',
		short_name: '',
		valuation_type_id: '',
		frequency_of_valuation_id: '',
		stock_account_id: '',
		stock_issue_account_id: '',
		parent_item_class_id: '',
		i_version: 0
	});

	$effect(() => {
		if (itemGroup && !isEditing) {
			formData = {
				code: itemGroup.code,
				name: itemGroup.name,
				short_name: itemGroup.short_name,
				valuation_type_id: itemGroup.valuation_type_id,
				frequency_of_valuation_id: itemGroup.frequency_of_valuation_id,
				stock_account_id: itemGroup.stock_account_id,
				stock_issue_account_id: itemGroup.stock_issue_account_id || '',
				parent_item_class_id: itemGroup.parent_item_class_id || '',
				i_version: itemGroup.i_version
			};
		}
	});

	// Fetch master values for valuation type
	const valuationTypesQuery = useMasterTypeByNameQuery(() => ({
		name: ITEM_GROUP_TYPE_NAMES.VALUATION_TYPE
	}));
	const valuationTypes = $derived(valuationTypesQuery.data?.values || []);

	// Fetch master values for frequency of valuation
	const frequencyValuationQuery = useMasterTypeByNameQuery(() => ({
		name: ITEM_GROUP_TYPE_NAMES.FREQUENCY_OF_VALUATION
	}));
	const frequencyOptions = $derived(frequencyValuationQuery.data?.values || []);

	// Stock account options seeded from current item data (to be replaced with API later)
	const stockAccountOptions = $derived.by(() => {
		const options = [];
		if (itemGroup.stock_account_id && itemGroup.stock_account_name) {
			options.push({ id: itemGroup.stock_account_id, name: itemGroup.stock_account_name });
		}
		return options;
	});

	const stockIssueAccountOptions = $derived.by(() => {
		const options = [];
		if (itemGroup.stock_issue_account_id && itemGroup.stock_issue_account_name) {
			options.push({
				id: itemGroup.stock_issue_account_id,
				name: itemGroup.stock_issue_account_name
			});
		}
		return options;
	});

	const updateMutation = useUpdateItemGroup();

	function handleEdit() {
		isEditing = true;
	}

	function handleCancel() {
		formData = {
			code: itemGroup.code,
			name: itemGroup.name,
			short_name: itemGroup.short_name,
			valuation_type_id: itemGroup.valuation_type_id,
			frequency_of_valuation_id: itemGroup.frequency_of_valuation_id,
			stock_account_id: itemGroup.stock_account_id,
			stock_issue_account_id: itemGroup.stock_issue_account_id || '',
			parent_item_class_id: itemGroup.parent_item_class_id || '',
			i_version: itemGroup.i_version
		};
		isEditing = false;
	}

	function handleSave() {
		if (!formData.valuation_type_id || !formData.frequency_of_valuation_id) {
			toast.error('Mohon lengkapi semua field yang wajib diisi');
			return;
		}

		if (!formData.stock_account_id) {
			toast.error('Akun stok wajib dipilih');
			return;
		}

		const updateData = {
			code: formData.code,
			name: formData.name,
			short_name: formData.short_name,
			valuation_type_id: formData.valuation_type_id,
			frequency_of_valuation_id: formData.frequency_of_valuation_id,
			stock_account_id: formData.stock_account_id,
			stock_issue_account_id: formData.stock_issue_account_id || undefined,
			parent_item_class_id: formData.parent_item_class_id || undefined,
			i_version: formData.i_version
		};

		updateMutation.mutate(
			{
				uoid: itemGroup.uoid,
				data: updateData
			},
			{
				onSuccess: () => {
					toast.success('Informasi grup barang berhasil diperbarui');
					isEditing = false;
					onUpdateSuccess?.();
				},
				onError: (error: Error) => {
					toast.error(`Gagal memperbarui grup barang: ${error.message}`);
				}
			}
		);
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row justify-between gap-4 sm:items-center">
			<div>
				<Card.Title>Informasi Grup Barang</Card.Title>
				<Card.Description>Informasi dasar grup barang</Card.Description>
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
				{:else}
					<Button variant="outline" size="sm" onclick={handleEdit}>
						<Pencil class="mr-2 h-4 w-4" />
						Edit
					</Button>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
			<!-- Kode (Read-only) -->
			<div class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Kode</span>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2 text-sm">
					<p class="text-gray-900">{formData.code}</p>
				</div>
			</div>

			<!-- Nama (Read-only) -->
			<div class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Nama</span>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2 text-sm">
					<p class="text-gray-900">{formData.name}</p>
				</div>
			</div>

			<!-- Tipe Penilaian -->
			<EditableCombobox
				label="Tipe Penilaian"
				bind:value={formData.valuation_type_id}
				displayValue={itemGroup.valuation_type_value}
				placeholder="Pilih tipe penilaian"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={valuationTypesQuery.isLoading}
				options={valuationTypes.map((t) => ({ id: t.id, name: t.value || '' }))}
				id="valuation_type"
			/>

			<!-- Frekuensi Penilaian -->
			<EditableCombobox
				label="Frekuensi Penilaian"
				bind:value={formData.frequency_of_valuation_id}
				displayValue={itemGroup.frequency_of_valuation_value}
				placeholder="Pilih frekuensi penilaian"
				{isEditing}
				disabled={updateMutation.isPending}
				isLoading={frequencyValuationQuery.isLoading}
				options={frequencyOptions.map((f) => ({ id: f.id, name: f.value || '' }))}
				id="frequency"
			/>

			<!-- Akun Stok -->
			<EditableCombobox
				label="Akun Stok"
				bind:value={formData.stock_account_id}
				displayValue={itemGroup.stock_account_name}
				placeholder="Pilih akun stok"
				{isEditing}
				disabled={updateMutation.isPending}
				options={stockAccountOptions}
				id="stock_account"
			/>

			<!-- Akun Pengeluaran Stok -->
			<EditableCombobox
				label="Akun Pengeluaran Stok"
				bind:value={formData.stock_issue_account_id}
				displayValue={itemGroup.stock_issue_account_name || '-'}
				placeholder="Pilih akun pengeluaran stok"
				{isEditing}
				disabled={updateMutation.isPending}
				options={stockIssueAccountOptions}
				id="stock_issue_account"
			/>

			<!-- Kelas Induk (Read-only) -->
			<div class="space-y-2 md:col-span-2">
				<span class="text-sm font-medium text-gray-700">Kelas Induk</span>
				<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2 text-sm">
					<p class="text-gray-900">{itemGroup.parent_item_class_name || '-'}</p>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
