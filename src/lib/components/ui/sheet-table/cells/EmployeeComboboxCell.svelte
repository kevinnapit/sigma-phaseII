<script lang="ts">
	import EmployeeCombobox from '$lib/components/shared/EmployeeCombobox.svelte';

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
	<EmployeeCombobox
		bind:value={internalValue}
		{divisionId}
		{initialData}
		label=""
		placeholder="Pilih pekerja"
	/>
</div>
