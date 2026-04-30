<script lang="ts">
	import GRNReconditionedStockStats from '$lib/features/material-management/inventory/transaction/grn-reconditioned-stock/components/GRNReconditionedStockStats.svelte';
	import ViewGRNReconditionedStock from '$lib/features/material-management/inventory/transaction/grn-reconditioned-stock/components/ViewGRNReconditionedStock.svelte';
</script>

<div class="space-y-6">
	<!-- Stats Cards -->
	<GRNReconditionedStockStats />

	<!-- Data Table -->
	<ViewGRNReconditionedStock />
</div>
