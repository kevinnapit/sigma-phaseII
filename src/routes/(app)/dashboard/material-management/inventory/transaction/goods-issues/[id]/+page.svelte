<script lang="ts">
	import { page } from '$app/state';
	import { GoodsIssueDetailView } from '$lib/features/material-management/inventory/transaction/goods-issues';

	const issueId = $derived(page.params.id ?? '');
</script>

<GoodsIssueDetailView {issueId} />
