<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Box, ChevronRight } from 'lucide-svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';

	type ModuleNode = Schemas['ModuleNode'];

	let {
		open = $bindable(false),
		role,
		attachedModule,
		attachedPermissions
	}: {
		open: boolean;
		role: Schemas['RoleResponse'] | null;
		attachedModule: ModuleNode[] | null;
		attachedPermissions: Map<number, Schemas['PermissionData'][]>;
	} = $props();

	function getPermissionKindConfig(kind?: number | null) {
		switch (kind) {
			case 1:
				return { label: 'View', variant: 'secondary' as const };
			case 2:
				return { label: 'Create', variant: 'default' as const };
			case 3:
				return { label: 'Update', variant: 'outline' as const };
			case 4:
				return { label: 'Delete', variant: 'destructive' as const };
			default:
				return null;
		}
	}
	const getPermission = (mId: number) => attachedPermissions.get(mId) || [];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full max-w-xl xl:min-w-4xl">
		<Dialog.Header>
			<Dialog.Title>Hak Akses: {role?.name}</Dialog.Title>
			<Dialog.Description>
				Lihat akses modul dan permission untuk peran ini (Read Only).
			</Dialog.Description>
		</Dialog.Header>

		{#if !role || !attachedModule?.length}
			<div class="flex items-center justify-center p-8">
				<p class="text-muted-foreground">Tidak Ada Menu atau Hak Akses</p>
			</div>
		{:else if attachedModule?.length > 0 || attachedPermissions.size > 0}
			<div class="max-h-[80svh] overflow-auto">
				{#each attachedModule as module (module.id)}
					{@const permissions = getPermission(module.id)}
					<div class="rounded-md border bg-muted/10 p-2 opacity-80">
						{@render ModuleTreeItem({
							module,
							permissions,
							getPermission
						})}
					</div>
				{/each}
			</div>
		{/if}
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Tutup</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#snippet ModuleTreeItem({
	module,
	permissions,
	getPermission
}: {
	module: ModuleNode;
	permissions: Schemas['PermissionData'][];
	getPermission: (mId: number) => Schemas['PermissionData'][];
})}
	<Collapsible.Root class="space-y-1">
		<div
			class="flex max-h-[50svh] items-center space-x-2 overflow-auto rounded-md border px-4 py-2 hover:bg-muted/50"
		>
			{#if module.children?.length || permissions.length > 0}
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							class="
                                        flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted"
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
		</div>

		<Collapsible.Content class="space-y-2 pl-8">
			{#if permissions.length > 0}
				<div class="mt-1 mb-2 ml-3 space-y-2 border-l py-2 pl-2">
					<div class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Permissions
					</div>
					{#each permissions as perm (perm.id)}
						{@const kindConfig = getPermissionKindConfig(perm.action_kind)}
						<div class="flex items-center space-x-2">
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

			{#if module?.children?.length}
				{#each module.children as child (child.id)}
					{@const nextPerms = getPermission(child.id)}
					{@render ModuleTreeItem({ module: child, permissions: nextPerms, getPermission })}
				{/each}
			{/if}
		</Collapsible.Content>
	</Collapsible.Root>
{/snippet}
