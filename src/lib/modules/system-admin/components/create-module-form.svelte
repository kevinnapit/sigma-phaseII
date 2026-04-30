<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { systemAdminKeys } from '../keys';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { CheckIcon, ChevronsUpDownIcon } from 'lucide-svelte';
	import { allMenus, getMenuIcon } from '$lib/config/menus/menu-icon';
	import { tick } from 'svelte';
	import { useContextListQuery } from '../queries/useContextQueries.svelte';
	import { debounce } from '$lib/shared/utils';

	type ModuleNode = Schemas['ModuleNode'];

	let {
		modules = [],
		open = $bindable(false),
		defaultParentId = 0
	}: { modules: ModuleNode[]; open?: boolean; defaultParentId?: number } = $props();

	const userCtx = getUserContext();
	const queryClient = useQueryClient();
	let loading = $state(false);

	let name = $state('');
	let slug = $state('');
	let path_name = $state('');
	let icon = $state('');
	let description = $state('');
	let sort_order = $state(0);
	let parent_id = $state<number | undefined>(undefined); // string for select, converted to number on submit
	let kind = $state<'group' | 'module' | 'category' | 'item'>('module');
	let is_active = $state(true);
	let selectedContext = $state<{ id: string; description: string | null }>();

	// Sync parent_id on open, reset fields on close
	$effect(() => {
		if (open) {
			parent_id = defaultParentId || undefined;
		} else {
			name = '';
			slug = '';
			path_name = '';
			icon = '';
			description = '';
			sort_order = 0;
			parent_id = undefined;
			kind = 'module';
			is_active = true;
			selectedContext = { id: '', description: null };
		}
	});

	// Flatten modules for the select dropdown
	function flattenModules(nodes: ModuleNode[], depth = 0): { id: number; name: string }[] {
		let flat: { id: number; name: string }[] = [];
		for (const node of nodes) {
			flat.push({ id: node.id, name: '-'.repeat(depth) + ' ' + node.name });
			if (node.children) {
				flat = flat.concat(flattenModules(node.children, depth + 1));
			}
		}
		return flat;
	}

	let flatModules = $derived(flattenModules(modules));
	const parentModule = $derived(flatModules.find((mod) => mod.id === parent_id));

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		try {
			const { error } = await userCtx.client().POST('/api/system-admin/modules/', {
				body: {
					name,
					slug,
					path_name,
					icon,
					description,
					sort_order: Number(sort_order),
					parent_id: parent_id ? Number(parent_id) : 0,
					kind,
					is_active: true,
					context_id: selectedContext?.id
				}
			});

			if (error) throw error;

			toast.success('Menu berhasil ditambahkan');
			await queryClient.invalidateQueries({ queryKey: systemAdminKeys.moduleTree() });
			toast.success('Module created successfully');
			open = false;
		} catch (err) {
			console.error(err);
			toast.error('Gagal menambahkan menu');
		} finally {
			loading = false;
		}
	}

	let searchIcon = $state('');
	const filteredIcons = $derived(
		Object.entries(allMenus).filter(([key]) => key.toLowerCase().includes(searchIcon.toLowerCase()))
	);

	let contextListParams = $state({
		page: 1,
		page_size: 100,
		search: ''
	});

	let contextTriggerRef = $state<HTMLButtonElement>(null!);
	let contextPopoverOpen = $state(false);

	const contextList = useContextListQuery(() => ({
		...contextListParams,
		enabled: contextPopoverOpen
	}));

	let triggerRef = $state<HTMLButtonElement>(null!);
	let popoverOpen = $state(false);
	function closeAndFocusTrigger() {
		popoverOpen = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	const textDebouncer = debounce((text: string) => {
		contextListParams.search = text;
	}, 200);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-5xl sm:min-w-max">
		<Dialog.Header>
			<Dialog.Title>Tambah Menu</Dialog.Title>
			<Dialog.Description>Tambahkan data menu.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit}>
			<div class="grid max-h-[70svh] grid-cols-1 gap-4 overflow-y-auto px-1 py-4 sm:grid-cols-2">
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1 sm:col-span-1">
					<Label for="edit_parent_id" class="text-left">Parent Menu</Label>
					<div class="">
						<Select.Root
							type="single"
							onValueChange={(val) =>
								Number(val) == 0 || isNaN(Number(val))
									? (parent_id = 0)
									: (parent_id = Number(val))}
						>
							<Select.Trigger class="w-full">{parentModule?.name || 'No Parent'}</Select.Trigger>
							<Select.Content>
								{#each flatModules as mod (mod.id)}
									<Select.Item value={String(mod.id)}>{mod.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1 sm:col-span-1">
					<Label for="edit_kind" class="text-right">Jenis Menu</Label>
					<div class="">
						<Select.Root
							type="single"
							required
							value={kind}
							onValueChange={(val) => (kind = val as 'module' | 'group' | 'category' | 'item')}
						>
							<Select.Trigger class="w-full"
								>{kind?.charAt(0).toUpperCase() + kind?.slice(1) || 'Pilih Jenis'}</Select.Trigger
							>
							<Select.Content>
								<Select.Item value="group">Group</Select.Item>
								<Select.Item value="module">Module</Select.Item>
								<Select.Item value="category">Category</Select.Item>
								<Select.Item value="item">Item</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1 sm:col-span-1">
					<Label for="edit_name" class="text-right">Nama</Label>
					<Input id="edit_name" bind:value={name} class="" required />
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1 sm:col-span-1">
					<Label for="edit_icon" class="text-right">Icon</Label>
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger bind:ref={triggerRef}>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="w-full justify-between"
									role="combobox"
									aria-expanded={popoverOpen}
								>
									<span class="inline-flex items-center gap-2">
										{#if icon}
											{@const SelectedIcon = getMenuIcon(icon)}
											<SelectedIcon class="h-5 w-5" />
										{/if}
										{icon || 'pilih icon...'}
									</span>
									<ChevronsUpDownIcon class="opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-full p-0">
							<Command.Root shouldFilter={false}>
								<Command.Input placeholder="Cari icon..." bind:value={searchIcon} />
								<Command.List>
									<Command.Empty>Tidak ada icon.</Command.Empty>
									<Command.Group value="icons">
										{#if filteredIcons?.length}
											{#each filteredIcons as [iconName, MenuIcon] (iconName)}
												<Command.Item
													value={iconName}
													onSelect={() => {
														icon = iconName;
														closeAndFocusTrigger();
													}}
												>
													<CheckIcon class={icon !== iconName ? 'text-transparent' : ''} />
													<MenuIcon />
													{iconName}
												</Command.Item>
											{/each}
										{/if}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1">
					<Label for="edit_slug" class="text-right">Slug</Label>
					<Input id="edit_slug" bind:value={slug} class="" required />
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1">
					<Label for="edit_path_name" class="text-right">Pathname</Label>
					<Input id="edit_path_name" bind:value={path_name} class="" required />
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1">
					<Label for="edit_description" class="text-right">Deskripsi</Label>
					<Textarea id="edit_description" bind:value={description} class="h-full" rows={20} />
				</div>
				<div class="grid grid-flow-row grid-cols-1 items-center gap-1">
					<Label for="edit_sort_order" class="text-right">Nomor Pengurutan</Label>
					<Input id="edit_sort_order" type="number" bind:value={sort_order} class="" />
				</div>
				<div class="grid grid-flow-row grid-cols-1 items-center gap-1">
					<Label for="edit_is_active" class="text-right">Aktif ?</Label>
					<div class="">
						<input
							id="edit_is_active"
							type="checkbox"
							bind:checked={is_active}
							class="h-4 w-4 rounded border-input"
						/>
					</div>
				</div>
				<div class="col-span-2 grid grid-flow-row grid-cols-1 items-center gap-1 sm:col-span-2">
					<Label for="edit_context_id" class="text-right">Context</Label>
					<!-- <Select.Root type="single" name="context" value={selectedContext?.id}>
						<Select.Trigger class="w-full">
							{selectedContext?.description || 'pilih context...'}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Input
									class="w-full p-2"
									placeholder="Cari context..."
									value={contextListParams.search}
									oninput={(event) => textDebouncer((event.target as HTMLInputElement).value)}
								/>
								<Select.Label>Context</Select.Label>
								{#each contextList.data?.data as ctx (ctx.id)}
									<Select.Item value={ctx.id} onclick={() => (selectedContext = ctx)}>
										{ctx.description}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root> -->
					<Popover.Root bind:open={contextPopoverOpen}>
						<Popover.Trigger bind:ref={contextTriggerRef}>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="w-full justify-between"
									role="combobox"
									aria-expanded={contextPopoverOpen}
								>
									<span class="inline-flex items-center gap-2">
										{selectedContext?.description || 'pilih context...'}
									</span>
									<ChevronsUpDownIcon class="opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-full p-0">
							<Command.Root value="contexts" shouldFilter={false}>
								<Command.Input
									placeholder="Cari context..."
									value={contextListParams.search}
									oninput={(event) => textDebouncer((event.target as HTMLInputElement).value)}
								/>
								<Command.List>
									<Command.Empty>Tidak ada context.</Command.Empty>
									{#if contextList.data?.data?.length}
										<Command.Group value="contexts">
											{#each contextList.data?.data as ctx (ctx.id)}
												<Command.Item
													value={ctx.id}
													onSelect={() => {
														selectedContext = ctx;
														contextPopoverOpen = false;
														tick().then(() => {
															contextTriggerRef.focus();
														});
													}}
												>
													<CheckIcon
														class={selectedContext?.id !== ctx.id ? 'text-transparent' : ''}
													/>
													{ctx?.description}
												</Command.Item>
											{/each}
										</Command.Group>
									{/if}
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			</div>

			<Dialog.Footer class="col-span-2 flex justify-end">
				<Button type="submit" disabled={loading}>
					{loading ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
