<script lang="ts">
	import { ArrowLeftRight, Clock, CircleCheck, CircleX } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';

	// Mock data for now - nanti bisa diganti dengan real API
	const stats = [
		{
			title: 'TOTAL TRANSFER',
			value: 3,
			icon: ArrowLeftRight,
			iconColor: 'blue' as const,
			unit: 'Dokumen'
		},
		{
			title: 'MENUNGGU APPROVAL',
			value: 1,
			icon: Clock,
			iconColor: 'yellow' as const,
			unit: 'Transfer'
		},
		{
			title: 'DISETUJUI',
			value: 1,
			icon: CircleCheck,
			iconColor: 'green' as const,
			unit: 'Transfer'
		},
		{
			title: 'DITOLAK',
			value: 1,
			icon: CircleX,
			iconColor: 'red' as const,
			unit: 'Transfer'
		}
	];
</script>

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
