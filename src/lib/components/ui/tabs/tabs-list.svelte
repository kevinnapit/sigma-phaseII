<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let { ref = $bindable(null), class: className, ...restProps }: TabsPrimitive.ListProps = $props();
</script>

<div class="w-full overflow-x-auto">
	<TabsPrimitive.List
		bind:ref
		data-slot="tabs-list"
		class={cn(
			'inline-flex h-9 w-fit min-w-max items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground',
			className
		)}
		{...restProps}
	/>
</div>
