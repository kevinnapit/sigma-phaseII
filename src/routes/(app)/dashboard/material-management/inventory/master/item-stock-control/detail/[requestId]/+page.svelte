<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, Send, LoaderCircle, PowerOff } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import Guard from '$lib/components/shared/guard.svelte';
	import {
		ItemStockControlDetailView,
		useReadStockControlDetail,
		useSubmitStockControl,
		useDeactivateStockControl
	} from '$lib/features/material-management/inventory/master/item-stock-control';
	import { ITEM_STOCK_CONTROL_PERMISSIONS } from '$lib/features/material-management/inventory/master/item-stock-control/constants/item-stock-control-permissions';

	const requestId = $derived(page.params.requestId || '');

	const detailQuery = useReadStockControlDetail(() => requestId);
	const submitMutation = useSubmitStockControl();
	const deactivateMutation = useDeactivateStockControl();

	const detail = $derived(detailQuery.data);
	const isLoading = $derived(detailQuery.isLoading);
	const isDraft = $derived(detail?.status === 'DRAFT');
	const isApproved = $derived(detail?.status === 'APPROVED');
	const isSubmitting = $derived(submitMutation.isPending);
	const isDeactivating = $derived(deactivateMutation.isPending);

	let showDeactivateDialog = $state(false);
	let deactivateReason = $state('');

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/item-stock-control');
	}

	async function handleSubmit() {
		try {
			await submitMutation.mutateAsync(requestId);
			toast.success('Permintaan kontrol stok berhasil diajukan');
			await detailQuery.refetch();
		} catch (err: any) {
			toast.error(err?.message || 'Gagal mengajukan permintaan kontrol stok');
		}
	}

	async function handleDeactivate() {
		if (!deactivateReason.trim()) {
			toast.error('Alasan nonaktif wajib diisi');
			return;
		}
		try {
			await deactivateMutation.mutateAsync({ requestId, reason: deactivateReason.trim() });
			toast.success('Kontrol stok berhasil dinonaktifkan');
			showDeactivateDialog = false;
			deactivateReason = '';
			await detailQuery.refetch();
		} catch (err: any) {
			toast.error(err?.message || 'Gagal menonaktifkan kontrol stok');
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<PageHeader
			title="Detail Kontrol Stok Barang"
			description="Informasi lengkap kontrol stok barang dan persetujuan perubahan"
		/>
		<div class="flex items-center gap-2">
			{#if isDraft && !isLoading}
				<Button onclick={handleSubmit} disabled={isSubmitting} size="sm">
					{#if isSubmitting}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Mengajukan...
					{:else}
						<Send class="mr-2 h-4 w-4" />
						Ajukan
					{/if}
				</Button>
			{/if}
			{#if isApproved && !isLoading}
				<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.NONACTIVE_CREATE}>
					<Button
						variant="destructive"
						size="sm"
						onclick={() => (showDeactivateDialog = true)}
						disabled={isDeactivating}
					>
						<PowerOff class="mr-2 h-4 w-4" />
						Nonaktifkan
					</Button>
				</Guard>
			{/if}
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<ItemStockControlDetailView {detail} {isLoading} />
</div>

<!-- Deactivate Confirmation Dialog -->
<AlertDialog.Root bind:open={showDeactivateDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Nonaktifkan Kontrol Stok</AlertDialog.Title>
			<AlertDialog.Description>
				Tindakan ini akan menonaktifkan kontrol stok yang sudah disetujui. Masukkan alasan
				penonaktifan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2 py-2">
			<Label for="deactivate-reason">Alasan *</Label>
			<Textarea
				id="deactivate-reason"
				bind:value={deactivateReason}
				placeholder="Masukkan alasan penonaktifan..."
				class="min-h-[100px]"
				disabled={isDeactivating}
			/>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				disabled={isDeactivating}
				onclick={() => {
					deactivateReason = '';
				}}
			>
				Batal
			</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleDeactivate}
				disabled={isDeactivating || !deactivateReason.trim()}
				class="bg-destructive hover:bg-destructive/90"
			>
				{#if isDeactivating}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Menonaktifkan...
				{:else}
					Nonaktifkan
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
