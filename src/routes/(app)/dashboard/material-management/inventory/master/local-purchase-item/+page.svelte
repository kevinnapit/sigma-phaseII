<script lang="ts">
	import { PageHeader } from '$lib/components/shared';
	import ViewLocalPurchaseItems from '$lib/features/material-management/inventory/master/local-purchase-item/components/ViewLocalPurchaseItems.svelte';
	import LocalPurchaseItemStats from '$lib/features/material-management/inventory/master/local-purchase-item/components/LocalPurchaseItemStats.svelte';

	let searchName = $state('');
</script>

<div class="space-y-6">
	<PageHeader
		title="Barang Pembelian Lokal"
		description="Daftar barang yang diizinkan untuk pembelian lokal pada purchase request."
	/>

	<LocalPurchaseItemStats />

	<ViewLocalPurchaseItems bind:searchName />
</div>
