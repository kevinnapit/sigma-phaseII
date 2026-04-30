<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import { ViewLocalPurchaseOrder } from '$lib/features/material-management/inventory/transaction/local-purchase-order';
</script>

<PageHeader
	title="Order Pembelian Lokal"
	description="Kelola Order Pembelian Lokal berdasarkan pemenang tender."
/>

<div class="space-y-6">
	<ViewLocalPurchaseOrder />
</div>
