<script lang="ts">
	import ViewTransferReceipt from '$lib/features/material-management/inventory/transaction/transfer-receipt/components/ViewTransferReceipt.svelte';
	import TransferReceiptStats from '$lib/features/material-management/inventory/transaction/transfer-receipt/components/TransferReceiptStats.svelte';
</script>

<div class="space-y-6">
	<!-- Stats Cards -->
	<TransferReceiptStats />

	<!-- Data Table -->
	<ViewTransferReceipt />
</div>