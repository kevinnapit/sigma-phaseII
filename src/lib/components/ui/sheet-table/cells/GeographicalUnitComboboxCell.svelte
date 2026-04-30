<script lang="ts">
	import GeographicalUnitCombobox from '$lib/components/shared/GeographicalUnitCombobox.svelte';

	interface Props {
		value: string;
		updateValue: (val: string) => void;
		divisionId?: string;
		initialData?: any;
	}

	let { value, updateValue, divisionId, initialData }: Props = $props();

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
	<GeographicalUnitCombobox
		bind:value={internalValue}
		{divisionId}
		{initialData}
		label=""
		placeholder="Pilih unit geografis"
	/>
</div>
