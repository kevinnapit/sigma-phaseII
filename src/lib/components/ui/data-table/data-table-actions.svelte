<script lang="ts" generics="TId">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Icon, MoreHorizontal, Pencil, Trash2 } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

	type ActionProps = {
		label: string;
		icon: typeof Icon;
		fn: (id: TId) => MaybePromise<unknown>;
		guard?: (id: TId) => boolean;
	} & Omit<ComponentProps<typeof DropdownMenu.Item>, 'onclick'>;

	type HrefProps = {
		label: string;
		icon: typeof Icon;
		href: string;
		guard?: (id: TId) => boolean;
	} & Omit<ComponentProps<typeof DropdownMenu.Item>, 'onclick'>;

	type Props = {
		id: TId;
		label?: string;
		onUpdate?: (id: TId) => MaybePromise<unknown>;
		onDelete?: (id: TId) => MaybePromise<unknown>;
		updateLabel?: string;
		deleteLabel?: string;
		additionalActions?: ActionProps[] | HrefProps[];
	};

	let { id, label, onUpdate, onDelete, updateLabel, deleteLabel, additionalActions }: Props =
		$props();

	const actuallyHasActions = $derived(
		typeof onDelete == 'function' ||
			typeof onUpdate == 'function' ||
			((additionalActions?.length ?? 0) > 0 &&
				additionalActions?.some((action) => {
					if ('guard' in action) return action.guard?.(id);
					else if ('href' in action) return true;
					else if ('fn' in action) return true;
					return false;
				}))
	);
</script>

{#if actuallyHasActions}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" class="h-8 w-8 p-0">
					<span class="sr-only">Open menu</span>
					<MoreHorizontal class="h-4 w-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#if label}
				<DropdownMenu.Label>{label}</DropdownMenu.Label>
				<DropdownMenu.Separator />
			{/if}
			{#if onUpdate}
				<DropdownMenu.Item onclick={() => onUpdate(id)}>
					<Pencil />
					{updateLabel ?? 'Ubah'}
				</DropdownMenu.Item>
			{/if}
			{#if onDelete}
				<DropdownMenu.Item onclick={() => onDelete(id)} variant="destructive">
					<Trash2 />
					{deleteLabel ?? 'Hapus'}
				</DropdownMenu.Item>
			{/if}
			{#if additionalActions?.length}
				{#each additionalActions as action, i (i)}
					{#if action}
						{@const passed = typeof action.guard == 'function' ? action.guard(id) : true}
						{#if passed}
							{#if 'href' in action && action.href}
								<DropdownMenu.Item {...action}>
									{#snippet child({ props })}
										{@const ActionIcon = action.icon}
										<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
										<a {...props} href={action.href}>
											<ActionIcon />
											{action.label}
										</a>
									{/snippet}
								</DropdownMenu.Item>
							{:else if 'fn' in action && action.fn}
								<DropdownMenu.Item {...action} onclick={() => action.fn(id)}>
									{@const ActionIcon = action.icon}
									<ActionIcon />
									{action.label}
								</DropdownMenu.Item>
							{/if}
						{/if}
					{/if}
				{/each}
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
