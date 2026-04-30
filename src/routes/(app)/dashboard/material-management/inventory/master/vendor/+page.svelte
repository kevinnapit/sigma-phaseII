<script lang="ts">
	import { Store, CheckCircle2, Mail, Building2 } from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import StatCard from '$lib/components/shared/StatCard.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import ViewLocalVendors from '$lib/features/material-management/inventory/master/vendor/local/components/ViewLocalVendors.svelte';
	import ViewCentralVendors from '$lib/features/material-management/inventory/master/vendor/central/components/ViewCentralVendors.svelte';
	import { useReadVendorStats } from '$lib/features/material-management/inventory/master/vendor/shared';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';

	let searchLocalName = $state('');
	let searchCentralName = $state('');
	let activeTab = $state('local');

	const statsQuery = useReadVendorStats();

	const stats = $derived.by(() => {
		if (!statsQuery.data) return [];

		const data = statsQuery.data;

		return [
			{
				title: 'VENDOR LOKAL',
				value: data.total_local_vendor.toString(),
				icon: Store,
				iconColor: 'blue' as const,
				unit: 'Vendor'
			},
			{
				title: 'VENDOR LOKAL AKTIF',
				value: data.active_local_vendor.toString(),
				icon: CheckCircle2,
				iconColor: 'purple' as const,
				unit: 'Vendor'
			},
			{
				title: 'VENDOR PUSAT',
				value: data.total_central_vendor.toString(),
				icon: Building2,
				iconColor: 'green' as const,
				unit: 'Vendor'
			},
			{
				title: 'REGISTRASI TERKIRIM',
				value: data.registration_emails_sent.toString(),
				icon: Mail,
				iconColor: 'orange' as const,
				unit: 'Registrasi'
			}
		];
	});
</script>

<div class="space-y-6">
	<PageHeader title="Master Vendor" description="Kelola data master vendor" />
	<Guard permissions={VENDOR_PERMISSIONS.VIEW}>
		{#if statsQuery.isLoading}
			<div class="flex flex-wrap gap-4">
				{#each Array(4) as _}
					<div class="h-24 w-48 animate-pulse rounded-lg bg-gray-200"></div>
				{/each}
			</div>
		{:else if statsQuery.isError}
			<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
				Gagal memuat statistik vendor
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

		<!-- Tabs for Local and Central Vendors -->
		<Tabs.Root bind:value={activeTab} class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="local">Vendor Lokal</Tabs.Trigger>
				<Tabs.Trigger value="central">Vendor Pusat</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="local" class="mt-3 space-y-6">
				<!-- Local Vendor Table with Edit/Delete actions -->
				<ViewLocalVendors bind:searchName={searchLocalName} isActive={activeTab === 'local'} />
			</Tabs.Content>

			<Tabs.Content value="central" class="mt-3 space-y-6">
				<!-- Central Vendor Table with only View Detail action -->
				<ViewCentralVendors
					bind:searchName={searchCentralName}
					isActive={activeTab === 'central'}
				/>
			</Tabs.Content>
		</Tabs.Root>
	</Guard>
</div>
