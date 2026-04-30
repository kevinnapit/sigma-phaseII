<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Users } from 'lucide-svelte';
	import { useReadDetailRFQ } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';

	let {
		open = $bindable(false),
		rfqId,
		rfqNumber,
		mode
	}: {
		open?: boolean;
		rfqId: string;
		rfqNumber: string;
		mode: 'items' | 'vendors';
	} = $props();

	const detailQuery = useReadDetailRFQ(
		() => rfqId,
		() => open
	);
	const detail = $derived(detailQuery.data?.data);
	const items = $derived(detail?.items || []);
	const vendors = $derived(detail?.vendors || []);
	const isLoading = $derived(detailQuery.isLoading);

	const isItems = $derived(mode === 'items');
	const count = $derived(isItems ? items.length : vendors.length);
	const title = $derived(isItems ? 'Daftar Barang' : 'Daftar Vendor');
	const subtitle = $derived(`Total ${count} ${isItems ? 'barang' : 'vendor'}`);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{title} - {rfqNumber}</Dialog.Title>
			<Dialog.Description>{subtitle}</Dialog.Description>
		</Dialog.Header>

		<div class="max-h-[400px] overflow-y-auto">
			{#if isLoading}
				<p class="py-8 text-center text-sm text-muted-foreground">Memuat data...</p>
			{:else if isItems}
				{#if items.length === 0}
					<p class="py-8 text-center text-sm text-muted-foreground">Tidak ada barang</p>
				{:else}
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b">
								<th class="py-2 pr-4 text-left font-medium text-muted-foreground">No</th>
								<th class="py-2 text-left font-medium text-muted-foreground">Barang</th>
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b last:border-0">
									<td class="py-3 pr-4 text-muted-foreground">{index + 1}</td>
									<td class="py-3">{item.item_code} - {item.item_name}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			{:else if vendors.length === 0}
				<p class="py-8 text-center text-sm text-muted-foreground">Tidak ada vendor</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b">
							<th class="py-2 pr-4 text-left font-medium text-muted-foreground">No</th>
							<th class="py-2 text-left font-medium text-muted-foreground">Vendor</th>
						</tr>
					</thead>
					<tbody>
						{#each vendors as vendor, index}
							<tr class="border-b last:border-0">
								<td class="py-3 pr-4 text-muted-foreground">{index + 1}</td>
								<td class="py-3">
									{vendor.vendor_code} - {vendor.vendor_name}
									{#if vendor.vendor_email}
										<p class="text-xs text-muted-foreground">{vendor.vendor_email}</p>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
