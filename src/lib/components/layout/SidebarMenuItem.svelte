<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronRight } from 'lucide-svelte';
	import type { MenuItemWithState } from '$lib/config/menus/menu.types';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte';
	import SidebarMenuItem from './SidebarMenuItem.svelte';

	let { item = $bindable() }: { item: MenuItemWithState } = $props();

	const sidebar = useSidebar();
</script>

{#if item.children && item.children.length > 0}
	<Collapsible.Root open={item.isExpanded}>
		<Sidebar.MenuSubItem class="relative">
			<div class="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-sidebar-border"></div>
			<Collapsible.Trigger class="w-full">
				{#snippet child({ props })}
					<button
						{...props}
						class="ml-4 flex h-9 w-full items-center gap-3 rounded-sm px-3 py-2 outline-hidden transition-colors hover:bg-sidebar-accent focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
						onclick={() => (item.isExpanded = !item.isExpanded)}
					>
						{#if item.icon}
							{@const Icon = item.icon}
							<Icon class="h-4 w-4 shrink-0" />
						{/if}
						<span class="min-w-0 flex-1 break-words whitespace-normal leading-tight text-left">{item.name}</span>
						<ChevronRight
							class="h-4 w-4 shrink-0 transition-transform {item.isExpanded ? 'rotate-90' : ''}"
						/>
					</button>
				{/snippet}
			</Collapsible.Trigger>

			<Collapsible.Content>
				<!-- Nested MenuSub needs left border and specific margin -->
				<Sidebar.MenuSub class="relative mt-1 ml-4 border-l border-sidebar-border pr-0 pl-0">
					{#each item.children as child, i (child.slug)}
						<SidebarMenuItem bind:item={item.children[i]} />
					{/each}
				</Sidebar.MenuSub>
			</Collapsible.Content>
		</Sidebar.MenuSubItem>
	</Collapsible.Root>
{:else}
	<Sidebar.MenuSubItem class="relative">
		<div class="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-sidebar-border"></div>
		<Sidebar.MenuSubButton
			href={item.path_name}
			isActive={item.isActive}
			onclick={() => sidebar.setOpenMobile(false)}
			class="ml-4 gap-3 rounded-sm px-3 py-2 hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
		>
			{#if item.icon}
				{@const Icon = item.icon}
				<Icon class="h-4 w-4 shrink-0" />
			{/if}
			<span class="min-w-0 flex-1 break-words whitespace-normal leading-tight">{item.name}</span>
		</Sidebar.MenuSubButton>
	</Sidebar.MenuSubItem>
{/if}
