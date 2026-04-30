<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { ProcessStepInfo } from '../types/local-purchase-analysis.types';

	let { steps, currentStep }: { steps: ProcessStepInfo[]; currentStep: number } = $props();

	let showStepsList = $state(false);
</script>

<Card.Root>
	<Card.Content class="pt-6">
		<!-- Mobile: compact stepper with progress summary -->
		<div class="flex flex-col md:hidden">
			<!-- Progress summary bar — clickable to toggle steps list -->
			<button
				type="button"
				class="mb-3 flex w-full items-center justify-between"
				onclick={() => (showStepsList = !showStepsList)}
			>
				<span class="text-xs text-muted-foreground">
					Langkah {currentStep + 1} dari {steps.length}
				</span>
				<div class="flex items-center gap-1.5">
					<span class="text-xs font-semibold text-primary">
						{steps[currentStep]?.title}
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
					style="width: {((currentStep + 1) / steps.length) * 100}%"
				></div>
			</div>
			<!-- Steps list — hidden by default, toggle on click -->
			{#if showStepsList}
				<div class="mt-2 flex flex-col border-t pt-3">
					{#each steps as step, index}
						{@const isActive = index === currentStep}
						{@const isCompleted = step.completed}
						{@const isPast = index < currentStep}

						<div class="flex gap-3">
							<!-- Left: circle + connector -->
							<div class="flex flex-col items-center">
								<div
									class={cn(
										'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
										isCompleted || isPast
											? 'border-primary bg-primary text-primary-foreground'
											: isActive
												? 'border-primary bg-background text-primary'
												: 'border-muted-foreground/20 bg-background text-muted-foreground/50'
									)}
								>
									{#if isCompleted || isPast}
										<Check class="h-3.5 w-3.5" />
									{:else}
										{index + 1}
									{/if}
								</div>
								{#if index < steps.length - 1}
									<div
										class={cn(
											'my-0.5 w-0.5 flex-1',
											isPast || isCompleted ? 'bg-primary/40' : 'bg-muted-foreground/15'
										)}
										style="min-height: 20px;"
									></div>
								{/if}
							</div>
							<!-- Right: text -->
							<div class={cn('pt-0.5 pb-3', index === steps.length - 1 && 'pb-0')}>
								<span
									class={cn(
										'text-sm leading-none font-semibold',
										isActive
											? 'text-foreground'
											: isCompleted || isPast
												? 'text-muted-foreground'
												: 'text-muted-foreground/50'
									)}
								>
									{step.title}
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

		<!-- md+: horizontal stepper, step text below circle -->
		<div
			class="hidden md:grid md:items-start"
			style="grid-template-columns: repeat({steps.length}, 1fr);"
		>
			{#each steps as step, index}
				{@const isActive = index === currentStep}
				{@const isCompleted = step.completed}
				{@const isPast = index < currentStep}

				<div class="relative flex flex-col items-center gap-1.5 px-1">
					<!-- Connector line (left half, skip first step) -->
					{#if index > 0}
						<div
							class="absolute top-[18px] right-1/2 left-0 h-0.5 -translate-y-1/2 bg-muted-foreground/30"
						></div>
					{/if}
					<!-- Connector line (right half, skip last step) -->
					{#if index < steps.length - 1}
						<div
							class="absolute top-[18px] right-0 left-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground/30"
						></div>
					{/if}

					<!-- Circle -->
					<div
						class={cn(
							'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors',
							isCompleted || isPast
								? 'border-primary bg-primary text-primary-foreground'
								: isActive
									? 'border-primary bg-background text-primary'
									: 'border-muted-foreground/30 bg-background text-muted-foreground'
						)}
					>
						{#if isCompleted || isPast}
							<Check class="h-4 w-4" />
						{:else}
							{index + 1}
						{/if}
					</div>

					<!-- Label -->
					<p
						class={cn(
							'text-center text-xs leading-tight font-semibold',
							isActive ? 'text-foreground' : 'text-muted-foreground'
						)}
					>
						{step.title}
					</p>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
