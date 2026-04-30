<script lang="ts" generics=" TValue extends string | number">
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;
	type InputProps = Omit<HTMLInputAttributes, 'type'> &
		({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined });

	type Props = {
		value: TValue;
		updateValue: (val: TValue) => void;
		readonly?: boolean;
		class?: string;
		via?: 'change' | 'input';
		type?: 'string' | 'number';
	} & InputProps;

	let {
		value,
		updateValue,
		readonly = false,
		class: className,
		via = 'change',
		type = 'string',
		...restProps
	}: Props = $props();

	function onChange(e: Event) {
		if (via !== 'change') return;
		const target = e.target as HTMLInputElement;
		updateValue(target.value as TValue);
	}

	function onInput(e: Event) {
		if (via !== 'input') return;
		const target = e.target as HTMLInputElement;
		updateValue(target.value as TValue);
	}
</script>

<input
	{...restProps}
	{type}
	class={cn('h-full w-full border-none bg-transparent px-2 outline-none', className)}
	{value}
	{readonly}
	onchange={onChange}
	oninput={onInput}
	onclick={(e) => e.stopPropagation()}
/>
