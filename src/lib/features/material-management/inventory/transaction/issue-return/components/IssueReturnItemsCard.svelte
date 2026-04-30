<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search, Trash2, Plus } from 'lucide-svelte';

	let {
		items = [],
		onSaveItem,
		onEditItem,
		onDeleteItem,
		readonly = false
	}: {
		items?: any[];
		onSaveItem?: (item: any) => void;
		onEditItem?: (index: number, item: any) => void;
		onDeleteItem?: (index: number) => void;
		readonly?: boolean;
	} = $props();

	let searchQuery = $state('');
	let showSearchResults = $state(false);
	let searchInputRef: HTMLInputElement | null = null;

	// Mock item data with multiple storage locations (rak penyimpanan)
	const mockItems = [
		{ 
			code: 'BRG-001', 
			name: 'Pupuk NPK 50kg',
			storage_locations: [
				{ storage_location: 'JAC-2', batch_no: 'BATCH-2026-001', uom: 'Sak', unit_rate: 150000 },
				{ storage_location: 'JAC-3', batch_no: 'BATCH-2026-011', uom: 'Sak', unit_rate: 150000 },
				{ storage_location: 'RAK-A-01', batch_no: 'BATCH-2026-021', uom: 'Sak', unit_rate: 150000 }
			],
			allocations: ['ALLOC-001', 'ALLOC-002', 'ALLOC-003'],
			geo_units: ['Divisi 1', 'Divisi 2', 'Divisi 3'],
			issue_numbers: [
				{ issue_number: 'Issue/2026/0001', issue_qty: 50 },
				{ issue_number: 'Issue/2026/0011', issue_qty: 30 },
				{ issue_number: 'Issue/2026/0021', issue_qty: 40 }
			]
		},
		{ 
			code: 'BRG-002', 
			name: 'Oli Mesin SAE 40',
			storage_locations: [
				{ storage_location: 'RAK-A-01', batch_no: 'BATCH-2026-002', uom: 'Liter', unit_rate: 85000 },
				{ storage_location: 'RAK-B-05', batch_no: 'BATCH-2026-012', uom: 'Liter', unit_rate: 85000 }
			],
			allocations: ['ALLOC-001', 'ALLOC-004'],
			geo_units: ['Divisi 1', 'Divisi 2'],
			issue_numbers: [
				{ issue_number: 'Issue/2026/0002', issue_qty: 20 },
				{ issue_number: 'Issue/2026/0012', issue_qty: 15 }
			]
		},
		{ 
			code: 'BRG-003', 
			name: 'Filter Udara',
			storage_locations: [
				{ storage_location: 'RAK-B-05', batch_no: 'BATCH-2026-003', uom: 'Pcs', unit_rate: 45000 }
			],
			allocations: ['ALLOC-003'],
			geo_units: ['Divisi 3'],
			issue_numbers: [
				{ issue_number: 'Issue/2026/0003', issue_qty: 10 }
			]
		},
		{ 
			code: 'BRG-004', 
			name: 'Herbisida Glifosat',
			storage_locations: [
				{ storage_location: 'JAC-3', batch_no: 'BATCH-2026-004', uom: 'Liter', unit_rate: 120000 },
				{ storage_location: 'RAK-C-12', batch_no: 'BATCH-2026-014', uom: 'Liter', unit_rate: 120000 }
			],
			allocations: ['ALLOC-001', 'ALLOC-004'],
			geo_units: ['Divisi 1', 'Divisi 4'],
			issue_numbers: [
				{ issue_number: 'Issue/2026/0004', issue_qty: 30 },
				{ issue_number: 'Issue/2026/0014', issue_qty: 25 }
			]
		},
		{ 
			code: 'BRG-005', 
			name: 'Insektisida',
			storage_locations: [
				{ storage_location: 'RAK-C-12', batch_no: 'BATCH-2026-005', uom: 'Liter', unit_rate: 95000 }
			],
			allocations: ['ALLOC-002', 'ALLOC-005'],
			geo_units: ['Divisi 2'],
			issue_numbers: [
				{ issue_number: 'Issue/2026/0005', issue_qty: 15 }
			]
		}
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
		// Add item with default selections (first option of each dropdown)
		const firstStorage = item.storage_locations[0];
		const firstIssue = item.issue_numbers[0];
		
		const newItem = {
			item_code: item.code,
			item_name: item.name,
			// Dropdown options
			storage_locations: item.storage_locations,
			allocations: item.allocations,
			geo_units: item.geo_units,
			issue_numbers: item.issue_numbers,
			// Selected values
			storage_location: firstStorage.storage_location,
			allocation_code: item.allocations[0],
			geographical_unit: item.geo_units[0],
			issue_number: firstIssue.issue_number,
			// Auto-filled based on storage location selection
			batch_no: firstStorage.batch_no,
			uom: firstStorage.uom,
			unit_rate: firstStorage.unit_rate,
			// Auto-filled based on issue number selection
			issue_quantity: firstIssue.issue_qty,
			// User input
			quantity_returned: 1,
			remarks: ''
		};
		onSaveItem?.(newItem);
		searchQuery = '';
		showSearchResults = false;
	}

	function handleStorageLocationChange(index: number, storageLocation: string) {
		const item = items[index];
		const selectedStorage = item.storage_locations?.find((s: any) => s.storage_location === storageLocation);
		if (selectedStorage) {
			const updatedItem = {
				...item,
				storage_location: storageLocation,
				batch_no: selectedStorage.batch_no,
				uom: selectedStorage.uom,
				unit_rate: selectedStorage.unit_rate
			};
			onEditItem?.(index, updatedItem);
		}
	}

	function handleAllocationChange(index: number, value: string) {
		const updatedItem = { ...items[index], allocation_code: value };
		onEditItem?.(index, updatedItem);
	}

	function handleGeoUnitChange(index: number, value: string) {
		const updatedItem = { ...items[index], geographical_unit: value };
		onEditItem?.(index, updatedItem);
	}

	function handleIssueNumberChange(index: number, issueNumber: string) {
		const item = items[index];
		const selectedIssue = item.issue_numbers?.find((i: any) => i.issue_number === issueNumber);
		if (selectedIssue) {
			const updatedItem = {
				...item,
				issue_number: issueNumber,
				issue_quantity: selectedIssue.issue_qty
			};
			onEditItem?.(index, updatedItem);
		}
	}

	function handleQuantityChange(index: number, value: string) {
		const quantity = parseInt(value) || 1;
		const updatedItem = { ...items[index], quantity_returned: quantity };
		onEditItem?.(index, updatedItem);
	}

	function handleRemarksChange(index: number, value: string) {
		const updatedItem = { ...items[index], remarks: value };
		onEditItem?.(index, updatedItem);
	}

	// Close dropdown when clicking outside
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			const searchInput = searchInputRef;
			if (searchInput && !searchInput.contains(target) && !target.closest('.search-results')) {
				showSearchResults = false;
			}
		}

		if (showSearchResults) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">{readonly ? 'Daftar Barang Dikembalikan' : 'Cari & Tambah Barang'}</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Search - Only show if not readonly -->
		{#if !readonly}
			<div class="relative">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					bind:this={searchInputRef}
					bind:value={searchQuery}
					placeholder="Ketik kode, nama barang, atau nomor issue untuk mencari..."
					class="pl-9"
					onfocus={() => showSearchResults = true}
					oninput={() => showSearchResults = true}
				/>
				
				<!-- Search Results Dropdown -->
				{#if showSearchResults && searchQuery.trim()}
					<div class="search-results absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
						{#if filteredItems().length > 0}
							<div class="max-h-[300px] overflow-y-auto p-1">
								<p class="px-3 py-2 text-xs text-muted-foreground">Ditemukan {filteredItems().length} barang</p>
								{#each filteredItems() as item}
									<button
										type="button"
										class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left hover:bg-accent"
										onclick={() => handleSelectItem(item)}
									>
										<div class="flex-1">
											<p class="font-medium text-sm">{item.code} - {item.name}</p>
											<p class="text-xs text-muted-foreground">
												{item.storage_locations.length} rak • {item.issue_numbers.length} issue tersedia
											</p>
										</div>
										<Button size="sm" variant="ghost" class="h-7 text-xs">Pilih</Button>
									</button>
								{/each}
							</div>
						{:else}
							<div class="p-4 text-center text-sm text-muted-foreground">
								Tidak ada barang yang ditemukan
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Items Table -->
		{#if items.length > 0}
			<div class="rounded-md border">
				<div class="overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="border-b bg-muted/50">
								<th class="p-2 text-left text-sm font-medium" style="min-width: 220px;">Kode - Nama Barang</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 160px;">Nomor Issue</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 140px;">Unit Geografis</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 140px;">Kode Alokasi</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 80px;">Satuan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 100px;">Jumlah Issue</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 120px;">Harga Satuan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 120px;">Jumlah Kembali</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 150px;">Keterangan</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 140px;">Nomor Batch</th>
								<th class="p-2 text-left text-sm font-medium" style="min-width: 180px;">Rak Penyimpanan Barang</th>
								{#if !readonly}
									<th class="p-2 text-center text-sm font-medium" style="min-width: 80px;">Aksi</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each items as item, index}
								<tr class="border-b">
									<td class="p-2">
										<div class="font-medium text-sm">{item.item_code} - {item.item_name}</div>
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.issue_number || '-'}</span>
										{:else if item.issue_numbers && item.issue_numbers.length > 0}
											<select
												value={item.issue_number}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleIssueNumberChange(index, e.currentTarget.value)}
											>
												{#each item.issue_numbers as issueOpt}
													<option value={issueOpt.issue_number}>{issueOpt.issue_number}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.issue_number || '-'}</span>
										{/if}
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.geographical_unit || '-'}</span>
										{:else if item.geo_units && item.geo_units.length > 0}
											<select
												value={item.geographical_unit}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleGeoUnitChange(index, e.currentTarget.value)}
											>
												{#each item.geo_units as geoUnit}
													<option value={geoUnit}>{geoUnit}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.geographical_unit || '-'}</span>
										{/if}
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.allocation_code || '-'}</span>
										{:else if item.allocations && item.allocations.length > 0}
											<select
												value={item.allocation_code}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleAllocationChange(index, e.currentTarget.value)}
											>
												{#each item.allocations as alloc}
													<option value={alloc}>{alloc}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.allocation_code || '-'}</span>
										{/if}
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.uom}</span>
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.issue_quantity}</span>
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{new Intl.NumberFormat('id-ID').format(item.unit_rate)}</span>
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.quantity_returned}</span>
										{:else}
											<Input
												type="number"
												value={item.quantity_returned}
												min="1"
												max={item.issue_quantity}
												class="h-8 text-sm"
												oninput={(e) => handleQuantityChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.remarks || '-'}</span>
										{:else}
											<Input
												value={item.remarks}
												placeholder="Keterangan"
												class="h-8 text-sm"
												oninput={(e) => handleRemarksChange(index, e.currentTarget.value)}
											/>
										{/if}
									</td>
									<td class="p-2">
										<span class="text-sm text-muted-foreground">{item.batch_no}</span>
									</td>
									<td class="p-2">
										{#if readonly}
											<span class="text-sm text-muted-foreground">{item.storage_location || '-'}</span>
										{:else if item.storage_locations && item.storage_locations.length > 0}
											<select
												value={item.storage_location}
												class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
												onchange={(e) => handleStorageLocationChange(index, e.currentTarget.value)}
											>
												{#each item.storage_locations as storage}
													<option value={storage.storage_location}>{storage.storage_location}</option>
												{/each}
											</select>
										{:else}
											<span class="text-sm text-muted-foreground">{item.storage_location || '-'}</span>
										{/if}
									</td>
									{#if !readonly}
										<td class="p-2 text-center">
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												onclick={() => onDeleteItem?.(index)}
											>
												<Trash2 class="h-4 w-4 text-destructive" />
											</Button>
										</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="text-sm text-muted-foreground">
				Total: {items.length} barang
			</div>
		{:else}
			{#if readonly}
				<div class="rounded-lg border border-dashed p-8 text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Search class="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">Tidak Ada Barang</h3>
					<p class="text-sm text-muted-foreground">
						Tidak ada barang yang dikembalikan dalam transaksi ini
					</p>
				</div>
			{:else}
				<div class="rounded-lg border border-dashed p-8 text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Search class="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">Belum Ada Barang</h3>
					<p class="text-sm text-muted-foreground">
						Cari dan tambahkan barang yang akan dikembalikan
					</p>
				</div>
			{/if}
		{/if}
	</CardContent>
</Card>
