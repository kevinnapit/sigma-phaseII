<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Plus, Search, Trash2 } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';

	let {
		items = $bindable([]),
		onSaveItem,
		onEditItem,
		onDeleteItem
	}: {
		items?: any[];
		onSaveItem?: (item: any) => void;
		onEditItem?: (index: number, item: any) => void;
		onDeleteItem?: (index: number) => void;
	} = $props();

	let searchQuery = $state('');
	let filteredItems = $state([]);
	let showResults = $state(false);

	// Mock items for search
	const mockItems = [
		{ code: 'BRG-001', name: 'Pupuk NPK 50kg', uom: 'Sak', class: 'Pupuk' },
		{ code: 'BRG-002', name: 'Oli Mesin SAE 40', uom: 'Liter', class: 'Oli' },
		{ code: 'BRG-003', name: 'Filter Udara', uom: 'Pcs', class: 'Spare Part' },
		{ code: 'BRG-004', name: 'Herbisida Glifosat', uom: 'Liter', class: 'Pestisida' },
		{ code: 'BRG-005', name: 'Insektisida', uom: 'Liter', class: 'Pestisida' },
		{ code: 'BRG-006', name: 'Spare Part Mesin', uom: 'Unit', class: 'Spare Part' },
		{ code: 'BRG-007', name: 'Alat Tulis Kantor', uom: 'Set', class: 'ATK' },
		{ code: 'BRG-008', name: 'Tinta Printer', uom: 'Pcs', class: 'ATK' },
		{ code: 'BRG-009', name: 'Pupuk Urea 50kg', uom: 'Sak', class: 'Pupuk' },
		{ code: 'BRG-010', name: 'Pupuk TSP 50kg', uom: 'Sak', class: 'Pupuk' }
	];

	// Watch for search query changes
	$effect(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query || query.length < 1) {
			filteredItems = [];
			showResults = false;
			return;
		}
		
		const results = mockItems.filter(item => 
			item.code.toLowerCase().includes(query) || 
			item.name.toLowerCase().includes(query)
		);
		
		filteredItems = results;
		showResults = true;
	});

	function selectItem(item: any) {
		// Add item with default values
		const newItem = {
			item_code: item.code,
			item_name: item.name,
			quantity: 1,
			uom: item.uom,
			required_date: new Date().toISOString().split('T')[0],
			purpose: 'Kebutuhan operasional'
		};
		
		// Check if item already exists
		const existingIndex = items.findIndex(existingItem => existingItem.item_code === item.code);
		if (existingIndex >= 0) {
			// If item exists, increase quantity
			items[existingIndex].quantity += 1;
			items = [...items]; // Trigger reactivity
		} else {
			// Add new item
			onSaveItem?.(newItem);
		}
		
		// Clear search
		searchQuery = '';
		showResults = false;
	}

	function addEmptyRow() {
		const newItem = {
			item_code: '',
			item_name: '',
			quantity: 1,
			uom: '',
			required_date: new Date().toISOString().split('T')[0],
			purpose: 'Kebutuhan operasional'
		};
		onSaveItem?.(newItem);
	}

	function deleteItem(index: number) {
		onDeleteItem?.(index);
	}

	function updateItem(index: number, field: string, value: any) {
		if (items[index]) {
			items[index][field] = value;
			items = [...items]; // Trigger reactivity
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Cari & Tambah Item</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Search Section -->
		<div class="space-y-2">
			<div class="relative">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Ketik kode atau nama item untuk mencari..."
					bind:value={searchQuery}
					class="pl-10"
				/>
			</div>
			
			{#if showResults && searchQuery.trim()}
				<div class="max-h-[200px] space-y-1 overflow-y-auto rounded-lg border bg-background p-2">
					{#if filteredItems.length === 0}
						<div class="py-4 text-center text-sm text-muted-foreground">
							Tidak ada item ditemukan
						</div>
					{:else}
						<div class="text-xs text-muted-foreground mb-2 px-2">
							Ditemukan {filteredItems.length} item
						</div>
						{#each filteredItems as item (item.code)}
							<button
								type="button"
								class="w-full rounded p-2 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
								onclick={() => selectItem(item)}
							>
								<div class="font-medium">{item.code} - {item.name}</div>
								<div class="text-xs text-muted-foreground">{item.class} • {item.uom}</div>
							</button>
						{/each}
					{/if}
				</div>
			{:else if searchQuery.trim()}
				<div class="text-center py-4 text-sm text-muted-foreground">
					Mulai mengetik untuk mencari item<br>
					<span class="text-xs">Masukkan minimal 1 karakter untuk memulai pencarian</span>
				</div>
			{/if}
		</div>

		<!-- Items Table -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-base font-medium">Daftar Permintaan ({items.length})</h3>
			</div>

			{#if items.length === 0}
				<div class="rounded-lg border border-dashed p-8 text-center">
					<p class="text-sm text-muted-foreground">
						Belum ada item. Cari item di atas untuk menambahkan ke daftar.
					</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="border-b bg-muted/50">
								<th class="p-2 text-left text-sm font-medium">Kode - Nama Item</th>
								<th class="p-2 text-left text-sm font-medium">UOM</th>
								<th class="p-2 text-left text-sm font-medium">Qty</th>
								<th class="p-2 text-left text-sm font-medium">Tanggal Butuh</th>
								<th class="p-2 text-left text-sm font-medium">Tujuan</th>
								<th class="p-2 text-center text-sm font-medium">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b">
									<td class="p-2">
										<div class="space-y-1">
											<div class="font-medium text-sm">{item.item_code} - {item.item_name}</div>
											<div class="text-xs text-muted-foreground">{item.item_code}</div>
										</div>
									</td>
									<td class="p-2">
										<Input
											bind:value={item.uom}
											placeholder="UOM"
											class="h-8 text-sm cursor-not-allowed bg-muted"
											readonly
										/>
									</td>
									<td class="p-2">
										<Input
											type="number"
											bind:value={item.quantity}
											min="1"
											class="h-8 text-sm"
											onchange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
										/>
									</td>
									<td class="p-2">
										<Input
											type="date"
											bind:value={item.required_date}
											class="h-8 text-sm"
											onchange={(e) => updateItem(index, 'required_date', e.target.value)}
										/>
									</td>
									<td class="p-2">
										<Input
											bind:value={item.purpose}
											placeholder="Tujuan penggunaan"
											class="h-8 text-sm"
											onchange={(e) => updateItem(index, 'purpose', e.target.value)}
										/>
									</td>
									<td class="p-2 text-center">
										<Button
											variant="ghost"
											size="icon"
											class="h-8 w-8"
											onclick={() => deleteItem(index)}
										>
											<Trash2 class="h-4 w-4 text-destructive" />
										</Button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</CardContent>
</Card>