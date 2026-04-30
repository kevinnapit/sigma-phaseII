<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { useReadLocalPurchaseItemDetail } from '$lib/features/material-management/inventory/master/local-purchase-item/hooks/useLocalPurchaseItemQueries.svelte';
	import LocalPurchaseItemDetailView from '$lib/features/material-management/inventory/master/local-purchase-item/components/LocalPurchaseItemDetailView.svelte';

	const uoid = $derived(page.params.uoid);

	const localPurchaseItemQuery = useReadLocalPurchaseItemDetail(() => uoid);
	const localPurchaseItem = $derived(localPurchaseItemQuery.data?.data);

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/local-purchase-item');
	}
</script>

<div class="space-y-6">
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Barang Pembelian Lokal"
			description="Informasi lengkap barang yang diizinkan untuk pembelian lokal."
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:justify-end sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<LocalPurchaseItemDetailView
		{localPurchaseItem}
		isLoading={localPurchaseItemQuery.isLoading}
	/>
</div>
