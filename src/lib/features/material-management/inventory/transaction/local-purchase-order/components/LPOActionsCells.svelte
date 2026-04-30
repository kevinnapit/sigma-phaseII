<script lang="ts">
	import { Eye, Ellipsis, Send, Pencil, Ban, Clock } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { LPOListItem } from '../types/local-purchase-order.types';
	import { LOCAL_PURCHASE_ORDER_PERMISSIONS } from '../constants/local-purchase-order-permissions';

	let {
		lpo,
		onViewDetail,
		onSubmit,
		onEdit,
		onCancel,
		onTracking,
		isSubmitting = false
	}: {
		lpo: LPOListItem;
		onViewDetail: (lpo: LPOListItem) => void;
		onSubmit?: (lpo: LPOListItem) => void;
		onEdit?: (lpo: LPOListItem) => void;
		onCancel?: (lpo: LPOListItem) => void;
		onTracking?: (lpo: LPOListItem) => void;
		isSubmitting?: boolean;
	} = $props();

	const isDraft = $derived(lpo.approval_status === 'DRAFT');
	const isRejected = $derived(lpo.approval_status === 'REJECTED');
	const isCancelled = $derived(lpo.approval_status === 'CANCELLED');
	const isPrinted = $derived(lpo.approval_status === 'PRINTED');
	const isFinalized = $derived(lpo.approval_status === 'FINALIZED');

	// Button visibility logic
	const canEdit = $derived(isDraft || isRejected); // REQ-016, REQ-018
	const canCancelKTU = $derived(isDraft); // REQ-017
	const canCancelManager = $derived(!isCancelled && !isPrinted && !isFinalized); // REQ-019
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<Button variant="ghost" class="h-8 w-8 p-0">
			<span class="sr-only">Buka menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[160px]">
		<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.DETAIL_VIEW}>
			<DropdownMenu.Item onclick={() => onViewDetail(lpo)}>
				<Eye class="mr-2 h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>

		{#if onTracking}
			<DropdownMenu.Item onclick={() => onTracking(lpo)}>
				<Clock class="mr-2 h-4 w-4" />
				Lihat Tracking
			</DropdownMenu.Item>
		{/if}

		<!-- Edit Action (KTU) - REQ-016, REQ-018 -->
		{#if canEdit && onEdit}
			<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
				<DropdownMenu.Item onclick={() => onEdit(lpo)}>
					<Pencil class="mr-2 h-4 w-4" />
					Edit
				</DropdownMenu.Item>
			</Guard>
		{/if}

		<!-- Submit Action (KTU) -->
		{#if isDraft && onSubmit}
			<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.UPDATE}>
				<DropdownMenu.Item onclick={() => onSubmit(lpo)} disabled={isSubmitting}>
					<Send class="mr-2 h-4 w-4" />
					{isSubmitting ? 'Mengajukan...' : 'Ajukan'}
				</DropdownMenu.Item>
			</Guard>
		{/if}

		<!-- Cancel Action (KTU) - REQ-017 -->
		{#if canCancelKTU && onCancel}
			<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.CREATE}>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => onCancel(lpo)} class="text-destructive">
					<Ban class="mr-2 h-4 w-4" />
					Batalkan
				</DropdownMenu.Item>
			</Guard>
		{/if}

		<!-- Cancel Action (Manager) - REQ-019 -->
		{#if canCancelManager && !canCancelKTU && onCancel}
			<Guard permissions={LOCAL_PURCHASE_ORDER_PERMISSIONS.APPROVAL_MANAGER_UPDATE}>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => onCancel(lpo)} class="text-destructive">
					<Ban class="mr-2 h-4 w-4" />
					Batalkan
				</DropdownMenu.Item>
			</Guard>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
