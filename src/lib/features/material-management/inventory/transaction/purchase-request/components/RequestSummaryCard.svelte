<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Pencil, Trash2, FileText, MoreVertical } from 'lucide-svelte';

	let {
		requestList = [],
		onEditItem,
		onDeleteItem,
		onPreviewTransaction
	}: {
		requestList?: Array<any>;
		onEditItem: (index: number) => void;
		onDeleteItem: (index: number) => void;
		onPreviewTransaction: () => void;
	} = $props();

	// Calculate summary statistics
	const totalItems = $derived(requestList.length);
	const headOfficeItems = $derived(
		requestList.filter((item) => item.procurement_source === 'head_office').length
	);
	const cousinGardenItems = $derived(
		requestList.filter((item) => item.procurement_source === 'cousin_garden').length
	);
	const localPurchaseItems = $derived(
		requestList.filter((item) => item.procurement_source === 'local_purchase').length
	);
</script>

<div class="space-y-4">
	<!-- Summary Card -->
	<Card>
		<CardHeader>
			<CardTitle class="text-lg">Ringkasan Permintaan</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-3">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Item:</span>
					<span class="font-semibold">{totalItems}</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Kantor Pusat:</span>
					<span class="font-semibold">{headOfficeItems}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Kebun Sepupu:</span>
					<span class="font-semibold">{cousinGardenItems}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Pembelian Lokal:</span>
					<span class="font-semibold">{localPurchaseItems}</span>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Request List Card -->
	<Card>
		<CardHeader>
			<CardTitle class="text-lg">Daftar Permintaan ({requestList.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if requestList.length === 0}
				<div class="py-8 text-center">
					<p class="text-sm text-muted-foreground">Belum ada permintaan ditambahkan</p>
					<p class="mt-1 text-xs text-muted-foreground">
						Pilih item dan isi form untuk menambahkan permintaan
					</p>
				</div>
			{:else}
				<div class="space-y-2">
					{#each requestList as request, index}
						<div class="flex items-start justify-between rounded-lg border p-3">
							<div class="flex-1 space-y-1">
								<div class="flex items-center gap-2">
									<p class="text-sm font-medium">{request.item_name}</p>
								</div>
								<div class="text-xs text-muted-foreground">
									<Badge variant="outline" class="text-xs">
										{request.item_code}
									</Badge>
								</div>
							</div>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button size="icon" variant="ghost" class="h-8 w-8">
										<MoreVertical class="h-4 w-4" />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onclick={() => onEditItem(index)}>
										<Pencil class="mr-2 h-4 w-4" />
										Edit
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onclick={() => onDeleteItem(index)}
										class="text-red-600 focus:text-red-600"
									>
										<Trash2 class="mr-2 h-4 w-4" />
										Hapus
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					{/each}
				</div>

				<!-- Preview Transaction Button -->
				<div class="mt-4">
					<Button onclick={onPreviewTransaction} class="w-full" variant="default">
						<FileText class="mr-2 h-4 w-4" />
						Pratinjau Transaksi ({requestList.length} Item)
					</Button>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
