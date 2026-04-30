<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ChevronRight, ChevronLeft, Check, Pencil, X } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { useStoresListQuery } from '../../hooks/useDetailedItemQueries.svelte';
	import {
		useCreateItemStockRecord,
		useDeleteItemStockRecord
	} from '../../hooks/useItemMutations.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { ITEM_PERMISSIONS } from '../../constants/item-permissions';
	import type { ItemStore } from '../../types/item.types';

	const authCtx = getUserContext();
	const canEdit = $derived(authCtx.hasPermission(ITEM_PERMISSIONS.DETAIL_BARANG_UPDATE));

	let {
		stockRecords = [],
		itemId,
		onUpdateSuccess
	}: {
		stockRecords?: ItemStore[];
		itemId: string;
		onUpdateSuccess?: () => void;
	} = $props();

	// State
	let isEditing = $state(false);
	let searchAvailable = $state('');
	let searchSelected = $state('');
	let selectedAvailableIds = $state<Set<string>>(new Set());
	let selectedStoreIds = $state<Set<string>>(new Set());

	// Debounced search
	let debouncedSearchAvailable = $state('');
	let debouncedSearchSelected = $state('');

	$effect(() => {
		searchAvailable;
		const timer = setTimeout(() => {
			debouncedSearchAvailable = searchAvailable;
		}, 500);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		searchSelected;
		const timer = setTimeout(() => {
			debouncedSearchSelected = searchSelected;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Queries
	const storesQuery = useStoresListQuery(() => ({
		page: 1,
		size: 100
	}));

	// Mutations
	const createMutation = useCreateItemStockRecord();
	const deleteMutation = useDeleteItemStockRecord();

	// Derived data
	const allStores = $derived((storesQuery.data as any)?.data ?? []);
	const isLoading = $derived(storesQuery.isLoading);
	const isSaving = $derived(createMutation.isPending || deleteMutation.isPending);

	// Get store IDs that are already in stock records
	const usedStoreIds = $derived(new Set(stockRecords.map((s) => s.fk_store_hdrid)));

	// Filter available stores (exclude already used ones)
	const availableStores = $derived(
		allStores.filter((store: any) => {
			const isUsed = usedStoreIds.has(store.uoid);
			const matchSearch = debouncedSearchAvailable
				? store.name.toLowerCase().includes(debouncedSearchAvailable.toLowerCase()) ||
					store.code.toLowerCase().includes(debouncedSearchAvailable.toLowerCase())
				: true;
			return !isUsed && matchSearch;
		})
	);

	// Filter selected stores based on search
	const filteredStockRecords = $derived(
		stockRecords.filter((record) => {
			if (!debouncedSearchSelected) return true;
			const search = debouncedSearchSelected.toLowerCase();
			return (
				record.store_name.toLowerCase().includes(search) ||
				record.store_code.toLowerCase().includes(search)
			);
		})
	);

	// Toggle selection for available stores
	function toggleAvailableSelection(storeId: string) {
		if (!isEditing) return;
		const newSet = new Set(selectedAvailableIds);
		if (newSet.has(storeId)) {
			newSet.delete(storeId);
		} else {
			newSet.add(storeId);
		}
		selectedAvailableIds = newSet;
	}

	// Toggle selection for stock records
	function toggleStoreSelection(stockId: string) {
		if (!isEditing) return;
		const newSet = new Set(selectedStoreIds);
		if (newSet.has(stockId)) {
			newSet.delete(stockId);
		} else {
			newSet.add(stockId);
		}
		selectedStoreIds = newSet;
	}

	// Move selected stores to right (create immediately)
	async function moveToSelected() {
		if (selectedAvailableIds.size === 0) {
			toast.error('Pilih minimal satu gudang dari gudang tersedia');
			return;
		}

		try {
			// Process adds immediately
			const addPromises = Array.from(selectedAvailableIds).map(
				(storeId) =>
					new Promise<void>((resolve, reject) => {
						createMutation.mutate(
							{
								itemId,
								data: { fk_store_hdrid: storeId }
							},
							{
								onSuccess: () => resolve(),
								onError: (error) => reject(error)
							}
						);
					})
			);

			await Promise.all(addPromises);

			// Clear selection
			selectedAvailableIds = new Set();

			toast.success('Gudang berhasil ditambahkan');
			onUpdateSuccess?.();
		} catch (error) {
			toast.error(
				`Gagal menambahkan gudang: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	// Move selected stores to left (delete immediately)
	async function moveToAvailable() {
		if (selectedStoreIds.size === 0) {
			toast.error('Pilih minimal satu gudang dari gudang terpilih');
			return;
		}

		try {
			// Process deletes immediately
			const deletePromises = Array.from(selectedStoreIds).map(
				(stockId) =>
					new Promise<void>((resolve, reject) => {
						deleteMutation.mutate(
							{ itemId, stockId },
							{
								onSuccess: () => resolve(),
								onError: (error) => reject(error)
							}
						);
					})
			);

			await Promise.all(deletePromises);

			// Clear selection
			selectedStoreIds = new Set();

			toast.success('Gudang berhasil dihapus');
			onUpdateSuccess?.();
		} catch (error) {
			toast.error(
				`Gagal menghapus gudang: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	// Handle edit button
	function handleEdit() {
		isEditing = true;
	}

	// Handle cancel button
	function handleCancel() {
		isEditing = false;
		selectedAvailableIds = new Set();
		selectedStoreIds = new Set();
	}

	// Handle save button (just exit edit mode)
	function handleSave() {
		isEditing = false;
		selectedAvailableIds = new Set();
		selectedStoreIds = new Set();
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<div>
				<Card.Title>Gudang</Card.Title>
				<Card.Description>Kelola gudang yang menyimpan barang ini</Card.Description>
			</div>
			<div class="flex gap-2">
				{#if isEditing}
					<Button variant="outline" size="sm" onclick={handleCancel} disabled={isSaving}>
						<X class="mr-2 h-4 w-4" />
						Batal
					</Button>
					<Button
						size="sm"
						onclick={handleSave}
						disabled={isSaving}
						class="bg-[#0f4c2a] hover:bg-[#0d4023]"
					>
						<Check class="mr-2 h-4 w-4" />
						Simpan
					</Button>
				{:else if canEdit}
					<Button variant="outline" size="sm" onclick={handleEdit}>
						<Pencil class="mr-2 h-4 w-4" />
						Edit
					</Button>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr]">
			<!-- Available Stores (Left) -->
			<div class="space-y-3">
				<div>
					<h3 class="text-sm font-medium">Gudang Tersedia</h3>
					<p class="text-xs text-muted-foreground">Pilih gudang untuk ditambahkan</p>
				</div>
				<Input
					bind:value={searchAvailable}
					placeholder="Cari gudang..."
					disabled={!isEditing || isSaving}
					class="h-9"
				/>
				<div class="rounded-md border">
					<div class="max-h-[400px] overflow-y-auto">
						{#if isLoading}
							<div class="space-y-2 p-4">
								{#each Array(5) as _}
									<Skeleton class="h-10 w-full" />
								{/each}
							</div>
						{:else if availableStores.length === 0}
							<div class="p-8 text-center text-sm text-muted-foreground">
								Tidak ada gudang tersedia
							</div>
						{:else}
							<div class="divide-y">
								{#each availableStores as store (store.uoid)}
									<button
										type="button"
										class="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50"
										class:bg-muted={selectedAvailableIds.has(store.uoid)}
										class:cursor-not-allowed={!isEditing}
										onclick={() => toggleAvailableSelection(store.uoid)}
										disabled={!isEditing || isSaving}
									>
										<input
											type="checkbox"
											checked={selectedAvailableIds.has(store.uoid)}
											class="mt-1"
											disabled={!isEditing || isSaving}
										/>
										<div class="flex-1 space-y-1">
											<div class="text-sm font-medium">{store.name}</div>
											<div class="text-xs text-muted-foreground">
												{store.code}
											</div>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div class="text-xs text-muted-foreground">
					{availableStores.length} gudang tersedia
				</div>
			</div>

			<!-- Action Buttons (Center) -->
			<div class="flex flex-col items-center justify-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onclick={moveToSelected}
					disabled={!isEditing || selectedAvailableIds.size === 0 || isSaving}
					title="Pindahkan ke gudang terpilih"
				>
					<ChevronRight class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={moveToAvailable}
					disabled={!isEditing || selectedStoreIds.size === 0 || isSaving}
					title="Hapus dari gudang terpilih"
				>
					<ChevronLeft class="h-4 w-4" />
				</Button>
			</div>

			<!-- Selected Stores (Right) -->
			<div class="space-y-3">
				<div>
					<h3 class="text-sm font-medium">Gudang Terpilih</h3>
					<p class="text-xs text-muted-foreground">Gudang yang menyimpan barang ini</p>
				</div>
				<Input
					bind:value={searchSelected}
					placeholder="Cari gudang..."
					disabled={!isEditing || isSaving}
					class="h-9"
				/>
				<div class="rounded-md border">
					<div class="max-h-[400px] overflow-y-auto">
						{#if isLoading}
							<div class="space-y-2 p-4">
								{#each Array(5) as _}
									<Skeleton class="h-10 w-full" />
								{/each}
							</div>
						{:else if filteredStockRecords.length === 0}
							<div class="p-8 text-center text-sm text-muted-foreground">
								{stockRecords.length === 0
									? 'Belum ada gudang terpilih'
									: 'Tidak ada gudang yang sesuai pencarian'}
							</div>
						{:else}
							<div class="divide-y">
								{#each filteredStockRecords as store (store.uoid)}
									<button
										type="button"
										class="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50"
										class:bg-muted={selectedStoreIds.has(store.uoid)}
										class:cursor-not-allowed={!isEditing}
										onclick={() => toggleStoreSelection(store.uoid)}
										disabled={!isEditing || isSaving}
									>
										<input
											type="checkbox"
											checked={selectedStoreIds.has(store.uoid)}
											class="mt-1"
											disabled={!isEditing || isSaving}
										/>
										<div class="flex-1 space-y-1">
											<div class="text-sm font-medium">{store.store_name}</div>
											<div class="text-xs text-muted-foreground">
												{store.store_code}
											</div>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div class="text-xs text-muted-foreground">
					{stockRecords.length} gudang terpilih
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
