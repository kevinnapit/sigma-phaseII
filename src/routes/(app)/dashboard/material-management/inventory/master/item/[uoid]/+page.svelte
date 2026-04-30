<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import {
		useReadDetailItem,
		useReadItemVRLDetail,
		useReadItemManufactures,
		useReadItemUOMLinks,
		useReadItemUsages,
		useReadItemStockRecords,
		useReadItemConversions
	} from '$lib/features/material-management/inventory/master/item';
	import ItemDetailCard from '$lib/features/material-management/inventory/master/item/components/ItemDetailCard.svelte';
	import EditItemInformationCard from '$lib/features/material-management/inventory/master/item/components/EditItemInformationCard.svelte';
	import ManufactureTab from '$lib/features/material-management/inventory/master/item/components/detailed-information/ManufactureTab.svelte';
	import UomLinkTab from '$lib/features/material-management/inventory/master/item/components/detailed-information/UomLinkTab.svelte';
	import SubstitutesItemTab from '$lib/features/material-management/inventory/master/item/components/detailed-information/SubstitutesItemTab.svelte';
	import ListItemUsageTab from '$lib/features/material-management/inventory/master/item/components/detailed-information/ListItemUsageTab.svelte';
	import StoreItemTab from '$lib/features/material-management/inventory/master/item/components/detailed-information/StoreItemTab.svelte';
	import ConversionItemTab from '$lib/features/material-management/inventory/master/item/components/detailed-information/ConversionItemTab.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { ITEM_PERMISSIONS } from '$lib/features/material-management/inventory/master/item/constants/item-permissions';

	const itemId = $derived(page.params.uoid || '');

	// Fetch item detail
	const itemQuery = useReadDetailItem(() => itemId);
	const item = $derived(itemQuery.data?.data || null);

	// Fetch item VRL detail
	const itemVRLQuery = useReadItemVRLDetail(() => itemId);
	const itemVRL = $derived.by(() => {
		const data = itemVRLQuery.data?.data;
		// Return null if data is empty array or falsy
		if (!data || (Array.isArray(data) && data.length === 0)) {
			return null;
		}
		// If data is array with items, return first item
		if (Array.isArray(data) && data.length > 0) {
			return data[0];
		}
		// Otherwise return data as is
		return data;
	});

	// Fetch item manufactures
	const manufacturesQuery = useReadItemManufactures(() => itemId);
	const manufactures = $derived(manufacturesQuery.data?.data || []);

	// Fetch item UOM links
	const uomLinksQuery = useReadItemUOMLinks(() => itemId);
	const uomLinks = $derived(uomLinksQuery.data?.data || []);

	// Fetch item usages
	const usagesQuery = useReadItemUsages(
		() => itemId,
		() => undefined
	);

	// Fetch item stock records
	const stockRecordsQuery = useReadItemStockRecords(() => itemId);
	const stockRecords = $derived(stockRecordsQuery.data?.data || []);

	// Fetch item conversions
	const conversionsQuery = useReadItemConversions(() => itemId);
	const conversions = $derived(conversionsQuery.data?.data || []);

	let activeTab = $state('detail-manufaktur');

	function handleBack() {
		const searchParams = page.url.searchParams.toString();
		const backUrl = `/dashboard/material-management/inventory/master/item${searchParams ? `?${searchParams}` : ''}`;
		goto(backUrl);
	}

	function onUpdateSuccess() {
		itemVRLQuery.refetch();
		conversionsQuery.refetch();
	}

	// Get initials for avatar
	const initials = $derived(
		item?.name
			?.split(' ')
			.map((word) => word[0])
			.join('')
			.substring(0, 2)
			.toUpperCase() || 'IT'
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-semibold">Detail Data Barang</h1>
			</div>
			<p class="text-sm text-gray-500">
				Informasi lengkap {item?.name || ''} ({item?.code || ''})
			</p>
		</div>

		<div class="mt-5 flex items-center gap-2 max-sm:-mb-3">
			<Button variant="ghost" class="border" onclick={handleBack}>
				<ArrowLeft class="h-4 w-4" />Kembali
			</Button>
		</div>
	</div>

	{#if itemQuery.isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-gray-500">Memuat data...</p>
		</div>
	{:else if itemQuery.isError}
		<div class="flex items-center justify-center py-12">
			<p class="text-red-500">Gagal memuat data barang</p>
		</div>
	{:else if item}
		<!-- Profile Card -->
		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-start gap-4">
					<!-- Avatar -->
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600"
					>
						{initials}
					</div>

					<!-- Info -->
					<div class="flex-1">
						<h2 class="text-xl font-semibold">{item.name}</h2>
						<p class="text-sm text-gray-500">{item.code}</p>

						<div class="mt-2 flex items-center gap-2">
							<Badge variant="default" class="bg-blue-500 hover:bg-blue-600">
								{item.item_class?.name || 'Barang'}
							</Badge>
							<Badge variant="outline">{item.base_uom?.code || '-'}</Badge>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Detail Barang Card (Read-only) -->
		<Guard permissions={ITEM_PERMISSIONS.BARANG_VARIABEL_VIEW}>
			<ItemDetailCard {item} />
		</Guard>

		<!-- Detail Informasi Card (Editable) -->
		{#if itemVRLQuery.isLoading}
			<Card.Root>
				<Card.Content class="p-6">
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat detail informasi...</p>
					</div>
				</Card.Content>
			</Card.Root>
		{:else if itemVRLQuery.isError}
			<Card.Root>
				<Card.Content class="p-6">
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat detail informasi</p>
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
				<!-- Always render EditItemInformationCard, it handles empty state internally -->
				<EditItemInformationCard {itemVRL} {itemId} {onUpdateSuccess} />
			</Guard>
		{/if}

		<!-- Detail Informasi Tabs -->
		<Tabs.Root bind:value={activeTab} class="w-full">
			<Tabs.List class="grid w-full grid-cols-6">
				<Tabs.Trigger value="detail-manufaktur">Detail Manufaktur</Tabs.Trigger>
				<Tabs.Trigger value="gudang">Gudang</Tabs.Trigger>
				<Tabs.Trigger value="pemetaan-transaksi">Pemetaan Transaksi Satuan</Tabs.Trigger>
				<Tabs.Trigger value="detail-substitusi">Detail Substitusi</Tabs.Trigger>
				<Tabs.Trigger value="penggunaan-item">Penggunaan Item</Tabs.Trigger>
				<Tabs.Trigger value="konversi-unit">Konversi Unit Item</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="detail-manufaktur" class="mt-6">
				{#if manufacturesQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data manufaktur...</p>
					</div>
				{:else if manufacturesQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data manufaktur</p>
					</div>
				{:else}
					<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
						<ManufactureTab
							{manufactures}
							{itemId}
							onUpdateSuccess={() => {
								manufacturesQuery.refetch();
							}}
						/>
					</Guard>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="gudang" class="mt-6">
				{#if stockRecordsQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data gudang...</p>
					</div>
				{:else if stockRecordsQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data gudang</p>
					</div>
				{:else}
					<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
						<StoreItemTab
							{stockRecords}
							{itemId}
							onUpdateSuccess={() => {
								stockRecordsQuery.refetch();
							}}
						/>
					</Guard>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="pemetaan-transaksi" class="mt-6">
				{#if uomLinksQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data pemetaan satuan...</p>
					</div>
				{:else if uomLinksQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data pemetaan satuan</p>
					</div>
				{:else}
					<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
						<UomLinkTab
							{uomLinks}
							{itemId}
							onUpdateSuccess={() => {
								uomLinksQuery.refetch();
							}}
						/>
					</Guard>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="detail-substitusi" class="mt-6">
				<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
					<SubstitutesItemTab {itemId} />
				</Guard>
			</Tabs.Content>

			<Tabs.Content value="penggunaan-item" class="mt-6">
				{#if usagesQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data penggunaan...</p>
					</div>
				{:else if usagesQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data penggunaan</p>
					</div>
				{:else}
					<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
						<ListItemUsageTab
							{itemId}
							onUpdateSuccess={() => {
								usagesQuery.refetch();
							}}
						/>
					</Guard>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="konversi-unit" class="mt-6">
				{#if conversionsQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data konversi unit...</p>
					</div>
				{:else if conversionsQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data konversi unit</p>
					</div>
				{:else}
					<Guard permissions={ITEM_PERMISSIONS.DETAIL_BARANG_VARIABEL_VIEW}>
						<ConversionItemTab
							{conversions}
							{itemId}
							{item}
							onUpdateSuccess={() => {
								conversionsQuery.refetch();
							}}
						/>
					</Guard>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</div>
