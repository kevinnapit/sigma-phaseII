<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type Option = {
		value: string;
		label: string;
	};

	let {
		value = $bindable(undefined),
		options = [],
		disabled = false,
		placeholder = 'Pilih...',
		emptyText = 'Tidak ada data ditemukan.',
		searchPlaceholder = 'Cari...',
		isLoading = false,
		onSearchChange
	}: {
		value: string | undefined;
		options: Option[];
		disabled?: boolean;
		placeholder?: string;
		emptyText?: string;
		searchPlaceholder?: string;
		isLoading?: boolean;
		onSearchChange?: (search: string) => void;
	} = $props();

	let open = $state(false);
	let searchValue = $state('');

	const selectedOption = $derived(options.find((opt) => opt.value === value));

	$effect(() => {
		if (onSearchChange) {
			searchValue;
			const timer = setTimeout(() => {
				onSearchChange(searchValue);
			}, 300);
			return () => clearTimeout(timer);
		}
	});

	const filteredOptions = $derived.by(() => {
		if (onSearchChange || !searchValue) {
			return options;
		}
		const search = searchValue.toLowerCase();
		return options.filter((opt) => opt.label.toLowerCase().includes(search));
	});
</script>

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
			{selectedOption?.label || placeholder}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[400px] p-0" align="start">
		<Command.Root shouldFilter={false}>
			<Command.Input bind:value={searchValue} placeholder={searchPlaceholder} class="h-9" />
			<Command.Empty>
				{isLoading ? 'Memuat...' : emptyText}
			</Command.Empty>
			<Command.Group class="max-h-[200px] overflow-auto">
				{#if filteredOptions.length > 0}
					{#each filteredOptions as option}
						<Command.Item
							value={option.value}
							onSelect={() => {
								value = option.value;
								open = false;
								searchValue = '';
							}}
						>
							<Check
								class={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')}
							/>
							{option.label}
						</Command.Item>
					{/each}
				{/if}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
