<script lang="ts">
	import { Package, Layers, TrendingUp, Calendar } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadItemGroupStats } from '../hooks/useItemGroupQueries.svelte';
	import Info from '@lucide/svelte/icons/info';

	const statsQuery = useReadItemGroupStats();

	const stats = $derived.by(() => {
		if (!statsQuery.data?.data) return [];

		const data = statsQuery.data.data;

		return [
			{
				title: 'TOTAL GRUP BARANG',
				value: data.total_item_class.toString(),
				icon: Package,
				iconColor: 'blue' as const,
				unit: 'Grup'
			},
			{
				title: 'JUMLAH GRUP INDUK',
				value: data.total_parent.toString(),
				icon: Layers,
				iconColor: 'purple' as const,
				unit: 'Grup'
			},
			{
				title: 'TIPE PENILAIAN BERBEDA',
				value: data.distinct_valuation_type.toString(),
				icon: Package,
				iconColor: 'green' as const,
				unit: 'Jenis'
			},
			{
				title: 'FREKUENSI PENILAIAN',
				value: data.distinct_frequency_of_valuation.toString(),
				icon: Info,
				iconColor: 'orange' as const,
				unit: 'Jenis'
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
		Gagal memuat statistik grup barang
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
