<script
	lang="ts"
	generics="TList, TData extends TList = TList, TEl extends HTMLElement = HTMLButtonElement"
>
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick, type Snippet } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	// import { cn } from '$lib/utils.js';

	interface Props {
		open?: boolean;
		getCurrent: (val: TData) => boolean;
		data: TList[];
		value: TData;
		onValueChange?: (curr: TList) => void;
		triggerRef?: TEl;
		getLabel?: (val: TList) => string;
		placeholder?: string;
		Trigger?: Snippet<[Record<string, unknown> & { enabled: MaybeGetter<boolean> }]>;
		onSearch?: (f: string) => void;
		enabled?: MaybeGetter<boolean>;
	}

	let {
		data,
		value: _val,
		getCurrent,
		onValueChange,
		open = $bindable(false),
		triggerRef = $bindable(null!),
		getLabel = () => 'Pilih Data',
		placeholder = 'Cari Data',
		Trigger,
		onSearch,
		enabled = true
	}: Props = $props();

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			{#if Trigger}
				{@render Trigger({ props, enabled })}
			{:else}
				<Button
					{...props}
					variant="ghost"
					class="w-full justify-between"
					role="combobox"
					aria-expanded={open}
					disabled={typeof enabled == 'function' ? enabled?.() == false : !enabled}
				>
					{getLabel(_val)}
					<ChevronsUpDownIcon class="opacity-50" />
				</Button>
			{/if}
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root shouldFilter={false}>
			<Command.Input
				{placeholder}
				oninput={(e) => onSearch?.((e.target as HTMLInputElement).value)}
			/>
			<Command.List>
				<Command.Empty>No data found.</Command.Empty>
				<Command.Group value="data">
					{#each data as d, i (i)}
						<Command.Item
							onSelect={() => {
								onValueChange?.(d);
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={getCurrent(d as TData) ? '' : 'text-transparent'} />
							{getLabel?.(d)}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
