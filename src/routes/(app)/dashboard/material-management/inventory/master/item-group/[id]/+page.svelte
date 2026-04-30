<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { useReadDetailItemGroup } from '$lib/features/material-management/inventory/master/item-group';
	import EditItemGroupInfoCard from '$lib/features/material-management/inventory/master/item-group/components/EditItemGroupInfoCard.svelte';

	const itemGroupId = $derived(page.params.id || '');

	// Fetch item group detail
	const itemGroupQuery = useReadDetailItemGroup(() => itemGroupId);
	const itemGroup = $derived(itemGroupQuery.data?.data || null);

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/item-group');
	}

	function onUpdateSuccess() {
		itemGroupQuery.refetch();
	}

	// Get initials for avatar
	const initials = $derived(
		itemGroup?.name
			?.split(' ')
			.map((word) => word[0])
			.join('')
			.substring(0, 2)
			.toUpperCase() || 'GB'
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-semibold">Detail Grup Barang</h1>
			</div>
			<p class="text-sm text-gray-500">
				Informasi lengkap {itemGroup?.name || ''} ({itemGroup?.code || ''})
			</p>
		</div>

		<div class="mt-5 flex items-center gap-2 max-sm:-mb-3">
			<Button variant="ghost" class="border" onclick={handleBack}>
				<ArrowLeft class="h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	{#if itemGroupQuery.isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-gray-500">Memuat data...</p>
		</div>
	{:else if itemGroupQuery.isError}
		<div class="flex items-center justify-center py-12">
			<p class="text-red-500">Gagal memuat data grup barang</p>
		</div>
	{:else if itemGroup}
		<!-- Profile Card -->
		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-start gap-4">
					<!-- Avatar -->
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-xl font-semibold text-purple-600"
					>
						{initials}
					</div>

					<!-- Info -->
					<div class="flex-1">
						<h2 class="text-xl font-semibold">{itemGroup.name}</h2>
						<p class="text-sm text-gray-500">{itemGroup.code}</p>

						<div class="mt-2 flex items-center gap-2">
							<Badge variant="outline">{itemGroup.valuation_type_value}</Badge>
							<Badge variant="outline">{itemGroup.frequency_of_valuation_value}</Badge>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Informasi Grup Barang Card -->
		<EditItemGroupInfoCard {itemGroup} {onUpdateSuccess} />
	{/if}
</div>
