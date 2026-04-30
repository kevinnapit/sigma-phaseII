<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Alert from '$lib/components/ui/alert';
	import { Clock, Package, FileText, Truck, Building2, CheckCircle2, ArrowUpFromLine, AlertCircle, User } from 'lucide-svelte';
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
	// Reverse array so oldest (Belum Diajukan) appears at bottom of timeline
	const reversedTrackingData = $derived([...trackingData].reverse());
	const nextAction = $derived(trackingQuery.data?.next_action);
	const isLoading = $derived(trackingQuery.isLoading);

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

	function getModuleIcon(module: string) {
		switch (module) {
			case 'PURCHASE_REQUEST':
				return FileText;
			case 'LOCAL_PURCHASE_PROCESS':
				return Package;
			case 'LOCAL_PURCHASE_ORDER':
				return FileText;
			case 'GOODS_RECEIPT':
				return Truck;
			case 'GOODS_ISSUE':
				return ArrowUpFromLine;
			case 'INTER_ESTATE_REQUEST':
				return Building2;
			default:
				return FileText;
		}
	}

	function getStatusColor(status: string): string {
		if (status.includes('Disetujui') || status.includes('Selesai')) return 'bg-green-500';
		if (status.includes('Ditolak') || status.includes('Dibatalkan')) return 'bg-red-500';
		if (status.includes('Menunggu')) return 'bg-yellow-500';
		return 'bg-blue-500';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[80vh] max-w-2xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Clock class="h-5 w-5" />
				Tracking Status
			</Dialog.Title>
			<Dialog.Description>
				Kronologi lengkap status untuk dokumen <strong>{prNumber}</strong>
			</Dialog.Description>
		</Dialog.Header>

		<div class="py-4">
			{#if isLoading}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Package class="mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Memuat tracking data...</p>
				</div>
			{:else if trackingData.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<Package class="mb-4 h-12 w-12 text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Belum ada riwayat tracking</p>
				</div>
			{:else}
				<!-- Next Action Alert -->
				{#if nextAction}
					<Alert.Root class="mb-6 {nextAction.waiting_for ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}">
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
				
				<div class="relative space-y-6">
					<!-- Timeline line -->
					<div class="absolute left-4 top-0 h-full w-0.5 bg-border"></div>

					{#each reversedTrackingData as item, index}
						{@const Icon = getModuleIcon(item.module)}
						<div class="relative flex gap-4">
							<!-- Timeline dot -->
							<div class="relative z-10 flex h-8 w-8 items-center justify-center">
								<div class="{getStatusColor(item.status)} rounded-full p-1.5">
									<Icon class="h-4 w-4 text-white" />
								</div>
							</div>

							<!-- Content -->
							<div class="flex-1 pb-6">
								<div class="rounded-lg border bg-card p-4">
									<!-- Header -->
									<div class="mb-3 flex items-start justify-between">
										<div>
											<div class="mb-1 flex items-center gap-2">
												<Badge variant="outline" class="text-xs">
													{item.module_name}
												</Badge>
												{#if index === reversedTrackingData.length - 1}
													<Badge variant="default" class="text-xs">
														<CheckCircle2 class="mr-1 h-3 w-3" />
														Terbaru
													</Badge>
												{/if}
											</div>
											<p class="text-sm font-medium">{item.document_number}</p>
										</div>
									</div>

									<!-- Status -->
									<div class="mb-3">
										<p class="text-sm font-semibold text-foreground">{item.status_label}</p>
									</div>

									{#if item.remarks}
										<Separator class="my-3" />
										<div>
											<p class="mb-1 text-xs font-medium text-muted-foreground">Catatan:</p>
											<p class="text-sm">{item.remarks}</p>
										</div>
									{/if}

									<!-- Footer -->
									<Separator class="my-3" />
									<div class="flex items-center justify-between text-xs text-muted-foreground">
										<span>{formatDate(item.timestamp)}</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
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
