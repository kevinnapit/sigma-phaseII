<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Trash2, Edit, ShoppingCart } from 'lucide-svelte';

	export interface CartItem {
		item_id: string;
		item_code: string;
		item_name: string;
		quantity: number;
		uom: string;
		uom_name: string;
		uom_id: string;
	}

	let {
		items = $bindable([]),
		onEdit,
		onDelete
	}: {
		items?: CartItem[];
		onEdit: (index: number) => void;
		onDelete: (index: number) => void;
	} = $props();

	const totalItems = $derived(items.length);
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between">
			<CardTitle class="text-lg flex items-center gap-2">
				<ShoppingCart class="h-5 w-5" />
				Keranjang Permintaan
			</CardTitle>
			<Badge variant="secondary">{totalItems} Item</Badge>
		</div>
	</CardHeader>
	<CardContent>
		{#if items.length === 0}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<ShoppingCart class="h-12 w-12 text-muted-foreground/50 mb-3" />
				<p class="font-medium text-muted-foreground">Keranjang Kosong</p>
				<p class="text-sm text-muted-foreground mt-1">
					Cari dan tambahkan item untuk memulai permintaan
				</p>
			</div>
		{:else}
			<div class="space-y-2 max-h-[400px] overflow-y-auto">
				{#each items as item, index}
					<div class="flex items-start justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
						<div class="flex-1 min-w-0">
							<p class="font-medium text-sm truncate">{item.item_code}</p>
							<p class="text-xs text-muted-foreground truncate">{item.item_name}</p>
							<div class="flex items-center gap-2 mt-1">
								<Badge variant="outline" class="text-xs">
									{item.quantity} {item.uom}
								</Badge>
							</div>
						</div>
						<div class="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={() => onEdit(index)}
							>
								<Edit class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8 text-destructive hover:text-destructive"
								onclick={() => onDelete(index)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
