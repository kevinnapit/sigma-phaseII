<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronDown } from 'lucide-svelte';

	let {
		open = $bindable(false),
		item
	}: {
		open?: boolean;
		item?: any;
	} = $props();

	let priceEstimationOpen = $state(true);

	// Mock stock data
	const mockStockData = {
		current_stock: 25,
		minimum_stock: 20,
		uom: 'BOX'
	};

	// Mock price data
	const mockPriceData = {
		budget_price: 150000,
		ho_last_price: 145000,
		lpo_last_price: 148000
	};

	const stockPercentage = $derived(() => {
		if (!mockStockData.minimum_stock || mockStockData.minimum_stock === 0) return 0;
		return Math.round((mockStockData.current_stock / mockStockData.minimum_stock) * 100);
	});

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

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Detail Item: {item?.item_code} - {item?.item_name}</Dialog.Title>
			<Dialog.Description>
				Informasi stok dan estimasi harga untuk item ini
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- Stock Information Card -->
			<Card class={showAlert ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}>
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle class="text-lg">Informasi Stok</CardTitle>
						<Badge variant={getStatusVariant(stockStatus())}>
							{getStatusText(stockStatus())}
						</Badge>
					</div>
				</CardHeader>
				<CardContent class="space-y-4">
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
								{mockStockData.current_stock}
								<span class="text-sm font-normal text-muted-foreground">{mockStockData.uom}</span>
							</p>
						</div>
						<div class="space-y-1">
							<p class="text-xs text-muted-foreground">Stok Minimum</p>
							<p class="text-2xl font-bold">
								{mockStockData.minimum_stock}
								<span class="text-sm font-normal text-muted-foreground">{mockStockData.uom}</span>
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
				</CardContent>
			</Card>

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
						<!-- Budget Price -->
						<div class="space-y-2 rounded-md bg-blue-50 p-3">
							<p class="text-xs font-medium text-blue-900">Harga Budget:</p>
							<div class="flex items-center justify-between">
								<span class="text-sm text-blue-700">Harga Barang:</span>
								<span class="text-sm font-medium text-blue-900">
									{formatCurrency(mockPriceData.budget_price)}
								</span>
							</div>
							<div class="flex items-center justify-between border-b border-blue-200 pb-2">
								<span class="text-sm font-medium text-blue-900">
									Total ({item?.quantity || 1} {item?.uom}):
								</span>
								<span class="text-lg font-bold text-blue-900">
									{formatCurrency(mockPriceData.budget_price * (item?.quantity || 1))}
								</span>
							</div>
						</div>

						<!-- HO Latest Price -->
						<div class="space-y-2 rounded-md bg-purple-50 p-3">
							<p class="text-xs font-medium text-purple-900">Harga HO Terakhir:</p>
							<div class="flex items-center justify-between">
								<span class="text-sm text-purple-700">Harga Barang:</span>
								<span class="text-sm font-medium text-purple-900">
									{formatCurrency(mockPriceData.ho_last_price)}
								</span>
							</div>
							<div class="flex items-center justify-between border-b border-purple-200 pb-2">
								<span class="text-sm font-medium text-purple-900">
									Total ({item?.quantity || 1} {item?.uom}):
								</span>
								<span class="text-lg font-bold text-purple-900">
									{formatCurrency(mockPriceData.ho_last_price * (item?.quantity || 1))}
								</span>
							</div>
						</div>

						<!-- LPO Latest Price -->
						<div class="space-y-2 rounded-md bg-orange-50 p-3">
							<p class="text-xs font-medium text-orange-900">Harga LPO Terakhir:</p>
							<div class="flex items-center justify-between">
								<span class="text-sm text-orange-700">Harga Barang:</span>
								<span class="text-sm font-medium text-orange-900">
									{formatCurrency(mockPriceData.lpo_last_price)}
								</span>
							</div>
							<div class="flex items-center justify-between border-b border-orange-200 pb-2">
								<span class="text-sm font-medium text-orange-900">
									Total ({item?.quantity || 1} {item?.uom}):
								</span>
								<span class="text-lg font-bold text-orange-900">
									{formatCurrency(mockPriceData.lpo_last_price * (item?.quantity || 1))}
								</span>
							</div>
						</div>
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
