<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { ItemSubstitution } from '../types/item-substitution.types';

	interface Props {
		substitution?: ItemSubstitution;
		isLoading?: boolean;
	}

	let { substitution, isLoading = false }: Props = $props();

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	const items = $derived(substitution?.items ?? []);
</script>

<div class="space-y-6">
	<!-- Card 1: Informasi Header -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Informasi Header</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if isLoading}
				<div class="grid gap-4 md:grid-cols-2">
					{#each Array(7) as _}
						<div class="space-y-1">
							<Skeleton class="h-4 w-24" />
							<Skeleton class="h-5 w-full" />
						</div>
					{/each}
				</div>
			{:else if substitution}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p class="mb-1 text-sm text-muted-foreground">ID Substitusi</p>
						<p class="text-sm font-medium">{substitution.substitution_id}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Status</p>
						<p class="text-sm font-medium">{substitution.status}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Dibuat Oleh</p>
						<p class="text-sm font-medium">{substitution.created_by}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Diubah Oleh</p>
						<p class="text-sm font-medium">{substitution.updated_by}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Tanggal Dibuat</p>
						<p class="text-sm font-medium">{formatDate(substitution.created_at)}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Tanggal Diubah</p>
						<p class="text-sm font-medium">{formatDate(substitution.updated_at)}</p>
					</div>

					<div class="md:col-span-2">
						<p class="mb-1 text-sm text-muted-foreground">Deskripsi</p>
						<p class="text-sm font-medium">{substitution.description || '-'}</p>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Card 2: Detail Substitusi -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-3">
				<Card.Title>Detail Substitusi</Card.Title>
				{#if !isLoading}
					<Badge variant="outline">{items.length} item substitusi</Badge>
				{/if}
			</div>
		</Card.Header>
		<Card.Content>
			{#if isLoading}
				<div class="space-y-3">
					{#each Array(3) as _}
						<Skeleton class="h-10 w-full" />
					{/each}
				</div>
			{:else if items.length === 0}
				<p class="py-6 text-center text-sm text-muted-foreground">
					Tidak ada item substitusi.
				</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b">
								<th class="pb-3 pr-4 text-left font-medium text-muted-foreground">Kode Barang</th>
								<th class="pb-3 pr-4 text-left font-medium text-muted-foreground">Nama Barang</th>
								<th class="pb-3 pr-4 text-left font-medium text-muted-foreground">Status</th>
								<th class="pb-3 pr-4 text-left font-medium text-muted-foreground">Dibuat Oleh</th>
								<th class="pb-3 pr-4 text-left font-medium text-muted-foreground">Tanggal Dibuat</th>
								<th class="pb-3 pr-4 text-left font-medium text-muted-foreground">Diubah Oleh</th>
								<th class="pb-3 text-left font-medium text-muted-foreground">Tanggal Diubah</th>
							</tr>
						</thead>
						<tbody>
							{#each items as item}
								<tr class="border-b last:border-0">
									<td class="py-3 pr-4 font-medium">{item.item_code}</td>
									<td class="py-3 pr-4">{item.item_name}</td>
									<td class="py-3 pr-4">{item.status}</td>
									<td class="py-3 pr-4">{item.created_by}</td>
									<td class="py-3 pr-4">{formatDate(item.created_at)}</td>
									<td class="py-3 pr-4">{item.updated_by}</td>
									<td class="py-3">{formatDate(item.updated_at)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
