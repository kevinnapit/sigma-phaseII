<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';
	import { useReadAllItems } from '$lib/features/material-management/inventory/master/item';
	import { useReadAllStockControls } from '../hooks/useItemStockControlQueries.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { MASTER_VALUE_TYPES } from '../constants/master-value-types';
	import { createStockControlSchema } from '../schemas/create-stock-control.schema';
	import type {
		CreateStockControlPayload,
		ItemUsageWithRequest
	} from '../types/item-stock-control.types';

	interface Props {
		open?: boolean;
		/** If provided, modal is in "from-row" mode: item pre-filled, system ref shown */
		sourceRow?: ItemUsageWithRequest | null;
		onSubmit: (payload: CreateStockControlPayload) => Promise<void>;
		isSubmitting?: boolean;
	}

	let {
		open = $bindable(false),
		sourceRow = null,
		onSubmit,
		isSubmitting = false
	}: Props = $props();

	// "from-row" mode: item is pre-filled from the row
	const isFromRow = $derived(!!sourceRow);

	type MinStockChoice = 'system' | 'manual';
	let minStockChoice = $state<MinStockChoice>('system');

	let formData = $state({
		item_id: '',
		proposed_min_stock: '',
		fk_master_value_valuation_type_id: '',
		fk_master_value_frequency_of_valuation_id: ''
	});

	let searchQuery = $state('');
	let errors = $state<Record<string, string>>({});

	// Items query — only for manual mode
	const itemsQuery = useReadAllItems(
		() => ({ page: 1, size: 20, search: searchQuery || undefined }),
		() => open && !isFromRow
	);

	const valuationTypesQuery = useMasterTypeByNameQuery(() => ({
		name: MASTER_VALUE_TYPES.VALUATION_TYPE
	}));
	const frequencyQuery = useMasterTypeByNameQuery(() => ({
		name: MASTER_VALUE_TYPES.FREQUENCY_OF_VALUATION
	}));

	const items = $derived(itemsQuery.data?.data.map((i) => ({ ...i, uoid: i.uoid || i.id })) ?? []);
	const valuationTypes = $derived(valuationTypesQuery.data?.values ?? []);
	const frequencies = $derived(frequencyQuery.data?.values ?? []);

	const selectedValuationName = $derived(
		valuationTypes.find((v: any) => v.id === formData.fk_master_value_valuation_type_id)?.value ??
			''
	);
	const selectedFrequencyName = $derived(
		frequencies.find((f: any) => f.id === formData.fk_master_value_frequency_of_valuation_id)
			?.value ?? ''
	);

	// System recommendation from row
	const systemRef = $derived(sourceRow?.total_usage ?? '');
	const itemUom = $derived(sourceRow?.item_uom ?? '');

	// For manual mode: fetch usage data of selected item to get window info
	const selectedItemUsageQuery = useReadAllStockControls(
		() => ({ page: 1, limit: 1, search: formData.item_id || undefined }),
		() => open && !isFromRow && !!formData.item_id
	);
	const selectedItemUsage = $derived(
		selectedItemUsageQuery.data?.data.find((i) => i.item_id === formData.item_id) ?? null
	);

	// Window info — from sourceRow (from-row mode) or fetched usage (manual mode)
	const windowDays = $derived(
		isFromRow ? (sourceRow?.window_days ?? null) : (selectedItemUsage?.window_days ?? null)
	);
	const windowStart = $derived(
		isFromRow ? (sourceRow?.window_start ?? '') : (selectedItemUsage?.window_start ?? '')
	);
	const windowEnd = $derived(
		isFromRow ? (sourceRow?.window_end ?? '') : (selectedItemUsage?.window_end ?? '')
	);

	function formatWindowDate(dateStr: string): string {
		if (!dateStr) return '-';
		const d = new Date(dateStr);
		return d.toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	// Sync proposed_min_stock when choice changes in from-row mode
	$effect(() => {
		if (isFromRow && minStockChoice === 'system') {
			formData.proposed_min_stock = systemRef;
		}
	});

	// Reset when dialog opens
	$effect(() => {
		if (open) {
			errors = {};
			searchQuery = '';
			minStockChoice = 'system';
			formData = {
				item_id: isFromRow ? (sourceRow?.item_id ?? '') : '',
				proposed_min_stock: isFromRow ? (sourceRow?.total_usage ?? '') : '',
				fk_master_value_valuation_type_id: valuationTypes[0]?.id ?? '',
				fk_master_value_frequency_of_valuation_id: frequencies[0]?.id ?? ''
			};
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errors = {};

		const validation = createStockControlSchema.safeParse(formData);
		if (!validation.success) {
			validation.error.issues.forEach((issue) => {
				if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
			});
			return;
		}

		const payload: CreateStockControlPayload = {
			item_id: validation.data.item_id,
			proposed_min_stock: validation.data.proposed_min_stock.trim(),
			fk_master_value_valuation_type_id: validation.data.fk_master_value_valuation_type_id,
			fk_master_value_frequency_of_valuation_id:
				validation.data.fk_master_value_frequency_of_valuation_id,
			window_days: 30
		};

		try {
			await onSubmit(payload);
			open = false;
		} catch (err: any) {
			errors = { _form: err?.message || 'Gagal menyimpan kontrol stok barang' };
		}
	}

	function handleCancel() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[520px]">
		<Dialog.Header>
			<Dialog.Title>Tambah Kontrol Stok Barang</Dialog.Title>
			<Dialog.Description>
				Ajukan perubahan stok minimum untuk barang yang dipilih.
			</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4 py-2">
			<!-- Item Selection -->
			<div class="space-y-2">
				<Label class="text-sm">Kode - Nama Barang <span class="text-red-500">*</span></Label>
				{#if isFromRow}
					<div class="flex h-10 items-center rounded-md border bg-muted px-3 text-sm">
						<span class="text-muted-foreground">{sourceRow?.item_code}</span>
						<span class="mx-2 text-muted-foreground">—</span>
						<span>{sourceRow?.item_name}</span>
					</div>
				{:else}
					<SearchableCombobox
						bind:value={formData.item_id}
						items={items as any}
						isLoading={itemsQuery.isLoading}
						onSearchChange={(q) => (searchQuery = q)}
						placeholder="Pilih barang..."
						searchPlaceholder="Cari barang..."
						renderSubtitle={(item: any) => item.code}
						disabled={isSubmitting}
					/>
					{#if errors.item_id}
						<p class="text-xs text-red-500">{errors.item_id}</p>
					{/if}
				{/if}
			</div>

			<!-- Proposed Min Stock -->
			<div class="space-y-2">
				<Label class="text-sm">Nilai Stok Minimum <span class="text-red-500">*</span></Label>

				{#if isFromRow}
					<!-- Radio choice: system recommendation vs manual -->
					<div class="space-y-2">
						<label
							class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors {minStockChoice ===
							'system'
								? 'border-primary bg-primary/5'
								: 'hover:bg-muted/50'}"
						>
							<input
								type="radio"
								name="min_stock_choice"
								value="system"
								bind:group={minStockChoice}
								class="mt-0.5"
							/>
							<div class="flex-1">
								<p class="text-sm font-medium">Terima Rekomendasi Sistem</p>
								<p class="text-xs text-muted-foreground">
									Total pemakaian: <span class="font-medium">{systemRef || '-'}</span>
									{#if itemUom}
										<span class="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium"
											>{itemUom}</span
										>
									{/if}
								</p>
							</div>
						</label>

						<label
							class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors {minStockChoice ===
							'manual'
								? 'border-primary bg-primary/5'
								: 'hover:bg-muted/50'}"
						>
							<input
								type="radio"
								name="min_stock_choice"
								value="manual"
								bind:group={minStockChoice}
								class="mt-0.5"
							/>
							<div class="flex-1">
								<p class="text-sm font-medium">Input Manual</p>
								{#if minStockChoice === 'manual'}
									<Input
										type="text"
										bind:value={formData.proposed_min_stock}
										placeholder="Masukkan nilai stok minimum"
										disabled={isSubmitting}
										class="mt-2 text-sm"
										onclick={(e) => e.stopPropagation()}
									/>
									{#if itemUom}
										<p class="mt-1 text-xs text-muted-foreground">
											Satuan: <span class="font-medium">{itemUom}</span>
										</p>
									{/if}
								{/if}
							</div>
						</label>
					</div>
				{:else}
					<Input
						type="text"
						bind:value={formData.proposed_min_stock}
						placeholder="Masukkan nilai stok minimum"
						disabled={isSubmitting}
						class="text-sm"
					/>
				{/if}

				{#if errors.proposed_min_stock}
					<p class="text-xs text-red-500">{errors.proposed_min_stock}</p>
				{/if}
			</div>

			<!-- Valuation Type -->
			<div class="space-y-2">
				<Label class="text-sm">Tipe Penilaian <span class="text-red-500">*</span></Label>
				{#if valuationTypesQuery.isLoading}
					<div class="flex h-10 items-center justify-center rounded-md border bg-muted">
						<p class="text-xs text-muted-foreground">Memuat...</p>
					</div>
				{:else}
					<Select.Root
						type="single"
						bind:value={formData.fk_master_value_valuation_type_id}
						disabled={isSubmitting}
					>
						<Select.Trigger
							class="w-full text-sm {errors.fk_master_value_valuation_type_id
								? 'border-red-500'
								: ''}"
						>
							{selectedValuationName || 'Pilih tipe penilaian...'}
						</Select.Trigger>
						<Select.Content>
							{#each valuationTypes as type}
								<Select.Item value={(type as any).id}>{(type as any).value}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/if}
				{#if errors.fk_master_value_valuation_type_id}
					<p class="text-xs text-red-500">{errors.fk_master_value_valuation_type_id}</p>
				{/if}
			</div>

			<!-- Frequency of Valuation -->
			<div class="space-y-2">
				<Label class="text-sm">Frekuensi Penilaian <span class="text-red-500">*</span></Label>
				{#if frequencyQuery.isLoading}
					<div class="flex h-10 items-center justify-center rounded-md border bg-muted">
						<p class="text-xs text-muted-foreground">Memuat...</p>
					</div>
				{:else}
					<Select.Root
						type="single"
						bind:value={formData.fk_master_value_frequency_of_valuation_id}
						disabled={isSubmitting}
					>
						<Select.Trigger
							class="w-full text-sm {errors.fk_master_value_frequency_of_valuation_id
								? 'border-red-500'
								: ''}"
						>
							{selectedFrequencyName || 'Pilih frekuensi penilaian...'}
						</Select.Trigger>
						<Select.Content>
							{#each frequencies as freq}
								<Select.Item value={(freq as any).id}>{(freq as any).value}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/if}
				{#if errors.fk_master_value_frequency_of_valuation_id}
					<p class="text-xs text-red-500">{errors.fk_master_value_frequency_of_valuation_id}</p>
				{/if}
			</div>

			<!-- Info note -->
			<div class="rounded-lg border bg-muted/50 p-3">
				<p class="text-xs text-muted-foreground">
					<strong>Catatan:</strong> Periode penilaian berdasarkan pemakaian barang.
				</p>
				{#if windowDays !== null}
					<p class="mt-1 text-xs text-muted-foreground">
						Periode Penilaian Referensi: <span class="font-medium">{windowDays} hari</span>
						{#if windowStart && windowEnd}
							<span class="mx-1">·</span>
							<span class="font-medium">{formatWindowDate(windowStart)}</span>
							<span class="mx-1">s/d</span>
							<span class="font-medium">{formatWindowDate(windowEnd)}</span>
						{/if}
					</p>
				{:else if !isFromRow && formData.item_id && selectedItemUsageQuery.isLoading}
					<p class="mt-1 text-xs text-muted-foreground">Memuat info periode...</p>
				{/if}
			</div>

			{#if errors._form}
				<div class="rounded-lg border border-red-200 bg-red-50 p-3">
					<p class="text-xs text-red-600">{errors._form}</p>
				</div>
			{/if}

			<Dialog.Footer class="sm:gap-3">
				<Button type="button" variant="outline" onclick={handleCancel} disabled={isSubmitting}>
					Batal
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
