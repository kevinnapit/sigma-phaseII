<script lang="ts">
	/**
	 * LPO Tracking Modal Wrapper for Purchase Request
	 * This is a wrapper that adapts the main LPOTrackingModal to work with Purchase Request data structure
	 */
	import LPOTrackingModalBase from '../../local-purchase-order/components/LPOTrackingModal.svelte';
	import type { LPOTrackingDetail } from '../types/purchase-request.types';

	let {
		open = $bindable(false),
		lpoData
	}: {
		open?: boolean;
		lpoData: LPOTrackingDetail | null;
	} = $props();

	// Convert LPOTrackingDetail to the format expected by LPOTrackingModalBase
	const trackingDataArray = $derived(lpoData?.tracking || []);
	const lpoId = $derived(lpoData?.lpo_id || '');
	const lpoNumber = $derived(lpoData?.lpo_number || '');
</script>

<LPOTrackingModalBase
	bind:open
	lpoId={lpoId}
	lpoNumber={lpoNumber}
	lpoType="LPO"
	trackingData={trackingDataArray}
/>
