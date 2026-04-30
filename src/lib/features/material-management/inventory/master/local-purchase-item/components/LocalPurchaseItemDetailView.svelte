<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { LocalPurchaseItem } from '../types/local-purchase-item.types';

	interface Props {
		localPurchaseItem?: LocalPurchaseItem;
		isLoading?: boolean;
	}

	let { localPurchaseItem, isLoading = false }: Props = $props();

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}
</script>

<div class="space-y-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Informasi Barang</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if isLoading}
				<div class="grid gap-4 md:grid-cols-2">
					{#each Array(6) as _}
						<div class="space-y-1">
							<Skeleton class="h-4 w-24" />
							<Skeleton class="h-5 w-full" />
						</div>
					{/each}
				</div>
			{:else if localPurchaseItem}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Kode Barang</p>
						<p class="text-sm font-medium">{localPurchaseItem.code}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Nama Barang</p>
						<p class="text-sm font-medium">{localPurchaseItem.name}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Keputusan</p>
						<p class="text-sm font-medium">{localPurchaseItem.decision}</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Status</p>
						<p class="text-sm font-medium">{localPurchaseItem.status}</p>
					</div>

					<div class="md:col-span-2">
						<p class="mb-1 text-sm text-muted-foreground">Keterangan</p>
						<p class="text-sm font-medium">
							{localPurchaseItem.is_field_item
								? `Auto-published from approved material SAP: ${localPurchaseItem.code}`
								: 'Barang non-lapangan'}
						</p>
					</div>

					<div>
						<p class="mb-1 text-sm text-muted-foreground">Terakhir Diperbarui</p>
						<p class="text-sm font-medium">{formatDate(localPurchaseItem.synced_at)}</p>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
