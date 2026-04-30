<script lang="ts">
	import { Eye, Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import type { GoodsIssueItem } from '../types/goods-issues.types';
	import Guard from '$lib/components/shared/guard.svelte';
	import { GOODS_ISSUES_PERMISSIONS } from '../constants/goods-issues-permissions';

	let {
		issue,
		onViewDetail
	}: {
		issue: GoodsIssueItem;
		onViewDetail: (issue: GoodsIssueItem) => void;
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
	<Guard permissions={GOODS_ISSUES_PERMISSIONS.DETAIL_VIEW}>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item onclick={() => onViewDetail(issue)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</Guard>
</DropdownMenu.Root>
