<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		className?: string;
		Actions?: Snippet;
	}
	let { title, description, Actions, className }: Props = $props();
</script>

<div class={cn('flex w-full items-center justify-between pb-4', className)}>
	<div class="flex flex-1 flex-col gap-2">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">{title}</h2>
			<p class="text-muted-foreground">{description}</p>
		</div>
	</div>
	{@render Actions?.()}
</div>
