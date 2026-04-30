<script lang="ts">
	import { Warehouse, CheckCircle } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadItemStorageLayoutStats } from '../hooks/useItemStorageLayoutQueries.svelte';

	const statsQuery = useReadItemStorageLayoutStats();

	const stats = $derived.by(() => {
		if (!statsQuery.data?.data) return [];

		const data = statsQuery.data.data;

		return [
			{
				title: 'TOTAL RAK',
				value: data.total_layouts.toString(),
				icon: Warehouse,
				iconColor: 'blue' as const,
				iconText: 'black' as const,
				unit: 'Rak'
			},
			{
				title: 'RAK AKTIF',
				value: data.active_layouts.toString(),
				icon: CheckCircle,
				iconColor: 'green' as const,
				unit: 'Rak'
			}
		];
	});
</script>

{#if statsQuery.isLoading}
	<div class="flex flex-wrap gap-4">
		{#each Array(2) as _}
			<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
		{/each}
	</div>
{:else if statsQuery.isError}
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
		Gagal memuat statistik rak penyimpanan
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
