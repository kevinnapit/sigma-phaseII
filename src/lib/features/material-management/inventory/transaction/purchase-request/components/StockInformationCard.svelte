<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { AlertCircle, Package } from 'lucide-svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { useProcurementSources } from '../hooks/usePurchaseRequestQueries.svelte';
	import type { ItemComprehensiveData } from '$lib/features/material-management/inventory/master/item';

	let {
		selectedItem
	}: {
		selectedItem: ItemComprehensiveData | null;
	} = $props();

	// Query procurement sources to get minimum stock
	const itemCode = $derived(selectedItem?.code || '');
	const procurementSourcesQuery = useProcurementSources(
		() => itemCode,
		() => !!itemCode
	);

	const procurementData = $derived(procurementSourcesQuery.data?.data);
	const itemInfo = $derived(procurementData?.item);
	const isLoading = $derived(procurementSourcesQuery.isLoading);

	// Get minimum stock from procurement source response
	const minimumStock = $derived(itemInfo?.minimum_stock ? parseFloat(itemInfo.minimum_stock) : 0);

	const stocktotal = $derived(itemInfo?.stock_total?.total_current_stock);

	// Current stock from procurement source response
	const currentStock = $derived(
		itemInfo?.stock_total?.total_current_stock
			? parseFloat(itemInfo.stock_total.total_current_stock)
			: 0
	);

	// Calculate stock percentage
	const stockPercentage = $derived(() => {
		if (!minimumStock || minimumStock === 0) return 0;
		return Math.round((currentStock / minimumStock) * 100);
	});

	// Determine stock status based on percentage
	const stockStatus = $derived(() => {
		const percentage = stockPercentage();
		if (percentage < 100) return 'STOK_KURANG';
		return 'STOK_CUKUP';
	});

	const getStatusVariant = (status: string) => {
		if (status === 'STOK_KURANG') return 'destructive';
		return 'default';
	};

	const getStatusText = (status: string) => {
		if (status === 'STOK_KURANG') return 'Perlu Pengadaan!';
		return 'Stok Cukup';
	};

	const showAlert = $derived(stockStatus() === 'STOK_KURANG');
	const progressColor = $derived(stockStatus() === 'STOK_KURANG' ? 'bg-red-500' : 'bg-green-500');
	const textColor = $derived(stockStatus() === 'STOK_KURANG' ? 'text-red-600' : 'text-green-600');
</script>

<Card class={showAlert ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}>
	<CardHeader>
		<div class="flex items-center justify-between">
			<CardTitle class="text-lg">Informasi Stok</CardTitle>
			{#if minimumStock > 0}
				<Badge variant={getStatusVariant(stockStatus())}>
					{getStatusText(stockStatus())}
				</Badge>
			{/if}
		</div>
	</CardHeader>
	<CardContent class="space-y-4">
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="text-center">
					<div
						class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
					></div>
					<p class="mt-2 text-sm text-muted-foreground">Memuat informasi stok...</p>
				</div>
			</div>
		{:else if !itemInfo}
			<!-- <div class="flex flex-col items-center justify-center py-8 text-center">
				<Package class="h-12 w-12 text-muted-foreground/50" />
				<p class="mt-2 text-sm font-medium">Informasi stok tidak tersedia</p>
				<p class="text-xs text-muted-foreground">Data kontrol stok belum dikonfigurasi</p>
			</div> -->
		{:else}
			<!-- Alert -->
			{#if showAlert}
				<Alert variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<AlertDescription>
						Stok saat ini di bawah minimum. Segera lakukan pengadaan.
					</AlertDescription>
				</Alert>
			{/if}

			<!-- Stock Summary -->
			<div class="grid grid-cols-3 gap-4">
				<div class="space-y-1">
					<p class="text-xs text-muted-foreground">Stok Saat Ini</p>
					<p class="text-2xl font-bold {textColor}">
						{stocktotal || '-'}
						<span class="text-sm font-normal text-muted-foreground"
							>{itemInfo?.uom?.code || ''}</span
						>
					</p>
					<!-- <p class="text-xs text-muted-foreground">Belum tersedia</p> -->
				</div>
				<div class="space-y-1">
					<p class="text-xs text-muted-foreground">Stok Minimum</p>
					<p class="text-2xl font-bold">
						{minimumStock.toFixed(0) || '-'}
						<span class="text-sm font-normal text-muted-foreground"
							>{itemInfo?.uom?.code || ''}</span
						>
					</p>
				</div>
				<div class="space-y-1">
					<p class="text-xs text-muted-foreground">Persentase</p>
					<p class="text-2xl font-bold {textColor}">{stockPercentage()}%</p>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="space-y-2">
				<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
					<div
						class="h-full {progressColor} transition-all"
						style="width: {Math.min(stockPercentage(), 100)}%"
					></div>
				</div>
			</div>
		{/if}
	</CardContent>
</Card>
