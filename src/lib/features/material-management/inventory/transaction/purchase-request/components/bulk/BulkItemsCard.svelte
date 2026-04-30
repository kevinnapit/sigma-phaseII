<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search, Trash2, Eye } from 'lucide-svelte';
	import { usePurchasingGroups } from '../../hooks/usePurchaseRequestQueries.svelte';
	import ItemStockPriceModal from './ItemStockPriceModal.svelte';

	let {
		items = [],
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
	let showSearchResults = $state(false);
	let searchInputRef: HTMLInputElement | null = null;
	let showStockPriceModal = $state(false);
	let selectedItemForModal = $state<any>(null);

	// Load purchasing groups (departments)
	const purchasingGroupsQuery = usePurchasingGroups(() => true);
	const departments = $derived(purchasingGroupsQuery.data?.data || []);

	// Mock item data (10 items)
	const mockItems = [
		{ code: 'BRG-001', name: 'Pupuk NPK 50kg', uom: 'Sak' },
		{ code: 'BRG-002', name: 'Oli Mesin SAE 40', uom: 'Liter' },
		{ code: 'BRG-003', name: 'Filter Udara', uom: 'Pcs' },
		{ code: 'BRG-004', name: 'Herbisida Glifosat', uom: 'Liter' },
		{ code: 'BRG-005', name: 'Insektisida', uom: 'Liter' },
		{ code: 'BRG-006', name: 'Spare Part Mesin', uom: 'Unit' },
		{ code: 'BRG-007', name: 'Alat Tulis Kantor', uom: 'Set' },
		{ code: 'BRG-008', name: 'Tinta Printer', uom: 'Pcs' },
		{ code: 'BRG-009', name: 'Kertas A4', uom: 'Rim' },
		{ code: 'BRG-010', name: 'Baterai AA', uom: 'Pack' }
	];

	const filteredItems = $derived(() => {
		if (!searchQuery.trim()) return [];
		const query = searchQuery.toLowerCase();
		return mockItems.filter(
			item =>
				item.code.toLowerCase().includes(query) ||
				item.name.toLowerCase().includes(query)
		);
	});

	function handleSelectItem(item: any) {
		const newItem = {
			item_code: item.code,
			item_name: item.name,
			uom: item.uom,
			quantity: 1,
			purpose: 'Kebutuhan operasional'
		};
		onSaveItem?.(newItem);
		searchQuery = '';
		showSearchResults = false;
	}

	// Close dropdown when clicking outside
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (searchInputRef && !searchInputRef.contains(target) && !target.closest('.search-results')) {
				showSearchResults = false;
			}
		}

		if (showSearchResults) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	function handleQuantityChange(index: number, value: string) {
		const quantity = parseInt(value) || 1;
		const updatedItem = { ...items[index], quantity };
		onEditItem?.(index, updatedItem);
	}

	function handleDepartmentChange(index: number, value: string) {
		const selectedDept = departments.find(d => d.uoid === value);
		const updatedItem = { 
			...items[index], 
			department_id: value,
			department_name: selectedDept ? `${selectedDept.code} - ${selectedDept.name}` : ''
		};
		onEditItem?.(index, updatedItem);
	}

	function handlePurposeChange(index: number, value: string) {
		const updatedItem = { ...items[index], purpose: value };
		onEditItem?.(index, updatedItem);
	}

	function handleViewItem(index: number) {
		selectedItemForModal = items[index];
		showStockPriceModal = true;
	}
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Cari & Tambah Item</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Search -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				bind:this={searchInputRef}
				bind:value={searchQuery}
				placeholder="Ketik kode atau nama item untuk mencari..."
				class="pl-9"
				onfocus={() => showSearchResults = true}
				oninput={() => showSearchResults = true}
			/>
			
			<!-- Search Results Dropdown -->
			{#if showSearchResults && searchQuery.trim()}
				<div class="search-results absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
					{#if filteredItems().length > 0}
						<div class="max-h-[300px] overflow-y-auto p-1">
							<p class="px-3 py-2 text-xs text-muted-foreground">Ditemukan {filteredItems().length} item</p>
							{#each filteredItems() as item}
								<button
									type="button"
									class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left hover:bg-accent"
									onclick={() => handleSelectItem(item)}
								>
									<div class="flex-1">
										<p class="font-medium text-sm">{item.code} - {item.name}</p>
										<p class="text-xs text-muted-foreground">{item.name} • {item.uom}</p>
									</div>
									<Button size="sm" variant="ghost" class="h-7 text-xs">Pilih</Button>
								</button>
							{/each}
						</div>
					{:else}
						<div class="p-4 text-center text-sm text-muted-foreground">
							Tidak ada item yang ditemukan
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Items Table -->
		{#if items.length > 0}
			<div class="rounded-md border">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-muted/50">
							<tr class="border-b">
								<th class="px-4 py-3 text-left text-sm font-medium">Kode - Nama Item</th>
								<th class="px-4 py-3 text-left text-sm font-medium w-24">UOM</th>
								<th class="px-4 py-3 text-left text-sm font-medium w-24">Qty</th>
								<th class="px-4 py-3 text-left text-sm font-medium w-40">Departemen Tujuan</th>
								<th class="px-4 py-3 text-left text-sm font-medium">Tujuan</th>
								<th class="px-4 py-3 text-center text-sm font-medium w-24">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b last:border-0">
									<td class="px-4 py-3 text-sm">
										{item.item_code} - {item.item_name}
									</td>
									<td class="px-4 py-3 text-sm text-muted-foreground">
										{item.uom}
									</td>
									<td class="px-4 py-3">
										<Input
											type="number"
											value={item.quantity}
											min="1"
											class="h-8 w-20"
											oninput={(e) => handleQuantityChange(index, e.currentTarget.value)}
										/>
									</td>
									<td class="px-4 py-3">
										<select
											value={item.department_id || ''}
											class="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
											onchange={(e) => {
												const target = e.currentTarget as HTMLSelectElement;
												handleDepartmentChange(index, target.value);
											}}
										>
											<option value="">Pilih departemen</option>
											{#each departments as dept}
												<option value={dept.uoid}>{dept.code} - {dept.name}</option>
											{/each}
										</select>
									</td>
									<td class="px-4 py-3">
										<Input
											value={item.purpose}
											placeholder="Tujuan penggunaan"
											class="h-8"
											oninput={(e) => handlePurposeChange(index, e.currentTarget.value)}
										/>
									</td>
									<td class="px-4 py-3">
										<div class="flex items-center justify-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												onclick={() => handleViewItem(index)}
											>
												<Eye class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												onclick={() => onDeleteItem?.(index)}
											>
												<Trash2 class="h-4 w-4 text-destructive" />
											</Button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">
				Total: {items.length} item
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					<Search class="h-8 w-8 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">Keranjang Kosong</h3>
				<p class="text-sm text-muted-foreground">
					Cari dan tambahkan item untuk memulai permintaan
				</p>
			</div>
		{/if}
	</CardContent>
</Card>

<!-- Stock & Price Modal -->
<ItemStockPriceModal bind:open={showStockPriceModal} item={selectedItemForModal} />
