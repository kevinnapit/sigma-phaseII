<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Eye } from 'lucide-svelte';
	import type { PurchaseRequestListItem } from '../types/purchase-request.types';

	let {
		purchaseRequest,
		onClick
	}: {
		purchaseRequest: PurchaseRequestListItem;
		onClick: (pr: PurchaseRequestListItem) => void;
	} = $props();
</script>

<Button variant="ghost" size="icon" onclick={() => onClick(purchaseRequest)}>
	<Eye class="h-4 w-4" />
</Button>
