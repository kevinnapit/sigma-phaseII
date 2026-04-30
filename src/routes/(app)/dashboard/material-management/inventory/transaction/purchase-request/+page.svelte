<script lang="ts">
	import {
		ViewPurchaseRequest,
		PurchaseRequestStats
	} from '$lib/features/material-management/inventory/transaction/purchase-request';
	import Guard from '$lib/components/shared/guard.svelte';
	import { PURCHASE_REQUEST_PERMISSIONS } from '$lib/features/material-management/inventory/transaction/purchase-request/constants/purchase-request-permissions';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';

	let searchName = $state('');
</script>

<PageHeader
	title="Permintaan Barang"
	description="Kelola proses permintaan barang Ke HO, Lokal, Maupun Kebun Sepupu"
/>

<div class="space-y-6">
	<Guard permissions={PURCHASE_REQUEST_PERMISSIONS.VIEW}>
		<PurchaseRequestStats />
	</Guard>
	<ViewPurchaseRequest bind:searchName />
</div>
