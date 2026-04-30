<script lang="ts">
	import type { StorageLayoutCell } from '../types/item-storage-layout.types';

	interface Props {
		cells: StorageLayoutCell[];
		columns: number;
		rows: number;
	}

	let { cells, columns, rows }: Props = $props();

	// Group cells by row
	const cellsByRow = $derived.by(() => {
		const grouped: StorageLayoutCell[][] = [];
		for (let r = 1; r <= rows; r++) {
			const rowCells = cells.filter((cell) => cell.row === r).sort((a, b) => a.column - b.column);
			grouped.push(rowCells);
		}
		return grouped;
	});
</script>

<div class="space-y-3">
	<!-- Grid -->
	<div class="rounded-lg border bg-muted/30 p-4">
		<div class="space-y-2">
			{#each cellsByRow as rowCells}
				<div class="flex gap-2">
					{#each rowCells as cell}
						<div
							class="flex h-12 min-w-[80px] items-center justify-center rounded border text-sm font-medium transition-colors"
							class:bg-primary={cell.is_occupied}
							class:text-primary-foreground={cell.is_occupied}
							class:bg-background={!cell.is_occupied}
							class:hover:bg-muted={!cell.is_occupied}
						>
							{cell.item_group_code || cell.cell_code}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Info Text -->
	<p class="text-sm text-muted-foreground">
		{rows} Baris × {columns} Kolom = {cells.length} Cell
	</p>
</div>
