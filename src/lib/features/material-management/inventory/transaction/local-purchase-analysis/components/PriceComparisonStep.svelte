<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Award, Loader2, X, Save, Printer, Paperclip } from 'lucide-svelte';
	import { printComparisonReport } from '../utils/print-comparison';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { useReadQuotationComparison } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import { useSelectWinner } from '../hooks/useLocalPurchaseAnalysisMutations.svelte';
	import { formatCurrency } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';
	import Guard from '$lib/components/shared/guard.svelte';
	import { LOCAL_PURCHASE_ANALYSIS_PERMISSIONS } from '../constants/local-purchase-analysis.permissions';
	import { goto } from '$app/navigation';
	import type {
		ComparisonQuotation,
		ComparisonItem,
		ItemWinner,
		SelectWinnerRequest,
		ComparisonQuotationItem,
		ComparisonEquivalentItem,
		PendingVendor
	} from '../types/local-purchase-analysis.types';
	import { env } from '$env/dynamic/public';

	let { rfqId }: { rfqId: string } = $props();

	const comparisonQuery = useReadQuotationComparison(() => rfqId);
	const selectWinnerMutation = useSelectWinner();
	const userContext = getUserContext();

	const comparisonData = $derived(comparisonQuery.data?.data);
	const quotations = $derived(comparisonData?.quotations || []);
	const pendingVendors = $derived(comparisonData?.pending_vendors || []);
	const rfqItems = $derived(comparisonData?.items || []);
	const isLoading = $derived(comparisonQuery.isLoading);
	const isError = $derived(comparisonQuery.isError);

	const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

	// $inspect(comparisonData);

	// Winner selection state
	// key: rfq_detail_id → { quotationDetailId: string | null, equivalentId: string | null }
	// - Original item: quotationDetailId = qItem.uoid, equivalentId = null
	// - Equivalent:    quotationDetailId = null, equivalentId = equiv.uoid
	type WinnerSelection = { quotationDetailId: string | null; equivalentId: string | null };
	let isSelectingWinner = $state(false);
	let selectedWinners = $state<Record<string, WinnerSelection>>({});
	let justification = $state('');
	let showJustificationDialog = $state(false);

	const vendorLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	function hasSubmitted(quotation: ComparisonQuotation): boolean {
		// Vendor dianggap merespons jika ada minimal satu item dengan harga > 0 ATAU ada equivalent dengan harga > 0
		return quotation.items.some(
			(item) =>
				item.unit_price > 0 ||
				(item.equivalents?.length > 0 && item.equivalents.some((e) => e.unit_price > 0))
		);
	}

	function findQuotationItem(
		quotation: ComparisonQuotation,
		rfqItem: ComparisonItem
	): ComparisonQuotationItem | undefined {
		return quotation.items.find((qi) => qi.rfq_detail_id === rfqItem.uoid);
	}

	function handleSelectWinner() {
		isSelectingWinner = true;
		selectedWinners = {};
		justification = '';
	}

	function handleCancelSelection() {
		isSelectingWinner = false;
		selectedWinners = {};
		justification = '';
	}

	function handleSaveWinner() {
		showJustificationDialog = true;
	}

	async function handleSubmitWinner() {
		if (!justification.trim()) {
			toast.error('Justifikasi pemilihan pemenang wajib diisi');
			return;
		}

		const itemWinners: ItemWinner[] = rfqItems
			.filter((item) => {
				const sel = selectedWinners[item.uoid];
				return sel && (sel.quotationDetailId || sel.equivalentId);
			})
			.map((item) => {
				const sel = selectedWinners[item.uoid];
				const isEquiv = !!sel.equivalentId;
				return {
					rfq_detail_id: item.uoid,
					// quotation_detail_id hanya diisi saat bukan equivalent
					quotation_detail_id: isEquiv ? '' : (sel.quotationDetailId ?? ''),
					equivalent_id: sel.equivalentId ?? undefined,
					is_equivalent_winner: isEquiv
				};
			});

		const requestData: SelectWinnerRequest = {
			item_winners: itemWinners,
			justification: justification.trim()
		};

		try {
			await selectWinnerMutation.mutateAsync({ rfqId, data: requestData });
			toast.success('Pemenang tender berhasil dipilih');
			showJustificationDialog = false;
			isSelectingWinner = false;
			goto(
				`/dashboard/material-management/inventory/transaction/local-purchase-analysis/${rfqId}?step=create-lpo`
			);
		} catch (error) {
			toast.error(
				`Gagal memilih pemenang: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	// Radio value encoding:
	// Original item:  "qdetail:{quotationDetailId}"
	// Equivalent:     "equiv:{equivalentId}"
	function encodeRadioValue(quotationDetailId: string, equivalentId?: string): string {
		return equivalentId ? `equiv:${equivalentId}` : `qdetail:${quotationDetailId}`;
	}

	function decodeRadioValue(value: string): WinnerSelection {
		if (value.startsWith('equiv:')) {
			return { quotationDetailId: null, equivalentId: value.replace('equiv:', '') };
		}
		return { quotationDetailId: value.replace('qdetail:', ''), equivalentId: null };
	}

	function getRadioGroupValue(rfqDetailId: string): string {
		const sel = selectedWinners[rfqDetailId];
		if (!sel) return '';
		return encodeRadioValue(sel.quotationDetailId ?? '', sel.equivalentId ?? undefined);
	}

	function setRadioGroupValue(rfqDetailId: string, encoded: string) {
		selectedWinners[rfqDetailId] = decodeRadioValue(encoded);
	}
</script>

<div class="space-y-6">
	{#if isLoading}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Memuat data perbandingan harga...</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if isError}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<p class="text-sm text-destructive">Gagal memuat data perbandingan. Silakan coba lagi.</p>
					<Button variant="outline" onclick={() => comparisonQuery.refetch()}>Coba Lagi</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if comparisonData}
		<!-- Header Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Perbandingan Harga Vendor</Card.Title>
				<Card.Description>
					Perbandingan harga dari {quotations.length} vendor yang merespons{pendingVendors.length >
					0
						? ` · ${pendingVendors.length} vendor belum merespons`
						: ''} - {comparisonData?.rfq_title}
				</Card.Description>
			</Card.Header>
			<Card.Content class="-mt-2">
				<div class="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-2">
					{#if isSelectingWinner}
						<Button
							variant="outline"
							class="w-full sm:w-auto"
							onclick={handleCancelSelection}
							disabled={selectWinnerMutation.isPending}
						>
							<X class="mr-2 h-4 w-4" />
							Batal
						</Button>
						<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.UPDATE}>
							<Button
								class="w-full bg-[#0f4c2a] hover:bg-[#0d4023] sm:w-auto"
								onclick={handleSaveWinner}
								disabled={selectWinnerMutation.isPending}
							>
								<Save class="mr-2 h-4 w-4" />
								Simpan Pemenang
							</Button>
						</Guard>
					{:else}
						<Button
							variant="outline"
							class="w-full sm:w-auto"
							onclick={() =>
								comparisonData &&
								printComparisonReport(comparisonData, userContext.user?.name ?? '-')}
							disabled={!comparisonData}
						>
							<Printer class="mr-2 h-4 w-4" />
							<span class="hidden sm:inline">Cetak Laporan Perbandingan</span>
							<span class="sm:hidden">Cetak</span>
						</Button>
						<Guard permissions={LOCAL_PURCHASE_ANALYSIS_PERMISSIONS.UPDATE}>
							<Button
								class="w-full bg-[#0f4c2a] hover:bg-[#0d4023] sm:w-auto"
								onclick={handleSelectWinner}
							>
								<Award class="mr-2 h-4 w-4" />
								<span class="hidden sm:inline">Pilih Pemenang</span>
								<span class="sm:hidden">Pemenang</span>
							</Button>
						</Guard>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Vendor Quotation Cards -->
		{#each quotations as quotation, index}
			{@const submitted = hasSubmitted(quotation)}
			<Card.Root>
				<Card.Header>
					<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
						<div class="flex items-start gap-3">
							<div
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
							>
								{vendorLetters[index] || index + 1}
							</div>
							<div>
								<div class="flex flex-wrap items-center gap-2">
									<Card.Title class="text-base"
										>{quotation.vendor_name} - {quotation.vendor_rfq_number}</Card.Title
									>
									{#if !submitted}
										<Badge variant="secondary">Tidak Merespons</Badge>
									{/if}
								</div>
								<p class="text-sm text-muted-foreground">{quotation.vendor_code}</p>
							</div>
						</div>
						{#if submitted}
							<div class="sm:text-right">
								<p class="text-sm text-muted-foreground">Total Penawaran</p>
								<p class="text-xl font-bold">{formatCurrency(quotation.total_amount)}</p>
							</div>
						{/if}
					</div>
				</Card.Header>
				<Card.Content>
					<div class="overflow-x-auto rounded-md border">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									{#if isSelectingWinner}
										<Table.Head class="px-4 text-center">Pilih</Table.Head>
									{/if}
									<Table.Head class="w-[40px] px-4">No</Table.Head>
									<Table.Head class="px-4">Kode Item</Table.Head>
									<Table.Head class="px-4">Nama Item</Table.Head>
									<Table.Head class="px-4">Qty Permintaan</Table.Head>
									<Table.Head class="px-4">UOM</Table.Head>
									<Table.Head class="px-4 text-right">Harga Penawaran</Table.Head>
									<Table.Head class="px-4 text-right">Total Harga Penawaran</Table.Head>
									<Table.Head class="px-4">Ketersediaan</Table.Head>
									<Table.Head class="px-4">Dokumen</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each rfqItems as rfqItem, itemIndex}
									{@const qItem = findQuotationItem(quotation, rfqItem)}
									<!-- Original item row -->
									<Table.Row class={qItem?.equivalents?.length ? 'border-b-0' : ''}>
										{#if isSelectingWinner}
											<Table.Cell class="px-4 py-3 text-center">
												{#if qItem && qItem.unit_price > 0}
													<input
														type="radio"
														name="winner_{rfqItem.uoid}"
														value={encodeRadioValue(qItem.uoid)}
														checked={getRadioGroupValue(rfqItem.uoid) ===
															encodeRadioValue(qItem.uoid)}
														onchange={() =>
															setRadioGroupValue(rfqItem.uoid, encodeRadioValue(qItem.uoid))}
														class="h-4 w-4 accent-[#0f4c2a]"
													/>
												{:else}
													<span class="text-muted-foreground">-</span>
												{/if}
											</Table.Cell>
										{/if}
										<Table.Cell class="px-4 py-3">{itemIndex + 1}</Table.Cell>
										<Table.Cell class="px-4 py-3 font-medium">{rfqItem.item_code}</Table.Cell>
										<Table.Cell class="px-4 py-3">{rfqItem.item_name}</Table.Cell>
										<Table.Cell class="px-4 py-3">{qItem?.items?.qty ?? rfqItem.qty}</Table.Cell>
										<Table.Cell class="px-4 py-3">{rfqItem.uom}</Table.Cell>
										<Table.Cell class="px-4 py-3 text-right">
											{#if qItem && qItem.unit_price > 0}
												{formatCurrency(qItem.unit_price)}
											{:else}
												<span class="text-muted-foreground">-</span>
											{/if}
										</Table.Cell>
										<Table.Cell class="px-4 py-3 text-right">
											{#if qItem && qItem.total_price > 0}
												{formatCurrency(qItem.total_price)}
											{:else}
												<span class="text-muted-foreground">-</span>
											{/if}
										</Table.Cell>
										<Table.Cell class="px-4 py-3">
											{#if !submitted || !qItem}
												<Badge variant="outline" class="text-muted-foreground"
													>Tidak ada penawaran</Badge
												>
											{:else if qItem.ketersediaan_barang === '1'}
												<Badge variant="default" class="bg-[#0f4c2a]">Stok Terpenuhi</Badge>
											{:else if qItem.ketersediaan_barang === '2'}
												<div class="flex flex-col gap-1">
													<Badge variant="default" class="bg-[#0f4c2a]">
														Ready Stock ({qItem.jumlah_tersedia})
													</Badge>
													{#if qItem.jumlah_inden || qItem.lama_inden}
														<Badge variant="outline" class="border bg-white">
															Indent ({qItem.jumlah_inden}) - {qItem.lama_inden} hari
														</Badge>
													{/if}
												</div>
											{:else}
												<Badge variant="outline" class="text-muted-foreground"
													>Tidak ada penawaran</Badge
												>
											{/if}
										</Table.Cell>
										<Table.Cell class="px-4 py-3">
											{#if qItem?.documents?.length}
												<div class="flex flex-col gap-1">
													{#each qItem.documents as doc}
														{@const url = doc.download_url?.startsWith('http')
															? doc.download_url
															: `${BASE_URL}${doc.download_url}`}
														<a
															href={url}
															target="_blank"
															rel="noopener noreferrer"
															class="flex items-center gap-1 text-xs text-blue-600 hover:underline"
														>
															<Paperclip class="h-3 w-3 shrink-0" />
															<span class="max-w-[120px] truncate">{doc.file_name}</span>
														</a>
													{/each}
												</div>
											{:else}
												<span class="text-muted-foreground">-</span>
											{/if}
										</Table.Cell>
									</Table.Row>

									<!-- Equivalent rows (if any) -->
									{#if qItem?.equivalents?.length}
										{#each qItem.equivalents as equiv}
											<Table.Row class="bg-muted/30">
												{#if isSelectingWinner}
													<Table.Cell class="px-4 py-2 text-center">
														{#if equiv.unit_price > 0}
															<input
																type="radio"
																name="winner_{rfqItem.uoid}"
																value={encodeRadioValue('', equiv.uoid)}
																checked={getRadioGroupValue(rfqItem.uoid) ===
																	encodeRadioValue('', equiv.uoid)}
																onchange={() =>
																	setRadioGroupValue(
																		rfqItem.uoid,
																		encodeRadioValue('', equiv.uoid)
																	)}
																class="h-4 w-4 accent-[#0f4c2a]"
															/>
														{:else}
															<span class="text-muted-foreground">-</span>
														{/if}
													</Table.Cell>
												{/if}
												<Table.Cell class="px-4 py-2"></Table.Cell>
												<Table.Cell class="px-4 py-2">
													<span class="text-xs text-muted-foreground">↳ Ekuivalen</span>
													<br />
													<span class="text-sm font-medium">{equiv.equivalent_item_code}</span>
												</Table.Cell>
												<Table.Cell class="px-4 py-2 text-sm">{equiv.equivalent_merk}</Table.Cell>
												<Table.Cell class="px-4 py-2 text-sm">{equiv.qty}</Table.Cell>
												<Table.Cell class="px-4 py-2 text-sm">{rfqItem.uom}</Table.Cell>
												<Table.Cell class="px-4 py-2 text-right text-sm">
													{#if equiv.unit_price > 0}
														{formatCurrency(equiv.unit_price)}
													{:else}
														<span class="text-muted-foreground">-</span>
													{/if}
												</Table.Cell>
												<Table.Cell class="px-4 py-2 text-right text-sm">
													{#if equiv.total_price > 0}
														{formatCurrency(equiv.total_price)}
													{:else}
														<span class="text-muted-foreground">-</span>
													{/if}
												</Table.Cell>
												<Table.Cell class="px-4 py-2">
													{#if !equiv.stock_availability || equiv.stock_availability === '0'}
														<Badge variant="outline" class="text-xs text-muted-foreground"
															>Tidak ada penawaran</Badge
														>
													{:else if equiv.stock_availability === '1'}
														<Badge variant="default" class="bg-[#0f4c2a] text-xs"
															>Stok Terpenuhi</Badge
														>
													{:else if equiv.stock_availability === '2'}
														<div class="flex flex-col gap-1">
															<Badge variant="default" class="bg-[#0f4c2a] text-xs">
																Ready Stock ({equiv.stock_qty})
															</Badge>
															{#if equiv.indent_quantity || equiv.indent_duration}
																<Badge variant="outline" class="border bg-white text-xs">
																	Indent ({equiv.indent_quantity}) - {equiv.indent_duration} hari
																</Badge>
															{/if}
														</div>
													{:else}
														<Badge variant="outline" class="text-xs text-muted-foreground"
															>Tidak ada penawaran</Badge
														>
													{/if}
												</Table.Cell>
												<Table.Cell class="px-4 py-2">
													<span class="text-muted-foreground">-</span>
												</Table.Cell>
											</Table.Row>
										{/each}
									{/if}
								{/each}

								{#if rfqItems.length === 0}
									<Table.Row>
										<Table.Cell
											colspan={isSelectingWinner ? 10 : 9}
											class="px-4 py-6 text-center text-muted-foreground"
										>
											Tidak ada item
										</Table.Cell>
									</Table.Row>
								{/if}
							</Table.Body>
						</Table.Root>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}

		{#if quotations.length === 0 && pendingVendors.length === 0}
			<Card.Root>
				<Card.Content class="flex items-center justify-center py-16">
					<p class="text-sm text-muted-foreground">Belum ada data penawaran dari vendor.</p>
				</Card.Content>
			</Card.Root>
		{/if}

		<!-- Pending Vendors (belum merespons) -->
		{#if pendingVendors.length > 0}
			{#each pendingVendors as pendingVendor, index}
				<Card.Root class="border-dashed opacity-75">
					<Card.Header>
						<div class="flex items-start gap-3">
							<div
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground"
							>
								{vendorLetters[quotations.length + index] || quotations.length + index + 1}
							</div>
							<div>
								<div class="flex items-center gap-2">
									<Card.Title class="text-base text-muted-foreground">
										{pendingVendor.vendor_name} - {pendingVendor.vendor_rfq_number}
									</Card.Title>
									<Badge variant="secondary">Belum Merespons</Badge>
								</div>
								<p class="text-sm text-muted-foreground">{pendingVendor.vendor_code}</p>
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-muted-foreground italic">Vendor belum mengirimkan penawaran.</p>
					</Card.Content>
				</Card.Root>
			{/each}
		{/if}
	{/if}
</div>

<!-- Justification Dialog -->
<AlertDialog.Root bind:open={showJustificationDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Justifikasi Pemilihan Pemenang</AlertDialog.Title>
			<AlertDialog.Description>
				Berikan justifikasi keseluruhan untuk pemilihan pemenang tender ini.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2 py-2">
			<Label for="justification">Justifikasi *</Label>
			<Textarea
				id="justification"
				bind:value={justification}
				placeholder="Masukkan justifikasi pemilihan pemenang secara keseluruhan..."
				class="min-h-[120px]"
				disabled={selectWinnerMutation.isPending}
			/>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={selectWinnerMutation.isPending}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleSubmitWinner}
				disabled={selectWinnerMutation.isPending || !justification.trim()}
				class="bg-[#0f4c2a] hover:bg-[#0d4023]"
			>
				{#if selectWinnerMutation.isPending}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Menyimpan...
				{:else}
					Simpan Pemenang
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
