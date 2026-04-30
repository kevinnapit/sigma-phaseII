<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import RODetailStep from '$lib/features/material-management/inventory/transaction/local-purchase-analysis/components/RODetailStep.svelte';

	const rfqId = $derived(page.params.id || '');

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/local-purchase-analysis');
	}
</script>

<div class="space-y-6">
	<div class="items-center justify-between gap-4 sm:flex">
		<PageHeader
			title="Detail Repeat Order"
			description="Lihat detail Repeat Order dan LPO yang telah dibuat."
		/>
		<div class="mt-5">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<RODetailStep {rfqId} />
</div>
