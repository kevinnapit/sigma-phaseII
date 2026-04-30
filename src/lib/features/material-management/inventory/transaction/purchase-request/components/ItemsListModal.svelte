<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { useReadDetailPurchaseRequest } from '../hooks/usePurchaseRequestQueries.svelte';

	let {
		open = $bindable(false),
		requestId,
		prNumber
	}: {
		open?: boolean;
		requestId: string;
		prNumber: string;
	} = $props();

	const detailQuery = useReadDetailPurchaseRequest(() => requestId);
	const items = $derived(detailQuery.data?.data?.items || []);
	const isLoading = $derived(detailQuery.isLoading);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Daftar Barang - {prNumber}</Dialog.Title>
			<Dialog.Description>Total {items.length} barang</Dialog.Description>
		</Dialog.Header>

		<div class="max-h-[400px] overflow-y-auto">
			{#if isLoading}
				<p class="py-8 text-center text-sm text-muted-foreground">Memuat data...</p>
			{:else if items.length === 0}
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
		</div>
	</Dialog.Content>
</Dialog.Root>
