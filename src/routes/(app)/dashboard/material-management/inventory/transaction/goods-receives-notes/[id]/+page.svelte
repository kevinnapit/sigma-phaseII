<script lang="ts">
	import { page } from '$app/state';
	import { GRNDetailView } from '$lib/features/material-management/inventory/transaction/goods-receives-notes';

	const grnId = $derived(page.params.id ?? '');
</script>

<GRNDetailView {grnId} />
