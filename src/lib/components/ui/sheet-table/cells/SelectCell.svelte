<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		value: string;
		options: Option[];
		updateValue: (value: string) => void;
		placeholder?: string;
	}

	let { value = $bindable(''), options, updateValue, placeholder = 'Pilih...' }: Props = $props();

	const selected = $derived(options.find((opt) => opt.value === value));

	function handleValueChange(v: any) {
		if (v?.value) {
			value = v.value;
			updateValue(v.value);
		}
	}
</script>

<div class="p-2">
	<Select.Root {selected} onSelectedChange={handleValueChange}>
		<Select.Trigger class="w-full">
			<Select.Value {placeholder} />
		</Select.Trigger>
		<Select.Content>
			{#each options as option}
				<Select.Item value={option.value}>{option.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
