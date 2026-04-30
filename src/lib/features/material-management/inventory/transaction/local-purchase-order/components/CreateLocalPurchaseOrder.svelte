<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import SelectVendorAndItemsStep from './SelectVendorAndItemsStep.svelte';
	import FormLPOStep from './FormLPOStep.svelte';
	import { LPO_SESSION_KEY } from '../constants/session-storage';

	const STEPS = [
		{
			id: 'select-vendor-items',
			label: 'Pilih Vendor & Item',
			description: 'Pilih vendor pemenang dan item'
		},
		{ id: 'form-lpo', label: 'Isi Form LPO', description: 'Lengkapi detail LPO' }
	];

	const stepParam = $derived(page.url.searchParams.get('step') || 'select-vendor-items');
	const currentStepIndex = $derived(STEPS.findIndex((s) => s.id === stepParam) ?? 0);

	let isManual = $state(false);
	let showStepsList = $state(false);

	onMount(() => {
		const stored = sessionStorage.getItem(LPO_SESSION_KEY);
		if (stored) {
			try {
				const data = JSON.parse(stored);
				isManual = data.isManual ?? false;
			} catch {
				isManual = false;
			}
		}
	});
</script>

<div class="space-y-6">
	<!-- Process Steps Card — hidden for manual LPO (step 1 is skipped) -->
	{#if !isManual}
		<Card.Root>
			<Card.Content class="pt-6">
				<!-- Mobile: compact stepper with progress summary -->
				<div class="flex flex-col md:hidden">
					<!-- Progress summary — clickable to toggle -->
					<button
						type="button"
						class="mb-3 flex w-full items-center justify-between"
						onclick={() => (showStepsList = !showStepsList)}
					>
						<span class="text-xs text-muted-foreground">
							Langkah {currentStepIndex + 1} dari {STEPS.length}
						</span>
						<div class="flex items-center gap-1.5">
							<span class="text-xs font-semibold text-primary">
								{STEPS[currentStepIndex]?.label}
							</span>
							<ChevronDown
								class={cn(
									'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
									showStepsList && 'rotate-180'
								)}
							/>
						</div>
					</button>
					<!-- Progress bar -->
					<div class="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							class="h-full rounded-full bg-primary transition-all duration-300"
							style="width: {((currentStepIndex + 1) / STEPS.length) * 100}%"
						></div>
					</div>
					<!-- Steps list — hidden by default -->
					{#if showStepsList}
						<div class="mt-2 flex flex-col border-t pt-3">
							{#each STEPS as step, index}
								{@const isActive = index === currentStepIndex}
								{@const isPast = index < currentStepIndex}
								<div class="flex gap-3">
									<div class="flex flex-col items-center">
										<div
											class={cn(
												'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
												isPast
													? 'border-primary bg-primary text-primary-foreground'
													: isActive
														? 'border-primary bg-background text-primary'
														: 'border-muted-foreground/20 bg-background text-muted-foreground/50'
											)}
										>
											{#if isPast}
												<Check class="h-3.5 w-3.5" />
											{:else}
												{index + 1}
											{/if}
										</div>
										{#if index < STEPS.length - 1}
											<div
												class={cn(
													'my-0.5 w-0.5 flex-1',
													isPast ? 'bg-primary/40' : 'bg-muted-foreground/15'
												)}
												style="min-height: 20px;"
											></div>
										{/if}
									</div>
									<div class={cn('pt-0.5 pb-3', index === STEPS.length - 1 && 'pb-0')}>
										<span
											class={cn(
												'text-sm leading-none font-semibold',
												isActive
													? 'text-foreground'
													: isPast
														? 'text-muted-foreground'
														: 'text-muted-foreground/50'
											)}
										>
											{step.label}
										</span>
										{#if isActive}
											<p class="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- md+: horizontal stepper, label below circle -->
				<div
					class="hidden md:grid md:items-start"
					style="grid-template-columns: repeat({STEPS.length}, 1fr);"
				>
					{#each STEPS as step, index}
						{@const isActive = index === currentStepIndex}
						{@const isPast = index < currentStepIndex}
						<div class="relative flex flex-col items-center gap-1.5 px-1">
							{#if index > 0}
								<div
									class="absolute top-[18px] right-1/2 left-0 h-0.5 -translate-y-1/2 bg-muted-foreground/30"
								></div>
							{/if}
							{#if index < STEPS.length - 1}
								<div
									class="absolute top-[18px] right-0 left-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground/30"
								></div>
							{/if}
							<div
								class={cn(
									'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors',
									isPast
										? 'border-primary bg-primary text-primary-foreground'
										: isActive
											? 'border-primary bg-background text-primary'
											: 'border-muted-foreground/30 bg-background text-muted-foreground'
								)}
							>
								{#if isPast}
									<Check class="h-4 w-4" />
								{:else}
									{index + 1}
								{/if}
							</div>
							<p
								class={cn(
									'text-center text-xs leading-tight font-semibold',
									isActive ? 'text-foreground' : 'text-muted-foreground'
								)}
							>
								{step.label}
							</p>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Step Content -->
	{#if stepParam === 'select-vendor-items'}
		<SelectVendorAndItemsStep />
	{:else if stepParam === 'form-lpo'}
		<FormLPOStep />
	{/if}
</div>
