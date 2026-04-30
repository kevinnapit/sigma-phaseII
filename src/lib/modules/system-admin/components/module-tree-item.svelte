<script lang="ts">
	import {
		ChevronRight,
		File,
		Folder,
		Plus,
		Key,
		Pencil,
		ChevronUp,
		ChevronDown,
		Trash2,
		CircleCheck,
		CircleX
	} from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import ModuleTreeItem from './module-tree-item.svelte';
	import Guard from '$lib/components/shared/guard.svelte';

	type ModuleNodeWithContext = Schemas['ModuleNodeWithContext'];
	type PermissionData = Schemas['PermissionDataWithEntity'];
	type Props = {
		module: ModuleNodeWithContext;
		modulePermissionsMap?: Map<number, PermissionData[]>;
		onCreateModule?: (parent_id: number) => void;
		onCreatePermission?: (module: ModuleNodeWithContext) => void;
		onEditModule?: (module: ModuleNodeWithContext) => void;
		onEditPermission?: (permission: PermissionData, module: ModuleNodeWithContext) => void;
		onDeletePermission?: (permission: PermissionData) => void;
		onMoveUp?: (module: ModuleNodeWithContext) => void;
		onMoveDown?: (module: ModuleNodeWithContext) => void;
		onDeleteModule?: (module: ModuleNodeWithContext) => void;
	};

	let {
		module,
		modulePermissionsMap,
		onCreateModule,
		onCreatePermission,
		onEditModule,
		onEditPermission,
		onDeletePermission,
		onMoveUp,
		onMoveDown,
		onDeleteModule
	}: Props = $props();

	let isOpen = $state(false);
	let permissions = $derived<PermissionData[]>(modulePermissionsMap?.get(module.id) || []);

	function getPermissionKindConfig(kind?: number) {
		switch (kind) {
			case 1:
				return { label: 'Lihat', variant: 'secondary' as const };
			case 2:
				return { label: 'Tambah', variant: 'default' as const };
			case 3:
				return { label: 'Ubah', variant: 'outline' as const };
			case 4:
				return { label: 'Hapus', variant: 'destructive' as const };
			default:
				return null;
		}
	}

	function handleCreateModule(e: Event) {
		e.stopPropagation();
		onCreateModule?.(module.id);
	}

	function handleCreatePermission(e: Event) {
		e.stopPropagation();
		onCreatePermission?.(module);
	}

	function handleEditModule(e: Event) {
		e.stopPropagation();
		onEditModule?.(module);
	}

	function handleMoveUp(e: Event) {
		e.stopPropagation();
		onMoveUp?.(module);
	}

	function handleMoveDown(e: Event) {
		e.stopPropagation();
		onMoveDown?.(module);
	}

	function handleDeleteModule(e: Event) {
		e.stopPropagation();
		onDeleteModule?.(module);
	}
</script>

{#if (module.children && module.children.length > 0) || permissions.length > 0}
	<Collapsible.Root bind:open={isOpen} class="w-full space-y-2">
		<Collapsible.Trigger>
			{#snippet child({ props })}
				<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
				{@const isActive = (module as any).is_active}
				<div
					class="group flex items-center justify-between space-x-4 rounded-md px-4 py-2 transition-colors hover:bg-muted/50"
					{...props}
				>
					<h4 class="flex items-center gap-2 text-sm font-semibold capitalize">
						<Folder class="h-4 w-4" />
						{module.name}
						{#if isActive}
							<CircleCheck class="size-3.5 text-green-500" />
						{:else}
							<CircleX class="size-3.5 text-destructive" />
						{/if}
					</h4>
					<div class="flex items-center gap-1">
						<Guard permissions="administrasi.sistem-admin.modules.update">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
								onclick={handleMoveUp}
								title="Move Up"
							>
								<ChevronUp class="h-3 w-3" />
							</Button>
						</Guard>
						<Guard permissions="administrasi.sistem-admin.modules.update">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
								onclick={handleMoveDown}
								title="Move Down"
							>
								<ChevronDown class="h-3 w-3" />
							</Button>
						</Guard>

						<Guard permissions="administrasi.sistem-admin.modules.create">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
								onclick={handleCreateModule}
								title="Add Sub-module"
							>
								<Plus class="h-3 w-3" />
							</Button>
						</Guard>
						<Guard permissions="administrasi.sistem-admin.permissions.create">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
								onclick={handleCreatePermission}
								title="Add Permission"
							>
								<Key class="h-3 w-3" />
							</Button>
						</Guard>

						<Guard permissions="administrasi.sistem-admin.modules.update">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
								onclick={handleEditModule}
								title="Edit Module"
							>
								<Pencil class="h-3 w-3" />
							</Button>
						</Guard>
						<Guard permissions="administrasi.sistem-admin.modules.delete">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
								onclick={handleDeleteModule}
								title="Delete Module"
							>
								<Trash2 class="h-3 w-3 text-destructive" />
							</Button>
						</Guard>
						<button
							class="rounded-sm p-1 hover:bg-muted"
							onclick={(e) => {
								e.stopPropagation();
								isOpen = !isOpen;
							}}
							type="button"
						>
							<ChevronRight
								class="h-4 w-4 transition-transform duration-200 {isOpen ? 'rotate-90' : ''}"
							/>
							<span class="sr-only">Toggle</span>
						</button>
					</div>
				</div>
			{/snippet}
		</Collapsible.Trigger>
		<Collapsible.Content class="space-y-2 pl-6">
			<!-- Render Permissions -->
			<Guard permissions="administrasi.sistem-admin.permissions.view">
				{#if permissions.length > 0}
					<div class="mb-2 ml-1 space-y-2 border-l py-2 pl-4">
						<div class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
							Hak Akses
						</div>
						{#each permissions as perm, i (perm.id.toString() + perm.name + i.toString())}
							{@const kindConfig = getPermissionKindConfig(perm.action_kind ?? 1)}
							<div
								class="group/perm flex flex-col items-start gap-1 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30"
							>
								<div class="flex items-center gap-2">
									<span class="text-sm leading-relaxed font-normal">{perm.name}</span>
									{#if kindConfig}
										<Badge variant={kindConfig.variant} class="h-5 px-1 py-0 text-[10px]"
											>{kindConfig.label}</Badge
										>
									{/if}
									<Guard permissions="administrasi.sistem-admin.permissions.update">
										<Button
											variant="ghost"
											size="icon"
											class="h-5 w-5 opacity-100 transition-opacity group-hover/perm:opacity-100 md:opacity-0"
											onclick={() => onEditPermission?.(perm, module)}
											title="Edit Permission"
										>
											<Pencil class="h-3 w-3" />
										</Button>
									</Guard>
									<Guard permissions="administrasi.sistem-admin.permissions.delete">
										<Button
											variant="ghost"
											size="icon"
											class="h-5 w-5 text-destructive opacity-100 transition-opacity group-hover/perm:opacity-100 hover:text-destructive md:opacity-0"
											onclick={() => onDeletePermission?.(perm)}
											title="Delete Permission"
										>
											<Trash2 class="h-3 w-3" />
										</Button>
									</Guard>
								</div>
								{#if perm.description}
									<p class="text-xs text-muted-foreground">{perm.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</Guard>

			{#each module.children || [] as child (child.id)}
				<ModuleTreeItem
					module={child}
					{modulePermissionsMap}
					{onCreateModule}
					{onCreatePermission}
					{onEditModule}
					{onEditPermission}
					{onDeletePermission}
					{onDeleteModule}
					{onMoveUp}
					{onMoveDown}
				/>
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>
{:else}
	<div
		class="group flex items-center justify-between rounded-md px-4 py-2 transition-colors hover:bg-muted/50"
	>
		<div class="flex items-center gap-2">
			<File class="h-4 w-4 text-muted-foreground" />
			<span class="text-sm">{module.name}</span>
		</div>
		<div class="flex items-center gap-1">
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
				onclick={handleMoveUp}
				title="Move Up"
			>
				<ChevronUp class="h-3 w-3" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
				onclick={handleMoveDown}
				title="Move Down"
			>
				<ChevronDown class="h-3 w-3" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
				onclick={handleCreateModule}
				title="Add Sub-module"
			>
				<Plus class="h-3 w-3" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
				onclick={handleCreatePermission}
				title="Add Permission"
			>
				<Key class="h-3 w-3" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
				onclick={handleEditModule}
				title="Edit Module"
			>
				<Pencil class="h-3 w-3" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
				onclick={handleDeleteModule}
				title="Delete Module"
			>
				<Trash2 class="h-3 w-3 text-destructive" />
			</Button>
		</div>
	</div>
{/if}
