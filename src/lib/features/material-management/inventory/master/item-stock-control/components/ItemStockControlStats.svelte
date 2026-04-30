<script lang="ts">
	import { Package, Clock, CheckCircle, XCircle } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadStockControlSummary } from '../hooks/useItemStockControlQueries.svelte';

	const statsQuery = useReadStockControlSummary();

	const stats = $derived.by(() => {
		if (!statsQuery.data) return [];
		const d = statsQuery.data;
		return [
			{
				title: 'TOTAL KONTROL STOK',
				value: d.total_requests.toString(),
				icon: Package,
				iconColor: 'blue' as const,
				unit: 'Permintaan'
			},
			// {
			// 	title: 'BELUM DIAJUKAN',
			// 	value: d.draft_requests.toString(),
			// 	icon: Clock,
			// 	iconColor: 'yellow' as const,
			// 	unit: 'Permintaan'
			// },
			{
				title: 'MENUNGGU',
				value: d.pending_approval.toString(),
				icon: Clock,
				iconColor: 'yellow' as const,
				unit: 'Permintaan'
			},
			{
				title: 'DISETUJUI',
				value: d.approved_today.toString(),
				icon: CheckCircle,
				iconColor: 'green' as const,
				unit: 'Permintaan'
			},
			{
				title: 'DITOLAK',
				value: d.rejected_today.toString(),
				icon: XCircle,
				iconColor: 'red' as const,
				unit: 'Permintaan'
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
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
		Gagal memuat statistik kontrol stok barang
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
