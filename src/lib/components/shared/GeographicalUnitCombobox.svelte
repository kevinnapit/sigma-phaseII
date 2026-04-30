<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { useGeographicalUnitListQuery } from '$lib/modules/functional-admin/queries/useGeographicalUnitQueries.svelte';

	interface Props {
		value: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
		divisionId?: string;
		initialData?: { id: string; code: string; name: string };
	}

	let {
		value = $bindable(''),
		label = 'Unit Geografis',
		placeholder = 'Pilih unit geografis...',
		disabled = false,
		required = false,
		error,
		divisionId,
		initialData
	}: Props = $props();

	const userCtx = getUserContext();
	const estateId = $derived(userCtx.estate?.id);

	let open = $state(false);
	let searchValue = $state('');
	let debouncedSearch = $state('');
	let selectedItemCache = $state<any>(initialData || null);

	// Update cache when initialData changes
	$effect(() => {
		if (initialData) {
			selectedItemCache = initialData;
		}
	});

	// Debounce search
	$effect(() => {
		searchValue;
		const timer = setTimeout(() => {
			debouncedSearch = searchValue;
		}, 300);
		return () => clearTimeout(timer);
	});

	// Query geographical units
	const query = useGeographicalUnitListQuery(() => ({
		page: 1,
		page_size: 100,
		name: debouncedSearch || undefined,
		administrative_unit_id: divisionId || undefined
	}));

	const items = $derived(query?.data?.data || []);
	// Create unique items by combining id with code to handle duplicate IDs from API
	const validItems = $derived(
		items
			.filter((item: any) => item?.id)
			.map((item: any, index: number) => ({
				...item,
				_uniqueKey: `${item.id}-${item.code}-${index}` // Unique key combining id, code, and index
			}))
	);

	// Merge cached item with query results to ensure it's always available
	const allItems = $derived.by(() => {
		const itemsList = [...validItems];
		// If we have a cached item and it's not in the list, add it
		if (selectedItemCache && !itemsList.find((i: any) => i.id === selectedItemCache.id)) {
			const cachedWithKey = {
				...selectedItemCache,
				_uniqueKey: `${selectedItemCache.id}-${selectedItemCache.code}-cached`
			};
			itemsList.unshift(cachedWithKey);
		}
		return itemsList;
	});

	const selectedItem = $derived(
		allItems.find((item: any) => item.id === value) || selectedItemCache
	);

	// Display value with code and name
	const displayValue = $derived(() => {
		if (!selectedItem) return placeholder;
		return `${selectedItem.code} - ${selectedItem.name}`;
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
						(!estateId || disabled) && 'cursor-not-allowed opacity-50'
					)}
					disabled={!estateId || disabled}
				>
					<span class="truncate">
						{#if !estateId}
							Pilih estate terlebih dahulu
						{:else}
							{displayValue()}
						{/if}
					</span>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-full p-0" align="start">
			<Command.Root shouldFilter={false} filter={() => 1}>
				<Command.Input placeholder="Cari kode atau nama..." bind:value={searchValue} />
				<Command.Empty>
					{#if query?.isLoading}
						Memuat...
					{:else}
						Tidak ada data ditemukan
					{/if}
				</Command.Empty>
				<Command.Group class="max-h-[300px] overflow-auto">
					{#if query?.isLoading}
						<Command.Item disabled>Memuat...</Command.Item>
					{:else if query?.isError}
						<Command.Item disabled>Error memuat data</Command.Item>
					{:else if allItems.length === 0}
						<Command.Item disabled>Tidak ada data</Command.Item>
					{:else}
						{#each allItems as item (item._uniqueKey)}
							<Command.Item value={item.id} onSelect={() => handleSelect(item.id)}>
								<Check
									class={cn('mr-2 h-4 w-4', value === item.id ? 'opacity-100' : 'opacity-0')}
								/>
								<div class="flex flex-col">
									<span>{item.name}</span>
									<span class="text-xs text-muted-foreground">{item.code}</span>
								</div>
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
