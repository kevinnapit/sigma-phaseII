<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Trash2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { useReadDetailStore } from '$lib/features/material-management/inventory/master/stores';
	import EditStoreInfoCard from '$lib/features/material-management/inventory/master/stores/components/EditStoreInfoCard.svelte';
	import ParentStoreInfoCard from '$lib/features/material-management/inventory/master/stores/components/ParentStoreInfoCard.svelte';
	import DeleteStoreDialog from '$lib/features/material-management/inventory/master/stores/components/DeleteStoreDialog.svelte';

	const storeId = $derived(page.params.id || '');

	// Fetch store detail
	const storeQuery = useReadDetailStore(() => storeId);
	const store = $derived(storeQuery.data?.data || null);

	let deleteDialogOpen = $state(false);

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/store');
	}

	function handleDelete() {
		deleteDialogOpen = true;
	}

	function onDeleteSuccess() {
		goto('/dashboard/material-management/inventory/master/store');
	}

	function onUpdateSuccess() {
		storeQuery.refetch();
	}

	// Get initials for avatar
	const initials = $derived(
		store?.name
			?.split(' ')
			.map((word) => word[0])
			.join('')
			.substring(0, 2)
			.toUpperCase() || 'GD'
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-semibold">Detail Data Gudang</h1>
			</div>
			<p class="text-sm text-gray-500">
				Informasi lengkap {store?.name || ''} ({store?.code || ''})
			</p>
		</div>

		<div class="mt-5 flex items-center max-sm:-mb-3">
			<Button variant="ghost" class="border" onclick={handleBack}>
				<ArrowLeft class="h-4 w-4" />
				Kembali
			</Button>
			<!-- <Button variant="destructive" onclick={handleDelete}>
				<Trash2 class="mr-2 h-4 w-4" />
				Hapus
			</Button> -->
		</div>
	</div>

	{#if storeQuery.isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-gray-500">Memuat data...</p>
		</div>
	{:else if storeQuery.isError}
		<div class="flex items-center justify-center py-12">
			<p class="text-red-500">Gagal memuat data gudang</p>
		</div>
	{:else if store}
		<!-- Profile Card -->
		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-start gap-4">
					<!-- Avatar -->
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600"
					>
						{initials}
					</div>

					<!-- Info -->
					<div class="flex-1">
						<h2 class="text-xl font-semibold">{store.name}</h2>
						<p class="text-sm text-gray-500">{store.code}</p>

						<div class="mt-2 flex items-center gap-2">
							{#if store.is_active}
								<Badge variant="default" class="bg-green-500 hover:bg-green-600">Aktif</Badge>
							{:else}
								<Badge variant="secondary">Tidak Aktif</Badge>
							{/if}

							{#if store.store_type}
								<Badge variant="outline">{store.store_type.value}</Badge>
							{/if}
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Informasi Gudang Card -->
		<EditStoreInfoCard {store} {onUpdateSuccess} />

		<!-- Informasi Gudang Induk Card (if parent store exists) -->
		{#if store.parent_store}
			<ParentStoreInfoCard parentStore={store.parent_store} />
		{/if}
	{/if}
</div>

<!-- Delete Dialog -->
<DeleteStoreDialog bind:open={deleteDialogOpen} {store} onSuccess={onDeleteSuccess} />
