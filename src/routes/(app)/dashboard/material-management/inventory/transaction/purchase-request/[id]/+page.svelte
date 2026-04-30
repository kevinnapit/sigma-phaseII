<script lang="ts">
	import { PurchaseRequestDetailView } from '$lib/features/material-management/inventory/transaction/purchase-request';
	import { page } from '$app/state';

	const requestId = $derived(page.params.id || '');
</script>

<PurchaseRequestDetailView {requestId} />
