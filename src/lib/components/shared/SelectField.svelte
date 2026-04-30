<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';

	interface Option {
		id: string;
		value: string; // used for search/filter
		label?: string; // displayed in trigger button and list (falls back to value)
	}

	let {
		options = [],
		value = '',
		placeholder = 'Pilih...',
		searchPlaceholder = 'Cari...',
		emptyMessage = 'Tidak ada data ditemukan.',
		disabled = false,
		isLoading = false,
		onSelect
	}: {
		options: Option[];
		value: string;
		placeholder?: string;
		searchPlaceholder?: string;
		emptyMessage?: string;
		disabled?: boolean;
		isLoading?: boolean;
		onSelect: (value: string) => void;
	} = $props();

	let open = $state(false);

	const selectedOption = $derived(options.find((opt) => opt.id === value));
</script>

<Popover.Root bind:open>
	<Popover.Trigger class="w-full">
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-full justify-between"
			disabled={disabled || isLoading}
			type="button"
			size="sm"
		>
			{selectedOption?.label ?? selectedOption?.value ?? placeholder}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0" align="start">
		<Command.Root shouldFilter={true}>
			<Command.Input placeholder={searchPlaceholder} class="h-9" />
			<Command.Empty>
				{isLoading ? 'Memuat...' : emptyMessage}
			</Command.Empty>
			<Command.Group class="max-h-[200px] overflow-auto">
				{#if options.length > 0}
					{#each options as option}
						<Command.Item
							value={option.value}
							onSelect={() => {
								onSelect(option.id);
								open = false;
							}}
						>
							<Check
								class={cn('mr-2 h-4 w-4', value === option.id ? 'opacity-100' : 'opacity-0')}
							/>
							{option.value}
						</Command.Item>
					{/each}
				{/if}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
