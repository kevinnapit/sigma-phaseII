<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { useReadItemSubstitutes } from '../../hooks/useItemQueries.svelte';

	let { itemId }: { itemId: string } = $props();

	const substitutesQuery = useReadItemSubstitutes(() => itemId);
	const substitutes = $derived(substitutesQuery.data?.data || []);
	const isLoading = $derived(substitutesQuery.isLoading);
	const hasSubstitutes = $derived(substitutes.length > 0);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Detail Substitusi</Card.Title>
		<Card.Description>Informasi barang substitusi</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<p class="text-sm text-muted-foreground">Memuat data...</p>
			</div>
		{:else if !hasSubstitutes}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<p class="text-sm text-gray-500">Tidak ada data substitusi barang.</p>
			</div>
		{:else}
			<div class="rounded-md border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[80px]">No</Table.Head>
							<Table.Head>Kode Barang</Table.Head>
							<Table.Head>Nama Barang</Table.Head>
							<Table.Head>Prioritas</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each substitutes as substitute, index}
							<Table.Row>
								<Table.Cell class="font-medium">{index + 1}</Table.Cell>
								<Table.Cell class="font-medium">
									{substitute.substitute_item?.code || '-'}
								</Table.Cell>
								<Table.Cell>{substitute.substitute_item?.name || '-'}</Table.Cell>
								<Table.Cell>
									<Badge variant="secondary">Prioritas {substitute.priority}</Badge>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
