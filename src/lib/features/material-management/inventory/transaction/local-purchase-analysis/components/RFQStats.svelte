<script lang="ts">
	import { ClipboardList, Send, BarChart2, RefreshCw, FileText } from 'lucide-svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import { useReadRFQSummary } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';

	const summaryQuery = useReadRFQSummary();

	const stats = $derived.by(() => {
		if (!summaryQuery.data) return [];
		const data = summaryQuery.data.data;
		return [
			{
				title: 'Total RFQ',
				value: data.total_rfq,
				icon: ClipboardList,
				iconColor: 'blue' as const,
				unit: 'Dokumen'
			},
			{
				title: 'Terkirim',
				value: data.rfq_terkirim,
				icon: Send,
				iconColor: 'yellow' as const,
				unit: 'RFQ'
			},
			{
				title: 'Perbandingan harga',
				value: data.rfq_perbandingan_harga,
				icon: BarChart2,
				iconColor: 'green' as const,
				unit: 'RFQ'
			},
			{
				title: 'Repeat order',
				value: data.total_repeat_order,
				icon: RefreshCw,
				iconColor: 'red' as const,
				unit: 'RO'
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
		Gagal memuat statistik analisa pembelian lokal
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
