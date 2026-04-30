<script lang="ts">
	import { Package, Calendar, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadItemStats } from '../hooks/useItemQueries.svelte';

	const statsQuery = useReadItemStats();

	const stats = $derived.by(() => {
		if (!statsQuery.data?.data) return [];

		const data = statsQuery.data.data;

		return [
			{
				title: 'TOTAL BARANG',
				value: data.total_items.toString(),
				icon: Package,
				iconColor: 'blue' as const,
				iconText: 'black' as const,
				unit: 'Barang'
			},
			// {
			// 	title: 'DENGAN KADALUARSA',
			// 	value: data.items_with_expiry.toString(),
			// 	icon: Calendar,
			// 	iconColor: 'orange' as const,
			// 	unit: 'Barang'
			// },
			{
				title: 'BARANG KRITIKAL ',
				value: data.critical_items.toString(),
				icon: AlertTriangle,
				iconColor: 'red' as const,
				unit: 'Barang'
			},
			{
				title: 'BARANG FAST MOVING',
				value: data.fast_moving_items.toString(),
				icon: TrendingUp,
				iconColor: 'green' as const,
				unit: 'Barang'
			},
			{
				title: 'BARANG SLOW MOVING',
				value: data.slow_moving_items.toString(),
				icon: TrendingDown,
				iconColor: 'orange' as const,
				unit: 'Barang'
			}
		];
	});
</script>

{#if statsQuery.isLoading}
	<div class="flex flex-wrap gap-4">
		{#each Array(4) as _}
			<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
		{/each}
	</div>
{:else if statsQuery.isError}
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
		Gagal memuat statistik barang
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
