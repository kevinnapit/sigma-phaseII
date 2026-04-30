<script lang="ts">
	import { ChevronRight, ChevronDown, Warehouse, Package, MapPin } from 'lucide-svelte';
	import { mockRacks, mockStorageCells } from '../api/item-storage.mock';
	import type { StorageCell } from '../types/item-storage.types';

	interface Props {
		highlightCellId?: string;
	}

	let { highlightCellId }: Props = $props();

	// Track expanded groups
	let expandedGroups = $state<Set<string>>(new Set());
	// Track selected cell for right panel
	let selectedCell = $state<StorageCell | null>(null);

	// Auto-expand group that contains the highlighted cell
	$effect(() => {
		if (highlightCellId) {
			const cell = mockStorageCells.find((c) => c.id === highlightCellId);
			if (cell) {
				expandedGroups = new Set([...expandedGroups, cell.item_group_id]);
				selectedCell = cell;
			}
		}
	});

	function toggleGroup(groupId: string) {
		const next = new Set(expandedGroups);
		if (next.has(groupId)) {
			next.delete(groupId);
		} else {
			next.add(groupId);
		}
		expandedGroups = next;
	}

	function selectCell(cell: StorageCell) {
		selectedCell = cell;
	}

	function formatDate(dateString: string): string {
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateString));
	}
</script>

<div class="flex gap-4 rounded-lg border bg-card">
	<!-- Left: Tree Panel -->
	<div class="w-64 shrink-0 border-r">
		<div class="border-b bg-muted/50 px-4 py-3">
			<div class="flex items-center gap-2 text-sm font-semibold">
				<Warehouse class="h-4 w-4" />
				GUDANG
			</div>
		</div>
		<div class="p-2">
			{#each mockRacks as group}
				{@const groupCells = mockStorageCells.filter((c) => c.item_group_id === group.item_group_id)}
				{@const isExpanded = expandedGroups.has(group.item_group_id)}

				<!-- Group row -->
				<button
					type="button"
					class="flex w-full items-center gap-1 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
					onclick={() => toggleGroup(group.item_group_id)}
				>
					{#if isExpanded}
						<ChevronDown class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					{:else}
						<ChevronRight class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					{/if}
					<span class="truncate font-medium">{group.item_group_name}</span>
				</button>

				<!-- Cells under group -->
				{#if isExpanded}
					<div class="ml-4 mt-0.5 space-y-0.5">
						{#each groupCells as cell}
							{@const isHighlighted = cell.id === highlightCellId}
							{@const isSelected = selectedCell?.id === cell.id}
							<button
								type="button"
								class={[
									'flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs',
									isHighlighted
										? 'bg-[#0f4c2a] text-white'
										: isSelected
											? 'bg-accent font-medium'
											: 'hover:bg-accent'
								].join(' ')}
								onclick={() => selectCell(cell)}
							>
								<MapPin class="h-3 w-3 shrink-0" />
								<span class="truncate">{cell.rack_name} › {cell.cell_name}</span>
								{#if cell.is_occupied}
									<span
										class={[
											'ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px]',
											isHighlighted ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
										].join(' ')}
									>
										Terisi
									</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Right: Cell Detail Panel -->
	<div class="flex-1 p-4">
		{#if selectedCell}
			<div class="space-y-4">
				<div>
					<h4 class="text-sm font-semibold">
						Barang Tersimpan di {selectedCell.cell_name}
					</h4>
					<p class="text-xs text-muted-foreground">
						{selectedCell.rack_name} — {selectedCell.cell_code}
					</p>
				</div>

				{#if selectedCell.assigned_items.length === 0}
					<div class="flex flex-col items-center justify-center py-8 text-center">
						<Package class="mb-2 h-8 w-8 text-muted-foreground/50" />
						<p class="text-sm text-muted-foreground">Cell ini kosong</p>
					</div>
				{:else}
					<div class="space-y-2">
						{#each selectedCell.assigned_items as item}
							<div
								class={[
									'rounded-lg border p-3',
									item.item_code ===
									mockStorageCells.find((c) => c.id === highlightCellId)?.assigned_items[0]
										?.item_code
										? 'border-[#0f4c2a] bg-[#0f4c2a]/5'
										: 'bg-muted/30'
								].join(' ')}
							>
								<div class="flex items-start justify-between gap-2">
									<div>
										<p class="text-sm font-medium">{item.item_name}</p>
										<p class="text-xs text-muted-foreground">Kode: {item.item_code}</p>
									</div>
									<p class="shrink-0 text-xs text-muted-foreground">
										{formatDate(item.assigned_at)}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex h-full flex-col items-center justify-center py-12 text-center">
				<MapPin class="mb-3 h-10 w-10 text-muted-foreground/30" />
				<p class="text-sm text-muted-foreground">
					Pilih cell dari panel kiri untuk melihat barang yang tersimpan
				</p>
			</div>
		{/if}
	</div>
</div>
