<script lang="ts">
	import { Building2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { useSelectableEstate } from '$lib/modules/functional-admin/index.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { untrack } from 'svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	let {
		open = $bindable(false)
	}: {
		open?: boolean;
	} = $props();

	const userCtx = getUserContext();
	const queryClient = useQueryClient();
	const essData = useSelectableEstate(() => true);

	let currentEstate = $derived(userCtx.estate);

	$effect(() => {
		if (!open && !userCtx.estate) {
			open = untrack(() => !open);
		}
	});
</script>

<AlertDialog.Root
	bind:open
	onOpenChangeComplete={(v) => {
		if (!v && !userCtx.estate) {
			open = true;
		}
	}}
>
	<AlertDialog.Content class="sm:max-w-[450px]">
		<AlertDialog.Header class="pb-3">
			<AlertDialog.Title class="text-sm">Pilih Estate</AlertDialog.Title>
			<AlertDialog.Description class="text-xs">
				Silakan pilih estate untuk melanjutkan.
			</AlertDialog.Description>
		</AlertDialog.Header>

		{#if essData.isLoading}
			<div class="space-y-1.5 py-2 opacity-50">
				<div class="animate-pulse rounded-lg border border-gray-200 bg-white">
					<button
						type="button"
						class="flex w-full items-center gap-2.5 p-3 text-left transition-colors hover:bg-gray-50"
					>
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
							<Building2 class="h-4 w-4 text-gray-600" />
						</div>
						<div class="flex-1">
							<div class="text-sm font-semibold text-gray-900">Memuat Kebun...</div>
						</div>
					</button>
				</div>
			</div>
		{:else}
			<div class="space-y-1.5 py-2">
				{#each essData.data as estate (estate.id)}
					{@const isSelected = currentEstate?.code === estate.code}

					<div
						class="rounded-lg border {isSelected
							? 'border-primary bg-primary/5'
							: 'border-gray-200 bg-white'}"
					>
						<button
							type="button"
							class="flex w-full items-center gap-2.5 p-3 text-left"
							onclick={() => {
								if (!isSelected) {
									userCtx.setEstate({ ...estate });
									if (currentEstate) queryClient.clear();
								}
								open = false;
							}}
						>
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
								<Building2 class="h-4 w-4 text-gray-600" />
							</div>
							<div class="flex-1">
								<div class="text-sm font-semibold text-gray-900">{estate.name}</div>
							</div>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</AlertDialog.Content>
</AlertDialog.Root>
