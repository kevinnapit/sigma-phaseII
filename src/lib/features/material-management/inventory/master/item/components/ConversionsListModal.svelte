<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { useReadItemConversions } from '../hooks/useDetailedItemQueries.svelte';

	let {
		open = $bindable(false),
		itemId,
		itemCode,
		itemName
	}: {
		open?: boolean;
		itemId: string;
		itemCode: string;
		itemName: string;
	} = $props();

	const conversionsQuery = useReadItemConversions(() => itemId);
	const conversions = $derived(conversionsQuery.data?.data || []);
	const isLoading = $derived(conversionsQuery.isLoading);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Daftar Konversi Satuan - {itemCode}</Dialog.Title>
			<Dialog.Description>{itemName} • Total {conversions.length} konversi</Dialog.Description>
		</Dialog.Header>

		<div class="max-h-[400px] overflow-y-auto">
			{#if isLoading}
				<p class="py-8 text-center text-sm text-muted-foreground">Memuat data...</p>
			{:else if conversions.length === 0}
				<p class="py-8 text-center text-sm text-muted-foreground">Belum ada data konversi satuan</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b">
							<th class="py-2 pr-4 text-left font-medium text-muted-foreground">No</th>
							<th class="py-2 pr-4 text-left font-medium text-muted-foreground">Satuan Dasar</th>
							<th class="py-2 text-left font-medium text-muted-foreground">Satuan Konversi</th>
						</tr>
					</thead>
					<tbody>
						{#each conversions as conversion, index}
							<tr class="border-b last:border-0">
								<td class="py-3 pr-4 text-muted-foreground">{index + 1}</td>
								<td class="py-3 pr-4">
									{conversion.qty_satuan_dasar}
									{conversion.item.base_uom.name}
								</td>
								<td class="py-3">{conversion.qty_konversi} {conversion.uom.name}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
