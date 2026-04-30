<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-menu-sub"
	data-sidebar="menu-sub"
	class={cn(
		"border-sidebar-border ml-0 flex min-w-0 translate-x-px flex-col gap-1 border-s p-4 py-0.5",
		"group-data-[collapsible=icon]:hidden",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
