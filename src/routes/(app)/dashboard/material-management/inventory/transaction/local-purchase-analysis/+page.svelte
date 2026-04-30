<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import {
		ViewLocalPurchaseAnalysis,
		RFQStats
	} from '$lib/features/material-management/inventory/transaction/local-purchase-analysis';
	import { LOCAL_PURCHASE_ANALYSIS_PERMISSIONS } from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/constants/local-purchase-analysis.permissions';
</script>

<PageHeader
	title="Proses Pembelian Lokal"
	description="Kelola proses pembelian lokal melalui RFQ, Repeat Order, atau LPO langsung."
/>

<div class="space-y-6">
	<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.VIEW}>
		<RFQStats />
	</Guard>
	<ViewLocalPurchaseAnalysis />
</div>
