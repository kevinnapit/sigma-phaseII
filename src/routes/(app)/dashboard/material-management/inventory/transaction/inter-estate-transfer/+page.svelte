<script lang="ts">
	import { PageHeader } from '$lib/components/shared';
	import ViewInterEstateTransfer from '$lib/features/material-management/inventory/transaction/inter-estate-transfer/components/ViewInterEstateTransfer.svelte';
	import InterEstateTransferStats from '$lib/features/material-management/inventory/transaction/inter-estate-transfer/components/InterEstateTransferStats.svelte';
</script>

<div class="space-y-6">
	<PageHeader
		title="Transfer Antar Kebun"
		description="Kelola permintaan transfer barang antar kebun"
	/>

	<InterEstateTransferStats />

	<ViewInterEstateTransfer />
</div>
