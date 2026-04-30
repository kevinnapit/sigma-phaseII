<script lang="ts">
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import { ViewGoodsReceivesNotes } from '$lib/features/material-management/inventory/transaction/goods-receives-notes';
</script>

<PageHeader
	title="Penerimaan Barang Lokal"
	description="Kelola penerimaan barang dari Local Purchase Order."
/>

<ViewGoodsReceivesNotes />
