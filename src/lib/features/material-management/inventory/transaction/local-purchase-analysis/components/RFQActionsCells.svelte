<script lang="ts">
	import { Eye, Ellipsis, Clock } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { RFQItem } from '../types/local-purchase-analysis.types';
	import { LOCAL_PURCHASE_ANALYSIS_PERMISSIONS } from '../constants/local-purchase-analysis.permissions';

	let {
		rfq,
		onViewDetail,
		onTracking
	}: {
		rfq: RFQItem;
		onViewDetail: (rfq: RFQItem) => void;
		onTracking?: (rfq: RFQItem) => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" class="h-8 w-8 p-0">
			<span class="sr-only">Buka menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.DETAIL_VIEW}>
			<DropdownMenu.Item onclick={() => onViewDetail(rfq)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		
		{#if onTracking}
			<DropdownMenu.Item onclick={() => onTracking(rfq)}>
				<Clock class="h-4 w-4" />
				Lihat Tracking
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
