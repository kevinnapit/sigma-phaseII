<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { MoreHorizontal, Eye, Plus, FileText, Loader2, CheckCircle2, XCircle, Filter } from 'lucide-svelte';
	import { useReadAllItemCodeRequests, useReadItemCodeRequestSummary } from '$lib/features/material-management/inventory/master/item-code-request/hooks/useItemCodeRequestQueries.svelte';
	import { formatDate } from '$lib/shared/utils';
	import type { ItemCodeRequest } from '$lib/features/material-management/inventory/master/item-code-request/types/item-code-request.types';
	import ItemCodeRequestDialog from '$lib/features/material-management/inventory/transaction/purchase-request/components/ItemCodeRequestDialog.svelte';
	
	// Get pagination from URL
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);
	
	let searchQuery = $state('');
	let debouncedSearch = $state('');
	let showCreateDialog = $state(false);
	
	// Debounce search
	$effect(() => {
		searchQuery;
		const timer = setTimeout(() => {
			debouncedSearch = searchQuery;
		}, 500);
		return () => clearTimeout(timer);
	});
	
	const requestsQuery = useReadAllItemCodeRequests(() => ({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined
	}));
	
	const summaryQuery = useReadItemCodeRequestSummary();
	
	const data = $derived(requestsQuery.data?.data || []);
	const totalItems = $derived(requestsQuery.data?.pagination?.total_records || 0);
	const totalPages = $derived(requestsQuery.data?.pagination?.total_pages || 0);
	const summary = $derived(summaryQuery.data?.data);
	
	function updateUrlParams(newPage: number, newSize: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}
	
	function getStatusText(status: string) {
		switch (status) {
			case 'PENDING':
			case 'IN_REVIEW':
				return 'Menunggu Persetujuan Staff HO';
			case 'APPROVED':
				return 'Disetujui';
			case 'REJECTED':
				return 'Ditolak';
			default:
				return status;
		}
	}
	
	function handleViewDetail(id: string) {
		goto(`/dashboard/material-management/inventory/transaction/item-code-request/${id}`);
	}
	
	function handlePrevPage() {
		if (currentPage > 1) {
			updateUrlParams(currentPage - 1, pageSize);
		}
	}
	
	function handleNextPage() {
		if (currentPage < totalPages) {
			updateUrlParams(currentPage + 1, pageSize);
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-semibold text-gray-900">Permintaan Kode Barang</h1>
		<p class="text-sm text-gray-500">Kelola permintaan kode barang baru dari user</p>
	</div>

	<!-- Summary Cards -->
	{#if summary}
		<div class="grid gap-4 md:grid-cols-4">
			<Card.Root>
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Total Permintaan</p>
							<p class="text-3xl font-bold">{summary.total_requests}</p>
						</div>
						<div class="rounded-lg bg-blue-50 p-3">
							<FileText class="h-6 w-6 text-blue-600" />
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Menunggu</p>
							<p class="text-3xl font-bold">{summary.pending_requests}</p>
						</div>
						<div class="rounded-lg bg-yellow-50 p-3">
							<Loader2 class="h-6 w-6 text-yellow-600" />
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Disetujui</p>
							<p class="text-3xl font-bold">{summary.approved_requests}</p>
						</div>
						<div class="rounded-lg bg-green-50 p-3">
							<CheckCircle2 class="h-6 w-6 text-green-600" />
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-muted-foreground">Ditolak</p>
							<p class="text-3xl font-bold">{summary.rejected_requests}</p>
						</div>
						<div class="rounded-lg bg-red-50 p-3">
							<XCircle class="h-6 w-6 text-red-600" />
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}

	<!-- Search and Actions -->
	<div class="flex items-center gap-3">
		<div class="relative flex-1">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari nomor permintaan..."
				class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			/>
		</div>
		<Button variant="outline" class="gap-2">
			<Filter class="h-4 w-4" />
			Filter
		</Button>
		<Button onclick={() => (showCreateDialog = true)} class="gap-2 bg-[#0f4c2a] hover:bg-[#0d4023]">
			<Plus class="h-4 w-4" />
			Buat Permintaan
		</Button>
	</div>

	<!-- Table -->
	<div class="rounded-lg border bg-card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium">No. Permintaan</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Tanggal</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Nama Barang</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Satuan</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Departemen Tujuan</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Diminta Oleh</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Kode Barang</th>
						<th class="px-4 py-3 text-center text-sm font-medium">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#if requestsQuery.isLoading}
						<tr>
							<td colspan="9" class="px-4 py-12 text-center text-sm text-muted-foreground">
								Memuat data...
							</td>
						</tr>
					{:else if requestsQuery.isError}
						<tr>
							<td colspan="9" class="px-4 py-12 text-center text-sm text-destructive">
								Gagal memuat data. Silakan coba lagi.
							</td>
						</tr>
					{:else if data.length === 0}
						<tr>
							<td colspan="9" class="px-4 py-12 text-center text-sm text-muted-foreground">
								{searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada permintaan kode barang'}
							</td>
						</tr>
					{:else}
						{#each data as request}
							<tr class="border-b transition-colors hover:bg-muted/50">
								<td class="px-4 py-3 text-sm">{request.request_number}</td>
								<td class="px-4 py-3 text-sm">{formatDate(request.requested_at)}</td>
								<td class="px-4 py-3 text-sm font-medium">{request.item_name}</td>
								<td class="px-4 py-3 text-sm">{request.uom}</td>
								<td class="px-4 py-3 text-sm">{request.department_destination}</td>
								<td class="px-4 py-3 text-sm">{request.requested_by_name}</td>
								<td class="px-4 py-3 text-sm">{getStatusText(request.status)}</td>
								<td class="px-4 py-3 text-sm">
									{#if request.approved_item_code}
										<span class="font-medium text-green-700">{request.approved_item_code}</span>
									{:else}
										<span class="text-muted-foreground">-</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-center">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger asChild>
											<Button variant="ghost" size="icon">
												<MoreHorizontal class="h-4 w-4" />
											</Button>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content align="end">
											<DropdownMenu.Item onclick={() => handleViewDetail(request.uoid)}>
												<Eye class="mr-2 h-4 w-4" />
												Lihat Detail
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 0}
			<div class="flex items-center justify-between border-t px-4 py-3">
				<div class="text-sm text-muted-foreground">
					{((currentPage - 1) * pageSize) + 1} s/d {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data
				</div>
				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onclick={handlePrevPage}
						disabled={currentPage === 1}
					>
						Sebelumnya
					</Button>
					<div class="flex items-center gap-1">
						<span class="text-sm">{currentPage}</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						onclick={handleNextPage}
						disabled={currentPage === totalPages}
					>
						Selanjutnya
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Create Dialog -->
<ItemCodeRequestDialog bind:open={showCreateDialog} />
