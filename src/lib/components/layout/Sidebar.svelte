<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { ChevronRight, ChevronsUpDown } from 'lucide-svelte';
	import { getMenuContext } from '$lib/config/menus/menu-state.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import EstateSelector from './EstateSelector.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import SidebarMenuItem from './SidebarMenuItem.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte';

	const sidebar = useSidebar();

	let estateSelectorOpen = $state(false);
	// let estateSelectorRequired = $state(false);

	const authCtx = getUserContext();
	const menuCtx = getMenuContext();

	const computedMenus = $derived(menuCtx().items);
</script>

<Sidebar.Root class="border-none">
	<Sidebar.Header class="border-b border-sidebar-border px-3 py-3">
		<div class="flex items-center gap-2.5">
			<div class="rounded bg-white p-1.5">
				<Logo width={46} height={28} />
			</div>
			<div class="flex flex-col">
				<div class="text-lg font-semibold">Sigma</div>
				<div class="text-xs text-sidebar-foreground/70">Enterprise</div>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="py-2">
		{#each computedMenus as group (group.slug)}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="px-3 text-xs font-medium text-sidebar-foreground/50">
					{group.name}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.children as module (module.slug)}
							{#if module.children && module.children.length > 0}
								<Collapsible.Root open={module.isExpanded}>
									<Sidebar.MenuItem class="mb-1">
										<Collapsible.Trigger>
											{#snippet child({ props })}
												<Sidebar.MenuButton
													{...props}
													tooltipContent={module.name}
													class="w-full justify-start gap-3 rounded-sm px-3 py-2 hover:bg-sidebar-accent"
												>
													{#if module.icon}
														{@const Icon = module.icon}
														<Icon class="h-5 w-5 shrink-0" />
													{/if}
													<span class="min-w-0 flex-1 break-words whitespace-normal leading-tight text-left font-medium"
														>{module.name}</span
													>
													<ChevronRight
														class="h-4 w-4 shrink-0 transition-transform {module.isExpanded
															? 'rotate-90'
															: ''}"
													/>
												</Sidebar.MenuButton>
											{/snippet}
										</Collapsible.Trigger>

										<Collapsible.Content class="group-data-[collapsible=icon]:hidden">
											<Sidebar.MenuSub
												class="relative mt-1 ml-4 border-l border-sidebar-border pl-0"
											>
												{#each module.children as item, i (item.slug)}
													<SidebarMenuItem bind:item={module.children[i]} />
												{/each}
											</Sidebar.MenuSub>
										</Collapsible.Content>
									</Sidebar.MenuItem>
								</Collapsible.Root>
							{:else}
								<Sidebar.MenuItem class="mb-1">
									<Sidebar.MenuSubButton
										href={module.path_name}
										isActive={module.isActive}
									onclick={() => sidebar.setOpenMobile(false)}
										class="w-full justify-start gap-3 rounded-sm px-3 py-2 hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
									>
										{#if module.icon}
											{@const Icon = module.icon}
											<Icon class="h-5 w-5 shrink-0" />
										{/if}
										<span class="min-w-0 flex-1 break-words whitespace-normal leading-tight text-left font-medium">{module.name}</span>
									</Sidebar.MenuSubButton>
								</Sidebar.MenuItem>
							{/if}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>

	<Sidebar.Footer class="border-t border-sidebar-border">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					tooltipContent={authCtx.estate?.name || ''}
					class="w-full justify-start gap-3 px-4 py-6 hover:bg-sidebar-accent"
					onclick={() => (estateSelectorOpen = true)}
				>
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary"
					>
						{authCtx.estate?.short_name || ''}
					</div>
					<div class="flex flex-1 flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
						<span class="text-xs font-medium">{authCtx.estate?.name || ''}</span>
					</div>
					<ChevronsUpDown
						class="h-4 w-4 shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden"
					/>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>

<EstateSelector bind:open={estateSelectorOpen} />
