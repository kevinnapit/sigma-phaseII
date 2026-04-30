<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		value: string;
		updateValue: (val: string) => void;
		readonly?: boolean;
		class?: string;
		placeholder?: string;
	}

	let {
		value,
		updateValue,
		readonly = false,
		class: className,
		placeholder = 'HH:mm'
	}: Props = $props();

	function onChange(e: Event) {
		const target = e.target as HTMLInputElement;
		updateValue(target.value);
	}
</script>

<input
	type="time"
	class={cn('h-full w-full border-none bg-transparent px-2 outline-none', className)}
	{value}
	{readonly}
	{placeholder}
	onchange={onChange}
	onclick={(e) => e.stopPropagation()}
	step="60"
/>
