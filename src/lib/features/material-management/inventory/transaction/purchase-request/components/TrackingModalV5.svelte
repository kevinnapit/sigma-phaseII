<script lang="ts">
	/**
	 * TrackingModalV5 - Smart Default View (Updated Scope)
	 * Shows context-aware timeline: 3 completed + 1 current + 2 next = 6 steps default
	 * Expandable to full 12 steps (MR Creation → GRN Approved)
	 * Scope: Procurement cycle only (excludes Goods Issue steps 13-15)
	 */
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { 
		Clock, 
		Package, 
		ChevronRight,
		ChevronDown,
		CheckCircle2,
		Circle,
		Loader2,
		XCircle,
		AlertCircle,
		FileText,
		ExternalLink
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
			tracking: TrackingStatusItem[];
			current_step: number;
			total_steps: number;
			progress_percentage: number;
		}>();

		trackingData.forEach(track => {
			if (track.related_items && track.related_items.length > 0) {
				track.related_items.forEach(itemCode => {
					if (!grouped.has(itemCode)) {
						// Use item code mapping for better display
						const itemName = getItemNameByCode(itemCode);
						const { quantity, uom } = extractItemQuantityUOM(track.remarks || '', itemCode);
						
						grouped.set(itemCode, {
							item_code: itemCode,
							item_name: itemName,
							quantity: quantity,
							uom: uom,
							tracking: [],
							current_step: 0,
							total_steps: 0,
							progress_percentage: 0
						});
					}
					grouped.get(itemCode)!.tracking.push(track);
				});
			}
		});

		// Calculate progress for each item
		grouped.forEach((item) => {
			const sortedTracking = item.tracking.sort((a, b) => 
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			);
			item.tracking = sortedTracking;
			item.total_steps = sortedTracking.length;
			
			// Find current step (first non-completed status)
			const currentIndex = sortedTracking.findIndex(t => 
				t.status !== 'COMPLETED' && t.status !== 'APPROVED'
			);
			item.current_step = currentIndex >= 0 ? item.total_steps - currentIndex : item.total_steps;
			item.progress_percentage = Math.round((item.current_step / item.total_steps) * 100);
		});

		return Array.from(grouped.values());
	});
	
	// Expanded state per item
	let expandedItems = $state<Set<string>>(new Set());

	function extractItemInfo(remarks: string): { name: string; quantity: number; uom: string } {
		// Try single item format first: "Item: Name (quantity uom)"
		const singleMatch = remarks.match(/Item:\s*([^(]+?)\s*\((\d+)\s*(\w+)\)/);
		if (singleMatch) {
			return {
				name: singleMatch[1].trim(),
				quantity: parseInt(singleMatch[2]),
				uom: singleMatch[3]
			};
		}
		
		// Try multiple items format: "Items: Name1 (qty uom), Name2 (qty uom)"
		const multipleMatch = remarks.match(/Items:\s*([^(]+?)\s*\((\d+)\s*(\w+)\)/);
		if (multipleMatch) {
			return {
				name: multipleMatch[1].trim(),
				quantity: parseInt(multipleMatch[2]),
				uom: multipleMatch[3]
			};
		}
		
		return { name: 'Unknown Item', quantity: 0, uom: '' };
	}

	// Item code to name mapping for better display
	function getItemNameByCode(itemCode: string): string {
		const itemMapping: Record<string, string> = {
			'ATK-001': 'Kertas HVS A4',
			'ATK-002': 'Pulpen Hitam', 
			'ATK-003': 'Stapler',
			'OFF-010': 'Laptop Dell Latitude',
			'OFF-011': 'Mouse Wireless Logitech',
			'OFF-012': 'Keyboard Mechanical',
			'TOOL-001': 'Cangkul',
			'TOOL-002': 'Parang',
			'TOOL-003': 'Sarung Tangan',
			'TOOL-004': 'Sepatu Boot'
		};
		
		return itemMapping[itemCode] || itemCode;
	}

	// Extract quantity and UOM for specific item from remarks
	function extractItemQuantityUOM(remarks: string, itemCode: string): { quantity: number; uom: string } {
		// Item code to expected patterns mapping
		const itemPatterns: Record<string, RegExp> = {
			'ATK-001': /Kertas HVS A4.*?\((\d+)\s*(\w+)\)/i,
			'ATK-002': /Pulpen.*?\((\d+)\s*(\w+)\)/i,
			'ATK-003': /Stapler.*?\((\d+)\s*(\w+)\)/i,
			'OFF-010': /Laptop.*?\((\d+)\s*(\w+)\)/i,
			'OFF-011': /Mouse.*?\((\d+)\s*(\w+)\)/i,
			'OFF-012': /Keyboard.*?\((\d+)\s*(\w+)\)/i,
			'TOOL-001': /Cangkul.*?\((\d+)\s*(\w+)\)/i,
			'TOOL-002': /Parang.*?\((\d+)\s*(\w+)\)/i,
			'TOOL-003': /Sarung Tangan.*?\((\d+)\s*(\w+)\)/i,
			'TOOL-004': /Sepatu Boot.*?\((\d+)\s*(\w+)\)/i
		};
		
		const pattern = itemPatterns[itemCode];
		if (pattern) {
			const match = remarks.match(pattern);
			if (match) {
				return {
					quantity: parseInt(match[1]),
					uom: match[2]
				};
			}
		}
		
		// Fallback for default quantities based on item type
		const defaultQuantities: Record<string, { quantity: number; uom: string }> = {
			'ATK-001': { quantity: 20, uom: 'box' },
			'ATK-002': { quantity: 50, uom: 'pcs' },
			'ATK-003': { quantity: 10, uom: 'pcs' },
			'OFF-010': { quantity: 1, uom: 'unit' },
			'OFF-011': { quantity: 5, uom: 'pcs' },
			'OFF-012': { quantity: 3, uom: 'pcs' },
			'TOOL-001': { quantity: 10, uom: 'pcs' },
			'TOOL-002': { quantity: 15, uom: 'pcs' },
			'TOOL-003': { quantity: 50, uom: 'pasang' },
			'TOOL-004': { quantity: 20, uom: 'pasang' }
		};
		
		return defaultQuantities[itemCode] || { quantity: 1, uom: 'pcs' };
	}

	function toggleExpanded(itemCode: string) {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(itemCode)) {
			newExpanded.delete(itemCode);
		} else {
			newExpanded.add(itemCode);
		}
		expandedItems = newExpanded;
	}

	function getSmartTimelineSteps(tracking: TrackingStatusItem[], currentStep: number, totalSteps: number) {
		const reversed = [...tracking].reverse(); // Oldest to newest
		const currentIndex = totalSteps - currentStep;
		
		// Get 3 completed steps before current
		const startIndex = Math.max(0, currentIndex - 3);
		// Get current + 2 next steps
		const endIndex = Math.min(totalSteps, currentIndex + 3);
		
		return {
			visibleSteps: reversed.slice(startIndex, endIndex),
			hasMoreBefore: startIndex > 0,
			hasMoreAfter: endIndex < totalSteps,
			hiddenBeforeCount: startIndex,
			hiddenAfterCount: totalSteps - endIndex
		};
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
		if (status === 'COMPLETED' || status === 'APPROVED') return CheckCircle2;
		if (status === 'REJECTED' || status === 'CANCELLED') return XCircle;
		if (status.includes('PENDING') || status.includes('WAITING')) return Loader2;
		if (status === 'DRAFT') return Circle;
		return CheckCircle2;
	}

	function getStatusColor(status: string): string {
		if (status === 'COMPLETED' || status === 'APPROVED') return 'text-green-500';
		if (status === 'REJECTED' || status === 'CANCELLED') return 'text-red-500';
		if (status.includes('PENDING') || status.includes('WAITING')) return 'text-blue-500';
		if (status === 'DRAFT') return 'text-gray-400';
		return 'text-blue-500';
	}

	function isRejectedStatus(status: string): boolean {
		return status === 'REJECTED' || status.includes('REJECT');
	}
	
	function isCompletedStatus(status: string, module: string): boolean {
		return (status === 'APPROVED' && module === 'GOODS_RECEIPT') || 
		       status === 'GRN_APPROVED' || 
		       status === 'COMPLETED';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[80vh] max-w-3xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Clock class="h-5 w-5" />
				Tracking Status - Smart View
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
			{:else}
				<div class="space-y-4">
					{#each itemsTracking() as item}
						{@const isExpanded = expandedItems.has(item.item_code)}
						{@const smartSteps = getSmartTimelineSteps(item.tracking, item.current_step, item.total_steps)}
						{@const displaySteps = isExpanded ? [...item.tracking].reverse() : smartSteps.visibleSteps}
						
						<Card.Root>
							<Card.Header>
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<Card.Title class="text-base">{item.item_name}</Card.Title>
										<Card.Description>
											{item.item_code} • {item.quantity} {item.uom}
										</Card.Description>
									</div>
								</div>
							</Card.Header>
							<Card.Content class="space-y-4">
								<!-- Next Action Highlight -->
								{#if item.tracking[0]}
									{@const currentStatus = item.tracking[0]}
									{@const isRejected = isRejectedStatus(currentStatus.status)}
									{@const isCompleted = isCompletedStatus(currentStatus.status, currentStatus.module)}
									
									<div class="rounded-lg border-2 {isRejected ? 'border-destructive bg-destructive/10' : isCompleted ? 'border-green-500 bg-green-50' : 'border-primary bg-primary/10'} p-3">
										<div class="flex items-start gap-2">
											{#if isRejected}
												<AlertCircle class="h-5 w-5 text-destructive" />
											{:else if isCompleted}
												<CheckCircle2 class="h-5 w-5 text-green-500" />
											{:else}
												<Clock class="h-5 w-5 text-primary" />
											{/if}
											<div class="flex-1">
												<div class="text-xs font-medium text-muted-foreground">
													{#if isRejected}
														Status Terakhir (Ditolak)
													{:else if isCompleted}
														Status Akhir (Selesai)
													{:else}
														Next Action - Yang Perlu Dilakukan
													{/if}
												</div>
												<div class="mt-1 text-sm font-semibold">
													{currentStatus.status_label}
												</div>
												<div class="mt-1 text-xs text-muted-foreground">
													{formatDateShort(currentStatus.timestamp)}
													{#if currentStatus.performed_by_name}
														• {currentStatus.performed_by_name}
													{/if}
												</div>
												{#if currentStatus.document_number}
													<div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
														<FileText class="h-3 w-3" />
														{currentStatus.document_number}
													</div>
												{/if}
												{#if isRejected && currentStatus.remarks && !currentStatus.remarks.startsWith('Item:')}
													<div class="mt-2 rounded-md bg-background p-2 text-xs text-destructive">
														<strong>Alasan:</strong> {currentStatus.remarks}
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/if}

								<!-- Timeline -->
								<div>
									<div class="mb-3 flex items-center justify-between">
										<div class="text-sm font-medium">Timeline</div>
										<button
											onclick={() => toggleExpanded(item.item_code)}
											class="flex items-center gap-1 text-xs text-primary hover:underline"
										>
											{isExpanded ? 'Sembunyikan' : `Lihat semua (${item.total_steps} aktivitas)`}
											<ChevronDown class="h-3 w-3 transition-transform {isExpanded ? 'rotate-180' : ''}" />
										</button>
									</div>

									<div class="relative space-y-3">
										<!-- Timeline line -->
										<div class="absolute left-2 top-0 h-full w-0.5 bg-border"></div>

										{#if !isExpanded && smartSteps.hasMoreBefore}
											<div class="relative flex gap-3">
												<div class="relative z-10 flex h-4 w-4 items-center justify-center">
													<div class="h-2 w-2 rounded-full bg-muted-foreground"></div>
												</div>
												<div class="flex-1 pb-1">
													<button
														onclick={() => toggleExpanded(item.item_code)}
														class="text-xs text-muted-foreground hover:text-primary hover:underline"
													>
														... {smartSteps.hiddenBeforeCount} aktivitas sebelumnya
													</button>
												</div>
											</div>
										{/if}

										{#each displaySteps as track, index}
											{@const Icon = getStatusIcon(track.status)}
											{@const colorClass = getStatusColor(track.status)}
											{@const shouldSpin = track.status.includes('PENDING') || track.status.includes('WAITING')}
											{@const isRejected = isRejectedStatus(track.status)}
											{@const isCurrent = index === 0 && !isExpanded}
											
											<div class="relative flex gap-3 {isCurrent ? 'opacity-50' : ''}">
												<!-- Timeline dot -->
												<div class="relative z-10 flex h-4 w-4 items-center justify-center">
													<Icon 
														class="h-4 w-4 {colorClass} {shouldSpin ? 'animate-spin' : ''}" 
													/>
												</div>

												<!-- Content -->
												<div class="flex-1 pb-1">
													<div class="text-sm {isRejected ? 'font-semibold text-destructive' : ''}">
														{track.status_label}
													</div>
													<div class="text-xs text-muted-foreground">
														{formatDateShort(track.timestamp)}
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
													{#if isRejected && track.remarks && !track.remarks.startsWith('Item:')}
														<div class="mt-1 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
															<strong>Alasan:</strong> {track.remarks}
														</div>
													{/if}
												</div>
											</div>
										{/each}

										{#if !isExpanded && smartSteps.hasMoreAfter}
											<div class="relative flex gap-3">
												<div class="relative z-10 flex h-4 w-4 items-center justify-center">
													<div class="h-2 w-2 rounded-full bg-muted-foreground"></div>
												</div>
												<div class="flex-1 pb-1">
													<button
														onclick={() => toggleExpanded(item.item_code)}
														class="text-xs text-muted-foreground hover:text-primary hover:underline"
													>
														... {smartSteps.hiddenAfterCount} aktivitas berikutnya
													</button>
												</div>
											</div>
										{/if}
									</div>
								</div>
							</Card.Content>
						</Card.Root>
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
