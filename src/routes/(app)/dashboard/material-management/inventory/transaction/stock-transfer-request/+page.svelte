<script lang="ts">
	import ViewStockTransferRequest from '$lib/features/material-management/inventory/transaction/stock-transfer-request/components/ViewStockTransferRequest.svelte';
	import StockTransferRequestStats from '$lib/features/material-management/inventory/transaction/stock-transfer-request/components/StockTransferRequestStats.svelte';
</script>

<div class="space-y-6">
	<!-- Stats Cards -->
	<StockTransferRequestStats />

	<!-- Data Table -->
	<ViewStockTransferRequest />
</div>

