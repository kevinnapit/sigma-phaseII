<script lang="ts">
	import ViewIssueReturn from '$lib/features/material-management/inventory/transaction/issue-return/components/ViewIssueReturn.svelte';
	import IssueReturnStats from '$lib/features/material-management/inventory/transaction/issue-return/components/IssueReturnStats.svelte';
</script>

<div class="space-y-6">
	<!-- Stats Cards -->
	<IssueReturnStats />

	<!-- Data Table -->
	<ViewIssueReturn />
</div>
