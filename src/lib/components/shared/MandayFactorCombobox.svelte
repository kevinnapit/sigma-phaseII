<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/queries/useMasterQueries.svelte';

	interface Props {
		value: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
		initialData?: { id: string; code?: string; name?: string; value?: string };
	}

	let {
		value = $bindable(''),
		label = 'Manday Factor',
		placeholder = 'Pilih manday factor...',
		disabled = false,
		required = false,
		error,
		initialData
	}: Props = $props();

	let open = $state(false);
	let searchValue = $state('');
	let selectedItemCache = $state<any>(initialData || null);

	// Update cache when initialData changes
	$effect(() => {
		if (initialData) {
			selectedItemCache = initialData;
		}
	});

	// Get master type by name "Manday Factor"
	const masterTypeQuery = useMasterTypeByNameQuery(() => ({ name: 'Manday Factor' }));

	// The response contains the master type with values directly
	const allItems = $derived.by(() => {
		const data = masterTypeQuery?.data;
		if (!data) return [];

		// Check if data is array (list response) or object (single item with values)
		if (Array.isArray(data)) {
			// If it's an array, get the first item's values
			return data[0]?.values || [];
		}

		// If it's an object, get values directly
		return data.values || [];
	});

	const filteredItems = $derived.by(() => {
		if (!searchValue || searchValue.trim() === '') {
			return allItems;
		}

		const searchLower = searchValue.toLowerCase().trim();
		return allItems.filter((item: any) => item.value?.toLowerCase().includes(searchLower));
	});

	const selectedItem = $derived(
		allItems.find((item: any) => item.id === value) || selectedItemCache
	);

	const displayValue = $derived(() => {
		if (!selectedItem) return placeholder;
		return selectedItem.value || selectedItem.name;
	});

	function handleSelect(itemId: string) {
		const item = allItems.find((i: any) => i.id === itemId);
		if (item) {
			selectedItemCache = item;
		}
		value = itemId === value ? '' : itemId;
		open = false;
		searchValue = '';
	}
</script>

<div class="space-y-2">
	{#if label}
		<Label>
			{label}
			{#if required}
				<span class="text-destructive">*</span>
			{/if}
		</Label>
	{/if}

	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class={cn(
						'w-full justify-between',
						!value && 'text-muted-foreground',
						error && 'border-destructive',
						disabled && 'cursor-not-allowed opacity-50'
					)}
					{disabled}
				>
					<span class="truncate">{displayValue()}</span>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-full p-0" align="start">
			<Command.Root shouldFilter={false} filter={() => 1}>
				<Command.Input placeholder="Cari..." bind:value={searchValue} />
				<Command.Empty>
					{#if masterTypeQuery?.isLoading}
						Memuat...
					{:else}
						Tidak ada data ditemukan
					{/if}
				</Command.Empty>
				<Command.Group class="max-h-[300px] overflow-auto">
					{#if masterTypeQuery?.isLoading}
						<Command.Item disabled>Memuat...</Command.Item>
					{:else if masterTypeQuery?.isError}
						<Command.Item disabled>Error memuat data</Command.Item>
					{:else if filteredItems.length === 0}
						<Command.Item disabled>Manday factor tidak ada</Command.Item>
					{:else}
						{#each filteredItems as item (item.id)}
							<Command.Item value={item.value} onSelect={() => handleSelect(item.id)}>
								<Check
									class={cn('mr-2 h-4 w-4', value === item.id ? 'opacity-100' : 'opacity-0')}
								/>
								{item.value}
							</Command.Item>
						{/each}
					{/if}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}
</div>
