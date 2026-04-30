<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle, XCircle, Building2, Package, Clock, AlertTriangle } from 'lucide-svelte';
	import { formatCurrency, formatDateTime } from '$lib/shared/utils';
	import type { SAPApprovalResponse, HOTransferResponse } from '../types/local-purchase-analysis.types';

	let {
		rfqId,
		rfqNumber
	}: {
		rfqId: string;
		rfqNumber: string;
	} = $props();

	let sapApproval = $state<SAPApprovalResponse | null>(null);
	let hoTransfer = $state<HOTransferResponse | null>(null);
	let isLoading = $state(true);
	let isProcessing = $state(false);

	// Mock data - in real app this would come from API
	onMount(async () => {
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Mock SAP approval data
		sapApproval = {
			rfq_id: rfqId,
			rfq_number: rfqNumber,
			submitted_at: '2026-04-18T14:00:00Z',
			responded_at: '2026-04-19T10:15:00Z',
			ktu_name: 'Bapak Suharto',
			ktu_notes: 'Sebagian item disetujui untuk procurement lokal, item khusus dialihkan ke HO',
			overall_status: 'MIXED',
			items: [
				{
					rfq_detail_id: 'rfq-dtl-022',
					item_code: 'ATK-002',
					item_name: 'Gula Pasir',
					qty: 25,
					uom: 'KG',
					vendor_name: 'CV Mitra Sejahtera',
					unit_price: 17600,
					total_price: 440000,
					approval_status: 'APPROVED',
					approval_reason: 'Budget lokal mencukupi untuk item standar',
					ktu_notes: 'Approved for local procurement'
				},
				{
					rfq_detail_id: 'rfq-dtl-023',
					item_code: 'TEST-001',
					item_name: 'Barang Test Perlu Izin',
					qty: 5,
					uom: 'PCS',
					vendor_name: 'CV Mitra Sejahtera',
					unit_price: 50000,
					total_price: 250000,
					approval_status: 'REJECTED',
					approval_reason: 'Budget lokal tidak mencukupi untuk item khusus',
					ktu_notes: 'Item dialihkan ke Head Office untuk proses lebih lanjut'
				}
			]
		};

		// Mock HO transfer data for rejected items
		hoTransfer = {
			rfq_id: rfqId,
			rfq_number: rfqNumber,
			transferred_at: '2026-04-19T10:30:00Z',
			transferred_by: 'System Auto Transfer',
			items: [
				{
					original_rfq_detail_id: 'rfq-dtl-023',
					item_code: 'TEST-001',
					item_name: 'Barang Test Perlu Izin',
					qty: 5,
					uom: 'PCS',
					specifications: 'Barang khusus yang memerlukan persetujuan departemen',
					estimated_price: 50000,
					requester_name: 'Bambang Suryanto',
					requester_division: 'Divisi IT',
					transfer_reason: 'Budget lokal tidak mencukupi - dialihkan dari SAP rejection',
					ho_reference_number: 'HO/PR/2026/00234',
					transferred_at: '2026-04-19T10:30:00Z',
					ho_status: 'PENDING'
				}
			]
		};

		isLoading = false;
	});

	const approvedItems = $derived(sapApproval?.items.filter(item => item.approval_status === 'APPROVED') || []);
	const rejectedItems = $derived(sapApproval?.items.filter(item => item.approval_status === 'REJECTED') || []);

	async function handleProcessApprovedItems() {
		isProcessing = true;
		// Simulate processing approved items to LPO
		await new Promise(resolve => setTimeout(resolve, 2000));
		isProcessing = false;
		// In real app, this would redirect to LPO creation or show success message
		alert('Item yang disetujui berhasil diproses ke LPO!');
	}
</script>

{#if isLoading}
	<div class="flex items-center justify-center py-8">
		<div class="flex items-center gap-2">
			<Clock class="h-5 w-5 animate-spin" />
			<span>Memuat hasil approval SAP...</span>
		</div>
	</div>
{:else if sapApproval}
	<div class="space-y-6">
		<!-- Header -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<div>
						<Card.Title class="flex items-center gap-2">
							<Building2 class="h-5 w-5" />
							Hasil Approval SAP
						</Card.Title>
						<Card.Description>
							{sapApproval.rfq_number} - Response dari {sapApproval.ktu_name}
						</Card.Description>
					</div>
					<Badge variant={sapApproval.overall_status === 'APPROVED' ? 'default' : sapApproval.overall_status === 'REJECTED' ? 'destructive' : 'secondary'}>
						{sapApproval.overall_status === 'APPROVED' ? 'Semua Disetujui' : 
						 sapApproval.overall_status === 'REJECTED' ? 'Semua Ditolak' : 
						 'Sebagian Disetujui'}
					</Badge>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<p class="text-sm font-medium">Tanggal Dikirim ke SAP</p>
						<p class="text-sm text-muted-foreground">{formatDateTime(sapApproval.submitted_at)}</p>
					</div>
					<div>
						<p class="text-sm font-medium">Tanggal Response SAP</p>
						<p class="text-sm text-muted-foreground">{formatDateTime(sapApproval.responded_at)}</p>
					</div>
				</div>
				{#if sapApproval.ktu_notes}
					<Alert.Root class="mt-4">
						<AlertTriangle class="h-4 w-4" />
						<Alert.Title>Catatan dari KTU</Alert.Title>
						<Alert.Description>{sapApproval.ktu_notes}</Alert.Description>
					</Alert.Root>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Summary -->
		{#if sapApproval.overall_status === 'MIXED'}
			<Alert.Root>
				<AlertTriangle class="h-4 w-4" />
				<Alert.Title>Status Campuran</Alert.Title>
				<Alert.Description>
					{approvedItems.length} item disetujui untuk procurement lokal, 
					{rejectedItems.length} item otomatis dialihkan ke Head Office
				</Alert.Description>
			</Alert.Root>
		{/if}

		<!-- Approved Items -->
		{#if approvedItems.length > 0}
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-green-700">
						<CheckCircle class="h-5 w-5" />
						Item Disetujui SAP ({approvedItems.length})
					</Card.Title>
					<Card.Description>Item berikut dapat diproses ke LPO lokal</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each approvedItems as item}
							<div class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<Badge variant="outline" class="border-green-600 text-green-700">✅ DISETUJUI</Badge>
											<span class="font-medium">{item.item_code} - {item.item_name}</span>
										</div>
										<div class="mt-2 grid gap-2 text-sm md:grid-cols-2">
											<div>
												<span class="text-muted-foreground">Qty:</span> {item.qty} {item.uom}
											</div>
											<div>
												<span class="text-muted-foreground">Vendor:</span> {item.vendor_name}
											</div>
											<div>
												<span class="text-muted-foreground">Harga:</span> {formatCurrency(item.unit_price, 'IDR')}/{item.uom}
											</div>
											<div>
												<span class="text-muted-foreground">Total:</span> {formatCurrency(item.total_price, 'IDR')}
											</div>
										</div>
										{#if item.ktu_notes}
											<p class="mt-2 text-sm text-green-700">{item.ktu_notes}</p>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
				<Card.Footer>
					<Button onclick={handleProcessApprovedItems} disabled={isProcessing} class="w-full">
						{#if isProcessing}
							<Clock class="mr-2 h-4 w-4 animate-spin" />
							Memproses ke LPO...
						{:else}
							<Package class="mr-2 h-4 w-4" />
							Proses ke LPO Lokal
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		{/if}

		<!-- Rejected Items (Auto transferred to HO) -->
		{#if rejectedItems.length > 0 && hoTransfer}
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-blue-700">
						<Building2 class="h-5 w-5" />
						Item Dialihkan ke Head Office ({rejectedItems.length})
					</Card.Title>
					<Card.Description>Item yang ditolak SAP otomatis dialihkan ke Head Office</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each rejectedItems as item}
							{@const hoItem = hoTransfer.items.find(ho => ho.item_code === item.item_code)}
							<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<Badge variant="outline" class="border-blue-600 text-blue-700">🏢 DIALIHKAN HO</Badge>
											<span class="font-medium">{item.item_code} - {item.item_name}</span>
										</div>
										<div class="mt-2 grid gap-2 text-sm md:grid-cols-2">
											<div>
												<span class="text-muted-foreground">Qty:</span> {item.qty} {item.uom}
											</div>
											<div>
												<span class="text-muted-foreground">Requester:</span> {hoItem?.requester_name}
											</div>
											<div>
												<span class="text-muted-foreground">Ref. HO:</span> {hoItem?.ho_reference_number}
											</div>
											<div>
												<span class="text-muted-foreground">Status HO:</span> 
												<Badge variant="secondary">{hoItem?.ho_status}</Badge>
											</div>
										</div>
										<div class="mt-2 space-y-1">
											<p class="text-sm text-red-600">
												<strong>Alasan penolakan:</strong> {item.approval_reason}
											</p>
											{#if hoItem}
												<p class="text-sm text-blue-600">
													<strong>Dialihkan:</strong> {formatDateTime(hoItem.transferred_at)}
												</p>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
				<Card.Footer>
					<Alert.Root>
						<Building2 class="h-4 w-4" />
						<Alert.Title>Otomatis Dialihkan</Alert.Title>
						<Alert.Description>
							Item yang ditolak SAP telah otomatis dialihkan ke sistem procurement Head Office. 
							Anda dapat memantau status melalui sistem HO atau menghubungi tim procurement pusat.
						</Alert.Description>
					</Alert.Root>
				</Card.Footer>
			</Card.Root>
		{/if}
	</div>
{/if}