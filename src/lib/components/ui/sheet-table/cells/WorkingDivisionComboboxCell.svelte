<script lang="ts">
	import WorkingDivisionCombobox from '$lib/components/shared/WorkingDivisionCombobox.svelte';

	interface Props {
		value: string;
		updateValue: (value: string) => void;
		initialData?: any;
	}

	let { value = $bindable(''), updateValue, initialData }: Props = $props();

	function handleValueChange(newValue: string) {
		value = newValue;
		updateValue(newValue);
	}
</script>

<div class="p-2">
	<WorkingDivisionCombobox
		bind:value
		placeholder="Pilih divisi"
		onValueChange={handleValueChange}
	/>
</div>
