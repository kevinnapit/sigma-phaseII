<script lang="ts">
	import { toast } from 'svelte-sonner';
	import {
		ViewItemStockControl,
		ItemStockControlStats,
		useCreateStockControl,
		useSubmitStockControl
	} from '$lib/features/material-management/inventory/master/item-stock-control';
	import PageHeader from '$lib/components/shared/PageHeader.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { CreateStockControlPayload } from '$lib/features/material-management/inventory/master/item-stock-control';
	import { ITEM_STOCK_CONTROL_PERMISSIONS } from '$lib/features/material-management/inventory/master/item-stock-control/constants/item-stock-control-permissions';

	let searchName = $state('');
	let filterValues = $state<Record<string, string>>({});

	const createMutation = useCreateStockControl();
	const submitMutation = useSubmitStockControl();

	// Track which request IDs are being submitted from action cells
	let submittingIds = $state(new Set<string>());

	async function handleCreateRequest(payload: CreateStockControlPayload) {
		try {
			const result = await createMutation.mutateAsync(payload);
			toast.success('Permintaan kontrol stok berhasil dibuat');
			// result is StockControlRequestDetail[] — first item's uoid is the request_id
			const first = Array.isArray(result) ? result[0] : (result as any);
			return {
				request_id: first?.uoid ?? '',
				item_code: first?.item_code ?? '',
				item_name: first?.item_name ?? ''
			};
		} catch (err: any) {
			toast.error(err?.message || 'Gagal membuat permintaan kontrol stok');
			throw err;
		}
	}

	async function handleSubmitRequest(requestId: string) {
		submittingIds = new Set([...submittingIds, requestId]);
		try {
			await submitMutation.mutateAsync(requestId);
			toast.success('Permintaan kontrol stok berhasil diajukan');
		} catch (err: any) {
			toast.error(err?.message || 'Gagal mengajukan permintaan kontrol stok');
		} finally {
			const next = new Set(submittingIds);
			next.delete(requestId);
			submittingIds = next;
		}
	}

	const isCreating = $derived(createMutation.isPending);
</script>

<div class="space-y-6">
	<PageHeader
		title="Master Kontrol Stok Barang"
		description="Kelola stok minimum barang untuk manajemen material dan inventory."
	/>

	<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.VIEW}>
		<ItemStockControlStats />
	</Guard>

	<ViewItemStockControl
		bind:searchName
		bind:filterValues
		onCreateRequest={handleCreateRequest}
		onSubmitRequest={handleSubmitRequest}
		{isCreating}
		{submittingIds}
	/>
</div>
