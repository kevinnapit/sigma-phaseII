<script lang="ts" generics="T">
	import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-svelte';

	type Column<T> = {
		key: keyof T | string;
		header: string;
		sortable?: boolean;
		cell?: (item: T) => any;
	};

	type SortConfig = {
		key: string;
		direction: 'asc' | 'desc' | null;
	};

	let {
		data,
		columns,
		children
	}: {
		data: T[];
		columns: Column<T>[];
		children?: any;
	} = $props();

	let sortConfig = $state<SortConfig>({ key: '', direction: null });

	const sortedData = $derived(() => {
		if (!sortConfig.direction || !sortConfig.key) {
			return data;
		}

		return [...data].sort((a, b) => {
			const aVal = a[sortConfig.key as keyof T];
			const bVal = b[sortConfig.key as keyof T];

			if (aVal === bVal) return 0;

			const comparison = aVal > bVal ? 1 : -1;
			return sortConfig.direction === 'asc' ? comparison : -comparison;
		});
	});

	function handleSort(key: string) {
		if (sortConfig.key === key) {
			if (sortConfig.direction === 'asc') {
				sortConfig = { key, direction: 'desc' };
			} else if (sortConfig.direction === 'desc') {
				sortConfig = { key: '', direction: null };
			}
		} else {
			sortConfig = { key, direction: 'asc' };
		}
	}

	function getSortIcon(key: string) {
		if (sortConfig.key !== key || !sortConfig.direction) {
			return ArrowUpDown;
		}
		return sortConfig.direction === 'asc' ? ArrowUp : ArrowDown;
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full">
		<thead class="border-b bg-gray-50">
			<tr>
				{#each columns as column}
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-700">
						{#if column.sortable !== false}
							{@const SortIcon = getSortIcon(column.key as string)}
							<button
								type="button"
								class="flex items-center gap-1 hover:text-gray-900 transition-colors"
								onclick={() => handleSort(column.key as string)}
							>
								{column.header}
								<SortIcon class="h-3 w-3" />
							</button>
						{:else}
							{column.header}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedData() as item, index}
				<tr class="border-b hover:bg-gray-50 transition-colors">
					{#each columns as column}
						<td class="px-4 py-3">
							{#if children}
								{@render children({ item, column, index })}
							{:else if column.cell}
								{@render column.cell(item)}
							{:else}
								<span class="text-sm text-gray-700">{item[column.key as keyof T]}</span>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
