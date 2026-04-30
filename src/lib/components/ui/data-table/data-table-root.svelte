<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
	};

	let { children, class: className, ...restProps }: Props = $props();
</script>

<div
	data-data-table-root
	class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
	{...restProps}
>
	{@render children()}
</div>
