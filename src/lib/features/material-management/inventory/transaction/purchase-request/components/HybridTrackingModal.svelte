<script lang="ts">
	/**
	 * Hybrid Tracking Modal (Opsi C)
	 * Combines simplified MR tracking with LPO tracking
	 */
	import { purchaseRequestMockApi } from '../api/purchase-request.mock';
	import TrackingModalV4 from './TrackingModalV4.svelte';
	import LPOTrackingModal from './LPOTrackingModal.svelte';
	import type { SimplifiedTrackingItem, LPOTrackingDetail } from '../types/purchase-request.types';

	let {
		open = $bindable(false),
		requestId,
		prNumber
	}: {
		open?: boolean;
		requestId: string;
		prNumber: string;
	} = $props();

	// State for simplified tracking
	let simplifiedItems = $state<SimplifiedTrackingItem[]>([]);
	let isLoadingSimplified = $state(false);

	// State for LPO tracking
	let showLPOModal = $state(false);
	let selectedLPOData = $state<LPOTrackingDetail | null>(null);
	let isLoadingLPO = $state(false);

	// Load simplified tracking when modal opens
	$effect(() => {
		if (open && requestId) {
			loadSimplifiedTracking();
		}
	});

	async function loadSimplifiedTracking() {
		isLoadingSimplified = true;
		try {
			const response = await purchaseRequestMockApi.getSimplifiedTracking(requestId);
			simplifiedItems = response.data || [];
		} catch (error) {
			console.error('Error loading simplified tracking:', error);
			simplifiedItems = [];
		} finally {
			isLoadingSimplified = false;
		}
	}

	async function handleViewLPO(lpoId: string, lpoNumber: string) {
		isLoadingLPO = true;
		showLPOModal = true;
		selectedLPOData = null;

		try {
			const response = await purchaseRequestMockApi.getLPOTracking(lpoId);
			selectedLPOData = response.data;
		} catch (error) {
			console.error('Error loading LPO tracking:', error);
			selectedLPOData = null;
		} finally {
			isLoadingLPO = false;
		}
	}
</script>

<!-- MR Tracking Modal (Simplified - 5 milestones) -->
<TrackingModalV4
	bind:open
	items={simplifiedItems}
	{prNumber}
	onViewLPO={handleViewLPO}
/>

<!-- LPO Tracking Modal (Detailed - 6 steps) -->
<LPOTrackingModal
	bind:open={showLPOModal}
	lpoData={selectedLPOData}
/>
