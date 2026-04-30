<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';

	let {
		label,
		value = $bindable(''),
		displayValue = '',
		placeholder = 'Pilih...',
		isEditing = false,
		disabled = false,
		isLoading = false,
		required = false,
		options = [],
		onSelect,
		id,
		class: className = ''
	}: {
		label: string;
		value?: string;
		displayValue?: string;
		placeholder?: string;
		isEditing?: boolean;
		disabled?: boolean;
		isLoading?: boolean;
		required?: boolean;
		options?: Array<{ id: string; name: string; value?: string }>;
		onSelect?: (id: string) => void;
		id?: string;
		class?: string;
	} = $props();

	let open = $state(false);

	const selectedOption = $derived(options.find((opt) => opt.id === value));
	const buttonText = $derived(
		selectedOption ? selectedOption.name || selectedOption.value || '' : placeholder
	);
	const readOnlyValue = $derived(
		displayValue || selectedOption?.name || selectedOption?.value || '-'
	);

	function handleSelect(optionId: string) {
		value = optionId;
		open = false;
		onSelect?.(optionId);
	}
</script>

<div class="space-y-2 {className}">
	<Label for={id} class="text-sm font-medium text-gray-600">
		{label}
		{#if required && isEditing}
			<span class="text-red-500">*</span>
		{/if}
	</Label>
	{#if isEditing}
		<Popover.Root bind:open>
			<Popover.Trigger class="w-full">
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="w-full justify-between"
					{disabled}
					type="button"
				>
					{buttonText}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-full p-0" align="start">
				<Command.Root shouldFilter={true}>
					<Command.Input placeholder="Cari..." class="h-9" />
					<Command.Empty>
						{isLoading ? 'Memuat...' : 'Tidak ada data ditemukan.'}
					</Command.Empty>
					<Command.Group class="max-h-[200px] overflow-auto">
						{#if options.length > 0}
							{#each options as option}
								<Command.Item
									value={option.name || option.value || ''}
									onSelect={() => handleSelect(option.id)}
								>
									<Check
										class={cn('mr-2 h-4 w-4', value === option.id ? 'opacity-100' : 'opacity-0')}
									/>
									{option.name || option.value}
								</Command.Item>
							{/each}
						{/if}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{:else}
		<div class="min-h-[40px] rounded-md border border-transparent bg-transparent py-2 text-sm">
			<p class="font-medium text-gray-900">{readOnlyValue}</p>
		</div>
	{/if}
</div>
