<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		start?: Snippet;
		end?: Snippet;
	};

	let { children, start, end, class: className, ...restProps }: Props = $props();
</script>

<div
	data-data-table-toolbar
	class={cn(
		'flex items-center justify-between gap-2 px-6 pb-4',
		'[div[data-data-table-root]:not(:has([data-data-table-header]))_&]:pt-6',
		className
	)}
	{...restProps}
>
	{#if start}
		<div data-toolbar-start class="flex w-full items-center gap-2">
			{@render start()}
		</div>
	{/if}
	{#if children}
		{@render children()}
	{/if}
	{#if end}
		<div data-toolbar-end class="ml-auto flex items-center gap-2">
			{@render end()}
		</div>
	{/if}
</div>

<style>
	[data-data-table-toolbar] {
		/* Add top padding if header doesn't exist */
		/* [data-data-table-root]:not(:has([data-data-table-header])) & {
			padding-top: 1.5rem;
		} */

		&:not(:has([data-toolbar-start])) [data-toolbar-end] {
			margin-left: auto;
		}

		&:has([data-toolbar-start]):not(:has([data-toolbar-end])) [data-toolbar-start] {
			flex: 1;
		}
	}
</style>
