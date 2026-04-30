<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { 
		Clock, 
		Package, 
		ChevronRight,
		ChevronLeft,
		Circle,
		CheckCircle,
		Loader2,
		FileText
	} from 'lucide-svelte';
	import { useReadTrackingHistory } from '../hooks/usePurchaseRequestQueries.svelte';
	import type { TrackingStatusItem } from '../types/purchase-request.types';

	let {
		open = $bindable(false),
		requestId,
		prNumber
	}: {
		open?: boolean;
		requestId: string;
		prNumber: string;
	} = $props();
	
	// Fetch tracking data
	const trackingQuery = useReadTrackingHistory(() => requestId);
	const trackingData = $derived(trackingQuery.data?.data || []);
	const isLoading = $derived(trackingQuery.isLoading);
	
	// Group tracking by item
	const itemsTracking = $derived(() => {
		const grouped = new Map<string, {
			item_code: string;
			item_name: string;
			quantity: number;
			uom: string;
			latest_status: string;
			latest_status_label: string;
			latest_timestamp: string;
			latest_document: string;
			tracking: TrackingStatusItem[];
		}>();

		trackingData.forEach(track => {
			if (track.related_items && track.related_items.length > 0) {
				track.related_items.forEach(itemCode => {
					if (!grouped.has(itemCode)) {
						// Extract item info from remarks
						const itemInfo = extractItemInfo(track.remarks || '');
						grouped.set(itemCode, {
							item_code: itemCode,
							item_name: itemInfo.name,
							quantity: itemInfo.quantity,
							uom: itemInfo.uom,
							latest_status: track.status,
							latest_status_label: track.status_label,
							latest_timestamp: track.timestamp,
							latest_document: track.document_number,
							tracking: []
						});
					}
					grouped.get(itemCode)!.tracking.push(track);
				});
			}
		});

		return Array.from(grouped.values());
	});
	
	// Selected item for detail view
	let selectedItemCode = $state<string | null>(null);
	const selectedItem = $derived(
		selectedItemCode ? itemsTracking().find(item => item.item_code === selectedItemCode) : null
	);

	function extractItemInfo(remarks: string): { name: string; quantity: number; uom: string } {
		// Extract from format: "Item: Name (quantity uom)"
		const match = remarks.match(/Item:\s*([^(]+)\s*\((\d+)\s*(\w+)\)/);
		if (match) {
			return {
				name: match[1].trim(),
				quantity: parseInt(match[2]),
				uom: match[3]
			};
		}
		return { name: 'Unknown Item', quantity: 0, uom: '' };
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, '0');
		const month = date.toLocaleDateString('id-ID', { month: 'long' });
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
	}

	function formatDateShort(dateStr: string): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, '0');
		const month = date.toLocaleDateString('id-ID', { month: 'short' });
		return `${day} ${month}`;
	}

	function getStatusIcon(status: string) {
		if (status === 'COMPLETED') return CheckCircle;
		if (status.includes('PENDING') || status.includes('WAITING')) return Loader2;
		if (status === 'DRAFT') return Circle;
		return CheckCircle;
	}

	function getStatusColor(status: string): string {
		if (status === 'COMPLETED') return 'text-green-500';
		if (status.includes('PENDING') || status.includes('WAITING')) return 'text-yellow-500';
		if (status === 'DRAFT') return 'text-gray-400';
		return 'text-blue-500';
	}

	function handleItemClick(itemCode: string) {
		selectedItemCode = itemCode;
	}

	function handleBackToList() {
		selectedItemCode = null;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[80vh] max-w-3xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Clock class="h-5 w-5" />
				Tracking Status
			</Dialog.Title>
			<Dialog.Description>
				Kronologi status untuk dokumen <strong>{prNumber}</strong>
			</Dialog.Description>
		</Dialog.Header>

		<div class="py-4">
			{#if isLoading}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Package class="mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Memuat tracking data...</p>
				</div>
			{:else if itemsTracking().length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Package class="mb-4 h-12 w-12 text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Belum ada riwayat tracking</p>
				</div>
			{:else if selectedItem}
				<!-- Detail View: Full Timeline for Selected Item -->
				<div class="space-y-4">
					<Button
						variant="ghost"
						size="sm"
						onclick={handleBackToList}
						class="gap-2"
					>
						<ChevronLeft class="h-4 w-4" />
						Kembali ke Daftar Item
					</Button>

					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center justify-between">
								<div>
									<div class="text-lg font-semibold">{selectedItem.item_name}</div>
									<div class="text-sm text-muted-foreground">
										{selectedItem.item_code} • {selectedItem.quantity} {selectedItem.uom}
									</div>
								</div>
								<Badge variant={selectedItem.latest_status === 'COMPLETED' ? 'default' : 'secondary'}>
									{selectedItem.latest_status === 'COMPLETED' ? '✅ Selesai' : '🔄 Proses'}
								</Badge>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<!-- Current Status -->
							<div class="mb-6 rounded-lg border bg-muted/50 p-4">
								<div class="text-sm font-medium text-muted-foreground">Status Saat Ini</div>
								<div class="mt-1 text-base font-semibold">{selectedItem.latest_status_label}</div>
								<div class="mt-1 text-xs text-muted-foreground">
									{formatDate(selectedItem.latest_timestamp)}
								</div>
							</div>

							<!-- Full Timeline (15 Steps) -->
							<div>
								<h4 class="mb-4 text-sm font-medium">Timeline Lengkap</h4>
								<div class="relative space-y-4">
									<!-- Timeline line -->
									<div class="absolute left-3 top-0 h-full w-0.5 bg-border"></div>

									{#each selectedItem.tracking.reverse() as track}
										{@const Icon = getStatusIcon(track.status)}
										{@const colorClass = getStatusColor(track.status)}
										{@const shouldSpin = track.status.includes('PENDING') || track.status.includes('WAITING')}
										<div class="relative flex gap-4">
											<!-- Timeline dot -->
											<div class="relative z-10 flex h-6 w-6 items-center justify-center">
												<Icon 
													class="h-5 w-5 {colorClass} {shouldSpin ? 'animate-spin' : ''}" 
												/>
											</div>

											<!-- Content -->
											<div class="flex-1 pb-2">
												<div class="text-sm font-medium">{track.status_label}</div>
												<div class="text-xs text-muted-foreground">
													{formatDate(track.timestamp)}
													{#if track.performed_by_name}
														• {track.performed_by_name}
													{/if}
												</div>
												{#if track.document_number}
													<div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
														<FileText class="h-3 w-3" />
														{track.document_number}
													</div>
												{/if}
												{#if track.remarks && !track.remarks.startsWith('Item:')}
													<div class="mt-1 text-xs text-muted-foreground">
														{track.remarks}
													</div>
												{/if}
											</div>
										</div>
									{/each}
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			{:else}
				<!-- List View: Items with Latest Status -->
				<div class="space-y-3">
					<div class="mb-4">
						<h3 class="text-sm font-medium text-muted-foreground">
							Daftar Item ({itemsTracking().length} items)
						</h3>
						<p class="text-xs text-muted-foreground">
							Klik item untuk melihat timeline lengkap
						</p>
					</div>

					{#each itemsTracking() as item}
						<button
							onclick={() => handleItemClick(item.item_code)}
							class="w-full text-left transition-all hover:scale-[1.01]"
						>
							<Card.Root class="cursor-pointer hover:border-primary hover:shadow-md">
								<Card.Content class="p-4">
									<div class="flex items-start justify-between gap-4">
										<div class="flex-1 space-y-2">
											<!-- Item Header -->
											<div class="flex items-center gap-2">
												<Package class="h-4 w-4 text-muted-foreground" />
												<span class="font-medium">{item.item_name}</span>
												<Badge variant="outline" class="text-xs">
													{item.item_code}
												</Badge>
											</div>

											<!-- Quantity -->
											<div class="text-sm text-muted-foreground">
												{item.quantity} {item.uom}
											</div>

											<!-- Latest Status -->
											<div class="flex items-start gap-2">
												<div class="flex-1">
													<div class="flex items-center gap-2">
														{#snippet statusIcon()}
															{@const Icon = getStatusIcon(item.latest_status)}
															{@const colorClass = getStatusColor(item.latest_status)}
															<Icon class="h-4 w-4 {colorClass}" />
														{/snippet}
														{@render statusIcon()}
														<span class="text-sm font-medium">
															{item.latest_status_label}
														</span>
													</div>
													<div class="mt-1 text-xs text-muted-foreground">
														Terakhir: {item.latest_document} ({formatDateShort(item.latest_timestamp)})
													</div>
												</div>
											</div>
										</div>

										<!-- Arrow Icon -->
										<ChevronRight class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
									</div>
								</Card.Content>
							</Card.Root>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Dialog.Close asChild>
				<Button variant="outline">
					Tutup
				</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
