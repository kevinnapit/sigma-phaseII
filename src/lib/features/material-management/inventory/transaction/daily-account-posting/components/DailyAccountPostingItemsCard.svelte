<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCw } from 'lucide-svelte';
	import type { DailyAccountPostingItem } from '../types/daily-account-posting.types';

	let {
		items = [],
		onLoadItems,
		isLoadingItems = false,
		readonly = false
	}: {
		items?: DailyAccountPostingItem[];
		onLoadItems?: () => void;
		isLoadingItems?: boolean;
		readonly?: boolean;
	} = $props();

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}

	const totalDebit = $derived(items.reduce((s, i) => s + i.debit_amount, 0));
	const totalCredit = $derived(items.reduce((s, i) => s + i.credit_amount, 0));
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title class="text-lg">Detail Posting</Card.Title>
			{#if !readonly}
				<Button
					variant="outline"
					size="sm"
					onclick={onLoadItems}
					disabled={isLoadingItems}
				>
					<RefreshCw class="mr-2 h-4 w-4 {isLoadingItems ? 'animate-spin' : ''}" />
					{isLoadingItems ? 'Memuat...' : 'Muat Data'}
				</Button>
			{/if}
		</div>
	</Card.Header>
	<Card.Content>
		{#if items.length === 0}
			<div class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
				{#if readonly}
					Tidak ada data
				{:else}
					Klik 'Muat Data' untuk memuat data posting
				{/if}
			</div>
		{:else}
			<div class="overflow-x-auto rounded-md border">
				<table class="w-full border-collapse text-sm">
					<thead>
						<tr class="border-b bg-muted/50 text-left text-muted-foreground">
							<th class="p-2 font-medium" style="min-width:110px;">Tipe Voucher</th>
							<th class="p-2 font-medium" style="min-width:160px;">No. Voucher</th>
							<th class="p-2 font-medium" style="min-width:200px;">Nama Akun</th>
							<th class="p-2 text-right font-medium" style="min-width:140px;">Jumlah Debit</th>
							<th class="p-2 text-right font-medium" style="min-width:140px;">Jumlah Kredit</th>
							<th class="p-2 font-medium" style="min-width:200px;">Tujuan</th>
						</tr>
					</thead>
					<tbody>
						{#each items as item}
							<tr class="border-b last:border-0 hover:bg-muted/30">
								<td class="p-2">
									<span
										class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
									>
										{item.voucher_type}
									</span>
								</td>
								<td class="p-2 font-mono text-xs text-muted-foreground">{item.voucher_no}</td>
								<td class="p-2 font-medium">{item.account_name}</td>
								<td class="p-2 text-right font-medium">
									{item.debit_amount > 0 ? formatCurrency(item.debit_amount) : '-'}
								</td>
								<td class="p-2 text-right font-medium">
									{item.credit_amount > 0 ? formatCurrency(item.credit_amount) : '-'}
								</td>
								<td class="p-2 text-muted-foreground">{item.purpose}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="border-t-2 bg-muted/50 font-semibold">
							<td colspan="3" class="p-2 text-right text-sm">Total</td>
							<td class="p-2 text-right text-sm">{formatCurrency(totalDebit)}</td>
							<td class="p-2 text-right text-sm">{formatCurrency(totalCredit)}</td>
							<td class="p-2"></td>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="mt-2 text-sm text-muted-foreground">
				Total: {items.length} item
			</div>
		{/if}
	</Card.Content>
</Card.Root>
