<script lang="ts">
	import { Filter, Check, ChevronsUpDown, Loader2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import DatePicker from '$lib/components/ui/date-picker/DatePicker.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface FilterOption {
		label: string;
		value: string;
		/** 'select' (default) | 'searchable' (combobox) | 'date' (date picker) */
		type?: 'select' | 'searchable' | 'date';
		/** @deprecated Use type: 'searchable' instead */
		searchable?: boolean;
		/** Options for select/searchable filters. Not needed for date type. */
		options?: { value: string; label: string }[];
		/** Placeholder for date picker or combobox */
		placeholder?: string;
		/**
		 * Server-side search callback. When provided, typing in the combobox
		 * will debounce and call this instead of filtering client-side.
		 * The parent should update `options` reactively based on API results.
		 */
		onSearch?: (query: string) => void;
		/** Show loading spinner in combobox when server-side search is in progress */
		isSearching?: boolean;
	}

	let {
		filters = [],
		values = $bindable({}),
		open = $bindable(false),
		description = 'Pilih filter untuk menyaring data',
		onApply,
		children
	}: {
		filters: FilterOption[];
		values: Record<string, string>;
		open?: boolean;
		description?: string;
		onApply?: (values: Record<string, string>) => void;
		children?: Snippet;
	} = $props();

	let localValues = $state<Record<string, string>>({ ...values });
	let searchQueries = $state<Record<string, string>>(
		Object.fromEntries(
			filters
				.filter((f) => f.searchable || f.type === 'searchable')
				.map((f) => [f.value, ''])
		)
	);
	let comboboxOpen = $state<Record<string, boolean>>(
		Object.fromEntries(
			filters
				.filter((f) => f.searchable || f.type === 'searchable')
				.map((f) => [f.value, false])
		)
	);
	let debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

	function getFilterType(filter: FilterOption): 'select' | 'searchable' | 'date' {
		if (filter.type) return filter.type;
		if (filter.searchable) return 'searchable';
		return 'select';
	}

	let previousOpen = false;

	$effect(() => {
		const isOpen = open;
		// Only reset localValues when transitioning from closed → open
		if (isOpen && !previousOpen) {
			localValues = { ...values };
			// Reset search queries when opening
			for (const key of Object.keys(searchQueries)) {
				searchQueries[key] = '';
			}
		}
		previousOpen = isOpen;

		// Always ensure searchable filter keys exist (safe even if filters change)
		if (isOpen) {
			filters.forEach((f) => {
				const type = getFilterType(f);
				if (type === 'searchable') {
					if (searchQueries[f.value] === undefined) searchQueries[f.value] = '';
					if (comboboxOpen[f.value] === undefined) comboboxOpen[f.value] = false;
				}
			});
		}
	});

	function triggerServerSearch(filterValue: string, query: string) {
		const filter = filters.find((f) => f.value === filterValue);
		if (!filter?.onSearch) return;
		if (debounceTimers[filterValue]) clearTimeout(debounceTimers[filterValue]);
		debounceTimers[filterValue] = setTimeout(() => {
			filter.onSearch!(query);
		}, 300);
	}

	function handleApply() {
		values = { ...localValues };
		open = false;
		if (onApply) onApply(values);
	}

	function handleReset() {
		const resetValues: Record<string, string> = {};
		Object.keys(values).forEach((key) => (resetValues[key] = ''));
		filters.forEach((filter) => (resetValues[filter.value] = ''));
		localValues = resetValues;
		values = resetValues;
		open = false;
		if (onApply) onApply(values);
	}

	const activeFilterCount = $derived(
		Object.values(values).filter((v) => v && v !== '' && v !== 'all').length
	);

	function getTriggerContent(filterValue: string): string {
		const filter = filters.find((f) => f.value === filterValue);
		if (!filter || !filter.options) return '';
		return filter.options.find((opt) => opt.value === localValues[filterValue])?.label || '';
	}

	function getFilteredOptions(filter: FilterOption) {
		// Server-side search: don't filter client-side, options come from API
		if (filter.onSearch) return filter.options || [];
		// Client-side search
		const q = (searchQueries[filter.value] ?? '').toLowerCase();
		if (!q) return filter.options || [];
		return (filter.options || []).filter((opt) => opt.label.toLowerCase().includes(q));
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 gap-2">
				<Filter class="h-4 w-4" />
				<span class="hidden sm:block">Filter</span>
				{#if activeFilterCount > 0}
					<span
						class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
					>
						{activeFilterCount}
					</span>
				{/if}
			</Button>
		{/snippet}
	</Sheet.Trigger>

	<Sheet.Content side="right" class="flex w-full flex-col sm:w-[400px] md:w-[540px]">
		<Sheet.Header class="p-4">
			<Sheet.Title>Filter Data</Sheet.Title>
			<Sheet.Description>{description}</Sheet.Description>
		</Sheet.Header>

		<div class="space-y-4 p-4">
			{#each filters as filter (filter.value)}
				{@const filterType = getFilterType(filter)}

				{#if filterType === 'date'}
					<DatePicker
						id={`filter-${filter.value}`}
						label={filter.label}
						bind:value={localValues[filter.value]}
						placeholder={filter.placeholder || `Pilih ${filter.label.toLowerCase()}...`}
					/>
				{:else if filterType === 'searchable'}
					<div class="space-y-2">
						<Label for={`filter-${filter.value}`}>{filter.label}</Label>
						<Popover.Root
							open={comboboxOpen[filter.value] ?? false}
							onOpenChange={(v) => {
								comboboxOpen[filter.value] = v;
								if (v && filter.onSearch) {
									filter.onSearch(searchQueries[filter.value] ?? '');
								}
							}}
						>
							<Popover.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="outline"
										role="combobox"
										class="w-full justify-between font-normal"
									>
										{getTriggerContent(filter.value) || `Pilih ${filter.label.toLowerCase()}...`}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-full p-0" align="start">
								<Command.Root shouldFilter={false}>
									<Command.Input
										placeholder={filter.placeholder || `Cari ${filter.label.toLowerCase()}...`}
										bind:value={searchQueries[filter.value]}
										oninput={(e) => {
											if (filter.onSearch) {
												triggerServerSearch(filter.value, (e.target as HTMLInputElement)?.value ?? '');
											}
										}}
									/>
									<Command.List>
										{#if filter.isSearching}
											<div class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
												<Loader2 class="h-4 w-4 animate-spin" />
												Mencari...
											</div>
										{:else}
											<Command.Empty>Tidak ada hasil.</Command.Empty>
											<Command.Group>
												{#each getFilteredOptions(filter) as option (option.value)}
													<Command.Item
														value={option.label}
														onSelect={() => {
															localValues[filter.value] = option.value;
															comboboxOpen[filter.value] = false;
														}}
													>
														<Check
															class={cn(
																'mr-2 h-4 w-4',
																localValues[filter.value] === option.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{option.label}
													</Command.Item>
												{/each}
											</Command.Group>
										{/if}
									</Command.List>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>
				{:else}
					<div class="space-y-2">
						<Label for={`filter-${filter.value}`}>{filter.label}</Label>
						<Select.Root type="single" bind:value={localValues[filter.value]}>
							<Select.Trigger id={`filter-${filter.value}`} class="w-full">
								{getTriggerContent(filter.value) || `Pilih ${filter.label.toLowerCase()}...`}
							</Select.Trigger>
							<Select.Content class="max-h-[200px] sm:max-h-[300px]">
								{#each filter.options || [] as option (option.value)}
									<Select.Item value={option.value} label={option.label}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				{/if}
			{/each}

			{#if children}
				{@render children()}
			{/if}
		</div>

		<Sheet.Footer class="flex-row gap-2 px-4 pb-6 sm:px-6">
			<Button variant="outline" onclick={handleReset} class="flex-1 sm:flex-none">Reset</Button>
			<Button onclick={handleApply} class="flex-1 sm:flex-none">Terapkan</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
