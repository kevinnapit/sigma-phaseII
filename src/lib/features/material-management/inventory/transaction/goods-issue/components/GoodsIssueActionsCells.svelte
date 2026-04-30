<script lang="ts">
	import { Eye, Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import type { GoodsIssue } from '../types/goods-issue.types';

	let {
		goodsIssue,
		onViewDetail
	}: {
		goodsIssue: GoodsIssue;
		onViewDetail: (goodsIssue: GoodsIssue) => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<Ellipsis class="h-4 w-4" />
				<span class="sr-only">Buka menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail(goodsIssue)}>
			<Eye class="h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
