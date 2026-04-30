<script lang="ts">
	import { page } from '$app/state';
	import { LPODetailView } from '$lib/features/material-management/inventory/transaction/local-purchase-order';

	const lpoId = $derived(page.params.id ?? '');
</script>

<LPODetailView {lpoId} />
