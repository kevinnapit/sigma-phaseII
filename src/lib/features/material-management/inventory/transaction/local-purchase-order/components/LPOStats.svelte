<script lang="ts">
	import { ClipboardList, Clock, CircleCheck, CircleX, FileText, Ban } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadLPOSummary } from '../hooks/useLocalPurchaseOrderQueries.svelte';

	const summaryQuery = useReadLPOSummary();

	const stats = $derived.by(() => {
		if (!summaryQuery.data) return [];
		const data = summaryQuery.data.data;
		return [
			{
				title: 'TOTAL LPO',
				value: data.total_lpo,
				icon: ClipboardList,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			},
			{
				title: 'MENUNGGU PERSETUJUAN',
				value: data.pending_approval,
				icon: Clock,
				iconColor: 'yellow' as const,
				unit: 'Pesanan'
			},
			{
				title: 'DISETUJUI',
				value: data.approved,
				icon: CircleCheck,
				iconColor: 'green' as const,
				unit: 'Pesanan'
			},
			{
				title: 'DITOLAK',
				value: data.rejected,
				icon: CircleX,
				iconColor: 'red' as const,
				unit: 'Pesanan'
			}
		];
	});
</script>

{#if summaryQuery.isLoading}
	<div class="flex flex-wrap gap-4">
		{#each Array(4) as _}
			<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
		{/each}
	</div>
{:else if summaryQuery.isError}
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
		Gagal memuat statistik order pembelian lokal
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
