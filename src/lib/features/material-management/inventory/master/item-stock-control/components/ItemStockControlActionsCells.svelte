<script lang="ts">
	import { Eye, FilePlus, Send, Ellipsis, LoaderCircle, PowerOff } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { ItemUsageWithRequest } from '../types/item-stock-control.types';
	import { ITEM_STOCK_CONTROL_PERMISSIONS } from '../constants/item-stock-control-permissions';

	interface Props {
		item: ItemUsageWithRequest;
		onViewDetail: (item: ItemUsageWithRequest) => void;
		onCreateRequest: (item: ItemUsageWithRequest) => void;
		onSubmit?: (item: ItemUsageWithRequest) => void;
		onDeactivate?: (item: ItemUsageWithRequest) => void;
		isSubmitting?: boolean;
	}

	let {
		item,
		onViewDetail,
		onCreateRequest,
		onSubmit,
		onDeactivate,
		isSubmitting = false
	}: Props = $props();

	const canViewDetail = $derived(item.approval_status !== 'NO_REQUEST' && !!item.latest_request_id);
	const canCreate = $derived(item.approval_status === 'NO_REQUEST');
	const canSubmit = $derived(item.approval_status === 'DRAFT' && !!item.latest_request_id);
	const canDeactivate = $derived(
		item.approval_status === 'APPROVED' &&
			item.latest_request_status !== 'NONACTIVE' &&
			!!item.latest_request_id
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="h-8 w-8 p-0">
				<span class="sr-only">Buka menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#if canViewDetail}
			<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.DETAIL_VIEW}>
				<DropdownMenu.Item onclick={() => onViewDetail(item)}>
					<Eye class="h-4 w-4" />
					Lihat Detail
				</DropdownMenu.Item>
			</Guard>
		{/if}
		{#if canSubmit && onSubmit}
			<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.UPDATE}>
				<DropdownMenu.Item onclick={() => onSubmit(item)} disabled={isSubmitting}>
					{#if isSubmitting}
						<LoaderCircle class="h-4 w-4 animate-spin" />
						Mengajukan...
					{:else}
						<Send class="h-4 w-4" />
						Ajukan
					{/if}
				</DropdownMenu.Item>
			</Guard>
		{/if}
		{#if canCreate}
			<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.CREATE}>
				<DropdownMenu.Item onclick={() => onCreateRequest(item)}>
					<FilePlus class="h-4 w-4" />
					Buat Permintaan
				</DropdownMenu.Item>
			</Guard>
		{/if}
		{#if canDeactivate && onDeactivate}
			<Guard permissions={ITEM_STOCK_CONTROL_PERMISSIONS.NONACTIVE_CREATE}>
				<DropdownMenu.Item
					onclick={() => onDeactivate(item)}
					class="text-destructive focus:text-destructive"
				>
					<PowerOff class="h-4 w-4" />
					Nonaktifkan
				</DropdownMenu.Item>
			</Guard>
		{/if}
		{#if !canViewDetail && !canCreate && !canSubmit && !canDeactivate}
			<DropdownMenu.Item disabled>
				<span class="text-sm text-muted-foreground">Tidak ada aksi</span>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
