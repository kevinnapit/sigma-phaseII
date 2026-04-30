<script lang="ts">
	import { FileText } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { getMockIssueReturnStats } from '../api/issue-return.mock';

	let statsData = $state({ total: 0 });
	let isLoading = $state(true);

	// Load stats
	$effect(() => {
		isLoading = true;
		setTimeout(() => {
			statsData = getMockIssueReturnStats();
			isLoading = false;
		}, 300);
	});

	const stats = $derived.by(() => {
		return [
			{
				title: 'TOTAL PENGEMBALIAN',
				value: statsData.total,
				icon: FileText,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			}
		];
	});
</script>

{#if isLoading}
	<div class="flex flex-wrap gap-4">
		<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
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
