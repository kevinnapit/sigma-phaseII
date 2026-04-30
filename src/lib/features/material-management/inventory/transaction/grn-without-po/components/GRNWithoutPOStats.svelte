<script lang="ts">
	import { FileText, Clock, CheckCircle, XCircle } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadGRNWithoutPOStats } from '../hooks/useGRNWithoutPOQueries.svelte';

	const statsQuery = useReadGRNWithoutPOStats();

	const stats = $derived.by(() => {
		const data = statsQuery.data || {
			total: 0,
			draft: 0,
			pending_approval: 0,
			approved: 0,
			rejected: 0
		};

		return [
			{
				title: 'TOTAL GRN',
				value: data.total,
				icon: FileText,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			},
			{
				title: 'MENUNGGU PERSETUJUAN',
				value: data.pending_approval,
				icon: Clock,
				iconColor: 'yellow' as const,
				unit: 'Dokumen'
			},
			{
				title: 'DISETUJUI',
				value: data.approved,
				icon: CheckCircle,
				iconColor: 'green' as const,
				unit: 'Dokumen'
			},
			{
				title: 'DITOLAK',
				value: data.rejected,
				icon: XCircle,
				iconColor: 'red' as const,
				unit: 'Dokumen'
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
