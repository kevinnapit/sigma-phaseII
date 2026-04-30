<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { ItemGroupItem } from '../types/item-group.types';

	let {
		itemGroup,
		isLoading = false
	}: {
		itemGroup?: ItemGroupItem;
		isLoading?: boolean;
	} = $props();
</script>

<div class="space-y-6">
	<!-- Header Card with Avatar and Name -->
	<Card>
		<CardContent class="pt-6">
			<div class="flex items-center gap-4">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600"
				>
					{#if isLoading}
						<Skeleton class="h-16 w-16 rounded-full" />
					{:else}
						<span class="text-xl font-semibold">
							{itemGroup?.code || 'IG'}
						</span>
					{/if}
				</div>
				<div class="flex-1">
					{#if isLoading}
						<Skeleton class="mb-2 h-7 w-64" />
						<Skeleton class="h-5 w-32" />
					{:else}
						<h2 class="text-2xl font-bold">{itemGroup?.name || '-'}</h2>
						<p class="text-sm text-muted-foreground">{itemGroup?.code || '-'}</p>
					{/if}
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Informasi Barang -->
	<Card>
		<CardHeader>
			<CardTitle>Informasi Barang</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<div>
					<p class="mb-1 text-sm text-muted-foreground">Kode Barang</p>
					{#if isLoading}
						<Skeleton class="h-5 w-32" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.code || '-'}</p>
					{/if}
				</div>

				<div>
					<p class="mb-1 text-sm text-muted-foreground">Nama Barang</p>
					{#if isLoading}
						<Skeleton class="h-5 w-48" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.name || '-'}</p>
					{/if}
				</div>

				<div>
					<p class="mb-1 text-sm text-muted-foreground">Kelas Induk</p>
					{#if isLoading}
						<Skeleton class="h-5 w-40" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.parent_item_class_name || '-'}</p>
					{/if}
				</div>

				<div>
					<p class="mb-1 text-sm text-muted-foreground">Tipe Penilaian</p>
					{#if isLoading}
						<Skeleton class="h-5 w-36" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.valuation_type_value || '-'}</p>
					{/if}
				</div>

				<div>
					<p class="mb-1 text-sm text-muted-foreground">Frekuensi Penilaian</p>
					{#if isLoading}
						<Skeleton class="h-5 w-24" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.frequency_of_valuation_value || '-'}</p>
					{/if}
				</div>

				<div>
					<p class="mb-1 text-sm text-muted-foreground">Akun Stok</p>
					{#if isLoading}
						<Skeleton class="h-5 w-48" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.stock_account_name || '-'}</p>
					{/if}
				</div>

				<div class="md:col-span-2">
					<p class="mb-1 text-sm text-muted-foreground">Akun Pengeluaran Stok</p>
					{#if isLoading}
						<Skeleton class="h-5 w-48" />
					{:else}
						<p class="text-sm font-medium">{itemGroup?.stock_issue_account_name || '-'}</p>
					{/if}
				</div>
			</div>
		</CardContent>
	</Card>
</div>
