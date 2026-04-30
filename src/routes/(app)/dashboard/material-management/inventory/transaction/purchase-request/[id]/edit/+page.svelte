<script lang="ts">
	import { page } from '$app/state';
	import { EditPurchaseRequest } from '$lib/features/material-management/inventory/transaction/purchase-request';

	const requestId = $derived(page.params.id ?? '');
</script>

<EditPurchaseRequest {requestId} />
