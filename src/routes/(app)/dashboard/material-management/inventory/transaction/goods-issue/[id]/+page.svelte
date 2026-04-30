<script lang="ts">
	import { page } from '$app/state';
	import { GoodsIssueDetailView } from '$lib/features/material-management/inventory/transaction/goods-issue';

	const goodsIssueId = $derived(page.params.id ?? '');
</script>

<GoodsIssueDetailView {goodsIssueId} />
