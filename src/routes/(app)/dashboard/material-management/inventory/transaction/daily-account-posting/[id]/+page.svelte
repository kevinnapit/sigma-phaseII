<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, FileText } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import { getMockDailyAccountPostingDetail } from '$lib/features/material-management/inventory/transaction/daily-account-posting/api/daily-account-posting.mock';

	const postingId = $derived(page.params.id);

	// Load detail data
	let postingData = $derived.by(() => {
		try {
			return getMockDailyAccountPostingDetail(postingId);
		} catch {
			return null;
		}
	});

	const detail = $derived(postingData?.data);
	const items = $derived(detail?.items ?? []);

	function formatDate(iso: string) {
		if (!iso) return '-';
		return new Date(iso).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}

	const totalDebit = $derived(items.reduce((s, i) => s + (i.debit_amount || 0), 0));
	const totalCredit = $derived(items.reduce((s, i) => s + (i.credit_amount || 0), 0));

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/daily-account-posting');
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div class="space-y-2">
			<PageHeader
				title="Detail Posting Akun Harian"
				description="Informasi lengkap posting akun harian"
			/>
			{#if detail}
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<FileText class="h-4 w-4" />
						<span class="font-mono font-medium">{detail.posting_number}</span>
					</div>
					<div>
						Dibuat: {formatDate(detail.created_at)} oleh {detail.created_by}
					</div>
				</div>
			{/if}
		</div>
		<div class="mt-5 flex items-center gap-2 sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	{#if !detail}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">
			Data posting akun tidak ditemukan.
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Left column (2/3) -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Informasi Umum -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Umum</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No. Posting</p>
								<p class="font-mono text-sm font-medium">{detail.posting_number}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Unit Administratif</p>
								<p class="text-sm font-medium">{detail.administrative_unit}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
								<p class="text-sm font-medium">{detail.store_name}</p>
							</div>
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Tanggal Proses</p>
								<p class="text-sm font-medium">{formatDate(detail.process_date)}</p>
							</div>
							{#if detail.remarks}
								<div class="md:col-span-2">
									<p class="mb-1 text-sm text-muted-foreground">Catatan</p>
									<p class="text-sm font-medium">{detail.remarks}</p>
								</div>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Detail Posting -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							Detail Posting
							<Badge variant="outline">{items.length} Item</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content>
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
										<tr class="border-b last:border-0">
											<td class="p-2">
												<span
													class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
												>
													{item.voucher_type}
												</span>
											</td>
											<td class="p-2 font-mono text-xs text-muted-foreground">{item.voucher_no}</td>
											<td class="p-2 font-medium">{item.account_name}</td>
											<td class="p-2 text-right text-muted-foreground">
												{item.debit_amount > 0 ? formatCurrency(item.debit_amount) : '-'}
											</td>
											<td class="p-2 text-right text-muted-foreground">
												{item.credit_amount > 0 ? formatCurrency(item.credit_amount) : '-'}
											</td>
											<td class="p-2 text-muted-foreground">{item.purpose}</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="border-t font-semibold">
										<td colspan="3" class="p-2 text-right text-sm">Total</td>
										<td class="p-2 text-right text-sm">{formatCurrency(totalDebit)}</td>
										<td class="p-2 text-right text-sm">{formatCurrency(totalCredit)}</td>
										<td></td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Right column (1/3) sticky -->
			<div class="lg:col-span-1">
				<div class="sticky top-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Ringkasan</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">No. Posting</span>
								<span class="font-mono font-medium">{detail.posting_number}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Unit Administratif</span>
								<span class="font-medium">{detail.administrative_unit}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Tanggal Proses</span>
								<span class="font-medium">{formatDate(detail.process_date)}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Item</span>
								<span class="font-medium">{detail.total_items} item</span>
							</div>
							<div class="border-t pt-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Total Debit</span>
									<span class="font-semibold">{formatCurrency(detail.total_debit)}</span>
								</div>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Total Kredit</span>
								<span class="font-semibold">{formatCurrency(detail.total_credit)}</span>
							</div>
							<div class="border-t pt-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Dibuat oleh</span>
									<span class="font-medium">{detail.created_by}</span>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	{/if}
</div>
