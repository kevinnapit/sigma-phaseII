<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save } from 'lucide-svelte';
	import { mockRacks, mockStorageCells } from '../api/item-storage.mock';
	import type { ItemStorageAssignmentCreatePayload } from '../types/item-storage.types';
	import ItemStorageConfirmModal from './ItemStorageConfirmModal.svelte';

	interface Props {
		formData: ItemStorageAssignmentCreatePayload;
		isPending?: boolean;
		onSave?: () => void;
	}

	let { formData, isPending = false, onSave }: Props = $props();

	let confirmOpen = $state(false);

	const selectedRack = $derived(mockRacks.find((r) => r.id === formData.rack_id));
	const selectedCell = $derived(mockStorageCells.find((c) => c.id === formData.cell_id));

	const filledItems = $derived(
		formData.items.filter((i) => i.item_code.trim() && i.item_name.trim())
	);

	// Mock item catalog (same as FormCard) for group info
	const mockItemCatalog = [
		{ item_code: '7037104', group_parent_code: 'GF', group_code: 'GFA' },
		{ item_code: '8011002', group_parent_code: 'GF', group_code: 'GFB' },
		{ item_code: '7000000', group_parent_code: 'AA', group_code: 'AAH' },
		{ item_code: '7000001', group_parent_code: 'AA', group_code: 'AAH' },
		{ item_code: '7000004', group_parent_code: 'AA', group_code: 'AAB' },
		{ item_code: '7000005', group_parent_code: 'AA', group_code: 'AAC' },
		{ item_code: '7000006', group_parent_code: 'AA', group_code: 'AAD' },
		{ item_code: '7011812', group_parent_code: 'JA', group_code: 'JAO' },
		{ item_code: '7011814', group_parent_code: 'JA', group_code: 'JAO' },
		{ item_code: '7021129', group_parent_code: 'JA', group_code: 'JAP' },
		{ item_code: '8011001', group_parent_code: 'BF', group_code: 'BFA' },
		{ item_code: '7006825', group_parent_code: 'EM', group_code: 'EMA' },
	];

	// Unique group codes from assigned items
	const assignedGroupCodes = $derived.by(() => {
		const codes = filledItems
			.map((item) => mockItemCatalog.find((c) => c.item_code === item.item_code)?.group_code ?? '')
			.filter(Boolean);
		return [...new Set(codes)];
	});

	const isValid = $derived(
		!!formData.rack_id &&
		!!formData.cell_id &&
		filledItems.length > 0
	);

	function handleSaveClick() {
		if (!isValid) return;
		confirmOpen = true;
	}

	function handleConfirm() {
		confirmOpen = false;
		onSave?.();
	}
</script>

<div class="space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Ringkasan Penugasan</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-3 text-sm">
				<div class="grid grid-cols-2 gap-x-4 gap-y-3">
					<div>
						<p class="text-xs text-muted-foreground">RAK</p>
						<p class="font-medium">{selectedRack?.rack_name ?? '-'}</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">CELL</p>
						<p class="font-medium">{selectedCell?.cell_code ?? '-'}</p>
					</div>
					<div class="col-span-2">
						<p class="text-xs text-muted-foreground">Kode Group Barang</p>
						<p class="font-medium">
							{assignedGroupCodes.length > 0 ? assignedGroupCodes.join(' / ') : '-'}
						</p>
					</div>
					<div class="col-span-2">
						<p class="text-xs text-muted-foreground">Jumlah Barang</p>
						<p class="font-medium">{filledItems.length} barang</p>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Button
		class="w-full bg-[#0f4c2a] hover:bg-[#0d4023]"
		onclick={handleSaveClick}
		disabled={!isValid || isPending}
	>
		<Save class="mr-2 h-4 w-4" />
		{isPending ? 'Menyimpan...' : 'Simpan Penugasan'}
	</Button>

	{#if !isValid}
		<p class="text-center text-xs text-muted-foreground">
			Pilih rak, cell, dan isi minimal 1 barang.
		</p>
	{/if}
</div>

<ItemStorageConfirmModal
	bind:open={confirmOpen}
	{isPending}
	onConfirm={handleConfirm}
	onCancel={() => (confirmOpen = false)}
/>
