<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import ProcessStepsCard from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/components/ProcessStepsCard.svelte';
	import RFQSentStatusStep from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/components/RFQSentStatusStep.svelte';
	import PriceComparisonStep from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/components/PriceComparisonStep.svelte';
	import CreateLPOStep from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/components/CreateLPOStep.svelte';
	import {
		PROCESS_STEPS,
		getRFQStepFromStatus,
		getRFQStepIndexFromStatus
	} from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/constants/process-steps';
	import type { ProcessStepInfo } from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/types/local-purchase-analysis.types';
	import { useReadDetailRFQ } from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/hooks/useLocalPurchaseAnalysisQueries.svelte';

	// Get RFQ ID from route params
	const rfqId = $derived(page.params.id || '');

	// Get step from URL param as fallback
	const stepParam = $derived(page.url.searchParams.get('step') || 'rfq-sent-status');

	// Fetch RFQ detail to get actual status
	const rfqDetailQuery = useReadDetailRFQ(
		() => rfqId,
		() => !!rfqId
	);
	const rfqStatus = $derived(rfqDetailQuery.data?.data?.status);

	// Determine the active step: use API status if available, fallback to URL param
	const activeStep = $derived(rfqStatus ? getRFQStepFromStatus(rfqStatus) : stepParam);
	const currentStepIndex = $derived(
		rfqStatus
			? getRFQStepIndexFromStatus(rfqStatus)
			: PROCESS_STEPS.findIndex((s) => s.id === stepParam) !== -1
				? PROCESS_STEPS.findIndex((s) => s.id === stepParam)
				: PROCESS_STEPS.length - 1
	);

	// Process steps state - all steps before current are completed
	const steps = $derived<ProcessStepInfo[]>(
		PROCESS_STEPS.map((step, index) => ({
			...step,
			completed: index < currentStepIndex
		}))
	);

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/local-purchase-analysis');
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between gap-4">
		<!-- <Button variant="ghost" size="icon" onclick={handleBack}>
			<ArrowLeft class="h-5 w-5" />
		</Button> -->

		<PageHeader
			title="Detail Permintaan Harga"
			description="Lihat detail dan status permintaan harga (RFQ)."
		/>
		<Button variant="outline" size="sm" onclick={handleBack}>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Kembali
		</Button>
	</div>

	<!-- Process Steps Card - Top -->
	<ProcessStepsCard {steps} currentStep={currentStepIndex} />

	<!-- Main Content -->
	<div>
		{#if activeStep === 'rfq-sent-status'}
			<RFQSentStatusStep {rfqId} />
		{:else if activeStep === 'price-comparison'}
			<PriceComparisonStep {rfqId} />
		{:else if activeStep === 'create-lpo'}
			<CreateLPOStep {rfqId} />
		{:else}
			<RFQSentStatusStep {rfqId} />
		{/if}
	</div>
</div>
