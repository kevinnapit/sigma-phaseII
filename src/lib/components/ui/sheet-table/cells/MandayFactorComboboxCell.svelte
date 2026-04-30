<script lang="ts">
	import MandayFactorCombobox from '$lib/components/shared/MandayFactorCombobox.svelte';

	interface Props {
		value: string;
		updateValue: (val: string) => void;
		initialData?: any;
	}

	let { value, updateValue, initialData }: Props = $props();

	let internalValue = $state(value);

	// Sync internal value with prop value
	$effect(() => {
		internalValue = value;
	});

	// Update parent when internal value changes
	$effect(() => {
		if (internalValue !== value) {
			updateValue(internalValue);
		}
	});
</script>

<div class="h-full w-full p-2">
	<MandayFactorCombobox
		bind:value={internalValue}
		{initialData}
		label=""
		placeholder="Pilih manday factor"
	/>
</div>
