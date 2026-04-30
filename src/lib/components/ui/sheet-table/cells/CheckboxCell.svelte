<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';

	interface Props {
		value: boolean;
		updateValue: (val: boolean) => void;
	}

	let { value = $bindable(false), updateValue }: Props = $props();

	function handleChange(checked: boolean | 'indeterminate') {
		const newValue = checked === true;
		value = newValue;
		updateValue(newValue);
	}
</script>

<div class="flex items-center justify-center">
	<Checkbox checked={value} onCheckedChange={handleChange} />
</div>
