<script lang="ts">
	import { Eye, Ellipsis, Send } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import Guard from '$lib/components/shared/guard.svelte';
	import type { GRNItem } from '../types/goods-receives-notes.types';
	import { GOODS_RECEIVES_NOTES_PERMISSIONS } from '../constants/goods-receives-notes-permissions';

	let {
		grn,
		onViewDetail,
		onSubmit,
		isSubmitting = false
	}: {
		grn: GRNItem;
		onViewDetail: (grn: GRNItem) => void;
		onSubmit?: (grn: GRNItem) => void;
		isSubmitting?: boolean;
	} = $props();

	const isDraft = $derived(grn.approval_status === 'DRAFT');
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<Ellipsis class="h-4 w-4" />
				<span class="sr-only">Buka menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.DETAIL_VIEW}>
			<DropdownMenu.Item onclick={() => onViewDetail(grn)}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		{#if isDraft && onSubmit}
			<Guard permissions={GOODS_RECEIVES_NOTES_PERMISSIONS.UPDATE}>
				<DropdownMenu.Item onclick={() => onSubmit(grn)} disabled={isSubmitting}>
					<Send class="h-4 w-4" />
					{isSubmitting ? 'Mengajukan...' : 'Ajukan'}
				</DropdownMenu.Item>
			</Guard>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
