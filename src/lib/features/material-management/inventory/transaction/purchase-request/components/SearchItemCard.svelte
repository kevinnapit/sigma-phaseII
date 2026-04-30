<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search, Plus, X } from 'lucide-svelte';
	import { useReadAllItems } from '$lib/features/material-management/inventory/master/item';
	import type { ItemComprehensiveData } from '$lib/features/material-management/inventory/master/item';
	import ItemCodeRequestDialog from './ItemCodeRequestDialog.svelte';

	let {
		onItemSelect,
		selectedItem = $bindable(null)
	}: {
		onItemSelect: (item: ItemComprehensiveData) => void;
		selectedItem?: ItemComprehensiveData | null;
	} = $props();

	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let showItemCodeRequestDialog = $state(false);

	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Query items dengan search
	const itemsQuery = useReadAllItems(
		() => ({
			page: 1,
			size: 15,
			search: debouncedSearch || undefined
		}),
		() => debouncedSearch.length > 0
	);

	const items = $derived(itemsQuery.data?.data || []);
	const isLoading = $derived(itemsQuery.isLoading);
	const hasSearched = $derived(debouncedSearch.length > 0);

	function handleSelectItem(item: ItemComprehensiveData) {
		selectedItem = item;
		onItemSelect(item);
	}

	function handleCancelSelection() {
		selectedItem = null;
		searchQuery = '';
		debouncedSearch = '';
	}

	// Public function to reset search from parent
	export function resetSearch() {
		selectedItem = null;
		searchQuery = '';
		debouncedSearch = '';
	}

	const isItemSelected = $derived(!!selectedItem);
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Cari & Tambah Item</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Selected Item Display -->
		{#if isItemSelected && selectedItem}
			<div class="rounded-lg border bg-muted/50 p-4 shadow-sm">
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-3">
						<div class="flex-1 space-y-1">
							<div class="flex items-center gap-2">
								<p class="font-semibold text-gray-900">{selectedItem.code} - {selectedItem.name}</p>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-700">
								{#if selectedItem.item_class?.code}
									<span>{selectedItem.item_class.code}</span>
									<span>•</span>
								{/if}
								{#if selectedItem.base_uom}
									<span>{selectedItem.base_uom.name}</span>
								{/if}
							</div>
						</div>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onclick={handleCancelSelection}
						class="text-gray-700 hover:bg-gray-200 hover:text-gray-900"
					>
						<X class="mr-1 h-4 w-4" />
						<span class="max-sm:hidden">Batalkan</span>
					</Button>
				</div>
			</div>
		{:else}
			<!-- Search Input -->
			<div class="relative">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Ketik kode atau nama item untuk mencari..."
					bind:value={searchQuery}
					class="pl-10"
				/>
			</div>

			<!-- Results -->
			{#if hasSearched}
				<div class="space-y-2">
					{#if isLoading}
						<div class="flex items-center justify-center py-8">
							<div class="text-center">
								<div
									class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
								></div>
								<p class="mt-2 text-sm text-muted-foreground">Mencari item...</p>
							</div>
						</div>
					{:else if items.length === 0}
						<div class="flex flex-col items-center justify-center py-8 text-center">
							<Search class="h-12 w-12 text-muted-foreground/50" />
							<p class="mt-2 text-sm font-medium">Tidak ada item ditemukan</p>
							<p class="text-xs text-muted-foreground">Coba kata kunci lain atau ajukan permintaan kode barang baru</p>
							<Button variant="outline" size="sm" class="mt-4" onclick={() => showItemCodeRequestDialog = true}>
								<Plus class="mr-2 h-4 w-4" />
								Permintaan Kode Barang
							</Button>
						</div>
					{:else}
						<div class="text-sm text-muted-foreground">
							Ditemukan {items.length} item
						</div>
						<div class="max-h-[400px] space-y-2 overflow-y-auto">
							{#each items as item}
								<div
									class="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
								>
									<div class="flex-1 space-y-1">
										<div class="flex items-center gap-2">
											<p class="font-medium">{item.code} - {item.name}</p>
										</div>
										<div class="flex items-center gap-2 text-xs text-muted-foreground">
											{#if item.item_class?.code}
												<span>{item.item_class.code}</span>
												<span>•</span>
											{/if}
											{#if item.base_uom}
												<span>{item.base_uom.name}</span>
											{/if}
										</div>
									</div>
									<Button size="sm" onclick={() => handleSelectItem(item)}>
										<Plus class="mr-1 h-4 w-4" />
										Pilih
									</Button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Search class="h-16 w-16 text-muted-foreground/30" />
					<p class="mt-4 text-sm font-medium text-muted-foreground">
						Mulai mengetik untuk mencari item
					</p>
					<p class="mt-1 text-xs text-muted-foreground">
						Masukkan minimal 1 karakter untuk memulai pencarian
					</p>
				</div>
			{/if}
		{/if}
	</CardContent>
</Card>

<!-- Item Code Request Dialog -->
<ItemCodeRequestDialog bind:open={showItemCodeRequestDialog} />
