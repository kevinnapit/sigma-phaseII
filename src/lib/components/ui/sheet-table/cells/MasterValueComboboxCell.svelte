<script lang="ts">
	import MasterValueCombobox from '$lib/components/shared/MasterValueCombobox.svelte';

	interface Props {
		value: string;
		updateValue: (val: string) => void;
		masterTypeId: string;
		placeholder?: string;
	}

	let { value, updateValue, masterTypeId, placeholder = 'Pilih...' }: Props = $props();

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
	<MasterValueCombobox
		bind:value={internalValue}
		{masterTypeId}
		label=""
		{placeholder}
		searchPlaceholder="Cari..."
	/>
</div>
