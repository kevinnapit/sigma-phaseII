<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			(
				| { type: 'file'; files?: FileList }
				| { type?: InputType; files?: undefined; debounce?: number }
			)
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		debounce = 500,
		placeholder = 'Cari data...',
		class: className,
		'data-slot': dataSlot = 'input',
		...restProps
	}: Props & { debounce?: number } = $props();

	let inputValue = $state(value || '');

	$effect(() => {
		inputValue = value || '';
	});

	let timeoutId: number | undefined | NodeJS.Timeout;
	const debouncer = (next: string) => {
		inputValue = next;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			value = next;
		}, debounce);
	};
</script>

<input
	bind:this={ref}
	data-slot={dataSlot}
	{placeholder}
	class={cn(
		'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-xs md:text-sm  shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
		'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
		'w-full aria-invalid:border-destructive aria-invalid:ring-destructive/20 sm:max-w-lg dark:aria-invalid:ring-destructive/40',
		className
	)}
	{type}
	value={inputValue}
	oninput={(e) => debouncer((e.target as HTMLInputElement).value)}
	{...restProps}
/>
