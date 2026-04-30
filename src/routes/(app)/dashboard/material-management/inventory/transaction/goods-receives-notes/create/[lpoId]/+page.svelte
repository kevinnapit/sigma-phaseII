<script lang="ts">
	import { page } from '$app/state';
	import { CreateGRNPage } from '$lib/features/material-management/inventory/transaction/goods-receives-notes';

	const lpoId = $derived(page.params.lpoId ?? '');
</script>

<CreateGRNPage {lpoId} />
