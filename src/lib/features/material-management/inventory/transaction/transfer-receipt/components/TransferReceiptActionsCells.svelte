<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Eye, MoreHorizontal, CheckCircle, XCircle } from 'lucide-svelte';
	import { Guard } from '$lib/components/shared';
	import { TRANSFER_RECEIPT_PERMISSIONS } from '../constants/transfer-receipt-permissions';
	import { useApproveTransferReceipt, useRejectTransferReceipt } from '../hooks/useTransferReceiptMutations.svelte';
	import type { TransferReceipt } from '../types/transfer-receipt.types';

	let {
		transferReceipt,
		onViewDetail,
		onApprove,
		onReject
	}: {
		transferReceipt: TransferReceipt;
		onViewDetail?: (transferReceipt: TransferReceipt) => void;
		onApprove?: (transferReceipt: TransferReceipt) => void;
		onReject?: (transferReceipt: TransferReceipt) => void;
	} = $props();

	const approveMutation = useApproveTransferReceipt();
	const rejectMutation = useRejectTransferReceipt();

	async function handleApprove() {
		try {
			await approveMutation.mutateAsync(transferReceipt.id);
			onApprove?.(transferReceipt);
		} catch (error) {
			console.error('Error approving transfer receipt:', error);
		}
	}

	async function handleReject() {
		const reason = prompt('Alasan penolakan:');
		if (!reason) return;

		try {
			await rejectMutation.mutateAsync({ id: transferReceipt.id, reason });
			onReject?.(transferReceipt);
		} catch (error) {
			console.error('Error rejecting transfer receipt:', error);
		}
	}

	const canApprove = $derived(transferReceipt.status === 'submitted');
	const isProcessing = $derived(approveMutation.isPending || rejectMutation.isPending);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" size="icon" disabled={isProcessing}>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => onViewDetail?.(transferReceipt)}>
			<Eye class="mr-2 h-4 w-4" />
			Lihat Detail
		</DropdownMenu.Item>
		
		{#if canApprove}
			<DropdownMenu.Separator />
			<Guard permissions={TRANSFER_RECEIPT_PERMISSIONS.APPROVE}>
				<DropdownMenu.Item onclick={handleApprove} disabled={isProcessing}>
					<CheckCircle class="mr-2 h-4 w-4 text-green-600" />
					{approveMutation.isPending ? 'Menyetujui...' : 'Setujui'}
				</DropdownMenu.Item>
			</Guard>
			<Guard permissions={TRANSFER_RECEIPT_PERMISSIONS.REJECT}>
				<DropdownMenu.Item onclick={handleReject} disabled={isProcessing}>
					<XCircle class="mr-2 h-4 w-4 text-red-600" />
					{rejectMutation.isPending ? 'Menolak...' : 'Tolak'}
				</DropdownMenu.Item>
			</Guard>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>