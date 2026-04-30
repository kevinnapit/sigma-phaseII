<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { ItemStorageLayout } from '../types/item-storage-layout.types';
	import StorageLayoutGrid from './StorageLayoutGrid.svelte';

	let {
		layout
	}: {
		layout: ItemStorageLayout;
	} = $props();
</script>

<div class="space-y-6">
	<!-- Basic Information Card -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div>
					<Card.Title>{layout.name}</Card.Title>
					<Card.Description>Kode: {layout.code}</Card.Description>
				</div>
				<Badge variant={layout.is_active ? 'default' : 'secondary'}>
					{layout.is_active ? 'Aktif' : 'Tidak Aktif'}
				</Badge>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<div class="text-sm font-medium text-muted-foreground">Gudang</div>
					<div class="mt-1 text-sm">{layout.store.name}</div>
				</div>

				<div>
					<div class="text-sm font-medium text-muted-foreground">Kode Gudang</div>
					<div class="mt-1 text-sm">{layout.store.code}</div>
				</div>

				{#if layout.parent}
					<div>
						<div class="text-sm font-medium text-muted-foreground">Parent Rak</div>
						<div class="mt-1 text-sm">{layout.parent.name}</div>
					</div>

					<div>
						<div class="text-sm font-medium text-muted-foreground">Kode Parent</div>
						<div class="mt-1 text-sm">{layout.parent.code}</div>
					</div>
				{/if}

				<div>
					<div class="text-sm font-medium text-muted-foreground">Jumlah Baris</div>
					<div class="mt-1 text-sm">{layout.number_of_rows}</div>
				</div>

				<div>
					<div class="text-sm font-medium text-muted-foreground">Jumlah Kolom</div>
					<div class="mt-1 text-sm">{layout.number_of_columns}</div>
				</div>

				<div>
					<div class="text-sm font-medium text-muted-foreground">Total Cell</div>
					<div class="mt-1 text-sm">{layout.cells.length}</div>
				</div>

				<div>
					<div class="text-sm font-medium text-muted-foreground">Cell Terisi</div>
					<div class="mt-1 text-sm">
						{layout.cells.filter((c) => c.is_occupied).length} / {layout.cells.length}
					</div>
				</div>

				{#if layout.created_at}
					<div>
						<div class="text-sm font-medium text-muted-foreground">Dibuat Pada</div>
						<div class="mt-1 text-sm">
							{new Date(layout.created_at).toLocaleDateString('id-ID', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
					</div>
				{/if}

				{#if layout.updated_at}
					<div>
						<div class="text-sm font-medium text-muted-foreground">Diperbarui Pada</div>
						<div class="mt-1 text-sm">
							{new Date(layout.updated_at).toLocaleDateString('id-ID', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Storage Layout Grid -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Layout Penyimpanan</Card.Title>
			<Card.Description>
				Visualisasi layout rak dengan {layout.number_of_rows} baris dan {layout.number_of_columns} kolom
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<StorageLayoutGrid
				cells={layout.cells}
				columns={layout.number_of_columns}
				rows={layout.number_of_rows}
			/>
		</Card.Content>
	</Card.Root>
</div>
