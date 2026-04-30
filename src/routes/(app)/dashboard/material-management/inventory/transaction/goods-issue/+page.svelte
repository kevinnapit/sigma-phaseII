<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { PageHeader } from '$lib/components/shared';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { PackageOpen, Loader, RefreshCw } from 'lucide-svelte';
	import {
		useReadGoodsIssueSummary,
		useReadAllGoodsIssues
	} from '$lib/features/material-management/inventory/transaction/goods-issue/hooks/useGoodsIssueQueries.svelte';
	import { useReadGoodsIssueDetail } from '$lib/features/material-management/inventory/transaction/goods-issue/hooks/useGoodsIssueQueries.svelte';
	import GoodsIssueActionsCells from '$lib/features/material-management/inventory/transaction/goods-issue/components/GoodsIssueActionsCells.svelte';
	import type { GoodsIssue } from '$lib/features/material-management/inventory/transaction/goods-issue/types/goods-issue.types';

	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);

	let searchQuery = $state('');
	let debouncedSearch = $state('');

	// Dialog state
	let showItemsDialog = $state(false);
	let selectedGoodsIssueId = $state<string | null>(null);

	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});

	// Query summary
	const summaryQuery = useReadGoodsIssueSummary();
	const summary = $derived(summaryQuery.data?.data);

	// Query list
	const goodsIssuesQuery = useReadAllGoodsIssues(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined
	}));

	const goodsIssues = $derived(goodsIssuesQuery.data?.data || []);
	const pagination = $derived(goodsIssuesQuery.data?.pagination);

	// Query detail for dialog
	const detailQuery = useReadGoodsIssueDetail(() => selectedGoodsIssueId || '');
	const selectedDetail = $derived(detailQuery.data?.data);

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		try {
			const date = new Date(dateStr);
			return date.toLocaleDateString('id-ID', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});
		} catch {
			return dateStr;
		}
	}

	function handleViewDetail(id: string) {
		goto(`/dashboard/material-management/inventory/transaction/goods-issue/${id}`);
	}

	function handleViewDetailFromAction(goodsIssue: GoodsIssue) {
		handleViewDetail(goodsIssue.id);
	}

	function handleRefresh() {
		goodsIssuesQuery.refetch();
		summaryQuery.refetch();
	}

	function handleShowItems(goodsIssue: GoodsIssue) {
		selectedGoodsIssueId = goodsIssue.id;
		showItemsDialog = true;
	}
</script>

<div class="space-y-6">
	<PageHeader
		title="Pengeluaran Barang"
		description="Kelola pengeluaran barang dari gudang untuk kebutuhan operasional."
	/>

	<!-- Stats Cards -->
	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
						<p class="mt-2 text-2xl font-bold">{summary?.total_issue || 0}</p>
					</div>
					<div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
						<PackageOpen class="h-5 w-5 text-blue-600 dark:text-blue-400" />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Pending</p>
						<p class="mt-2 text-2xl font-bold">{summary?.pending || 0}</p>
					</div>
					<div class="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
						<PackageOpen class="h-5 w-5 text-amber-600 dark:text-amber-400" />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Approved</p>
						<p class="mt-2 text-2xl font-bold">{summary?.approved || 0}</p>
					</div>
					<div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
						<PackageOpen class="h-5 w-5 text-green-600 dark:text-green-400" />
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Main Content Card -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div>
					<Card.Title>Daftar Pengeluaran Barang</Card.Title>
					<Card.Description class="mt-1">
						Data pengeluaran barang dari transaksi mobile (gawai)
					</Card.Description>
				</div>
				<Button variant="outline" size="icon" onclick={handleRefresh}>
					<RefreshCw class="h-4 w-4" />
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			<!-- Search -->
			<div class="mb-4">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari nomor dokumen..."
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>

			{#if goodsIssuesQuery.isLoading}
				<!-- Loading State -->
				<div class="flex flex-col items-center justify-center py-16">
					<Loader class="h-8 w-8 animate-spin text-muted-foreground" />
					<p class="mt-4 text-sm text-muted-foreground">Memuat data...</p>
				</div>
			{:else if goodsIssuesQuery.isError}
				<!-- Error State -->
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div class="rounded-full bg-destructive/10 p-6">
						<PackageOpen class="h-12 w-12 text-destructive" />
					</div>
					<h3 class="mt-4 text-lg font-semibold text-destructive">Gagal Memuat Data</h3>
					<p class="mt-2 text-sm text-muted-foreground">
						Terjadi kesalahan saat memuat data pengeluaran barang.
					</p>
					<Button class="mt-6" variant="outline" onclick={() => goodsIssuesQuery.refetch()}>
						Coba Lagi
					</Button>
				</div>
			{:else if goodsIssues.length === 0}
				<!-- Empty State -->
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div class="rounded-full bg-muted p-6">
						<PackageOpen class="h-12 w-12 text-muted-foreground" />
					</div>
					<h3 class="mt-4 text-lg font-semibold">Tidak Ada Data</h3>
					<p class="mt-2 text-sm text-muted-foreground">
						{searchQuery
							? 'Tidak ada hasil yang sesuai dengan pencarian Anda.'
							: 'Belum ada data pengeluaran barang.'}
					</p>
				</div>
			{:else}
				<!-- Table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="border-b bg-muted/50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									No GSIR
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									No Pengeluaran
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									No Penerimaan
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									Tanggal Penerimaan
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									Vendor
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									Barang
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
									Status
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y">
							{#each goodsIssues as gi}
								<tr class="hover:bg-muted/30">
									<td class="px-4 py-3 text-sm font-medium">{gi.gsir_number}</td>
									<td class="px-4 py-3 text-sm font-medium">{gi.issue_number}</td>
									<td class="px-4 py-3 text-sm">{gi.grn_number}</td>
									<td class="px-4 py-3 text-sm">{formatDate(gi.date)}</td>
									<td class="px-4 py-3 text-sm">{gi.vendor_name}</td>
									<td class="px-4 py-3">
										<button
											onclick={() => handleShowItems(gi)}
											class="text-sm text-primary underline hover:text-primary/80"
										>
											{gi.total_items} barang
										</button>
									</td>
									<td class="px-4 py-3 text-sm">
										{gi.approval_status}
									</td>
									<td class="px-4 py-3">
										<GoodsIssueActionsCells
											goodsIssue={gi}
											onViewDetail={handleViewDetailFromAction}
										/>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination Info -->
				{#if pagination}
					<div class="mt-4 flex items-center justify-between text-sm text-muted-foreground">
						<p>
							{pagination.page} / {pagination.total_page} Halaman
						</p>
						<p>
							{(pagination.page - 1) * pagination.size + 1} s/d {Math.min(
								pagination.page * pagination.size,
								pagination.total_item
							)} dari {pagination.total_item} data
						</p>
					</div>
				{/if}
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<!-- Dialog Daftar Barang -->
<Dialog.Root bind:open={showItemsDialog}>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>
				Daftar Barang - {selectedDetail?.gsir_number || ''}
			</Dialog.Title>
			<Dialog.Description>
				Total {selectedDetail?.items?.length || 0} barang
			</Dialog.Description>
		</Dialog.Header>

		{#if detailQuery.isLoading}
			<div class="flex items-center justify-center py-8">
				<Loader class="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		{:else if selectedDetail}
			<div class="max-h-[400px] overflow-y-auto">
				<table class="w-full text-sm">
					<thead class="sticky top-0 bg-background">
						<tr class="border-b text-left text-muted-foreground">
							<th class="px-4 py-2 font-medium">No</th>
							<th class="px-4 py-2 font-medium">Barang</th>
						</tr>
					</thead>
					<tbody>
						{#each selectedDetail.items as item, index}
							<tr class="border-b last:border-0">
								<td class="px-4 py-3">{index + 1}</td>
								<td class="px-4 py-3">{item.item_code} - {item.item_name}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showItemsDialog = false)}>Tutup</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
