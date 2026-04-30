<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { systemAdminKeys } from '../keys';
	import { useQueryClient } from '@tanstack/svelte-query';
	import * as Select from '$lib/components/ui/select';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { CheckIcon, ChevronsUpDownIcon } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { getContextEntities } from '../queries/useContextQueries.svelte';

	type ModuleNodeWithContext = Schemas['ModuleNodeWithContext'];
	type PermissionData = Schemas['PermissionDataWithEntity'] & { kind?: number };
	const userCtx = getUserContext();

	let {
		modules = [],
		open = $bindable(false),
		permission = null,
		currentModule = null
	}: {
		modules: ModuleNodeWithContext[];
		open?: boolean;
		permission: PermissionData | null;
		currentModule: ModuleNodeWithContext | null;
	} = $props();

	let loading = $state(false);

	let name = $state('');
	let slug = $state('');
	let description = $state('');
	let moduleId = $state('');
	let selectedEntity = $state<{ id: string; name: string; description?: string } | null>(null);

	const entityQuery = getContextEntities(() => ({
		context_id: currentModule?.context_id
	}));

	const actionKinds = {
		1: 'view',
		2: 'create',
		3: 'update',
		4: 'delete'
	} as const;

	type ActionKind = keyof typeof actionKinds;
	let actionKind = $state<ActionKind>(1);

	const queryClient = useQueryClient();

	$effect(() => {
		if (open && permission && currentModule) {
			name = permission.name;
			slug = permission.slug;
			description = permission.description || '';
			moduleId = String(currentModule.id);
			if (permission.entity) selectedEntity = permission.entity;
			// @ts-expect-error adasd
			actionKind = permission.action_kind ?? permission.kind ?? (1 as ActionKind);
		} else if (!open) {
			selectedEntity = null;
			name = '';
			slug = '';
			description = '';
			moduleId = '';
			actionKind = 1;
			selectedEntity = null;
		}
	});

	// $effect(() => {
	// 	if (permission?.entity_id && entitiesData.length > 0) {
	// 		selectedEntity = entitiesData.find((e) => e.id === permission.entity_id) || null;
	// 	}
	// });

	function flattenModules(
		nodes: ModuleNodeWithContext[],
		depth = 0
	): { id: number; name: string }[] {
		let flat: { id: number; name: string }[] = [];
		for (const node of nodes) {
			flat.push({ id: node.id, name: '-'.repeat(depth) + ' ' + node.name });
			if (node.children) {
				flat = flat.concat(flattenModules(node.children, depth + 1));
			}
		}
		return flat;
	}

	// function getAllModulesFlat(nodes: ModuleNodeWithContext[]): ModuleNodeWithContext[] {
	// 	let flat: ModuleNodeWithContext[] = [];
	// 	for (const node of nodes) {
	// 		flat.push(node);
	// 		if (node.children) {
	// 			flat = flat.concat(getAllModulesFlat(node.children));
	// 		}
	// 	}
	// 	return flat;
	// }

	let flatModules = $derived(flattenModules(modules));
	const selectedModule = $derived(flatModules.find((val) => val.id === Number(moduleId)));

	// async function fetchEntities(contextId: string) {
	// 	if (!contextId) {
	// 		entitiesData = [];
	// 		return;
	// 	}

	// 	entitiesLoading = true;
	// 	try {
	// 		const { data, error } = await userCtx
	// 			.client()
	// 			.GET('/api/system-admin/contextfind/{context_id}/entities', {
	// 				params: { path: { context_id: contextId } },
	// 				baseUrl: env.PUBLIC_T2_API_URL
	// 			});

	// 		if (error) throw error;
	// 		entitiesData = data?.entities || [];
	// 	} catch (err) {
	// 		console.error('Failed to fetch entities:', err);
	// 		entitiesData = [];
	// 	} finally {
	// 		entitiesLoading = false;
	// 	}
	// }

	// $effect(() => {
	// 	if (moduleId) {
	// 		const allModulesFlat = getAllModulesFlat(modules);
	// 		const module = allModulesFlat.find((m) => m.id === Number(moduleId));
	// 		if (module?.context_id) {
	// 			fetchEntities(module.context_id);
	// 		} else {
	// 			entitiesData = [];
	// 			selectedEntity = null;
	// 		}
	// 	}
	// });

	let entityPopoverOpen = $state(false);
	let entityTriggerRef = $state<HTMLButtonElement>(null!);

	const isEntityFieldEnabled = $derived.by(() => !!currentModule?.context_id);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!permission) return;
		if (!moduleId) {
			toast.error('Harap pilih menu terlebih dahulu');
			return;
		}

		loading = true;
		try {
			const { error } = await userCtx.client().PUT('/api/system-admin/permissions/{id}', {
				params: { path: { id: permission.id } },
				body: {
					name,
					slug,
					description,
					module_id: Number(moduleId),
					action_kind: Number(actionKind),
					entity_id: selectedEntity?.id || undefined
				}
			});

			if (error) throw error;

			toast.success('Berhasil memperbarui hak akses');
			await queryClient.invalidateQueries({ queryKey: systemAdminKeys.permissionsAll() });
			open = false;
		} catch (err) {
			console.error(err);
			toast.error('gagal memperbarui hak akses');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-2xl sm:min-w-max">
		<Dialog.Header>
			<Dialog.Title>Perbarui Izin/Hak akses baru</Dialog.Title>
			<Dialog.Description>perbarui izin/hak akses baru untuk menu.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="w-full">
			<div class="grid max-h-[60svh] w-full gap-4 overflow-y-auto py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="module_id" class="text-right">Menu</Label>
					<div class="col-span-3 w-full">
						<Select.Root
							name="module_id"
							type="single"
							value={moduleId}
							onValueChange={(val) => {
								moduleId = val;
							}}
						>
							<Select.Trigger class="w-full" disabled={true}>
								{selectedModule?.name ?? 'Pilih Menu'}
							</Select.Trigger>
							<Select.Content>
								{#each flatModules as mod (mod.id)}
									<Select.Item value={String(mod.id)}>{mod.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Nama</Label>
					<Input id="name" bind:value={name} class="col-span-3" required />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="slug" class="text-right">Slug</Label>
					<Input id="slug" bind:value={slug} class="col-span-3" required />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="slug" class="text-right">Jenis</Label>
					<div class="col-span-3">
						<Select.Root
							name="actionKind"
							required
							type="single"
							value={actionKind.toString()}
							onValueChange={(val) => {
								actionKind = Number(val) as ActionKind;
							}}
						>
							<Select.Trigger class="w-full">
								{actionKinds?.[actionKind] ?? 'Pilih Jenis'}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(actionKinds) as [code, name] (name)}
									<Select.Item value={String(code)}>{name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="description" class="text-right">Deskripsi</Label>
					<Textarea id="description" bind:value={description} class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="entities" class="text-right">Entities</Label>
					<div class="col-span-3 w-full">
						<Popover.Root bind:open={entityPopoverOpen}>
							<Popover.Trigger bind:ref={entityTriggerRef} disabled={!isEntityFieldEnabled}>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="outline"
										class="w-full justify-between"
										role="combobox"
										aria-expanded={entityPopoverOpen}
										disabled={!isEntityFieldEnabled}
									>
										<span class="inline-flex items-center gap-2">
											{#if entityQuery.isLoading}
												Loading entities...
											{:else if !isEntityFieldEnabled}
												Pilih menu dengan context terlebih dahulu
											{:else}
												{selectedEntity?.name || 'Pilih entity...'}
											{/if}
										</span>
										<ChevronsUpDownIcon class="opacity-50" />
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-full p-0">
								<Command.Root value="entities" shouldFilter={false}>
									<Command.Input placeholder="Cari entity..." />
									<Command.List>
										<Command.Empty>Tidak ada entity.</Command.Empty>
										{#if entityQuery.data?.entities?.length}
											<Command.Group value="entities">
												{#each entityQuery.data?.entities as entity (entity.id)}
													<Command.Item
														value={entity.id}
														onSelect={() => {
															selectedEntity = {
																id: entity.id,
																name: entity.entity_name!,
																description: entity.description!
															};
															entityPopoverOpen = false;
															tick().then(() => {
																entityTriggerRef.focus();
															});
														}}
													>
														<CheckIcon
															class={selectedEntity?.id !== entity.id ? 'text-transparent' : ''}
														/>
														<div class="flex flex-col">
															<span class="font-medium">{entity.entity_name}</span>
															{#if entity.description}
																<span class="text-sm text-muted-foreground"
																	>{entity.description}</span
																>
															{/if}
														</div>
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
			</div>
			<Dialog.Footer>
				<Button type="submit" disabled={loading}>
					{loading ? 'Memperbarui...' : 'Perbarui Akses'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- <Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Permission</Dialog.Title>
			<Dialog.Description>Update the permission details.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="edit_perm_module_id" class="text-right">Module</Label>
				<div class="col-span-3">
					<select
						id="edit_perm_module_id"
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						bind:value={moduleId}
						required
					>
						<option value="" disabled>Select a module</option>
						{#each flatModules as mod (mod.id)}
							<option value={String(mod.id)}>{mod.name}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="edit_perm_name" class="text-right">Name</Label>
				<Input id="edit_perm_name" bind:value={name} class="col-span-3" required />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="edit_perm_slug" class="text-right">Slug</Label>
				<Input id="edit_perm_slug" bind:value={slug} class="col-span-3" required />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="edit_perm_kind" class="text-right">Kind</Label>
				<Input
					id="edit_perm_kind"
					type="number"
					bind:value={actionKind}
					class="col-span-3"
					required
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="edit_perm_description" class="text-right">Description</Label>
				<Input id="edit_perm_description" bind:value={description} class="col-span-3" />
			</div>
			<Dialog.Footer>
				<Button type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root> -->
