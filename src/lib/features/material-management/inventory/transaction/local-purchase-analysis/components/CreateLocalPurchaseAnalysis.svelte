<script lang="ts">
	import { page } from '$app/state';
	import ProcessStepsCard from './ProcessStepsCard.svelte';
	import SelectItemsStep from './SelectItemsStep.svelte';
	import SelectVendorStep from './SelectVendorStep.svelte';
	import ReviewSubmitStep from './ReviewSubmitStep.svelte';
	import { PROCESS_STEPS } from '../constants/process-steps';
	import type { ProcessStepInfo } from '../types/local-purchase-analysis.types';

	// Get current step from URL
	const stepParam = $derived(page.url.searchParams.get('step') || 'select-items');
	const currentStepIndex = $derived(
		PROCESS_STEPS.findIndex((s) => s.id === stepParam) !== -1
			? PROCESS_STEPS.findIndex((s) => s.id === stepParam)
			: 0
	);

	// Process steps state
	let steps = $state<ProcessStepInfo[]>(
		PROCESS_STEPS.map((step, index) => ({
			...step,
			completed: index < currentStepIndex
		}))
	);
</script>

<div class="space-y-6">
	<!-- Process Steps Card - Top -->
	<ProcessStepsCard {steps} currentStep={currentStepIndex} />

	<!-- Main Content -->
	<div>
		{#if stepParam === 'select-items'}
			<SelectItemsStep />
		{:else if stepParam === 'select-vendor'}
			<SelectVendorStep />
		{:else if stepParam === 'review-submit'}
			<ReviewSubmitStep />
		{/if}
	</div>
</div>
