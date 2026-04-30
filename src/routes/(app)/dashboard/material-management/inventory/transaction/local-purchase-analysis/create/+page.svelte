<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { CreateLocalPurchaseAnalysis } from '$lib/features/material-management/inventory/transaction/local-purchase-analysis';

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/local-purchase-analysis');
	}
</script>

<div class="space-y-6">
	<div class="items-center justify-between gap-4 sm:flex">
		<!-- <Button variant="ghost" size="icon" onclick={handleBack}>
			<ArrowLeft class="h-5 w-5" />
		</Button> -->
		<PageHeader
			title="Buat Proses Pembelian Lokal"
			description="Ikuti tahapan untuk membuat proses pembelian lokal baru."
		/>
		<div class="mt-5">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<CreateLocalPurchaseAnalysis />
</div>
