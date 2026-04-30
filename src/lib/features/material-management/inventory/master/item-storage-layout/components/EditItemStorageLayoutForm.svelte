<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { toast } from 'svelte-sonner';
	import { useUpdateItemStorageLayout } from '../hooks/useItemStorageLayoutMutations.svelte';
	import type {
		ItemStorageLayout,
		ItemStorageLayoutUpdateRequest
	} from '../types/item-storage-layout.types';
	import StorageLayoutGrid from './StorageLayoutGrid.svelte';

	let {
		layout,
		onSuccess
	}: {
		layout: ItemStorageLayout;
		onSuccess?: () => void;
	} = $props();

	let formData = $state<ItemStorageLayoutUpdateRequest>({
		code: layout.code,
		name: layout.name,
		store_id: layout.store.id,
		parent_id: layout.parent?.id,
		number_of_columns: layout.number_of_columns,
		number_of_rows: layout.number_of_rows,
		is_active: layout.is_active,
		i_version: layout.i_version || 1
	});

	let errors = $state<Record<string, string>>({});

	const updateMutation = useUpdateItemStorageLayout();

	// Mock stores for dropdown
	const stores = [
		{ value: 'store-1', label: 'GUDANG' },
		{ value: 'store-2', label: 'GUDANG SPARE PART' },
		{ value: 'store-3', label: 'GUDANG BAHAN KIMIA' }
	];

	// Mock parent layouts for dropdown
	const parentLayouts = [
		{ value: '', label: 'Tidak Ada' },
		{ value: '1', label: 'RAK A 001' },
		{ value: '2', label: 'RAK B 001' },
		{ value: '3', label: 'RAK C 001' }
	];

	// Generate preview cells
	const previewCells = $derived.by(() => {
		const cells = [];
		for (let r = 1; r <= formData.number_of_rows; r++) {
			for (let c = 1; c <= formData.number_of_columns; c++) {
				cells.push({
					row: r,
					column: c,
					cell_code: `R${r}C${c}`,
					is_occupied: false
				});
			}
		}
		return cells;
	});

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		if (!formData.code.trim()) {
			newErrors.code = 'Kode rak wajib diisi';
		}

		if (!formData.name.trim()) {
			newErrors.name = 'Nama rak wajib diisi';
		}

		if (!formData.store_id) {
			newErrors.store_id = 'Gudang wajib dipilih';
		}

		if (formData.number_of_columns < 1 || formData.number_of_columns > 10) {
			newErrors.number_of_columns = 'Jumlah kolom harus antara 1-10';
		}

		if (formData.number_of_rows < 1 || formData.number_of_rows > 10) {
			newErrors.number_of_rows = 'Jumlah baris harus antara 1-10';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toast.error('Mohon perbaiki kesalahan pada form');
			return;
		}

		updateMutation.mutate(
			{ uoid: layout.uoid, payload: formData },
			{
				onSuccess: () => {
					toast.success('Rak penyimpanan berhasil diperbarui');
					onSuccess?.();
				},
				onError: (error: Error) => {
					toast.error(`Gagal memperbarui rak penyimpanan: ${error.message}`);
				}
			}
		);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Informasi Rak</Card.Title>
			<Card.Description>Perbarui informasi rak penyimpanan</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="code">Kode Rak <span class="text-destructive">*</span></Label>
					<Input
						id="code"
						bind:value={formData.code}
						placeholder="Contoh: RAK-001"
						disabled={updateMutation.isPending}
					/>
					{#if errors.code}
						<p class="text-sm text-destructive">{errors.code}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="name">Nama Rak <span class="text-destructive">*</span></Label>
					<Input
						id="name"
						bind:value={formData.name}
						placeholder="Contoh: RAK A 001"
						disabled={updateMutation.isPending}
					/>
					{#if errors.name}
						<p class="text-sm text-destructive">{errors.name}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="store">Gudang <span class="text-destructive">*</span></Label>
					<Select.Root type="single" bind:value={formData.store_id}>
						<Select.Trigger id="store" disabled={updateMutation.isPending}>
							{stores.find((s) => s.value === formData.store_id)?.label || "Pilih gudang"}
						</Select.Trigger>
						<Select.Content>
							{#each stores as store}
								<Select.Item value={store.value}>{store.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if errors.store_id}
						<p class="text-sm text-destructive">{errors.store_id}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="parent">Parent (Opsional)</Label>
					<Select.Root
						type="single"
						value={formData.parent_id || ''}
						onValueChange={(v) => {
							formData.parent_id = v || undefined;
						}}
					>
						<Select.Trigger id="parent" disabled={updateMutation.isPending}>
							{parentLayouts.find((p) => p.value === (formData.parent_id || ''))?.label || "Pilih parent"}
						</Select.Trigger>
						<Select.Content>
							{#each parentLayouts as parent}
								<Select.Item value={parent.value}>{parent.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="space-y-2">
					<Label for="columns">Jumlah Kolom <span class="text-destructive">*</span></Label>
					<Input
						id="columns"
						type="number"
						min="1"
						max="10"
						bind:value={formData.number_of_columns}
						disabled={updateMutation.isPending}
					/>
					{#if errors.number_of_columns}
						<p class="text-sm text-destructive">{errors.number_of_columns}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="rows">Jumlah Baris <span class="text-destructive">*</span></Label>
					<Input
						id="rows"
						type="number"
						min="1"
						max="10"
						bind:value={formData.number_of_rows}
						disabled={updateMutation.isPending}
					/>
					{#if errors.number_of_rows}
						<p class="text-sm text-destructive">{errors.number_of_rows}</p>
					{/if}
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<Switch id="is_active" bind:checked={formData.is_active} disabled={updateMutation.isPending} />
				<Label for="is_active">Aktif</Label>
			</div>
		</Card.Content>
	</Card.Root>

	<StorageLayoutGrid
		cells={previewCells}
		columns={formData.number_of_columns}
		rows={formData.number_of_rows}
	/>

	<div class="flex justify-end gap-2">
		<Button type="button" variant="outline" disabled={updateMutation.isPending}>Batal</Button>
		<Button type="submit" disabled={updateMutation.isPending}>
			{updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
		</Button>
	</div>
</form>
