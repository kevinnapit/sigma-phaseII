<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Eye, MoreHorizontal } from 'lucide-svelte';
	import type { GRNReconditionedStock } from '../types/grn-reconditioned-stock.types';

	let {
		grn,
		onViewDetail
	}: {
		grn: GRNReconditionedStock;
		onViewDetail?: (grn: GRNReconditionedStock) => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon">
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(grn)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
