<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { RefreshCw } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { useCreateItemStorageLayout } from '../hooks/useItemStorageLayoutMutations.svelte';
	import { useReadAllItemStorageLayouts } from '../hooks/useItemStorageLayoutQueries.svelte';
	import type { ItemStorageLayoutCreateRequest } from '../types/item-storage-layout.types';
	import StorageLayoutGrid from './StorageLayoutGrid.svelte';
	import SelectFormSection from './SelectFormSection.svelte';

	let {
		onSuccess,
		onCancel
	}: {
		onSuccess?: () => void;
		onCancel?: () => void;
	} = $props();

	let formData = $state<ItemStorageLayoutCreateRequest>({
		code: '',
		name: '',
		store_id: '',
		parent_id: undefined,
		number_of_columns: 3,
		number_of_rows: 3,
		is_active: true
	});

	let errors = $state<Record<string, string>>({});

	const createMutation = useCreateItemStorageLayout();

	// Fetch all layouts to get the last code for auto-generation
	const layoutsQuery = useReadAllItemStorageLayouts(() => ({
		page: 1,
		size: 1000 // Get all to find the highest code
	}));

	// Mock stores for dropdown
	const stores = [
		{ value: 'store-1', label: 'GUDANG' },
		{ value: 'store-2', label: 'GUDANG SPARE PART' },
		{ value: 'store-3', label: 'GUDANG BAHAN KIMIA' }
	];

	// Mock parent layouts for dropdown - will be populated from query
	const parentLayouts = $derived.by(() => {
		const layouts = layoutsQuery.data?.data || [];
		return [
			{ value: '', label: 'None' },
			...layouts.map((layout) => ({
				value: layout.id,
				label: `${layout.code} - ${layout.name}`
			}))
		];
	});

	// Auto-generate code when layouts are loaded
	$effect(() => {
		if (!formData.code && layoutsQuery.data) {
			generateCode();
		}
	});

	function generateCode() {
		const layouts = layoutsQuery.data?.data || [];
		
		// Extract numbers from existing codes (RAK001, RAK002, etc.)
		const codeNumbers = layouts
			.map((layout) => {
				const match = layout.code.match(/RAK(\d+)/);
				return match ? parseInt(match[1], 10) : 0;
			})
			.filter((num) => num > 0);

		// Get the highest number, default to 0 if no codes exist
		const lastNumber = codeNumbers.length > 0 ? Math.max(...codeNumbers) : 0;
		const nextNumber = lastNumber + 1;

		formData.code = `RAK${String(nextNumber).padStart(3, '0')}`;
	}

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
			newErrors.code = 'Code is required';
		}

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (!formData.store_id) {
			newErrors.store_id = 'Store is required';
		}

		if (formData.number_of_columns < 1 || formData.number_of_columns > 10) {
			newErrors.number_of_columns = 'Number of columns must be between 1-10';
		}

		if (formData.number_of_rows < 1 || formData.number_of_rows > 10) {
			newErrors.number_of_rows = 'Number of rows must be between 1-10';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function handleNew() {
		formData = {
			code: '',
			name: '',
			store_id: '',
			parent_id: undefined,
			number_of_columns: 3,
			number_of_rows: 3,
			is_active: true
		};
		errors = {};
	}

	function handleReset() {
		handleNew();
	}

	async function handleSave() {
		if (!validateForm()) {
			toast.error('Please fix form errors');
			return;
		}

		createMutation.mutate(formData, {
			onSuccess: () => {
				toast.success('Storage layout created successfully');
				onSuccess?.();
			},
			onError: (error: Error) => {
				toast.error(`Failed to create storage layout: ${error.message}`);
			}
		});
	}

	function handleClose() {
		onCancel?.();
	}

	function handleRefreshLayout() {
		// Trigger re-render of grid preview
		formData = { ...formData };
		toast.success('Layout refreshed');
	}
</script>

<div class="space-y-6">
	<!-- Form Section -->
	<div class="rounded-lg border bg-card">
		<div class="border-b bg-muted/50 px-6 py-4">
			<h3 class="font-semibold">Item Storage Layout</h3>
		</div>
		<div class="p-6 space-y-6">
			<!-- Form Fields Grid -->
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Code -->
				<div class="space-y-2">
					<Label for="code">Code: <span class="text-destructive">*</span></Label>
					<Input
						id="code"
						bind:value={formData.code}
						placeholder="Enter code"
						disabled={createMutation.isPending}
					/>
					{#if errors.code}
						<p class="text-sm text-destructive">{errors.code}</p>
					{/if}
				</div>

				<!-- Name -->
				<div class="space-y-2">
					<Label for="name">Name: <span class="text-destructive">*</span></Label>
					<Input
						id="name"
						bind:value={formData.name}
						placeholder="Enter name"
						disabled={createMutation.isPending}
					/>
					{#if errors.name}
						<p class="text-sm text-destructive">{errors.name}</p>
					{/if}
				</div>

				<!-- Store -->
				<div class="space-y-2">
					<Label for="store">Store: <span class="text-destructive">*</span></Label>
					<SelectFormSection
						bind:value={formData.store_id}
						options={stores}
						disabled={createMutation.isPending}
						placeholder="Pilih gudang"
						searchPlaceholder="Cari gudang..."
						emptyText="Tidak ada gudang ditemukan."
					/>
					{#if errors.store_id}
						<p class="text-sm text-destructive">{errors.store_id}</p>
					{/if}
				</div>

				<!-- Parent -->
				<div class="space-y-2">
					<Label for="parent">Parent:</Label>
					<SelectFormSection
						bind:value={formData.parent_id}
						options={parentLayouts}
						disabled={createMutation.isPending}
						placeholder="Pilih parent"
						searchPlaceholder="Cari parent..."
						emptyText="Tidak ada parent ditemukan."
					/>
				</div>

				<!-- Number of Columns with Refresh Button -->
				<div class="space-y-2">
					<Label for="columns">Number Of Columns:</Label>
					<div class="flex gap-2">
						<Input
							id="columns"
							type="number"
							min="1"
							max="10"
							bind:value={formData.number_of_columns}
							disabled={createMutation.isPending}
							class="flex-1"
						/>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onclick={handleRefreshLayout}
							disabled={createMutation.isPending}
							title="Refresh Layout"
						>
							<RefreshCw class="h-4 w-4" />
						</Button>
					</div>
					{#if errors.number_of_columns}
						<p class="text-sm text-destructive">{errors.number_of_columns}</p>
					{/if}
				</div>

				<!-- Number of Rows -->
				<div class="space-y-2">
					<Label for="rows">Number Of Rows:</Label>
					<Input
						id="rows"
						type="number"
						min="1"
						max="10"
						bind:value={formData.number_of_rows}
						disabled={createMutation.isPending}
					/>
					{#if errors.number_of_rows}
						<p class="text-sm text-destructive">{errors.number_of_rows}</p>
					{/if}
				</div>
			</div>

			<!-- Is Active Checkbox -->
			<div class="flex items-center space-x-2">
				<Checkbox
					id="is_active"
					bind:checked={formData.is_active}
					disabled={createMutation.isPending}
				/>
				<Label for="is_active" class="text-sm font-normal cursor-pointer">
					Is Active?: <span class="text-destructive">*</span>
				</Label>
			</div>

			<!-- Layout Preview -->
			<div class="space-y-3">
				<Label class="text-base">Layout Preview</Label>
				<StorageLayoutGrid
					cells={previewCells}
					columns={formData.number_of_columns}
					rows={formData.number_of_rows}
				/>
			</div>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex justify-end gap-2">
		<Button
			type="button"
			variant="outline"
			onclick={handleClose}
			disabled={createMutation.isPending}
		>
			Batal
		</Button>
		<Button
			type="button"
			onclick={handleSave}
			disabled={createMutation.isPending}
			class="bg-[#0f4c2a] hover:bg-[#0d4023]"
		>
			{createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
		</Button>
	</div>
</div>
