<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	let {
		label,
		value = $bindable(''),
		placeholder = '',
		isEditing = false,
		disabled = false,
		type = 'text',
		multiline = false,
		rows = 3,
		id,
		class: className = ''
	}: {
		label: string;
		value?: string;
		placeholder?: string;
		isEditing?: boolean;
		disabled?: boolean;
		type?: 'text' | 'email' | 'tel' | 'number';
		multiline?: boolean;
		rows?: number;
		id?: string;
		class?: string;
	} = $props();

	const displayValue = $derived(value || '-');
</script>

<div class="space-y-2 {className}">
	<Label for={id} class="text-sm font-medium text-gray-600">{label}</Label>
	{#if isEditing}
		{#if multiline}
			<Textarea {id} bind:value {placeholder} {disabled} {rows} class="resize-none" />
		{:else}
			<Input {id} bind:value {placeholder} {disabled} {type} />
		{/if}
	{:else}
		<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2 text-sm">
			<p class="font-medium text-gray-900">{displayValue}</p>
		</div>
	{/if}
</div>
