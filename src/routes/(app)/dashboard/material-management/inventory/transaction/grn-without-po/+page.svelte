<script lang="ts">
	import GRNWithoutPOStats from '$lib/features/material-management/inventory/transaction/grn-without-po/components/GRNWithoutPOStats.svelte';
	import ViewGRNWithoutPO from '$lib/features/material-management/inventory/transaction/grn-without-po/components/ViewGRNWithoutPO.svelte';
</script>

<div class="space-y-6">
	<!-- Stats Cards -->
	<GRNWithoutPOStats />

	<!-- Data Table -->
	<ViewGRNWithoutPO />
</div>
