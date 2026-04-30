<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Eye, MoreHorizontal } from 'lucide-svelte';
	import type { StockReconciliation } from '../types/stock-reconciliation.types';

	let {
		reconciliation,
		onViewDetail
	}: {
		reconciliation: StockReconciliation;
		onViewDetail?: (reconciliation: StockReconciliation) => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(reconciliation)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
