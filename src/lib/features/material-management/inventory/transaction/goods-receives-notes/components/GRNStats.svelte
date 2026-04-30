<script lang="ts">
	import { ClipboardList, Clock, CircleCheck, Ban } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadGRNSummary } from '../hooks/useGoodsReceivesNotesQueries.svelte';

	const summaryQuery = useReadGRNSummary();

	const stats = $derived.by(() => {
		if (!summaryQuery.data) return [];
		const data = summaryQuery.data.data;
		return [
			{
				title: 'TOTAL GRN',
				value: data.total_grn,
				icon: ClipboardList,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			},
			{
				title: 'MENUNGGU PERSETUJUAN',
				value: data.pending_approval,
				icon: Clock,
				iconColor: 'yellow' as const,
				unit: 'Penerimaan'
			},
			{
				title: 'DISETUJUI',
				value: data.approved,
				icon: CircleCheck,
				iconColor: 'green' as const,
				unit: 'Penerimaan'
			},
			{
				title: 'DIBATALKAN',
				value: data.cancelled,
				icon: Ban,
				iconColor: 'red' as const,
				unit: 'Penerimaan'
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
		Gagal memuat statistik penerimaan barang
	</div>
{:else}
	<div class="mb-2 flex flex-wrap gap-4">
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
