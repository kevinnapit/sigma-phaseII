<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { 
		Clock, 
		Package, 
		FileText, 
		Truck, 
		CheckCircle2, 
		AlertCircle, 
		User,
		ChevronRight,
		Circle,
		CheckCircle,
		Loader2
	} from 'lucide-svelte';
	import { useReadTrackingHistory } from '../hooks/usePurchaseRequestQueries.svelte';
	import type { ItemProgress } from '../types/purchase-request.types';

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
	const itemsProgress = $derived(trackingQuery.data?.items_progress || []);
	const overallProgress = $derived(trackingQuery.data?.overall_progress);
	const nextAction = $derived(trackingQuery.data?.next_action);
	const isLoading = $derived(trackingQuery.isLoading);
	
	// Selected item for detail view
	let selectedItem = $state<ItemProgress | null>(null);

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

	function getStatusIcon(status: 'completed' | 'in_progress' | 'pending') {
		switch (status) {
			case 'completed':
				return CheckCircle;
			case 'in_progress':
				return Loader2;
			case 'pending':
				return Circle;
		}
	}

	function getStatusColor(status: 'completed' | 'in_progress' | 'pending'): string {
		switch (status) {
			case 'completed':
				return 'text-green-500';
			case 'in_progress':
				return 'text-yellow-500';
			case 'pending':
				return 'text-gray-300';
		}
	}

	function handleItemClick(item: ItemProgress) {
		selectedItem = item;
	}

	function handleBackToOverview() {
		selectedItem = null;
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
			{:else if itemsProgress.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Package class="mb-4 h-12 w-12 text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Belum ada riwayat tracking</p>
				</div>
			{:else if selectedItem}
				<!-- Detail View for Selected Item -->
				<div class="space-y-4">
					<button
						onclick={handleBackToOverview}
						class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
					>
						<ChevronRight class="h-4 w-4 rotate-180" />
						Kembali ke Overview
					</button>

					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center justify-between">
								<div>
									<div class="text-lg font-semibold">{selectedItem.item_name}</div>
									<div class="text-sm text-muted-foreground">
										{selectedItem.item_code} • {selectedItem.quantity} {selectedItem.uom}
									</div>
								</div>
								<Badge variant={selectedItem.is_completed ? 'default' : 'secondary'}>
									{selectedItem.is_completed ? '✅ Selesai' : '🔄 Proses'}
								</Badge>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<!-- Progress Bar -->
							<div class="mb-6">
								<div class="mb-2 flex items-center justify-between text-sm">
									<span class="font-medium">Progress</span>
									<span class="text-muted-foreground">{selectedItem.progress_percentage}%</span>
								</div>
								<Progress value={selectedItem.progress_percentage} class="h-2" />
							</div>

							<!-- Documents -->
							{#if selectedItem.documents}
								<div class="mb-6">
									<h4 class="mb-3 text-sm font-medium">Dokumen Terkait</h4>
									<div class="grid grid-cols-2 gap-2">
										{#if selectedItem.documents.rfq}
											<div class="rounded-md border bg-muted/50 p-2">
												<div class="text-xs text-muted-foreground">RFQ</div>
												<div class="text-sm font-medium">{selectedItem.documents.rfq}</div>
											</div>
										{/if}
										{#if selectedItem.documents.lpo}
											<div class="rounded-md border bg-muted/50 p-2">
												<div class="text-xs text-muted-foreground">LPO</div>
												<div class="text-sm font-medium">{selectedItem.documents.lpo}</div>
											</div>
										{/if}
										{#if selectedItem.documents.grn}
											<div class="rounded-md border bg-muted/50 p-2">
												<div class="text-xs text-muted-foreground">GRN</div>
												<div class="text-sm font-medium">{selectedItem.documents.grn}</div>
											</div>
										{/if}
										{#if selectedItem.documents.gi}
											<div class="rounded-md border bg-muted/50 p-2">
												<div class="text-xs text-muted-foreground">GI</div>
												<div class="text-sm font-medium">{selectedItem.documents.gi}</div>
											</div>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Milestones Timeline -->
							<div>
								<h4 class="mb-4 text-sm font-medium">Timeline</h4>
								<div class="relative space-y-4">
									<!-- Timeline line -->
									<div class="absolute left-3 top-0 h-full w-0.5 bg-border"></div>

									{#each selectedItem.milestones as milestone}
										{@const Icon = getStatusIcon(milestone.status)}
										{@const colorClass = getStatusColor(milestone.status)}
										{@const shouldSpin = milestone.status === 'in_progress'}
										<div class="relative flex gap-4">
											<!-- Timeline dot -->
											<div class="relative z-10 flex h-6 w-6 items-center justify-center">
												<Icon class="h-5 w-5 {colorClass} {shouldSpin ? 'animate-spin' : ''}" />
											</div>

											<!-- Content -->
											<div class="flex-1 pb-2">
												<div class="text-sm font-medium">{milestone.label}</div>
												{#if milestone.timestamp}
													<div class="text-xs text-muted-foreground">
														{formatDate(milestone.timestamp)}
														{#if milestone.performed_by}
															• {milestone.performed_by}
														{/if}
													</div>
												{/if}
												{#if milestone.document_number}
													<div class="mt-1 text-xs text-muted-foreground">
														📄 {milestone.document_number}
													</div>
												{/if}
												{#if milestone.remarks}
													<div class="mt-1 text-xs text-muted-foreground">
														{milestone.remarks}
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
				<!-- Overview: Item Cards -->
				<div class="space-y-6">
					<!-- Overall Progress -->
					{#if overallProgress}
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Progress Overview</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex items-center justify-between">
									<div>
										<div class="text-2xl font-bold">
											{overallProgress.completed_items} / {overallProgress.total_items}
										</div>
										<div class="text-sm text-muted-foreground">Item Selesai</div>
									</div>
									<div class="text-right">
										<div class="text-2xl font-bold">{overallProgress.percentage}%</div>
										<div class="text-sm text-muted-foreground">Progress</div>
									</div>
								</div>
								<Progress value={overallProgress.percentage} class="mt-4 h-2" />
							</Card.Content>
						</Card.Root>
					{/if}

					<!-- Next Action Alert -->
					{#if nextAction}
						<Alert.Root class="{nextAction.waiting_for ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}">
							<AlertCircle class="h-4 w-4 {nextAction.waiting_for ? 'text-yellow-600' : 'text-green-600'}" />
							<Alert.Title class="{nextAction.waiting_for ? 'text-yellow-900' : 'text-green-900'}">
								{nextAction.action}
							</Alert.Title>
							<Alert.Description class="{nextAction.waiting_for ? 'text-yellow-800' : 'text-green-800'}">
								{nextAction.description}
								{#if nextAction.waiting_for}
									<div class="mt-2 flex items-center gap-2 rounded-md bg-white/50 p-2">
										<User class="h-4 w-4" />
										<div>
											<p class="text-xs font-medium">Menunggu Tindakan Dari:</p>
											<p class="text-sm font-semibold">{nextAction.waiting_for} ({nextAction.waiting_for_role})</p>
										</div>
									</div>
								{/if}
							</Alert.Description>
						</Alert.Root>
					{/if}

					<!-- Item Cards -->
					<div>
						<h3 class="mb-4 text-sm font-medium">Item Progress ({itemsProgress.length} items)</h3>
						<div class="space-y-3">
							{#each itemsProgress as item}
								<button
									onclick={() => handleItemClick(item)}
									class="w-full text-left transition-all hover:scale-[1.02]"
								>
									<Card.Root class="cursor-pointer hover:border-primary">
										<Card.Content class="p-4">
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<div class="mb-1 flex items-center gap-2">
														<span class="font-medium">{item.item_name}</span>
														<Badge variant="outline" class="text-xs">
															{item.item_code}
														</Badge>
													</div>
													<div class="mb-2 text-sm text-muted-foreground">
														{item.quantity} {item.uom}
													</div>
													<div class="mb-2 flex items-center gap-2">
														<Progress value={item.progress_percentage} class="h-1.5 flex-1" />
														<span class="text-xs text-muted-foreground">{item.progress_percentage}%</span>
													</div>
													<div class="flex items-center gap-2 text-xs">
														{#if item.is_completed}
															<Badge variant="default" class="text-xs">
																<CheckCircle2 class="mr-1 h-3 w-3" />
																Selesai
															</Badge>
														{:else}
															<Badge variant="secondary" class="text-xs">
																<Loader2 class="mr-1 h-3 w-3 animate-spin" />
																{item.current_status_label}
															</Badge>
														{/if}
													</div>
												</div>
												<ChevronRight class="h-5 w-5 text-muted-foreground" />
											</div>
										</Card.Content>
									</Card.Root>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Dialog.Close asChild>
				<button
					class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					Tutup
				</button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
