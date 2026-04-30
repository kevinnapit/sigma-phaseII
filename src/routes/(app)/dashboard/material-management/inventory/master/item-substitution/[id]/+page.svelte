<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { useReadItemSubstitutionDetail } from '$lib/features/material-management/inventory/master/item-substitution/hooks/useItemSubstitutionQueries.svelte';
	import ItemSubstitutionDetailView from '$lib/features/material-management/inventory/master/item-substitution/components/ItemSubstitutionDetailView.svelte';

	const id = $derived(page.params.id);

	const substitutionQuery = useReadItemSubstitutionDetail(() => id);
	const substitution = $derived(substitutionQuery.data?.data);

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/item-substitution');
	}
</script>

<div class="space-y-6">
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Substitusi Barang"
			description="Informasi lengkap substitusi barang dari SAP."
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:justify-end sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<ItemSubstitutionDetailView
		{substitution}
		isLoading={substitutionQuery.isLoading}
	/>
</div>
