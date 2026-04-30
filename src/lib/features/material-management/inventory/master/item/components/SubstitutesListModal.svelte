<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { useReadItemSubstitutes } from '../hooks/useItemQueries.svelte';

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

	const substitutesQuery = useReadItemSubstitutes(() => itemId);
	const substitutes = $derived(substitutesQuery.data?.data || []);
	const isLoading = $derived(substitutesQuery.isLoading);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Daftar Barang Substitusi - {itemCode}</Dialog.Title>
			<Dialog.Description>{itemName} • Total {substitutes.length} substitusi</Dialog.Description>
		</Dialog.Header>

		<div class="max-h-[400px] overflow-y-auto">
			{#if isLoading}
				<p class="py-8 text-center text-sm text-muted-foreground">Memuat data...</p>
			{:else if substitutes.length === 0}
				<p class="py-8 text-center text-sm text-muted-foreground">Belum ada data substitusi</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b">
							<th class="py-2 pr-4 text-left font-medium text-muted-foreground">No</th>
							<th class="py-2 text-left font-medium text-muted-foreground">Barang</th>
						</tr>
					</thead>
					<tbody>
						{#each substitutes as substitute, index}
							<tr class="border-b last:border-0">
								<td class="py-3 pr-4 text-muted-foreground">{index + 1}</td>
								<td class="py-3">
									{substitute.substitute_item.code} - {substitute.substitute_item.name}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
