<script lang="ts">
	import { Clock } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	let { value, updateValue }: { value: string; updateValue: (val: string) => void } = $props();

	let localValue = $state(value);

	$effect(() => {
		localValue = value;
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		localValue = target.value;
	}

	function handleBlur() {
		if (localValue !== value) {
			updateValue(localValue);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (localValue !== value) {
				updateValue(localValue);
			}
		}
	}
</script>

<div class="flex h-full w-full items-center gap-2 px-2 py-1">
	<Clock size={14} class="shrink-0 text-gray-400" />
	<Input
		type="time"
		value={localValue}
		oninput={handleInput}
		onblur={handleBlur}
		onkeydown={handleKeydown}
		class="h-7 border-0 bg-transparent px-0 text-sm outline-none focus-visible:ring-0"
		placeholder="HH:MM"
	/>
</div>
