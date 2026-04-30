<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft, Send, LoaderCircle, Clock } from 'lucide-svelte';
	import { PageHeader } from '$lib/components/shared';
	import Guard from '$lib/components/shared/guard.svelte';
	import {
		useApproveTransferReceipt,
		useRejectTransferReceipt
	} from '$lib/features/material-management/inventory/transaction/transfer-receipt/hooks/useTransferReceiptMutations.svelte';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	const receiptId = $derived(page.params.id);

	// ── Mock data ────────────────────────────────────────────────────────────────
	let transferReceipt = $state({
		id: '1',
		grn_number: 'GRN/TR/2026/0001',
		grn_date: '2026-04-28',
		delivery_date: '2026-04-28',
		store_name: 'Gudang Poliklinik A',
		administrative_unit_name: 'Afd Penerima',
		from_store_name: 'Gudang',
		ref_no: 'REF/2026/001',
		delivery_note_no: 'DN/2026/001',
		vehicle_no: 'B 1234 ABC',
		transporter: 'PT Transport Jaya',
		mr_no: 'MR/2017/8/001',
		remarks: 'Penerimaan barang transfer dari gudang pusat',
		approval_status: 'PENDING_APPROVAL',
		gross_amount: 1850000,
		created_at: '2026-04-28T10:30:00Z',
		created_by: 'Budi Santoso',
		updated_at: '2026-04-28T14:15:00Z',
		updated_by: 'Siti Aminah'
	});

	let items = $state([
		{
			item_code: '7011812',
			item_name: 'BECOM C',
			item_uom: 'Caplet',
			mr_quantity: 100,
			grn_quantity: 100,
			grn_uom: 'Caplet',
			accepted_quantity: 100,
			unit_rate: 5000,
			total_value: 500000,
			total_amount: 500000,
			batch_no: 'BATCH001',
			mfd_date: '2026-01-01',
			exp_date: '2027-01-01',
			storage: 'RAK-A-01',
			percentage_amount: 0,
			mr_allocation: 'ALLOC-001',
			batchwise_entries: [],
			additional_charges: []
		},
		{
			item_code: '7021129',
			item_name: 'MIRASECT TAB / EXTRO',
			item_uom: 'Tablet',
			mr_quantity: 100,
			grn_quantity: 100,
			grn_uom: 'Tablet',
			accepted_quantity: 100,
			unit_rate: 7500,
			total_value: 750000,
			total_amount: 750000,
			batch_no: 'BATCH002',
			mfd_date: '2026-02-01',
			exp_date: '2027-02-01',
			storage: 'RAK-B-02',
			percentage_amount: 0,
			mr_allocation: 'ALLOC-002',
			batchwise_entries: [],
			additional_charges: []
		},
		{
			item_code: '7011814',
			item_name: 'BIOSANBE',
			item_uom: 'Capsul',
			mr_quantity: 100,
			grn_quantity: 100,
			grn_uom: 'Capsul',
			accepted_quantity: 100,
			unit_rate: 6000,
			total_value: 600000,
			total_amount: 600000,
			batch_no: 'BATCH003',
			mfd_date: '2026-03-01',
			exp_date: '2027-03-01',
			storage: 'RAK-C-03',
			percentage_amount: 0,
			mr_allocation: 'ALLOC-003',
			batchwise_entries: [],
			additional_charges: []
		}
	]);

	// ── Mutations ────────────────────────────────────────────────────────────────
	const approveMutation = useApproveTransferReceipt();
	const rejectMutation  = useRejectTransferReceipt();

	let showApproveDialog = $state(false);
	let showRejectDialog  = $state(false);

	const isApproving  = $derived(approveMutation.isPending);
	const isRejecting  = $derived(rejectMutation.isPending);
	const isDraft      = $derived(transferReceipt.approval_status === 'DRAFT');
	const isPending    = $derived(transferReceipt.approval_status === 'PENDING_APPROVAL');

	// ── Status helpers ───────────────────────────────────────────────────────────
	const statusLabelMap: Record<string, string> = {
		DRAFT:            'Belum Diajukan',
		PENDING_APPROVAL: 'Menunggu Persetujuan Askep/Tekniker 1',
		APPROVED:         'Disetujui',
		REJECTED:         'Ditolak',
		CANCELLED:        'Dibatalkan'
	};

	function getStatusLabel(s: string) {
		return statusLabelMap[s] ?? s;
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('id-ID', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}

	const grossTotal = $derived(items.reduce((s, i) => s + i.total_amount, 0));

	// ── Navigation ───────────────────────────────────────────────────────────────
	function handleBack() {
		const params = page.url.searchParams.toString();
		goto(
			`/dashboard/material-management/inventory/transaction/transfer-receipt${params ? `?${params}` : ''}`
		);
	}

	// ── Actions ──────────────────────────────────────────────────────────────────
	async function handleApprove(reason?: string) {
		try {
			await approveMutation.mutateAsync(receiptId);
			transferReceipt.approval_status = 'APPROVED';
			toast.success(`GRN ${transferReceipt.grn_number} berhasil disetujui`);
			showApproveDialog = false;
		} catch (e) {
			toast.error(`Gagal menyetujui: ${e instanceof Error ? e.message : 'Unknown error'}`);
		}
	}

	async function handleReject(reason?: string) {
		if (!reason) return;
		try {
			await rejectMutation.mutateAsync({ id: receiptId, reason });
			transferReceipt.approval_status = 'REJECTED';
			toast.success(`GRN ${transferReceipt.grn_number} berhasil ditolak`);
			showRejectDialog = false;
		} catch (e) {
			toast.error(`Gagal menolak: ${e instanceof Error ? e.message : 'Unknown error'}`);
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<PageHeader
			title="Detail Penerimaan Barang Transfer"
			description="Informasi lengkap penerimaan barang transfer"
		/>
		<div class="mt-5 flex items-center gap-2 max-sm:flex-row-reverse max-sm:justify-end">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- ── Left column (2/3) ─────────────────────────────────────────────── -->
		<div class="space-y-6 lg:col-span-2">

			<!-- Informasi Umum -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Informasi Umum</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p class="mb-1 text-sm text-muted-foreground">Nomor GRN</p>
							<p class="text-sm font-medium">{transferReceipt.grn_number}</p>
						</div>
						<div>
							<p class="mb-1 text-sm text-muted-foreground">Tanggal GRN</p>
							<p class="text-sm font-medium">{formatDate(transferReceipt.grn_date)}</p>
						</div>
						<div>
							<p class="mb-1 text-sm text-muted-foreground">Gudang</p>
							<p class="text-sm font-medium">{transferReceipt.store_name}</p>
						</div>
						<div>
							<p class="mb-1 text-sm text-muted-foreground">Unit Administratif</p>
							<p class="text-sm font-medium">{transferReceipt.administrative_unit_name}</p>
						</div>
						<div>
							<p class="mb-1 text-sm text-muted-foreground">Tanggal Pengiriman</p>
							<p class="text-sm font-medium">{formatDate(transferReceipt.delivery_date)}</p>
						</div>
						<div>
							<p class="mb-1 text-sm text-muted-foreground">Dari Gudang</p>
							<p class="text-sm font-medium">{transferReceipt.from_store_name}</p>
						</div>
						{#if transferReceipt.ref_no}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Nomor Referensi</p>
								<p class="text-sm font-medium">{transferReceipt.ref_no}</p>
							</div>
						{/if}
						{#if transferReceipt.delivery_note_no}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">No. Surat Jalan</p>
								<p class="text-sm font-medium">{transferReceipt.delivery_note_no}</p>
							</div>
						{/if}
						{#if transferReceipt.vehicle_no}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Nomor Kendaraan</p>
								<p class="text-sm font-medium">{transferReceipt.vehicle_no}</p>
							</div>
						{/if}
						{#if transferReceipt.transporter}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Transporter</p>
								<p class="text-sm font-medium">{transferReceipt.transporter}</p>
							</div>
						{/if}
						{#if transferReceipt.mr_no}
							<div>
								<p class="mb-1 text-sm text-muted-foreground">Nomor MR</p>
								<p class="text-sm font-medium">{transferReceipt.mr_no}</p>
							</div>
						{/if}
						{#if transferReceipt.remarks}
							<div class="md:col-span-2">
								<p class="mb-1 text-sm text-muted-foreground">Catatan</p>
								<p class="text-sm font-medium">{transferReceipt.remarks}</p>
							</div>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Detail Barang -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						Detail Barang
						<Badge variant="outline">{items.length} Item</Badge>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<!-- Desktop table -->
					<div class="hidden overflow-x-auto md:block">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b bg-muted/50 text-left text-muted-foreground">
									<th class="p-2 font-medium" style="min-width:110px;">Kode Barang</th>
									<th class="p-2 font-medium" style="min-width:180px;">Nama Barang</th>
									<th class="p-2 font-medium" style="min-width:70px;">Satuan</th>
									<th class="p-2 text-right font-medium" style="min-width:80px;">Jml MR</th>
									<th class="p-2 text-right font-medium" style="min-width:80px;">Jml GRN</th>
									<th class="p-2 font-medium" style="min-width:80px;">Sat. GRN</th>
									<th class="p-2 text-right font-medium" style="min-width:90px;">Jml Diterima</th>
									<th class="p-2 text-right font-medium" style="min-width:100px;">Harga Satuan</th>
									<th class="p-2 text-right font-medium" style="min-width:110px;">Total Nilai</th>
									<th class="p-2 font-medium" style="min-width:110px;">No. Batch</th>
									<th class="p-2 font-medium" style="min-width:100px;">Kode</th>
									<th class="p-2 font-medium" style="min-width:110px;">Tgl Produksi</th>
									<th class="p-2 font-medium" style="min-width:110px;">Tgl Kadaluarsa</th>
									<th class="p-2 font-medium" style="min-width:110px;">Penyimpanan</th>
									<th class="p-2 text-right font-medium" style="min-width:70px;">% Jml</th>
									<th class="p-2 font-medium" style="min-width:100px;">Kode</th>
									<th class="p-2 text-right font-medium" style="min-width:110px;">Total Jumlah</th>
									<th class="p-2 font-medium" style="min-width:110px;">Alokasi MR</th>
								</tr>
							</thead>
							<tbody>
								{#each items as item}
									<tr class="border-b last:border-0">
										<td class="p-2 text-muted-foreground">{item.item_code}</td>
										<td class="p-2">{item.item_name}</td>
										<td class="p-2 text-muted-foreground">{item.item_uom}</td>
										<td class="p-2 text-right text-muted-foreground">{item.mr_quantity ?? '-'}</td>
										<td class="p-2 text-right text-muted-foreground">{item.grn_quantity ?? item.accepted_quantity}</td>
										<td class="p-2 text-muted-foreground">{item.grn_uom ?? item.item_uom}</td>
										<td class="p-2 text-right font-medium">{item.accepted_quantity}</td>
										<td class="p-2 text-right text-muted-foreground">{formatCurrency(item.unit_rate)}</td>
										<td class="p-2 text-right text-muted-foreground">{formatCurrency(item.total_value ?? item.total_amount)}</td>
										<td class="p-2 text-muted-foreground">{item.batch_no || '-'}</td>
										<!-- Kode 1: Batchwise summary -->
										<td class="p-2 text-muted-foreground">
											{#if item.batchwise_entries?.length > 0}
												<span class="text-xs">{item.batchwise_entries.map((e: any) => e.batch).filter(Boolean).join(', ')}</span>
											{:else}
												<span class="text-xs">-</span>
											{/if}
										</td>
										<td class="p-2 text-muted-foreground">{item.mfd_date || '-'}</td>
										<td class="p-2 text-muted-foreground">{item.exp_date || '-'}</td>
										<td class="p-2 text-muted-foreground">{item.storage || '-'}</td>
										<td class="p-2 text-right text-muted-foreground">{item.percentage_amount ?? 0}</td>
										<!-- Kode 2: Additional charges summary -->
										<td class="p-2 text-muted-foreground">
											{#if item.additional_charges?.length > 0}
												<span class="text-xs">{formatCurrency(item.additional_charges.reduce((s: number, e: any) => s + (e.amount || 0), 0))}</span>
											{:else}
												<span class="text-xs">-</span>
											{/if}
										</td>
										<td class="p-2 text-right text-muted-foreground">{formatCurrency(item.total_amount)}</td>
										<td class="p-2 text-muted-foreground">{item.mr_allocation || '-'}</td>
									</tr>
								{/each}
							</tbody>
							<tfoot>
								<tr class="border-t font-semibold">
									<td colspan="17" class="p-2 text-right">Gross Amount</td>
									<td class="p-2 text-right">{formatCurrency(grossTotal)}</td>
								</tr>
							</tfoot>
						</table>
					</div>

					<!-- Mobile cards -->
					<div class="space-y-3 md:hidden">
						{#each items as item}
							<div class="overflow-hidden rounded-lg border">
								<div class="p-4">
									<div class="mb-3">
										<p class="text-sm font-semibold">{item.item_name}</p>
										<p class="text-xs text-muted-foreground">{item.item_code}</p>
									</div>
									<div class="grid grid-cols-2 gap-x-4 gap-y-2">
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Qty Diterima</p>
											<p class="text-sm font-semibold">{item.accepted_quantity} {item.item_uom}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">No. Batch</p>
											<p class="text-sm font-medium">{item.batch_no || '-'}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Penyimpanan</p>
											<p class="text-sm font-medium">{item.storage || '-'}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Tgl Kadaluarsa</p>
											<p class="text-sm font-medium">{item.exp_date || '-'}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Harga Satuan</p>
											<p class="text-sm font-medium">{formatCurrency(item.unit_rate)}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Total</p>
											<p class="text-sm font-semibold">{formatCurrency(item.total_amount)}</p>
										</div>
										<div>
											<p class="mb-0.5 text-xs text-muted-foreground">Alokasi MR</p>
											<p class="text-sm font-medium">{item.mr_allocation || '-'}</p>
										</div>
									</div>
								</div>
							</div>
						{/each}
						<div class="flex justify-between border-t pt-3 font-medium">
							<p class="text-sm">Gross Amount</p>
							<p class="text-sm">{formatCurrency(grossTotal)}</p>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Riwayat Persetujuan -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Clock class="h-5 w-5" />
						Riwayat Persetujuan
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-center text-sm text-muted-foreground">Belum ada riwayat persetujuan</p>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- ── Right column (1/3) sticky ────────────────────────────────────── -->
		<div class="lg:col-span-1">
			<div class="sticky top-6 space-y-6">

				<!-- Status Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Status Persetujuan</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-center rounded-lg border p-4">
							<p class="text-sm font-medium">{getStatusLabel(transferReceipt.approval_status)}</p>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Approval Action Card -->
				{#if isPending}
					<Card.Root>
						<Card.Header>
							<Card.Title>Tindakan Persetujuan</Card.Title>
							<p class="mt-1 text-sm text-muted-foreground">
								Sebagai Askep/Tekniker 1, Anda perlu menyetujui atau menolak penerimaan ini.
							</p>
						</Card.Header>
						<Card.Content class="space-y-3">
							<Button
								onclick={() => (showApproveDialog = true)}
								disabled={isApproving || isRejecting}
								class="w-full bg-[#116834] hover:bg-green-900"
							>
								Setujui
							</Button>
							<Button
								onclick={() => (showRejectDialog = true)}
								disabled={isApproving || isRejecting}
								variant="destructive"
								class="w-full bg-[#D12828] hover:bg-red-700"
							>
								Tolak
							</Button>
						</Card.Content>
					</Card.Root>
				{/if}

			</div>
		</div>
	</div>
</div>

<!-- Approve Dialog -->
<AlertDialog.Root bind:open={showApproveDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Konfirmasi Persetujuan</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menyetujui penerimaan barang transfer ini?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2 py-4">
			<Label for="approve-note">Catatan (opsional)</Label>
			<Textarea
				id="approve-note"
				placeholder="Berikan catatan persetujuan..."
				rows={3}
				disabled={isApproving}
			/>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isApproving}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => handleApprove()}
				disabled={isApproving}
				class="bg-[#116834] hover:bg-green-900"
			>
				{#if isApproving}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Menyetujui...
				{:else}
					Ya, Setujui
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- Reject Dialog -->
<AlertDialog.Root bind:open={showRejectDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Konfirmasi Penolakan</AlertDialog.Title>
			<AlertDialog.Description>
				Anda akan menolak penerimaan barang transfer ini. Silakan berikan alasan penolakan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2 py-4">
			<Label for="reject-reason">Alasan Penolakan <span class="text-red-500">*</span></Label>
			<Textarea
				id="reject-reason"
				placeholder="Berikan alasan penolakan..."
				rows={4}
				disabled={isRejecting}
			/>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isRejecting}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => {
					const el = document.getElementById('reject-reason') as HTMLTextAreaElement;
					handleReject(el?.value);
				}}
				disabled={isRejecting}
				class="bg-[#D12828] hover:bg-red-700"
			>
				{#if isRejecting}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Menolak...
				{:else}
					Ya, Tolak
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
