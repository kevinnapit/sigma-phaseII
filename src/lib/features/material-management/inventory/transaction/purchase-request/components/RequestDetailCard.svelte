<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronDown, CircleAlert, CircleCheck, Clock, Save } from 'lucide-svelte';
	import {
		useProcurementSources,
		usePurchasingGroups
	} from '../hooks/usePurchaseRequestQueries.svelte';
	import { useReadDetailItem } from '$lib/features/material-management/inventory/master/item';
	import type { ItemComprehensiveData } from '$lib/features/material-management/inventory/master/item';
	import type {
		ProcurementSource,
		ProcurementSourceOption,
		CousinGardenAvailability
	} from '../types/purchase-request.types';
	import { purchaseRequestItemSchema } from '../schemas/purchase-request.schema';
	import { toast } from 'svelte-sonner';

	let {
		selectedItem,
		onSaveItem
	}: {
		selectedItem: ItemComprehensiveData | null;
		onSaveItem: (itemData: any) => void;
	} = $props();

	// Form state
	let quantity = $state(1);
	let deliveryDate = $state('');
	let procurementSource = $state<ProcurementSource | ''>('');
	let procurementSourceId = $state('');
	let selectedGardenCode = $state('');
	let selectedDepartmentId = $state('');
	let isUrgent = $state(false);
	let justification = $state('');

	// Set default delivery date to today
	$effect(() => {
		if (!deliveryDate) {
			const today = new Date();
			deliveryDate = today.toISOString().split('T')[0];
		}
	});

	// Validation errors
	let errors = $state<Record<string, string>>({});

	// Derived UOM from selected item
	const uom = $derived(
		selectedItem?.base_uom ? `${selectedItem.base_uom.name} (${selectedItem.base_uom.code})` : '-'
	);

	const uom_code = $derived(selectedItem?.base_uom ? `${selectedItem.base_uom.code} ` : '-');

	// Collapsible states
	let cousinGardenOpen = $state(true);
	let priceEstimationOpen = $state(false);

	// Queries
	const itemId = $derived(selectedItem?.uoid || '');
	const itemCode = $derived(selectedItem?.code || '');

	// Fetch detailed item data to get budget price
	const itemDetailQuery = useReadDetailItem(() => itemId);
	const itemDetail = $derived(itemDetailQuery.data?.data);

	const procurementSourcesQuery = useProcurementSources(
		() => itemCode,
		() => !!itemCode
	);
	
	const procurementData = $derived(procurementSourcesQuery.data?.data);
	const procurementOptions = $derived(procurementData?.procurement_sources || []);
	const itemInfo = $derived(procurementData?.item);
	
	// Check if local purchase needs approval - must be defined before purchasingGroupsQuery
	const localPurchaseOption = $derived(
		procurementOptions.find((opt) => opt.master_value.value === 'Local Purchase Order')
	);
	const localPurchaseNeedsApproval = $derived(
		localPurchaseOption?.status.label === 'Perlu Izin' || 
		localPurchaseOption?.status.label === 'Needs Approval'
	);
	const isLocalPurchaseNeedsApproval = $derived(
		procurementSource === 'local_purchase' && localPurchaseNeedsApproval
	);
	
	// Query for purchasing groups - load when head office OR local purchase needs approval
	const purchasingGroupsQuery = usePurchasingGroups(
		() => procurementSource === 'head_office' || (procurementSource === 'local_purchase' && localPurchaseNeedsApproval)
	);
	
	const purchasingGroups = $derived(purchasingGroupsQuery.data?.data || []);

	// Get budget price
	const budgetPrice = $derived(itemDetail?.budget_price?.budget_price ?? 0);

	// Get minimum stock from procurement source response
	const minimumStock = $derived(itemInfo?.minimum_stock ? parseFloat(itemInfo.minimum_stock) : 0);

	// Get cousin garden data - filter only gardens with stock > 0
	const cousinGardenOption = $derived(
		procurementOptions.find((opt) => opt.master_value.value === 'Other Estate')
	);
	const allCousinGardens = $derived(cousinGardenOption?.sepupu?.availability || []);
	const cousinGardens = $derived(
		allCousinGardens.filter((garden) => (garden.current_stock ?? 0) > 0)
	);

	// Get HO option for latest PO price
	const hoOption = $derived(
		procurementOptions.find((opt) => opt.master_value.value === 'Purchase Order')
	);
	const latestPOPrice = $derived(hoOption?.latest_po?.net_price ?? 0);

	// Get Local option for latest LPO price
	const localOption = $derived(
		procurementOptions.find((opt) => opt.master_value.value === 'Local Purchase Order')
	);
	const latestLPOPrice = $derived(localOption?.latest_lpo?.rate ?? 0);

	// Get selected garden details
	const selectedGarden = $derived(cousinGardens.find((g) => g.estate_code === selectedGardenCode));

	// Find cheapest garden
	const cheapestGarden = $derived(() => {
		if (cousinGardens.length === 0) return null;
		return cousinGardens.reduce((min, garden) => {
			return garden.price < min.price ? garden : min;
		}, cousinGardens[0]);
	});

	// Calculate price comparison
	const priceComparison = $derived(() => {
		if (!selectedGarden) return null;

		const lastPurchasePrice = selectedGarden.price;
		const totalBudget = budgetPrice * quantity;
		const totalLastPurchase = lastPurchasePrice * quantity;
		const difference = totalBudget - totalLastPurchase;
		const percentage = totalBudget > 0 ? ((difference / totalBudget) * 100).toFixed(1) : '0.0';

		return {
			lastPurchasePrice,
			totalBudget,
			totalLastPurchase,
			difference,
			percentage: parseFloat(percentage),
			isLower: difference > 0,
			isHigher: difference < 0
		};
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	};

	const mapProcurementSource = (value: string): ProcurementSource | '' => {
		if (value === 'Other Estate' || value === 'Cousin Garden') return 'cousin_garden';
		if (value === 'Local Purchase Order' || value === 'Local Purchase') return 'local_purchase';
		if (value === 'Purchase Order' || value === 'Head Office') return 'head_office';
		return '';
	};

	const getSourceLabel = (value: string) => {
		if (value === 'Local Purchase Order' || value === 'Local Purchase') return 'Pembelian Lokal';
		if (value === 'Purchase Order' || value === 'Head Office') return 'Kantor Pusat';
		if (value === 'Other Estate' || value === 'Cousin Garden') return 'Kebun Sepupu';
		return value;
	};

	const getStatusIcon = (severity: string) => {
		if (severity === 'info') return CircleCheck;
		if (severity === 'warning') return CircleAlert;
		return Clock;
	};

	const getStatusVariant = (severity: string) => {
		if (severity === 'info') return 'default' as const;
		if (severity === 'warning') return 'default' as const;
		return 'outline' as const;
	};

	function handleSourceSelect(option: ProcurementSourceOption) {
		procurementSource = mapProcurementSource(option.master_value.value);
		procurementSourceId = option.master_value.id;

		selectedGardenCode = '';
		selectedDepartmentId = '';

		if (procurementSource !== 'head_office') {
			isUrgent = false;
		}
	}

	function handleGardenSelect(garden: CousinGardenAvailability) {
		selectedGardenCode = garden.estate_code;
	}

	function handleSaveItem() {
		if (!selectedItem) return;

		errors = {};

		// Validasi status sumber pengadaan
		const selectedOption = procurementOptions.find(
			(opt) => opt.master_value.id === procurementSourceId
		);
		if (selectedOption) {
			const statusLabel = selectedOption.status.label;
			
			// Block "Tidak Diizinkan" completely
			if (statusLabel === 'Tidak Diizinkan') {
				toast.error('Barang ini tidak diizinkan untuk pembelian lokal');
				return;
			}
			
			// For "Perlu Izin" status, check if department is selected
			if (statusLabel === 'Perlu Izin' || statusLabel === 'Needs Approval') {
				if (procurementSource === 'local_purchase' && !selectedDepartmentId) {
					errors.purchasing_group_id = 'Departemen tujuan wajib dipilih untuk barang yang perlu izin';
					toast.error('Silahkan pilih departemen tujuan untuk barang yang perlu izin');
					return;
				}
			}
		}
		
		// Additional validation for local purchase that needs approval
		if (isLocalPurchaseNeedsApproval && !selectedDepartmentId) {
			errors.purchasing_group_id = 'Departemen tujuan wajib dipilih';
			toast.error('Silahkan pilih departemen tujuan');
			return;
		}

		// Ensure UOM data is available
		const uomCode = selectedItem.base_uom?.code || 'UNIT';
		const uomName = selectedItem.base_uom?.name || 'Unit';
		const uomId = selectedItem.base_uom?.uoid || 'default-uom-id';

		const itemData = {
			item_id: selectedItem.uoid || '',
			item_code: selectedItem.code || '',
			item_name: selectedItem.name || '',
			quantity,
			uom: uomCode,
			uom_name: uomName,
			uom_id: uomId,
			procurement_source: procurementSource || 'local_purchase',
			procurement_source_id: procurementSourceId || 'default-proc-id',
			cousin_garden_code: selectedGardenCode || undefined,
			cousin_garden_name: selectedGarden?.estate_name || undefined,
			cousin_garden_price: selectedGarden?.price || undefined,
			estate_id: selectedGarden?.estate_id || undefined,
			purchasing_group_id: selectedDepartmentId || undefined,
			purchasing_group_name:
				purchasingGroups.find((g) => g.uoid === selectedDepartmentId)?.name || undefined,
			delivery_date: deliveryDate || undefined,
			estimated_price: budgetPrice || 0,
			ho_last_price: procurementSource === 'head_office' ? latestPOPrice : undefined,
			lpo_last_price: procurementSource === 'local_purchase' ? latestLPOPrice : undefined,
			is_urgent: isUrgent || false,
			justification: justification || 'Kebutuhan operasional'
		};

		const result = purchaseRequestItemSchema.safeParse(itemData);

		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((err: any) => {
				const path = err.path[0] as string;
				fieldErrors[path] = err.message;
				console.error('Item validation error:', path, err.message, 'Value:', itemData[path as keyof typeof itemData]);
			});
			errors = fieldErrors;

			console.error('Item data:', itemData);
			console.error('Validation errors:', result.error.issues);
			toast.error('Silahkan lengkapi data anda');
			return;
		}

		onSaveItem(itemData);
		resetForm();
	}

	function resetForm() {
		quantity = 1;
		const today = new Date();
		deliveryDate = today.toISOString().split('T')[0];
		procurementSource = '';
		procurementSourceId = '';
		selectedGardenCode = '';
		selectedDepartmentId = '';
		isUrgent = false;
		justification = '';
		errors = {};
	}

	// Public function to load item data for editing
	export function loadItemData(itemData: any) {
		quantity = itemData.quantity;
		deliveryDate = itemData.delivery_date || '';
		procurementSource = itemData.procurement_source;
		procurementSourceId = itemData.procurement_source_id;
		selectedGardenCode = itemData.cousin_garden_code || '';
		selectedDepartmentId = itemData.purchasing_group_id || '';
		isUrgent = itemData.is_urgent;
		justification = itemData.justification;
	}
</script>

{#if selectedItem}
	<Card>
		<CardHeader>
			<CardTitle class="text-lg">Detail Permintaan</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<!-- Item Info -->
			<!-- <div class="rounded-lg border bg-muted/50 p-4">
				<div class="flex items-start justify-between">
					<div class="space-y-1">
						<p class="font-semibold">{selectedItem.code} - {selectedItem.name}</p>
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							{#if selectedItem.uom}
								<span>{selectedItem.uom.name}</span>
							{/if}
						</div>
					</div>
				</div>
			</div> -->

			<!-- Quantity & UOM -->
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label>Jumlah <span class="text-red-500">*</span></Label>
					<Input
						type="number"
						bind:value={quantity}
						min="0.0001"
						step="0.0001"
						class={errors.quantity ? 'border-red-500' : ''}
					/>
					{#if errors.quantity}
						<p class="text-xs text-red-600">{errors.quantity}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label>Satuan <span class="text-red-500">*</span></Label>
					<Input value={uom} readonly class="bg-muted/50" />
				</div>
			</div>

			<!-- Delivery Date -->
			<div class="space-y-2">
				<Label>Diperlukan Tanggal</Label>
				<Input type="date" bind:value={deliveryDate} />
			</div>

			<!-- Procurement Source -->
			<div class="space-y-3">
				<Label>Sumber Pengadaan <span class="text-red-500">*</span></Label>
				{#if procurementSourcesQuery.isLoading}
					<div class="flex items-center justify-center py-4">
						<div class="text-center">
							<div
								class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
							></div>
							<p class="mt-2 text-xs text-muted-foreground">Memuat sumber pengadaan...</p>
						</div>
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
						{#each procurementOptions as option}
							{@const isSelected = procurementSourceId === option.master_value.id}
							{@const isLocalPurchase = option.master_value.value === 'Local Purchase' || option.master_value.value === 'Local Purchase Order'}
							{@const isHeadOffice = option.master_value.value === 'Head Office' || option.master_value.value === 'Purchase Order'}
							{@const isCousinGarden = option.master_value.value === 'Cousin Garden' || option.master_value.value === 'Other Estate'}
							{@const cousinGardenCount = isCousinGarden ? (option.sepupu?.availability?.filter(g => (g.current_stock ?? 0) > 0).length || 0) : 0}
							<button
								type="button"
								onclick={() => handleSourceSelect(option)}
								class="flex flex-col items-center justify-center space-y-3 rounded-lg border-2 p-4 transition-all hover:border-primary/50 hover:bg-primary/10 {isSelected
									? 'border-primary/50 bg-primary/10'
									: errors.procurement_source_id
										? 'border-red-500'
										: 'border-gray-200 bg-white'}"
							>
								<div class="text-center">
									<p class="font-semibold text-gray-900">
										{getSourceLabel(option.master_value.value)}
									</p>
								</div>
								{#if isLocalPurchase}
									{@const StatusIcon = getStatusIcon(option.status.severity)}
									<Badge variant={getStatusVariant(option.status.severity)} class="gap-1">
										<StatusIcon class="h-3 w-3" />
										{#if option.status.label === 'Available'}
											Diizinkan
										{:else if option.status.label === 'Perlu Izin' || option.status.label === 'Needs Approval'}
											Perlu Izin
										{:else}
											Tidak Diizinkan
										{/if}
									</Badge>
								{:else if isCousinGarden}
									<Badge variant="default" class="gap-1 bg-green-600">
										{cousinGardenCount} Kebun
									</Badge>
								{:else if isHeadOffice}
									<span class="text-sm text-muted-foreground">-</span>
								{/if}
							</button>
						{/each}
					</div>
					{#if errors.procurement_source_id || errors.procurement_source}
						<p class="text-xs text-red-600">
							{errors.procurement_source_id || errors.procurement_source}
						</p>
					{/if}
				{/if}
			</div>

			<!-- Cousin Garden Details -->
			{#if procurementSource === 'cousin_garden'}
				<Collapsible.Root bind:open={cousinGardenOpen}>
					<Collapsible.Trigger
						class="flex w-full items-center justify-between rounded-lg p-3 text-sm font-medium {errors.cousin_garden_code
							? 'border-2 border-red-500 bg-red-50'
							: 'border-primary/50 bg-primary/10'}"
					>
						<span>Pilih Kebun Sepupu <span class="text-red-500">*</span></span>
						<ChevronDown
							class="h-4 w-4 transition-transform {cousinGardenOpen ? 'rotate-180' : ''}"
						/>
					</Collapsible.Trigger>
					{#if errors.cousin_garden_code}
						<p class="mt-1 text-xs text-red-600">{errors.cousin_garden_code}</p>
					{/if}
					<Collapsible.Content class="mt-2 space-y-2">
						{#if cousinGardens.length > 0}
							<div class="grid gap-3 md:grid-cols-2">
								{#each cousinGardens as garden}
									{@const isSelected = selectedGardenCode === garden.estate_code}
									{@const cheapest = cheapestGarden()}
									{@const isCheapest = cheapest && cheapest.estate_code === garden.estate_code}
									<button
										type="button"
										onclick={() => handleGardenSelect(garden)}
										class="relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 {isSelected
											? 'border-primary bg-primary/5'
											: 'border-gray-200 bg-white'}"
									>
										<div class="mb-3 flex items-start justify-between">
											<div class="flex-1 pr-16">
												<p class="text-sm font-bold text-gray-900">
													{garden.estate_code || '-'}
												</p>
												<p class="text-xs text-muted-foreground">
													{garden.estate_name || '-'}
												</p>
											</div>
											<div class="text-right">
												<p class="text-xs text-muted-foreground">Stok:</p>
												<p class="text-sm font-bold text-green-600">
													{garden.current_stock ?? 0}
													{uom_code || ''}
												</p>
											</div>
										</div>
										<div class="border-gray-150 rounded bg-primary/4 px-3 py-2">
											<!-- Cheapest Label -->
											{#if isCheapest}
												<div class="absolute right-2 mr-4">
													<Badge variant="default" class="rounded-full bg-green-600 text-xs"
														>TERMURAH</Badge
													>
												</div>
											{/if}
											<p class="text-xs text-muted-foreground">Harga Barang :</p>
											<p class="text-sm font-bold text-green-600">
												{formatCurrency(garden.price ?? 0)}
												<span class="text-xs font-normal text-muted-foreground">
													/ {uom_code || ''}
												</span>
											</p>
										</div>
									</button>
								{/each}
							</div>
						{:else}
							<div
								class="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
							>
								<CircleAlert class="mb-2 h-12 w-12 text-muted-foreground/50" />
								<p class="font-medium text-muted-foreground">Tidak Ada Data Stok</p>
								<p class="mt-1 text-sm text-muted-foreground">
									Tidak ada data stok tersedia di kebun sepupu untuk item ini
								</p>
							</div>
						{/if}
					</Collapsible.Content>
				</Collapsible.Root>
			{/if}

			<!-- Department Selection for Head Office -->
			{#if procurementSource === 'head_office'}
				<div class="space-y-2">
					<Label>Departemen Tujuan <span class="text-red-500">*</span></Label>
					{#if purchasingGroupsQuery.isLoading}
						<div class="flex items-center justify-center py-4">
							<div class="text-center">
								<div
									class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
								></div>
								<p class="mt-2 text-xs text-muted-foreground">Memuat departemen...</p>
							</div>
						</div>
					{:else}
						<Select.Root type="single" bind:value={selectedDepartmentId}>
							<Select.Trigger class="w-full {errors.purchasing_group_id ? 'border-red-500' : ''}">
								{#if selectedDepartmentId && purchasingGroups.find((g) => g.uoid === selectedDepartmentId)}
									{@const selected = purchasingGroups.find((g) => g.uoid === selectedDepartmentId)}
									{selected.code} - {selected.name}
								{:else}
									Pilih departemen tujuan...
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#each purchasingGroups as group}
									<Select.Item value={group.uoid}>
										{group.code} - {group.name}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if errors.purchasing_group_id}
							<p class="text-xs text-red-600">{errors.purchasing_group_id}</p>
						{/if}
					{/if}
				</div>
			{/if}

			<!-- Department Selection for Local Purchase (Needs Approval) -->
			{#if isLocalPurchaseNeedsApproval}
				<div class="space-y-2">
					<Label>Departemen Tujuan <span class="text-red-500">*</span></Label>
					<p class="text-xs text-muted-foreground mb-2">
						Barang ini memerlukan persetujuan departemen untuk pembelian lokal
					</p>
					{#if purchasingGroupsQuery.isLoading}
						<div class="flex items-center justify-center py-4">
							<div class="text-center">
								<div
									class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
								></div>
								<p class="mt-2 text-xs text-muted-foreground">Memuat departemen...</p>
							</div>
						</div>
					{:else}
						<Select.Root type="single" bind:value={selectedDepartmentId}>
							<Select.Trigger class="w-full {errors.purchasing_group_id ? 'border-red-500' : ''}">
								{#if selectedDepartmentId && purchasingGroups.find((g) => g.uoid === selectedDepartmentId)}
									{@const selected = purchasingGroups.find((g) => g.uoid === selectedDepartmentId)}
									{selected.code} - {selected.name}
								{:else}
									Pilih departemen tujuan...
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#each purchasingGroups as group}
									<Select.Item value={group.uoid}>
										{group.code} - {group.name}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if errors.purchasing_group_id}
							<p class="text-xs text-red-600">{errors.purchasing_group_id}</p>
						{/if}
					{/if}
				</div>
			{/if}

			<!-- Price Estimation -->
			<Collapsible.Root bind:open={priceEstimationOpen}>
				<Collapsible.Trigger
					class="flex w-full items-center justify-between rounded-lg border bg-blue-50 p-3 text-sm font-medium"
				>
					<span>Estimasi Harga</span>
					<ChevronDown
						class="h-4 w-4 transition-transform {priceEstimationOpen ? 'rotate-180' : ''}"
					/>
				</Collapsible.Trigger>
				<Collapsible.Content class="mt-2">
					<div class="space-y-3 rounded-lg border bg-white p-4">
						{#if itemDetailQuery.isLoading}
							<div class="flex items-center justify-center py-4">
								<div class="text-center">
									<div
										class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
									></div>
									<p class="mt-2 text-xs text-muted-foreground">Memuat harga budget...</p>
								</div>
							</div>
						{:else}
							<!-- Budget Price -->
							{#if budgetPrice > 0}
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-sm text-muted-foreground">Harga Budget:</span>
										<span class="text-sm font-medium">{formatCurrency(budgetPrice)}</span>
									</div>
									<div class="flex items-center justify-between border-b pb-2">
										<span class="text-sm font-medium">Budget Total ({quantity} {uom}):</span>
										<span class="text-lg font-bold text-blue-600">
											{formatCurrency(budgetPrice * quantity)}
										</span>
									</div>
								</div>
							{/if}

							<!-- Last Purchase Price (if garden selected) -->
							{#if selectedGarden && priceComparison()}
								{@const comparison = priceComparison()}
								{#if comparison}
									<div class="space-y-2 rounded-md bg-green-50 p-3">
										<p class="text-xs font-medium text-green-900">
											Pengeluaran Terakhir {selectedGarden.estate_code}:
										</p>
										<div class="flex items-center justify-between">
											<span class="text-sm text-green-700">Harga Barang :</span>
											<span class="text-sm font-medium text-green-900">
												{formatCurrency(comparison.lastPurchasePrice)}
											</span>
										</div>
										<div class="flex items-center justify-between border-b border-green-200 pb-2">
											<span class="text-sm font-medium text-green-900">
												Total ({quantity}
												{uom}):
											</span>
											<span class="text-lg font-bold text-green-900">
												{formatCurrency(comparison.totalLastPurchase)}
											</span>
										</div>

										<!-- Price Difference -->
										{#if budgetPrice > 0}
											<div class="mt-2 space-y-1">
												<div class="flex items-center justify-between">
													<span class="text-sm text-green-700">Selisih:</span>
													<span
														class="text-sm font-bold {comparison.isLower
															? 'text-green-600'
															: 'text-red-600'}"
													>
														{comparison.isLower ? '↓' : '↑'}
														{formatCurrency(Math.abs(comparison.difference))}
														({Math.abs(comparison.percentage)}%)
													</span>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							{/if}

							<!-- HO Latest PO Price -->
							{#if latestPOPrice > 0}
								<div class="space-y-2 rounded-md bg-purple-50 p-3">
									<p class="text-xs font-medium text-purple-900">Harga HO Terakhir:</p>
									<div class="flex items-center justify-between">
										<span class="text-sm text-purple-700">Harga Barang:</span>
										<span class="text-sm font-medium text-purple-900">
											{formatCurrency(latestPOPrice)}
										</span>
									</div>
									<div class="flex items-center justify-between border-b border-purple-200 pb-2">
										<span class="text-sm font-medium text-purple-900">
											Total ({quantity}
											{uom}):
										</span>
										<span class="text-lg font-bold text-purple-900">
											{formatCurrency(latestPOPrice * quantity)}
										</span>
									</div>
								</div>
							{/if}

							<!-- LPO Latest Price -->
							{#if latestLPOPrice > 0}
								<div class="space-y-2 rounded-md bg-orange-50 p-3">
									<p class="text-xs font-medium text-orange-900">Harga LPO Terakhir:</p>
									<div class="flex items-center justify-between">
										<span class="text-sm text-orange-700">Harga Barang:</span>
										<span class="text-sm font-medium text-orange-900">
											{formatCurrency(latestLPOPrice)}
										</span>
									</div>
									<div class="flex items-center justify-between border-b border-orange-200 pb-2">
										<span class="text-sm font-medium text-orange-900">
											Total ({quantity}
											{uom}):
										</span>
										<span class="text-lg font-bold text-orange-900">
											{formatCurrency(latestLPOPrice * quantity)}
										</span>
									</div>
								</div>
							{/if}

							{#if budgetPrice === 0 && latestPOPrice === 0 && latestLPOPrice === 0 && !selectedGarden}
								<div class="flex flex-col items-center justify-center py-4 text-center">
									<CircleAlert class="mb-2 h-8 w-8 text-muted-foreground/50" />
									<p class="text-sm font-medium text-muted-foreground">Harga Tidak Tersedia</p>
									<p class="mt-1 text-xs text-muted-foreground">
										Data harga untuk item ini belum tersedia
									</p>
								</div>
							{/if}
						{/if}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>

			<!-- Justification / Purpose -->
			<div class="space-y-2">
				<Label>Tujuan Penggunaan <span class="text-red-500">*</span></Label>
				<Textarea
					bind:value={justification}
					placeholder="Jelaskan tujuan dan justifikasi permintaan ini secara detail..."
					rows={3}
					class={errors.justification ? 'border-red-500' : ''}
				/>
				{#if errors.justification}
					<p class="text-xs text-red-600">{errors.justification}</p>
				{/if}
			</div>

			<!-- Urgent Request (Only for Head Office) - WITHOUT REASON FIELD -->
			{#if procurementSource === 'head_office'}
				<div class="space-y-3">
					<div class="flex items-center justify-between rounded-lg border p-3">
						<div class="space-y-0.5">
							<Label>Permintaan Darurat</Label>
							<p class="text-xs text-muted-foreground">Aktifkan jika ini adalah prioritas tinggi</p>
						</div>
						<Switch bind:checked={isUrgent} />
					</div>
				</div>
			{/if}

			<!-- Save Item Button -->
			<div class="flex justify-end pt-4">
				<Button onclick={handleSaveItem} class="w-full md:w-auto">
					<Save class="mr-2 h-4 w-4" />
					Simpan Item ke Daftar
				</Button>
			</div>
		</CardContent>
	</Card>
{:else}
	<Card>
		<CardContent class="flex flex-col items-center justify-center py-12">
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50"
				>
					<CircleAlert class="h-8 w-8 text-muted-foreground" />
				</div>
				<p class="font-medium">Belum Ada Item Dipilih</p>
				<p class="mt-1 text-sm text-muted-foreground">
					Pilih item dari hasil pencarian untuk melanjutkan
				</p>
			</div>
		</CardContent>
	</Card>
{/if}
