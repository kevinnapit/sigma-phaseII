<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus } from 'lucide-svelte';
	import type { ItemComprehensiveData } from '$lib/features/material-management/inventory/master/item';

	let {
		open = $bindable(false),
		item,
		onAdd
	}: {
		open?: boolean;
		item: ItemComprehensiveData | null;
		onAdd: (quantity: number) => void;
	} = $props();

	let quantity = $state(1);
	let error = $state('');

	const uom = $derived(
		item?.base_uom ? `${item.base_uom.name} (${item.base_uom.code})` : '-'
	);

	function handleAdd() {
		error = '';

		if (!quantity || quantity <= 0) {
			error = 'Jumlah harus lebih dari 0';
			return;
		}

		onAdd(quantity);
		quantity = 1;
		error = '';
		open = false;
	}

	function handleCancel() {
		quantity = 1;
		error = '';
		open = false;
	}

	// Reset when modal opens
	$effect(() => {
		if (open) {
			console.log('Modal opened, item:', item);
			quantity = 1;
			error = '';
		}
	});

	// Auto-close if item becomes null
	$effect(() => {
		if (open && !item) {
			console.warn('Modal opened but item is null, closing...');
			open = false;
		}
	});

	// Debug log for open state changes
	$effect(() => {
		console.log('AddItemModal open state changed:', open);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Tambah Item ke Keranjang</Dialog.Title>
			<Dialog.Description>
				Masukkan jumlah yang dibutuhkan untuk item ini
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- Item Info -->
			<div class="rounded-lg border bg-muted/50 p-3">
				<p class="font-semibold text-sm">{item?.code || '-'} - {item?.name || '-'}</p>
				<p class="text-xs text-muted-foreground mt-1">Satuan: {uom}</p>
			</div>

			<!-- Quantity Input -->
			<div class="space-y-2">
				<Label for="quantity">
					Jumlah <span class="text-red-500">*</span>
				</Label>
				<Input
					id="quantity"
					type="number"
					bind:value={quantity}
					min="0.0001"
					step="0.0001"
					placeholder="Masukkan jumlah"
					class={error ? 'border-red-500' : ''}
				/>
				{#if error}
					<p class="text-xs text-red-600">{error}</p>
				{/if}
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={handleCancel}>Batal</Button>
			<Button onclick={handleAdd} disabled={!item}>
				<Plus class="mr-2 h-4 w-4" />
				Tambah ke Keranjang
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
