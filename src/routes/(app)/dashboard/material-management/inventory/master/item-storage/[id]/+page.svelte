<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { useReadItemStorageAssignmentDetail } from '$lib/features/material-management/inventory/master/item-storage/hooks/useItemStorageQueries.svelte';
	import ItemStorageDetailView from '$lib/features/material-management/inventory/master/item-storage/components/ItemStorageDetailView.svelte';

	const id = $derived(page.params.id);

	const assignmentQuery = useReadItemStorageAssignmentDetail(() => id);
	const assignment = $derived(assignmentQuery.data?.data);

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/item-storage');
	}
</script>

<div class="space-y-6">
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Penugasan Penyimpanan Barang"
			description="Informasi lengkap penugasan penyimpanan barang ke cell/rak gudang."
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:justify-end sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<ItemStorageDetailView
		{assignment}
		isLoading={assignmentQuery.isLoading}
	/>
</div>
