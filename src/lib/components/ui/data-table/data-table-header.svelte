<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		title?: string;
		classTitle?: string;
		description?: string;
		actions?: Snippet;
	};

	let {
		children,
		title,
		classTitle,
		description,
		actions,
		class: className,
		...restProps
	}: Props = $props();

	const hasContent = $derived(!!title || !!description || !!actions || !!children);
</script>

{#if hasContent}
	<div
		data-data-table-header
		class={cn(
			'flex flex-col space-y-1.5 p-6 pb-4 ',
			'[div[data-data-table-root]:not(:has([data-data-table-toolbar]))_&]:pb-4',
			className
		)}
		{...restProps}
	>
		{#if title || description}
			<div data-header-text>
				{#if title}
					<h3 class={cn('text-2xl leading-none font-semibold tracking-tight', classTitle)}>
						{title}
					</h3>
				{/if}
				{#if description}
					<p class="text-sm text-muted-foreground">{description}</p>
				{/if}
			</div>
		{/if}
		{#if actions}
			<div data-header-actions class="ml-auto">
				{@render actions()}
			</div>
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}

<style>
	[data-data-table-header] {
		&:has([data-header-actions]) {
			flex-direction: row;
			align-items: flex-start;
		}

		[data-header-text] {
			flex: 1;
		}
	}
</style>
