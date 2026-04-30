<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Plus, Trash2 } from 'lucide-svelte';

	export interface BatchwiseEntry {
		id: string;
		batch: string;
		expiry_date: string;
		manufacture: string;
		quantity: number;
		storage_location: string;
	}

	let {
		open = $bindable(false),
		itemName = '',
		entries = $bindable<BatchwiseEntry[]>([]),
		readonly = false,
		onConfirm
	}: {
		open?: boolean;
		itemName?: string;
		entries?: BatchwiseEntry[];
		readonly?: boolean;
		onConfirm?: (entries: BatchwiseEntry[]) => void;
	} = $props();

	// Local copy while editing
	let localEntries = $state<BatchwiseEntry[]>([]);

	$effect(() => {
		if (open) {
			localEntries = entries.length > 0
				? entries.map(e => ({ ...e }))
				: [newRow()];
		}
	});

	function newRow(): BatchwiseEntry {
		return {
			id: `bw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			batch: '',
			expiry_date: '',
			manufacture: '',
			quantity: 0,
			storage_location: ''
		};
	}

	function addRow() {
		localEntries = [...localEntries, newRow()];
	}

	function removeRow(id: string) {
		if (localEntries.length === 1) return;
		localEntries = localEntries.filter(e => e.id !== id);
	}

	function handleConfirm() {
		const valid = localEntries.filter(e => e.batch.trim() || e.quantity > 0);
		onConfirm?.(valid.length > 0 ? valid : []);
		open = false;
	}

	function handleCancel() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Batchwise Transfer</Dialog.Title>
			{#if itemName}
				<Dialog.Description>{itemName}</Dialog.Description>
			{/if}
		</Dialog.Header>

		<div class="overflow-x-auto rounded-md border">
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-b bg-muted/60">
						<th class="p-2 text-left font-medium" style="min-width:140px;">Batch</th>
						<th class="p-2 text-left font-medium" style="min-width:130px;">Expiry Date</th>
						<th class="p-2 text-left font-medium" style="min-width:130px;">Manufacture</th>
						<th class="p-2 text-left font-medium" style="min-width:100px;">Quantity</th>
						<th class="p-2 text-left font-medium" style="min-width:150px;">Storage Location</th>
						{#if !readonly}
							<th class="p-2 text-center font-medium" style="min-width:50px;"></th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each localEntries as entry (entry.id)}
						<tr class="border-b last:border-0">
							<td class="p-1.5">
								{#if readonly}
									<span class="px-1">{entry.batch || '-'}</span>
								{:else}
									<Input
										bind:value={entry.batch}
										placeholder="No. Batch"
										class="h-8 text-sm"
									/>
								{/if}
							</td>
							<td class="p-1.5">
								{#if readonly}
									<span class="px-1">{entry.expiry_date || '-'}</span>
								{:else}
									<Input
										type="date"
										bind:value={entry.expiry_date}
										class="h-8 text-sm"
									/>
								{/if}
							</td>
							<td class="p-1.5">
								{#if readonly}
									<span class="px-1">{entry.manufacture || '-'}</span>
								{:else}
									<Input
										type="date"
										bind:value={entry.manufacture}
										class="h-8 text-sm"
									/>
								{/if}
							</td>
							<td class="p-1.5">
								{#if readonly}
									<span class="px-1">{entry.quantity}</span>
								{:else}
									<Input
										type="number"
										min="0"
										bind:value={entry.quantity}
										class="h-8 text-sm"
									/>
								{/if}
							</td>
							<td class="p-1.5">
								{#if readonly}
									<span class="px-1">{entry.storage_location || '-'}</span>
								{:else}
									<Input
										bind:value={entry.storage_location}
										placeholder="Lokasi"
										class="h-8 text-sm"
									/>
								{/if}
							</td>
							{#if !readonly}
								<td class="p-1.5 text-center">
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7"
										onclick={() => removeRow(entry.id)}
										disabled={localEntries.length === 1}
									>
										<Trash2 class="h-3.5 w-3.5 text-destructive" />
									</Button>
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if !readonly}
			<Button variant="outline" size="sm" class="mt-2 gap-1.5" onclick={addRow}>
				<Plus class="h-3.5 w-3.5" />
				Tambah Baris
			</Button>
		{/if}

		<Dialog.Footer class="mt-4">
			<Button variant="outline" onclick={handleCancel}>
				{readonly ? 'Tutup' : 'Batal'}
			</Button>
			{#if !readonly}
				<Button onclick={handleConfirm}>OK</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
