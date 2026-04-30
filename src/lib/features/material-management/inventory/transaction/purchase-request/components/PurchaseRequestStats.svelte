<script lang="ts">
	import { ClipboardList, ShoppingCart, Store } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadPurchaseRequestSummary } from '../hooks/usePurchaseRequestQueries.svelte';

	const summaryQuery = useReadPurchaseRequestSummary();

	const stats = $derived.by(() => {
		if (!summaryQuery.data) return [];
		const data = summaryQuery.data.data;
		return [
			{
				title: 'TOTAL PERMINTAAN',
				value: data.total_requests,
				icon: ClipboardList,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			},
			{
				title: 'TOTAL PURCHASE ORDER',
				value: data.total_purchase_order,
				icon: ShoppingCart,
				iconColor: 'green' as const,
				unit: 'Dokumen'
			},
			{
				title: 'TOTAL LPO',
				value: data.total_local_purchase_order,
				icon: Store,
				iconColor: 'yellow' as const,
				unit: 'Dokumen'
			}
		];
	});
</script>

{#if summaryQuery.isLoading}
	<div class="flex flex-wrap gap-4">
		{#each Array(3) as _}
			<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
		{/each}
	</div>
{:else if summaryQuery.isError}
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
		Gagal memuat statistik permintaan pembelian
	</div>
{:else}
	<div class="flex flex-wrap gap-4">
		{#each stats as stat}
			<StatCard
				title={stat.title}
				value={stat.value}
				icon={stat.icon}
				iconColor={stat.iconColor}
				unit={stat.unit}
			/>
		{/each}
	</div>
{/if}
