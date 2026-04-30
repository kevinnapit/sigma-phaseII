<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import CreateItemStorageLayoutForm from '$lib/features/material-management/inventory/master/item-storage-layout/components/CreateItemStorageLayoutForm.svelte';

	function handleSuccess() {
		goto('/dashboard/material-management/inventory/master/item-storage-layout');
	}

	function handleCancel() {
		goto('/dashboard/material-management/inventory/master/item-storage-layout');
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Tambah Rak Penyimpanan"
		description="Buat rak penyimpanan barang baru"
	/>

	<CreateItemStorageLayoutForm onSuccess={handleSuccess} onCancel={handleCancel} />
</div>
