<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Eye, Ellipsis, Send, Pencil, X, Clock } from 'lucide-svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { PurchaseRequestListItemExtended } from '../types/purchase-request.types';
	import { PURCHASE_REQUEST_PERMISSIONS } from '../constants/purchase-request-permissions';

	let {
		purchaseRequest,
		onViewDetail,
		onSubmit,
		onEdit,
		onCancel,
		onTracking,
		isSubmitting = false
	}: {
		purchaseRequest: PurchaseRequestListItemExtended;
		onViewDetail: (pr: PurchaseRequestListItemExtended) => void;
		onSubmit?: (pr: PurchaseRequestListItemExtended) => void;
		onEdit?: (pr: PurchaseRequestListItemExtended) => void;
		onCancel?: (pr: PurchaseRequestListItemExtended) => void;
		onTracking?: (pr: PurchaseRequestListItemExtended) => void;
		isSubmitting?: boolean;
	} = $props();

	const isDraft = $derived(purchaseRequest.approval_status === 'DRAFT');
	const isRejected = $derived(purchaseRequest.approval_status === 'REJECTED');
	const isCancelled = $derived(purchaseRequest.approval_status === 'CANCELLED');
	const isProcessed = $derived(purchaseRequest.is_processed || false);

	// Show Edit if status is DRAFT or REJECTED (and not CANCELLED)
	const canEdit = $derived((isDraft || isRejected) && !isCancelled);
	
	// Show Cancel if not CANCELLED and not processed
	const canCancel = $derived(!isCancelled && !isProcessed);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" class="h-8 w-8 p-0">
			<span class="sr-only">Buka menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[160px]">
		<Guard permissions={PURCHASE_REQUEST_PERMISSIONS.DETAIL_VIEW}>
			<DropdownMenu.Item onclick={() => onViewDetail(purchaseRequest)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		
		{#if onTracking}
			<DropdownMenu.Item onclick={() => onTracking(purchaseRequest)}>
				<Clock class="h-4 w-4" />
				Lihat Tracking
			</DropdownMenu.Item>
		{/if}
		
		{#if canEdit && onEdit}
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={() => onEdit(purchaseRequest)}>
				<Pencil class="h-4 w-4" />
				Edit
			</DropdownMenu.Item>
		{/if}
		
		{#if isDraft && onSubmit}
			<Guard permissions={PURCHASE_REQUEST_PERMISSIONS.UPDATE}>
				<DropdownMenu.Item onclick={() => onSubmit(purchaseRequest)} disabled={isSubmitting}>
					<Send class="h-4 w-4" />
					{isSubmitting ? 'Mengajukan...' : 'Ajukan'}
				</DropdownMenu.Item>
			</Guard>
		{/if}
		
		{#if canCancel && onCancel}
			<DropdownMenu.Separator />
			<DropdownMenu.Item 
				onclick={() => onCancel(purchaseRequest)}
				class="text-destructive focus:text-destructive"
			>
				<X class="h-4 w-4" />
				Batalkan
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
