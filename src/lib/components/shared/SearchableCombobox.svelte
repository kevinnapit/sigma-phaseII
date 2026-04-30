<script lang="ts" generics="T extends { uoid: string; name: string }">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import type { CreateQueryResult } from '@tanstack/svelte-query';

	interface Props {
		value: string;
		items: T[];
		isLoading: boolean;
		onSearchChange: (search: string) => void;
		label?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		disabled?: boolean;
		required?: boolean;
		renderSubtitle?: (item: T) => string | null;
		subtitleMaxLength?: number;
	}

	let {
		value = $bindable(''),
		items,
		isLoading,
		onSearchChange,
		label,
		placeholder = 'Pilih...',
		searchPlaceholder = 'Cari...',
		disabled = false,
		required = false,
		renderSubtitle,
		subtitleMaxLength
	}: Props = $props();

	function truncateSubtitle(text: string): string {
		if (!subtitleMaxLength || text.length <= subtitleMaxLength) return text;
		return text.slice(0, subtitleMaxLength) + '...';
	}

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchValue = $state('');
	let selectedItemCache = $state<T | null>(null);

	const selectedItem = $derived(items.find((item) => item.uoid === value) || selectedItemCache);

	$effect(() => {
		const found = items.find((item) => item.uoid === value);
		if (found) {
			selectedItemCache = found;
		}
	});

	function handleSelect(itemId: string, item: T) {
		value = itemId;
		selectedItemCache = item;
		open = false;
		searchValue = '';
		onSearchChange('');
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	let debounceTimer: ReturnType<typeof setTimeout>;
	function handleSearchInput(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value;
		searchValue = inputValue;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearchChange(inputValue);
		}, 500);
	}

	$effect(() => {
		if (!open && searchValue !== '') {
			searchValue = '';
			onSearchChange('');
		}
	});
</script>

<div class="space-y-2">
	{#if label}
		<label
			class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<Popover.Root bind:open>
		<Popover.Trigger asChild>
			{#snippet child({ props })}
				<Button
					bind:ref={triggerRef}
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="w-full justify-between"
					{disabled}
				>
					<span class="truncate">
						{selectedItem?.name || placeholder}
					</span>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="p-0 sm:w-full" align="start">
			<Command.Root shouldFilter={false}>
				<Command.Input
					placeholder={searchPlaceholder}
					value={searchValue}
					oninput={handleSearchInput}
				/>
				<Command.List>
					<Command.Empty>
						{isLoading ? 'Memuat...' : 'Data tidak ditemukan'}
					</Command.Empty>
					{#if items.length}
						<Command.Group class="max-h-64 overflow-auto">
							{#each items as item (item.uoid)}
								<Command.Item value={item.name} onSelect={() => handleSelect(item.uoid, item)}>
									<Check
										class={cn('mr-2 h-4 w-4', value === item.uoid ? 'opacity-100' : 'opacity-0')}
									/>
									<div class="flex flex-col">
										<span>{item.name}</span>
										{#if renderSubtitle}
											{@const subtitle = renderSubtitle(item)}
											{#if subtitle}
												<span class="text-xs text-muted-foreground">
													{truncateSubtitle(subtitle)}
												</span>
											{/if}
										{/if}
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>
