<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import { useMasterValuesByTypeQuery } from '$lib/modules/functional-admin/index.svelte';

	interface Props {
		label: string;
		masterTypeId: string;
		value?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		required?: boolean;
		error?: string | string[];
		disabled?: boolean;
		filterNames?: string[];
	}

	let {
		label,
		masterTypeId,
		value = $bindable(''),
		placeholder = 'Pilih...',
		searchPlaceholder = 'Cari...',
		required = false,
		error,
		disabled = false,
		filterNames
	}: Props = $props();

	const errorMessage = $derived(
		error ? (Array.isArray(error) ? error[0] : error) : undefined
	);

	let open = $state(false);
	let searchValue = $state('');

	const query = useMasterValuesByTypeQuery(() => ({
		master_type_id: masterTypeId
	}));

	const allItems = $derived.by(() => {
		const data = query.data;
		const items = Array.isArray(data) ? data : [];
		if (filterNames && filterNames.length > 0) {
			const lower = filterNames.map((n) => n.toLowerCase());
			return items.filter((item: any) => lower.includes((item.value || '').toLowerCase()));
		}
		return items;
	});

	const filteredItems = $derived.by(() => {
		if (!searchValue || searchValue.trim() === '') {
			return allItems;
		}
		
		const searchLower = searchValue.toLowerCase().trim();
		return allItems.filter((item: any) =>
			item.value?.toLowerCase().includes(searchLower)
		);
	});

	const selectedItem = $derived(allItems.find((item: any) => item.id === value));

	const displayValue = $derived(selectedItem?.value || placeholder);

	function handleSelect(itemId: string) {
		value = itemId === value ? '' : itemId;
		open = false;
		searchValue = '';
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			searchValue = '';
		}
	}
</script>

<div class="space-y-2">
	<Label>
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</Label>

	<Popover.Root bind:open onOpenChange={handleOpenChange}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class={cn('w-full justify-between h-10', !value && 'text-muted-foreground')}
					{disabled}
				>
					<span class="truncate">{displayValue}</span>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-full p-0" align="start">
			<Command.Root shouldFilter={false}>
				<Command.Input placeholder={searchPlaceholder} bind:value={searchValue} />
				<Command.Empty>
					{#if query.isLoading}
						Memuat...
					{:else}
						Tidak ada data ditemukan
					{/if}
				</Command.Empty>
				<Command.Group class="max-h-[300px] overflow-auto">
					{#each filteredItems as item (item.id)}
						<Command.Item value={item.value} onSelect={() => handleSelect(item.id)}>
							<Check class={cn('mr-2 h-4 w-4', value === item.id ? 'opacity-100' : 'opacity-0')} />
							{item.value}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	{#if errorMessage}
		<p class="text-sm text-red-500">{errorMessage}</p>
	{/if}
</div>
