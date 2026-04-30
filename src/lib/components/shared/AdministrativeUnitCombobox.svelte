<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { useAdministrativeUnitListQuery } from '$lib/modules/functional-admin/queries/useAdministrativeUnitQueries.svelte';

	interface Props {
		value: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
	}

	let {
		value = $bindable(''),
		label = 'Unit Administratif',
		placeholder = 'Pilih unit administratif...',
		disabled = false,
		required = false,
		error
	}: Props = $props();

	let open = $state(false);
	let searchValue = $state('');
	let debouncedSearch = $state('');

	$effect(() => {
		searchValue;
		const timer = setTimeout(() => {
			debouncedSearch = searchValue;
		}, 300);
		return () => clearTimeout(timer);
	});

	const query = useAdministrativeUnitListQuery(() => ({
		page_size: 20,
		name: debouncedSearch || undefined
	}));

	const items = $derived(query?.data?.data || []);
	const selectedItem = $derived(items.find((item: any) => item.id === value));
	const displayValue = $derived(() => {
		if (!selectedItem) return placeholder;
		return selectedItem.name;
	});

	function handleSelect(itemId: string) {
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
						error && 'border-destructive'
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
				<Command.Input placeholder="Cari unit administratif..." bind:value={searchValue} />
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
					{:else if items.length === 0}
						<Command.Item disabled>Tidak ada data</Command.Item>
					{:else}
						{#each items as item (item.id)}
							<Command.Item value={item.id} onSelect={() => handleSelect(item.id)}>
								<Check
									class={cn('mr-2 h-4 w-4', value === item.id ? 'opacity-100' : 'opacity-0')}
								/>
								<div class="flex flex-col">
									<span>{item.name}</span>
									{#if item.code}
										<span class="text-xs text-muted-foreground">{item.code}</span>
									{/if}
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
