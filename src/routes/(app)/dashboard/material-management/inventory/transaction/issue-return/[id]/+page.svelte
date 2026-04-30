<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Edit, FileText } from 'lucide-svelte';
	import { PageHeader, Guard } from '$lib/components/shared';
	import IssueReturnFormCard from '$lib/features/material-management/inventory/transaction/issue-return/components/IssueReturnFormCard.svelte';
	import IssueReturnItemsCard from '$lib/features/material-management/inventory/transaction/issue-return/components/IssueReturnItemsCard.svelte';
	import { ISSUE_RETURN_PERMISSIONS } from '$lib/features/material-management/inventory/transaction/issue-return/constants/issue-return-permissions';

	const returnId = $page.params.id;

	// Mock data for detail view
	let issueReturn = $state({
		id: returnId,
		return_number: 'IR/2026/0001',
		return_date: '2026-04-28',
		store_id: 'GDG-001',
		store_name: 'Gudang Poliklinik A',
		return_by_id: 'USR-001',
		return_by_name: 'Budi Santoso',
		remarks: 'Pengembalian barang yang tidak terpakai',
		status: 'Diproses',
		created_at: '2026-04-28T10:30:00Z',
		created_by: 'Budi Santoso',
		updated_at: '2026-04-28T14:15:00Z',
		updated_by: 'Siti Aminah'
	});

	let items = $state([
		{
			item_code: 'BRG-001',
			item_name: 'Pupuk NPK 50kg',
			issue_number: 'Issue/2026/0001',
			geographical_unit: 'Divisi 1',
			allocation_code: 'ALLOC-001',
			uom: 'Sak',
			issue_quantity: 50,
			unit_rate: 150000,
			quantity_returned: 2,
			remarks: 'Barang rusak',
			batch_no: 'BATCH-2026-001',
			storage_location: 'JAC-2'
		},
		{
			item_code: 'BRG-002',
			item_name: 'Oli Mesin SAE 40',
			issue_number: 'Issue/2026/0002',
			geographical_unit: 'Divisi 1',
			allocation_code: 'ALLOC-001',
			uom: 'Liter',
			issue_quantity: 20,
			unit_rate: 85000,
			quantity_returned: 1,
			remarks: 'Kelebihan stok',
			batch_no: 'BATCH-2026-002',
			storage_location: 'RAK-A-01'
		}
	]);

	// Convert to form data format for read-only display
	let formData = $state({
		return_date: issueReturn.return_date,
		store_id: issueReturn.store_id,
		store_name: issueReturn.store_name,
		return_by_id: issueReturn.return_by_id,
		return_by_name: issueReturn.return_by_name,
		remarks: issueReturn.remarks
	});

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/issue-return');
	}

	function handleEdit() {
		// Navigate to edit page (if needed in the future)
		goto(`/dashboard/material-management/inventory/transaction/issue-return/${returnId}/edit`);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div class="space-y-2">
			<PageHeader
				title="Detail Pengembalian Pengeluaran"
				description="Informasi lengkap pengembalian barang"
			/>
			<div class="flex items-center gap-4 text-sm text-muted-foreground">
				<div class="flex items-center gap-1">
					<FileText class="h-4 w-4" />
					<span class="font-mono font-medium">{issueReturn.return_number}</span>
				</div>
				<div>
					Dibuat: {new Date(issueReturn.created_at).toLocaleDateString('id-ID', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					})} oleh {issueReturn.created_by}
				</div>
			</div>
		</div>
		<div class="mt-5 flex items-center gap-2 sm:mt-0">
			<Button variant="outline" size="sm" onclick={handleBack}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Kembali
			</Button>
			<Guard permissions={ISSUE_RETURN_PERMISSIONS.UPDATE}>
				<Button variant="outline" size="sm" onclick={handleEdit}>
					<Edit class="mr-2 h-4 w-4" />
					Edit
				</Button>
			</Guard>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Detail Pengembalian (2/3) -->
		<div class="lg:col-span-2">
			<IssueReturnFormCard
				bind:formData
				readonly={true}
			/>
		</div>

		<!-- Informasi Tambahan (1/3) -->
		<div class="lg:col-span-1">
			<div class="space-y-4">
				<!-- Summary Card -->
				<div class="rounded-lg border bg-card p-4">
					<h3 class="mb-3 font-semibold">Ringkasan Pengembalian</h3>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Total Barang:</span>
							<span class="font-medium">{items.length}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Total Kembali:</span>
							<span class="font-medium">{items.reduce((sum, item) => sum + item.quantity_returned, 0)}</span>
						</div>
					</div>
				</div>

				<!-- Audit Trail -->
				<div class="rounded-lg border bg-card p-4">
					<h3 class="mb-3 font-semibold">Riwayat Perubahan</h3>
					<div class="space-y-3 text-sm">
						<div class="border-l-2 border-green-200 pl-3">
							<div class="font-medium">Dibuat</div>
							<div class="text-muted-foreground">
								{new Date(issueReturn.created_at).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</div>
							<div class="text-muted-foreground">oleh {issueReturn.created_by}</div>
						</div>
						{#if issueReturn.updated_at !== issueReturn.created_at}
							<div class="border-l-2 border-blue-200 pl-3">
								<div class="font-medium">Diperbarui</div>
								<div class="text-muted-foreground">
									{new Date(issueReturn.updated_at).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
								<div class="text-muted-foreground">oleh {issueReturn.updated_by}</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Items Table (Full Width) -->
	<div>
		<IssueReturnItemsCard
			{items}
			readonly={true}
		/>
	</div>
</div>