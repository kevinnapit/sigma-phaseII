<script lang="ts">
	import { Warehouse, CheckCircle, XCircle, House } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadStoreStats } from '../hooks/useStoresQueries.svelte';

	const storeStatsQuery = useReadStoreStats();

	const stats = $derived.by(() => {
		if (!storeStatsQuery.data?.data) return [];

		const data = storeStatsQuery.data.data;

		return [
			{
				title: 'TOTAL DATA GUDANG',
				value: data.total_stores.toString(),
				icon: Warehouse,
				iconColor: 'blue' as const,
				iconText: 'black' as const,
				unit: 'Gudang'
			},
			{
				title: 'GUDANG AKTIF',
				value: data.active_stores.toString(),
				icon: CheckCircle,
				iconColor: 'green' as const,
				unit: 'Gudang'
			},
			{
				title: 'GUDANG NONAKTIF',
				value: data.inactive_stores.toString(),
				icon: XCircle,
				iconColor: 'red' as const,
				unit: 'Gudang'
			},
			{
				title: 'TIPE GUDANG BERBEDA',
				value: (data.store_types?.length ?? 0).toString(),
				icon: House,
				iconColor: 'purple' as const,
				unit: 'Jenis'
			}
		];
	});
</script>

{#if storeStatsQuery.isLoading}
	<div class="flex flex-wrap gap-4">
		{#each Array(4) as _}
			<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
		{/each}
	</div>
{:else if storeStatsQuery.isError}
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
		Gagal memuat statistik gudang
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
