<script lang="ts">
	import AllocationCombobox from '$lib/components/shared/AllocationCombobox.svelte';

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
	<AllocationCombobox
		bind:value={internalValue}
		{initialData}
		label=""
		placeholder="Pilih alokasi"
	/>
</div>
