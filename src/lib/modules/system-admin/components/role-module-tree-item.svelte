<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Switch } from '$lib/components/ui/switch';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { ChevronRight, Box } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import RoleModuleTreeItem from './role-module-tree-item.svelte';
	import Guard from '$lib/components/shared/guard.svelte';

	type ModuleNode = Schemas['ModuleNode'];
	type PermissionData = Schemas['PermissionData'];

	let {
		module,
		attachedModuleIds,
		attachedPermissionIds,
		modulePermissionsMap,
		onToggleModule,
		onTogglePermission,
		disabled
	}: {
		module: ModuleNode;
		attachedModuleIds: Set<number>;
		attachedPermissionIds: Set<number>;
		modulePermissionsMap: Map<number, PermissionData[]>;
		onToggleModule: (id: number, attached: boolean) => void;
		onTogglePermission: (id: number, attached: boolean) => void;
		disabled: boolean;
	} = $props();

	let isOpen = $state(false);
	let isAttached = $derived(attachedModuleIds.has(module.id));
	let permissions = $derived((modulePermissionsMap.get(module.id) || []) as PermissionData[]);

	function handleModuleSwitch(checked: boolean) {
		onToggleModule(module.id, checked);
	}

	function handlePermissionCheck(permissionId: number, checked: boolean) {
		onTogglePermission(permissionId, checked);
	}

	function getPermissionKindConfig(kind?: number | null) {
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
</script>

<Collapsible.Root bind:open={isOpen} class="space-y-1">
	<div class="flex items-center space-x-2 rounded-md border px-4 py-2 hover:bg-muted/50">
		{#if (module.children && module.children.length > 0) || permissions.length > 0}
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted',
							isOpen && 'rotate-90'
						)}
					>
						<ChevronRight class="h-4 w-4" />
						<span class="sr-only">Toggle</span>
					</button>
				{/snippet}
			</Collapsible.Trigger>
		{:else}
			<div class="h-6 w-6"></div>
		{/if}

		<Box class="h-4 w-4 text-muted-foreground" />
		<div class="flex-1 text-sm font-medium">
			{module.name}
		</div>

		<Guard permissions="administrasi.sistem-admin.roles.update">
			<Switch checked={isAttached} onCheckedChange={handleModuleSwitch} {disabled} />
		</Guard>
	</div>

	<Collapsible.Content class="space-y-1 pl-8">
		<!-- Render Permissions for this module -->
		{#if permissions.length > 0}
			<div class="mb-2 ml-3 space-y-2 border-l py-2 pl-2">
				<div class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Hak Akses
				</div>
				{#each permissions as perm (perm.id)}
					{@const kindConfig = getPermissionKindConfig(perm.action_kind)}
					<div class="flex items-center space-x-2">
						<Guard permissions="administrasi.sistem-admin.roles.update">
							<Checkbox
								id={`perm-${perm.id}`}
								{disabled}
								checked={attachedPermissionIds.has(perm.id)}
								onCheckedChange={(v) => handlePermissionCheck(perm.id, !!v)}
							/>
						</Guard>
						<div class="grid gap-1.5 leading-none">
							<div class="flex items-center gap-2">
								<Label
									for={`perm-${perm.id}`}
									class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{perm.name}
								</Label>
								{#if kindConfig}
									<Badge variant={kindConfig.variant} class="h-5 px-1 py-0 text-[10px]"
										>{kindConfig.label}</Badge
									>
								{/if}
							</div>
							{#if perm.description}
								<p class="text-xs text-muted-foreground">{perm.description}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Render Child Modules -->
		{#if module.children}
			{#each module.children as child (child.id)}
				<RoleModuleTreeItem
					{disabled}
					module={child}
					{attachedModuleIds}
					{attachedPermissionIds}
					{modulePermissionsMap}
					{onToggleModule}
					{onTogglePermission}
				/>
			{/each}
		{/if}
	</Collapsible.Content>
</Collapsible.Root>
