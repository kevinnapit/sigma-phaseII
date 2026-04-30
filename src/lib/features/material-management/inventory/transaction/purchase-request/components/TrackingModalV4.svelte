<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { 
		Clock, 
		Package, 
		ChevronRight,
		CheckCircle2,
		Circle,
		Loader2,
		FileText,
		ExternalLink
	} from 'lucide-svelte';
	import type { SimplifiedTrackingItem } from '../types/purchase-request.types';

	let {
		open = $bindable(false),
		items,
		prNumber,
		onViewLPO
	}: {
		open?: boolean;
		items: SimplifiedTrackingItem[];
		prNumber: string;
		onViewLPO?: (lpoId: string, lpoNumber: string) => void;
	} = $props();

	function getMilestoneIcon(status: 'completed' | 'in_progress' | 'pending') {
		if (status === 'completed') return CheckCircle2;
		if (status === 'in_progress') return Loader2;
		return Circle;
	}

	function getMilestoneColor(status: 'completed' | 'in_progress' | 'pending') {
		if (status === 'completed') return 'text-green-500';
		if (status === 'in_progress') return 'text-blue-500';
		return 'text-gray-300';
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, '0');
		const month = date.toLocaleDateString('id-ID', { month: 'short' });
		return `${day} ${month}`;
	}

	function handleViewLPO(item: SimplifiedTrackingItem) {
		if (item.related_documents.lpo_id && item.related_documents.lpo) {
			onViewLPO?.(item.related_documents.lpo_id, item.related_documents.lpo);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[80vh] max-w-3xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Clock class="h-5 w-5" />
				Tracking Status - Simplified
			</Dialog.Title>
			<Dialog.Description>
				Status items untuk dokumen <strong>{prNumber}</strong>
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			{#if items.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Package class="mb-4 h-12 w-12 text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Belum ada data tracking</p>
				</div>
			{:else}
				{#each items as item}
					<Card.Root>
						<Card.Header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<Card.Title class="text-base">{item.item_name}</Card.Title>
									<Card.Description>
										{item.item_code} • {item.quantity} {item.uom}
									</Card.Description>
								</div>
								<Badge variant={item.progress_percentage === 100 ? 'default' : 'secondary'}>
									{item.progress_percentage}%
								</Badge>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							<!-- Current Status -->
							<div class="rounded-lg border bg-muted/50 p-3">
								<div class="text-xs font-medium text-muted-foreground">Status Saat Ini</div>
								<div class="mt-1 text-sm font-semibold">{item.current_milestone_label}</div>
								
								<!-- Related Documents -->
								{#if item.related_documents.lpo}
									<div class="mt-2 flex items-center gap-2">
										<FileText class="h-3 w-3 text-muted-foreground" />
										<span class="text-xs text-muted-foreground">
											Dokumen: {item.related_documents.lpo}
										</span>
										{#if item.related_documents.lpo_id}
											<button
												onclick={() => handleViewLPO(item)}
												class="ml-auto flex items-center gap-1 text-xs text-primary hover:underline"
											>
												Lihat Detail LPO
												<ExternalLink class="h-3 w-3" />
											</button>
										{/if}
									</div>
								{/if}
							</div>

							<!-- Milestone Timeline (5 steps) -->
							<div class="space-y-3">
								<div class="text-xs font-medium text-muted-foreground">Progress Timeline</div>
								<div class="relative space-y-3">
									<!-- Timeline line -->
									<div class="absolute left-2 top-2 h-[calc(100%-1rem)] w-0.5 bg-border"></div>

									{#each item.milestones as milestone}
										{@const Icon = getMilestoneIcon(milestone.status)}
										{@const colorClass = getMilestoneColor(milestone.status)}
										{@const shouldSpin = milestone.status === 'in_progress'}
										
										<div class="relative flex gap-3">
											<!-- Milestone dot -->
											<div class="relative z-10 flex h-4 w-4 items-center justify-center">
												<Icon 
													class="h-4 w-4 {colorClass} {shouldSpin ? 'animate-spin' : ''}" 
												/>
											</div>

											<!-- Content -->
											<div class="flex-1 pb-1">
												<div class="text-sm {milestone.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}">
													{milestone.label}
												</div>
												{#if milestone.timestamp}
													<div class="text-xs text-muted-foreground">
														{formatDate(milestone.timestamp)}
														{#if milestone.document_number}
															• {milestone.document_number}
														{/if}
													</div>
												{/if}
											</div>
										</div>
									{/each}
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
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
