<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';

	let {
		label,
		checked = $bindable(false),
		isEditing = false,
		disabled = false,
		activeText = 'Aktif',
		inactiveText = 'Tidak Aktif',
		id,
		class: className = ''
	}: {
		label: string;
		checked?: boolean;
		isEditing?: boolean;
		disabled?: boolean;
		activeText?: string;
		inactiveText?: string;
		id?: string;
		class?: string;
	} = $props();

	const statusText = $derived(checked ? activeText : inactiveText);
	const statusColor = $derived(checked ? 'bg-green-500' : 'bg-gray-400');
</script>

<div class="space-y-2 {className}">
	<Label for={id} class="text-sm font-medium text-gray-600">{label}</Label>
	{#if isEditing}
		<div class="flex items-center gap-2">
			<Switch {id} bind:checked {disabled} />
			<span class="text-sm">{statusText}</span>
		</div>
	{:else}
		<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2">
			<div class="flex items-center gap-2">
				<div class="h-2 w-2 rounded-full {statusColor}"></div>
				<span class="text-sm font-medium text-gray-900">{statusText}</span>
			</div>
		</div>
	{/if}
</div>
