<script lang="ts">
	import { StatCard } from '$lib/components/shared';
	import { Package, CheckCircle, MapPin, Building } from 'lucide-svelte';
	import { useReadLocalPurchaseItemStats } from '../hooks/useLocalPurchaseItemQueries.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	const statsQuery = useReadLocalPurchaseItemStats();

	const stats = $derived.by(() => {
		const d = statsQuery.data?.data;
		if (!d) return [];

		return [
			{
				title: 'TOTAL BARANG',
				value: d.total_items.toString(),
				icon: Package,
				variant: 'default' as const
			},
			{
				title: 'BARANG DIIZINKAN',
				value: d.approved_items.toString(),
				icon: CheckCircle,
				variant: 'default' as const
			},
			{
				title: 'BARANG DI LAPANGAN',
				value: d.field_items.toString(),
				icon: MapPin,
				variant: 'default' as const
			},
			{
				title: 'BARANG NON-LAPANGAN',
				value: d.non_field_items.toString(),
				icon: Building,
				variant: 'default' as const
			}
		];
	});
</script>

{#if statsQuery.isLoading}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each Array(4) as _}
			<div class="rounded-lg border bg-card p-6">
				<Skeleton class="mb-2 h-4 w-32" />
				<Skeleton class="h-8 w-16" />
			</div>
		{/each}
	</div>
{:else if statsQuery.isError}
	<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
		Gagal memuat statistik barang pembelian lokal
	</div>
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<StatCard {...stat} />
		{/each}
	</div>
{/if}
