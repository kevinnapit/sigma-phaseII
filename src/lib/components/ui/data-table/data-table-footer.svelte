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
	data-data-table-footer
	class={cn('flex items-center justify-end p-6 pt-4', className)}
	{...restProps}
>
	{@render children()}
</div>
