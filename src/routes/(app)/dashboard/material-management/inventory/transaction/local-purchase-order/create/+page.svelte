<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import { CreateLocalPurchaseOrder } from '$lib/features/material-management/inventory/transaction/local-purchase-order';
</script>

<PageHeader
	title="Buat Local Purchase Order"
	description="Buat LPO baru berdasarkan vendor dan item pemenang tender."
/>

<div class="space-y-6">
	<CreateLocalPurchaseOrder />
</div>
