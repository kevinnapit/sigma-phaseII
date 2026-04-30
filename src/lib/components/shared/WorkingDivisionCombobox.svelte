<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { useDivisionListQuery } from '$lib/modules/functional-admin/queries/useAdministrativeUnitQueries.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

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
		label = 'Divisi Kerja',
		placeholder = 'Pilih divisi kerja...',
		disabled = false,
		required = false,
		error
	}: Props = $props();

	const userCtx = getUserContext();
	const estateId = $derived(userCtx.estate?.id);

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

	const query = useDivisionListQuery(() => ({
		page: 1,
		size: 100,
		search: debouncedSearch || undefined,
		parent_administrative_unit_id: estateId
	}));

	const items = $derived(query?.data?.items || []);
	const selectedItem = $derived(items.find((item: any) => item.id === value));
	const displayValue = $derived(() => {
		if (!selectedItem) return placeholder;
		return `${selectedItem.code} - ${selectedItem.name}`;
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
				<Command.Input placeholder="Cari divisi kerja..." bind:value={searchValue} />
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
