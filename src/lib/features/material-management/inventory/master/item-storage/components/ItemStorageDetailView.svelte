<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { ItemStorageAssignment } from '../types/item-storage.types';
	import ItemStorageTreeView from './ItemStorageTreeView.svelte';

	interface Props {
		assignment?: ItemStorageAssignment;
		isLoading?: boolean;
	}

	let { assignment, isLoading = false }: Props = $props();

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(dateString));
	}
</script>

<div class="space-y-6">
	<!-- Card 1: Informasi Penugasan -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Informasi Penugasan</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if isLoading}
				<div class="grid gap-4 md:grid-cols-2">
					{#each Array(6) as _}
						<div class="space-y-1">
							<Skeleton class="h-4 w-24" />
							<Skeleton class="h-5 w-full" />
						</div>
					{/each}
				</div>
			{:else if assignment}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p class="mb-1 text-sm text-muted-foreground">No. Penugasan</p>
						<p class="text-sm font-medium">{assignment.assignment_number}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
						<p class="text-sm font-medium">{assignment.store_name}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Nama Rak</p>
						<p class="text-sm font-medium">{assignment.rack_name}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Cell</p>
						<p class="text-sm font-medium">{assignment.cell_code}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Nama Cell</p>
						<p class="text-sm font-medium">{assignment.cell_name}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Grup Barang</p>
						<p class="text-sm font-medium">{assignment.item_group_name}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Ditugaskan Oleh</p>
						<p class="text-sm font-medium">{assignment.assigned_by}</p>
					</div>
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Tanggal Penugasan</p>
						<p class="text-sm font-medium">{formatDate(assignment.assigned_at)}</p>
					</div>
					{#if assignment.notes}
						<div class="md:col-span-2">
							<p class="mb-1 text-sm text-muted-foreground">Catatan</p>
							<p class="text-sm font-medium">{assignment.notes}</p>
						</div>
					{/if}
				</div>

				<!-- Items table -->
				<div class="mt-5">
					<div class="mb-2 flex items-center gap-2">
						<p class="text-sm font-semibold">Daftar Barang</p>
						<Badge variant="outline">{assignment.items?.length ?? 0} barang</Badge>
					</div>
					<div class="overflow-x-auto rounded-md border">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b bg-muted/50 text-left text-muted-foreground">
									<th class="p-2 font-medium">Kode Barang</th>
									<th class="p-2 font-medium">Nama Barang</th>
									<th class="p-2 font-medium">Tanggal Assign</th>
								</tr>
							</thead>
							<tbody>
								{#each assignment.items ?? [] as item}
									<tr class="border-b last:border-0">
										<td class="p-2 font-medium">{item.item_code}</td>
										<td class="p-2">{item.item_name}</td>
										<td class="p-2 text-muted-foreground">{formatDate(item.assigned_at)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Card 2: Tampilan Penyimpanan -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Tampilan Penyimpanan</Card.Title>
			<Card.Description>
				Hierarki penyimpanan gudang. Cell yang ditugaskan ditandai dengan warna hijau.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if isLoading}
				<Skeleton class="h-64 w-full" />
			{:else}
				<ItemStorageTreeView highlightCellId={assignment?.cell_id} />
			{/if}
		</Card.Content>
	</Card.Root>
</div>
