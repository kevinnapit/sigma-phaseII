<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Loader2, Trophy, Printer } from 'lucide-svelte';
	import { useReadDetailRFQ } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import { formatCurrency, formatDate } from '$lib/shared/utils';
	import { printWinnerReport } from '../utils/print-winner';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let { rfqId }: { rfqId: string } = $props();

	const userContext = getUserContext();
	const rfqQuery = useReadDetailRFQ(() => rfqId);

	const rfqData = $derived(rfqQuery.data?.data);
	const isLoading = $derived(rfqQuery.isLoading);
	const isError = $derived(rfqQuery.isError);

	// Check if this is HO status
	const isHOStatus = $derived(rfqData?.status === 'MENUNGGU_PERSETUJUAN_HO' || rfqData?.status === 'TELAH_DIVERIFIKASI');

	const winnerQuotations = $derived(rfqData?.quotations?.filter((q) => q.is_winner) || []);

	// Build winner rows per vendor — each row is either the original item or its selected equivalent
	type WinnerRow = {
		rfqDetailId: string;
		itemCode: string;
		itemName: string;
		qty: number;
		uom: string;
		unitPrice: number;
		totalPrice: number;
		isEquivalent: boolean;
		equivalentCode?: string;
		equivalentName?: string;
		hoApprovalStatus?: 'APPROVED' | 'TRANSFERRED_TO_HO' | 'PENDING';
		hoApprovalNotes?: string;
	};

	const winnersByVendor = $derived(() => {
		if (!rfqData || winnerQuotations.length === 0) return [];

		return winnerQuotations
			.map((quotation) => {
				const rows: WinnerRow[] = [];

				for (const rfqItem of rfqData.items) {
					const qItem = quotation.items.find((qi) => qi.rfq_detail_id === rfqItem.uoid);
					if (!qItem) continue;

					// Cek equivalent is_selected dulu (prioritas tertinggi)
					const equivs = qItem.equivalents || [];
					const selectedEquiv = equivs.find((e) => e.is_selected && e.unit_price > 0);

					if (selectedEquiv) {
						// Pemenang via equivalent yang is_selected
						rows.push({
							rfqDetailId: rfqItem.uoid,
							itemCode: rfqItem.item_code,
							itemName: rfqItem.item_name,
							qty: selectedEquiv.qty,
							uom: rfqItem.uom,
							unitPrice: selectedEquiv.unit_price,
							totalPrice: selectedEquiv.total_price,
							isEquivalent: true,
							equivalentCode: selectedEquiv.equivalent_item_code,
							equivalentName: selectedEquiv.equivalent_brand || selectedEquiv.equivalent_item_name,
							hoApprovalStatus: qItem.ho_approval_status,
							hoApprovalNotes: qItem.ho_approval_notes
						});
					} else if (qItem.is_winner && qItem.unit_price > 0) {
						// Pemenang original item
						rows.push({
							rfqDetailId: rfqItem.uoid,
							itemCode: rfqItem.item_code,
							itemName: rfqItem.item_name,
							qty: qItem.qty,
							uom: rfqItem.uom,
							unitPrice: qItem.unit_price,
							totalPrice: qItem.total_price,
							isEquivalent: false,
							hoApprovalStatus: qItem.ho_approval_status,
							hoApprovalNotes: qItem.ho_approval_notes
						});
					} else if (!selectedEquiv && qItem.unit_price === 0) {
						// Fallback: tidak ada is_selected, ambil equivalent pertama yang ada harga
						const fallbackEquiv = equivs.find((e) => e.unit_price > 0);
						if (fallbackEquiv) {
							rows.push({
								rfqDetailId: rfqItem.uoid,
								itemCode: rfqItem.item_code,
								itemName: rfqItem.item_name,
								qty: fallbackEquiv.qty,
								uom: rfqItem.uom,
								unitPrice: fallbackEquiv.unit_price,
								totalPrice: fallbackEquiv.total_price,
								isEquivalent: true,
								equivalentCode: fallbackEquiv.equivalent_item_code,
								equivalentName: fallbackEquiv.equivalent_brand || fallbackEquiv.equivalent_item_name,
								hoApprovalStatus: qItem.ho_approval_status,
								hoApprovalNotes: qItem.ho_approval_notes
							});
						}
					}
				}

				const total = rows.reduce((sum, r) => sum + r.totalPrice, 0);
				return { quotation, rows, total };
			})
			.filter((v) => v.rows.length > 0);
	});

	const totalAmount = $derived(winnersByVendor().reduce((sum: number, v: any) => sum + v.total, 0));

	async function handlePrintReport() {
		if (!rfqData) return;
		await printWinnerReport(rfqData, userContext.user?.name ?? '-');
	}
</script>

<div class="space-y-6">
	{#if isLoading}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
					<p class="text-sm text-muted-foreground">Memuat data RFQ...</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if isError}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<p class="text-sm text-destructive">Gagal memuat data. Silakan coba lagi.</p>
					<Button variant="outline" onclick={() => rfqQuery.refetch()}>Coba Lagi</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if isHOStatus}
		<!-- HO Status Display -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					{#if rfqData?.status === 'MENUNGGU_PERSETUJUAN_HO'}
						<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
						Menunggu Persetujuan Head Office
					{:else if rfqData?.status === 'TELAH_DIVERIFIKASI'}
						<div class="h-3 w-3 rounded-full bg-green-500"></div>
						Telah Diverifikasi Head Office
					{/if}
				</Card.Title>
				<Card.Description>
					{#if rfqData?.status === 'MENUNGGU_PERSETUJUAN_HO'}
						RFQ telah dikirim ke Head Office untuk persetujuan lebih lanjut
					{:else if rfqData?.status === 'TELAH_DIVERIFIKASI'}
						RFQ telah diverifikasi dan disetujui oleh Head Office
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<!-- RFQ Info -->
				<div class="grid gap-4 md:grid-cols-3">
					<div class="rounded-lg border bg-muted/30 p-3">
						<p class="text-xs font-medium text-muted-foreground">No. Transaksi</p>
						<p class="mt-1 text-sm font-medium">{rfqData?.rfq_number}</p>
					</div>
					<div class="rounded-lg border bg-muted/30 p-3">
						<p class="text-xs font-medium text-muted-foreground">Tanggal Pemilihan</p>
						<p class="mt-1 text-sm font-medium">{rfqData?.winner_selected_at ? formatDate(rfqData.winner_selected_at) : '-'}</p>
					</div>
					<div class="rounded-lg border bg-muted/30 p-3">
						<p class="text-xs font-medium text-muted-foreground">Jumlah Vendor</p>
						<p class="mt-1 text-sm font-medium">{rfqData?.vendor_count} vendor</p>
					</div>
				</div>
				
				<!-- Department Destination (if exists) -->
				{#if rfqData?.department_destination}
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div class="flex items-center gap-2">
							<p class="text-sm font-medium text-blue-800">Departemen Tujuan:</p>
							<p class="text-sm font-semibold text-blue-900">{rfqData.department_destination}</p>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Justification -->
		{#if rfqData?.winner_justification}
			<Card.Root>
				<Card.Content class="space-y-2 pt-6">
					<p class="text-sm font-semibold">Justifikasi Pemilihan</p>
					<div class="rounded-lg border bg-muted/30 p-4">
						<p class="text-sm leading-relaxed text-muted-foreground">
							{rfqData.winner_justification}
						</p>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}

		<!-- Pemenang Tender -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Pemenang Tender</Card.Title>
				<Card.Description>Detail vendor pemenang dan item yang dimenangkan</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				{#each winnersByVendor() as winner}
					<div class="space-y-3">
						<!-- Vendor header -->
						<div class="rounded-lg border bg-green-50 p-4">
							<div class="flex items-start gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white"
								>
									<Trophy class="h-5 w-5" />
								</div>
								<div>
									<p class="font-semibold text-green-800">
										{winner.quotation.vendor_name} -
										{winner.quotation.vendor_rfq_number}
									</p>
									<p class="text-sm text-green-600">{winner.quotation.vendor_code}</p>
									<p class="text-sm text-green-600">
										{winner.rows.length} item • Total: {formatCurrency(winner.total)}
									</p>
								</div>
							</div>
						</div>

						<!-- Items table with HO Status -->
						<div class="overflow-x-auto rounded-md border px-2">
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-[40px]">No</Table.Head>
										<Table.Head>Kode Item</Table.Head>
										<Table.Head>Nama Item</Table.Head>
										<Table.Head class="text-center">Qty</Table.Head>
										<Table.Head class="text-center">UOM</Table.Head>
										<Table.Head class="text-right">Harga Satuan</Table.Head>
										<Table.Head class="text-right">Total Harga</Table.Head>
										<Table.Head class="text-center">Status Persetujuan HO</Table.Head>
										<Table.Head>Alasan</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each winner.rows as row, idx}
										<Table.Row>
											<Table.Cell>{idx + 1}</Table.Cell>
											<Table.Cell class="font-medium">
												{#if row.isEquivalent}
													<div>
														<span class="text-xs text-muted-foreground">{row.itemCode}</span>
														<br />
														<span>{row.equivalentCode}</span>
														<Badge variant="outline" class="ml-1 text-xs">Ekuivalen</Badge>
													</div>
												{:else}
													{row.itemCode}
												{/if}
											</Table.Cell>
											<Table.Cell>
												{#if row.isEquivalent}
													<div>
														<span class="text-xs text-muted-foreground line-through"
															>{row.itemName}</span
														>
														<br />
														<span>{row.equivalentName}</span>
													</div>
												{:else}
													{row.itemName}
												{/if}
											</Table.Cell>
											<Table.Cell class="text-center">{row.qty}</Table.Cell>
											<Table.Cell class="text-center">{row.uom}</Table.Cell>
											<Table.Cell class="text-right">{formatCurrency(row.unitPrice)}</Table.Cell>
											<Table.Cell class="text-right font-medium"
												>{formatCurrency(row.totalPrice)}</Table.Cell
											>
											<Table.Cell class="text-center">
												{#if row.hoApprovalStatus === 'APPROVED'}
													<Badge class="bg-green-100 text-green-800 border-green-300">
														Disetujui
													</Badge>
												{:else if row.hoApprovalStatus === 'TRANSFERRED_TO_HO'}
													<Badge class="bg-blue-100 text-blue-800 border-blue-300">
														Permintaan ke HO
													</Badge>
												{:else if row.hoApprovalStatus === 'PENDING'}
													<Badge variant="outline" class="bg-yellow-50 text-yellow-700 border-yellow-300">
														Menunggu
													</Badge>
												{:else}
													{#if rfqData?.status === 'MENUNGGU_PERSETUJUAN_HO'}
														<Badge variant="outline" class="bg-yellow-50 text-yellow-700 border-yellow-300">
															Menunggu
														</Badge>
													{:else if rfqData?.status === 'TELAH_DIVERIFIKASI'}
														<Badge class="bg-green-100 text-green-800 border-green-300">
															Disetujui
														</Badge>
													{/if}
												{/if}
											</Table.Cell>
											<Table.Cell>
												{#if row.hoApprovalNotes}
													<span class="text-sm text-muted-foreground">{row.hoApprovalNotes}</span>
												{:else}
													<span class="text-sm text-muted-foreground">-</span>
												{/if}
											</Table.Cell>
										</Table.Row>
									{/each}
									<Table.Row class="bg-muted/50">
										<Table.Cell colspan={8} class="text-right font-semibold">Subtotal:</Table.Cell>
										<Table.Cell class="text-right font-bold"
											>{formatCurrency(winner.total)}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</div>
					</div>
				{/each}

				<!-- Grand Total -->
				{#if winnersByVendor().length > 1}
					<div class="rounded-lg border-2 border-green-600 bg-green-50 p-4">
						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold text-green-800">Grand Total</span>
							<span class="text-2xl font-bold text-green-800">{formatCurrency(totalAmount)}</span>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	{:else if rfqData && winnersByVendor().length > 0}
		<!-- Header Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Ringkasan Pemenang Tender</Card.Title>
				<Card.Description>
					{rfqData.rfq_number}
					{#if rfqData.winner_selected_at}
						— Pemenang dipilih pada {formatDate(rfqData.winner_selected_at)}
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content class="-mt-2">
				<div class="flex justify-end">
					<Button variant="outline" class="w-full sm:w-auto" onclick={handlePrintReport}>
						<Printer class="mr-2 h-4 w-4" />
						Print Laporan
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Justification & Meta -->
		<Card.Root>
			<Card.Content class="space-y-4">
				{#if rfqData.winner_justification}
					<div class="space-y-2">
						<p class="text-sm font-semibold">Justifikasi Pemilihan</p>
						<div class="rounded-lg border bg-muted/30 p-4">
							<p class="text-sm leading-relaxed text-muted-foreground">
								{rfqData.winner_justification}
							</p>
						</div>
					</div>
				{/if}
				<div class="grid gap-4 md:grid-cols-3">
					<div class="rounded-lg border bg-muted/30 p-3">
						<p class="text-xs font-medium text-muted-foreground">Nomor Transaksi</p>
						<p class="mt-1 text-sm font-medium">{rfqData.rfq_number}</p>
					</div>
					{#if rfqData.winner_selected_at}
						<div class="rounded-lg border bg-muted/30 p-3">
							<p class="text-xs font-medium text-muted-foreground">Tanggal Pemilihan</p>
							<p class="mt-1 text-sm font-medium">{formatDate(rfqData.winner_selected_at)}</p>
						</div>
					{/if}
					<div class="rounded-lg border bg-muted/30 p-3">
						<p class="text-xs font-medium text-muted-foreground">Jumlah Pemenang</p>
						<p class="mt-1 text-sm font-medium">{winnersByVendor().length} vendor</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Winner Details per Vendor -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Pemenang Tender</Card.Title>
				<Card.Description>Detail vendor pemenang dan item yang dimenangkan</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				{#each winnersByVendor() as winner}
					<div class="space-y-3">
						<!-- Vendor header -->
						<div class="rounded-lg border bg-green-50 p-4">
							<div class="flex items-start gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white"
								>
									<Trophy class="h-5 w-5" />
								</div>
								<div>
									<p class="font-semibold text-green-800">
										{winner.quotation.vendor_name} -
										{winner.quotation.vendor_rfq_number}
									</p>
									<p class="text-sm text-green-600">{winner.quotation.vendor_code}</p>
									<p class="text-sm text-green-600">
										{winner.rows.length} item • Total: {formatCurrency(winner.total)}
									</p>
								</div>
							</div>
						</div>

						<!-- Items table -->
						<div class="overflow-x-auto rounded-md border px-2">
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-[40px]">No</Table.Head>
										<Table.Head>Kode Item</Table.Head>
										<Table.Head>Nama Item</Table.Head>
										<Table.Head class="text-center">Qty</Table.Head>
										<Table.Head class="text-center">UOM</Table.Head>
										<Table.Head class="text-right">Harga Satuan</Table.Head>
										<Table.Head class="text-right">Total Harga</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each winner.rows as row, idx}
										<Table.Row>
											<Table.Cell>{idx + 1}</Table.Cell>
											<Table.Cell class="font-medium">
												{#if row.isEquivalent}
													<div>
														<span class="text-xs text-muted-foreground">{row.itemCode}</span>
														<br />
														<span>{row.equivalentCode}</span>
														<Badge variant="outline" class="ml-1 text-xs">Ekuivalen</Badge>
													</div>
												{:else}
													{row.itemCode}
												{/if}
											</Table.Cell>
											<Table.Cell>
												{#if row.isEquivalent}
													<div>
														<span class="text-xs text-muted-foreground line-through"
															>{row.itemName}</span
														>
														<br />
														<span>{row.equivalentName}</span>
													</div>
												{:else}
													{row.itemName}
												{/if}
											</Table.Cell>
											<Table.Cell class="text-center">{row.qty}</Table.Cell>
											<Table.Cell class="text-center">{row.uom}</Table.Cell>
											<Table.Cell class="text-right">{formatCurrency(row.unitPrice)}</Table.Cell>
											<Table.Cell class="text-right font-medium"
												>{formatCurrency(row.totalPrice)}</Table.Cell
											>
										</Table.Row>
									{/each}
									<Table.Row class="bg-muted/50">
										<Table.Cell colspan={6} class="text-right font-semibold">Subtotal:</Table.Cell>
										<Table.Cell class="text-right font-bold"
											>{formatCurrency(winner.total)}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</div>
					</div>
				{/each}

				<!-- Grand Total -->
				{#if winnersByVendor().length > 1}
					<div class="rounded-lg border-2 border-green-600 bg-green-50 p-4">
						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold text-green-800">Grand Total</span>
							<span class="text-2xl font-bold text-green-800">{formatCurrency(totalAmount)}</span>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root>
			<Card.Content class="flex items-center justify-center py-16">
				<p class="text-sm text-muted-foreground">Data pemenang tidak ditemukan.</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>