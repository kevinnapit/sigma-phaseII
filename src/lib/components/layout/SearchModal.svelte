<script lang="ts">
	import { goto } from '$app/navigation';
	import { Clock, Search, TrendingUp } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getMenuContext, type FlatModuleSearch } from '$lib/config/menus/menu-state.svelte';
	import { getMenuIcon } from '$lib/config/menus/menu-icon';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let searchQuery = $state('');
	let selectedIndex = $state(0);
	let recentItems = $state<FlatModuleSearch[]>([]);

	const menuCtx = getMenuContext();
	const filtered = $derived.by(() => menuCtx().searchModules(searchQuery));

	$effect(() => {
		if (open) {
			menuCtx()
				.persistor.getFromRecent()
				.then((v) => {
					recentItems = v;
				});
		}
	});

	function handleSelect(item: FlatModuleSearch) {
		Promise.resolve().then(() => {
			menuCtx().persistor.saveToRecent($state.snapshot(item), (v) => {
				recentItems = v;
				if (!item.path_name) return;
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(item.path_name);
				close();
			});
		});
	}

	function close() {
		open = false;
		searchQuery = '';
	}

	let scrollContainer = $state<HTMLDivElement>();
	// TODO: implement keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
			const nextEl = document.getElementById(`menu-item-${selectedIndex}`);
			scrollContainer?.scrollTo({
				top: (nextEl?.offsetTop || 0) - 50,
				behavior: 'smooth'
			});
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
			const prevEl = document.getElementById(`menu-item-${selectedIndex}`);
			scrollContainer?.scrollTo({
				top: (prevEl?.offsetTop || 0) - 50,
				behavior: 'smooth'
			});
		} else if (e.key === 'Enter' && filtered[selectedIndex]) {
			e.preventDefault();
			handleSelect(filtered[selectedIndex]);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-2xl gap-0 p-0">
		<div class="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
			<Search class="h-5 w-5 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				onkeydown={handleKeydown}
				placeholder="Cari menu..."
				class="flex-1 bg-transparent text-sm outline-hidden placeholder:text-gray-400"
			/>
		</div>

		<div class="max-h-96 overflow-y-auto" bind:this={scrollContainer}>
			{#if !searchQuery && recentItems.length > 0}
				<div class="p-2">
					<div class="mb-2 flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500">
						<Clock class="h-3.5 w-3.5" />
						<span>MENU TERAKHIR DIAKSES</span>
					</div>
					{#each recentItems as item (item.slug)}
						{@const Icon = getMenuIcon(item.icon)}
						<button
							onclick={() => handleSelect(item)}
							class="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
						>
							<Icon class="mt-0.5 size-4.5 shrink-0 text-gray-400" />
							<div class="flex-1">
								<div class="text-sm font-medium text-gray-900">{item.name}</div>
								<div class="text-xs text-gray-500">{item.breadcrumbLabel}</div>
							</div>
						</button>
					{/each}
				</div>
			{/if}

			<div class="p-2">
				<div class="mb-2 flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500">
					<TrendingUp class="h-3.5 w-3.5" />
					<span>SEMUA MENU</span>
				</div>
				{#each filtered as item, index (item.searchText)}
					{@const Icon = getMenuIcon(item.icon)}
					<button
						id={`menu-item-${index}`}
						class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-50 {selectedIndex ===
						index
							? 'bg-gray-100'
							: ''}"
						onclick={() => handleSelect(item)}
					>
						<Icon class="mt-0.5 size-4.5 shrink-0 text-gray-400" />
						<div class="flex-1">
							<div class="text-sm font-medium text-gray-900">{item.name}</div>
							<div class="text-xs text-gray-500">{item.breadcrumbLabel}</div>
						</div>
					</button>
				{/each}
			</div>

			{#if searchQuery && filtered.length === 0}
				<div class="px-4 py-8 text-center text-sm text-gray-500">
					Tidak ada hasil untuk "{searchQuery}"
				</div>
			{/if}
		</div>

		<div
			class="flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-500"
		>
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-1">
					<kbd class="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">↑↓</kbd>
					<span>navigasi</span>
				</div>
				<div class="flex items-center gap-1">
					<kbd class="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">Enter</kbd>
					<span>pilih</span>
				</div>
				<div class="flex items-center gap-1">
					<kbd class="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">Esc</kbd>
					<span>tutup</span>
				</div>
			</div>
			<div>{filtered.length} hasil</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
