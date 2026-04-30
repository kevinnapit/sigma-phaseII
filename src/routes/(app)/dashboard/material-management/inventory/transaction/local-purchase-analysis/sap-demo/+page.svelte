<script lang="ts">
	import SAPApprovalDemo from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/components/SAPApprovalDemo.svelte';
	import { PageHeader } from '$lib/components/shared';
</script>

<div class="space-y-6">
	<PageHeader
		title="Demo SAP Approval"
		description="Simulasi proses approval SAP untuk item dengan status 'Perlu Izin'"
	/>
	
	<SAPApprovalDemo />
</div>