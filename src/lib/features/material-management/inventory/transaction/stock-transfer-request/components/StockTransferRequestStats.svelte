<script lang="ts">
	import { FileText, Clock, CheckCircle, XCircle } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { getMockStockTransferRequestStats } from '../api/stock-transfer-request.mock';

	let statsData = $state({ total: 0, pending: 0, approved: 0, rejected: 0 });
	let isLoading = $state(true);

	// Load stats
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			statsData = getMockStockTransferRequestStats();
			isLoading = false;
		}, 300);
	});

	const stats = $derived.by(() => {
		return [
			{
				title: 'TOTAL PERMINTAAN',
				value: statsData.total,
				icon: FileText,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			},
			{
				title: 'MENUNGGU APPROVAL',
				value: statsData.pending,
				icon: Clock,
				iconColor: 'yellow' as const,
				unit: 'Dokumen'
			},
			{
				title: 'DISETUJUI',
				value: statsData.approved,
				icon: CheckCircle,
				iconColor: 'green' as const,
				unit: 'Dokumen'
			},
			{
				title: 'DITOLAK',
				value: statsData.rejected,
				icon: XCircle,
				iconColor: 'red' as const,
				unit: 'Dokumen'
			}
		];
	});
</script>

{#if isLoading}
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

