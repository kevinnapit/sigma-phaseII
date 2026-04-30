<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Plus, Loader2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
	import { PageHeader } from '$lib/components/shared';
	import {
		useReadDetailCentralVendor,
		usePublishCentralVendor
	} from '$lib/features/material-management/inventory/master/vendor/central/hooks/useVendorsCentralQueries.svelte';
	import type { CentralVendorPublishResponse } from '$lib/features/material-management/inventory/master/vendor/central/types/vendor-central.types';
	import PublishVendorSuccessModal from '$lib/features/material-management/inventory/master/vendor/central/components/PublishVendorSuccessModal.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';

	const sapVendorCode = $derived(page.params.sapVendorCode);
	const returnParams = $derived(page.url.searchParams.toString());

	const vendorQuery = useReadDetailCentralVendor(() => sapVendorCode || '');
	const vendor = $derived(vendorQuery.data);
	const isLoading = $derived(vendorQuery.isLoading);
	const isError = $derived(vendorQuery.isError);

	const publishMutation = usePublishCentralVendor();
	let showConfirmDialog = $state(false);
	let showSuccessModal = $state(false);
	let publishResult = $state<CentralVendorPublishResponse | null>(null);

	function handleBack() {
		const params = returnParams ? `?${returnParams}` : '';
		goto(`/dashboard/material-management/inventory/master/vendor${params}`);
	}

	async function handleConfirmPublish() {
		if (!sapVendorCode) return;
		try {
			const result = await publishMutation.mutateAsync(sapVendorCode);
			publishResult = result;
			showConfirmDialog = false;
			showSuccessModal = true;
		} catch (error) {
			showConfirmDialog = false;
			toast.error(
				`Gagal mendaftarkan vendor: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="space-y-6">
	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<div
					class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
				></div>
				<p class="mt-4 text-xs text-gray-600 md:text-sm">Loading vendor data...</p>
			</div>
		</div>
	{:else if isError}
		<Card.Root class="border-red-200 bg-red-50">
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="text-xs font-medium text-red-800 md:text-sm">Error loading vendor data</p>
					<Button variant="outline" size="sm" class="mt-4" onclick={handleBack}>
						Kembali ke List
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if vendor}
		<div class="items-center justify-between sm:flex">
			<PageHeader
				title="Detail Data Vendor Pusat"
				description="Informasi lengkap vendor {vendor?.name1 || 'Unknown'} ({vendor?.vendor_code ||
					'Unknown'})"
			/>
			<div
				class="mt-5 flex items-center gap-2 max-sm:-mb-3 max-sm:flex-row-reverse max-sm:justify-between"
			>
				<Guard permissions={VENDOR_PERMISSIONS.CREATE}>
					<Button
						size="sm"
						onclick={() => (showConfirmDialog = true)}
						disabled={publishMutation.isPending}
						class="bg-[#0f4c2a] hover:bg-[#0d4023]"
					>
						{#if publishMutation.isPending}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Mendaftarkan...
						{:else}
							<Plus class="mr-2 h-4 w-4" />
							Daftarkan ke Vendor Lokal
						{/if}
					</Button>
				</Guard>
				<Button variant="outline" size="sm" onclick={handleBack}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Kembali
				</Button>
			</div>
		</div>

		<Card.Root>
			<Card.Header>
				<div class="flex items-start gap-4">
					<div
						class="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600"
					>
						<span class="text-2xl font-semibold">
							{(vendor?.name1 || '')
								.split(' ')
								.map((n) => n[0])
								.join('')
								.toUpperCase()
								.slice(0, 2) || 'VP'}
						</span>
					</div>
					<div class="flex-1">
						<Card.Title class="text-lg md:text-xl">{vendor?.name1 || 'Unknown Vendor'}</Card.Title>
						<p class="mt-1 text-xs text-gray-600 md:text-sm">
							{vendor?.vendor_code || 'Unknown Code'}
						</p>
						<p class="mt-1 text-xs text-gray-500 md:text-sm">
							SAP Code: {vendor?.sap_vendor_code || '-'}
						</p>
					</div>
				</div>
			</Card.Header>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="text-sm md:text-base">Informasi Vendor</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="gap-4 max-sm:space-y-5 sm:grid md:grid-cols-2">
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Kode Vendor</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.vendor_code || '-'}
						</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Kode SAP</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.sap_vendor_code || '-'}
						</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Nama Vendor</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.name1 || '-'}
						</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Nama Pendek</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.mcod1 || '-'}
						</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Email</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.email || '-'}
						</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Telepon</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.telf1 || '-'}
						</p>
					</div>
					<div class="col-span-2 space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Alamat</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{vendor?.stras || '-'}
						</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-gray-600 md:text-sm">Terakhir Disinkronkan</p>
						<p class="text-xs font-medium text-gray-900 md:text-sm">
							{formatDate(vendor?.synced_at)}
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<!-- Confirm Dialog -->
<AlertDialog.Root bind:open={showConfirmDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Daftarkan Vendor Lokal</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin mendaftarkan <span class="font-semibold">{vendor?.name1}</span>
				({vendor?.vendor_code}) sebagai vendor lokal?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={publishMutation.isPending}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleConfirmPublish}
				disabled={publishMutation.isPending}
				class="bg-[#0f4c2a] hover:bg-[#0d4023]"
			>
				{#if publishMutation.isPending}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Mendaftarkan...
				{:else}
					Ya, Daftarkan
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- Success Modal -->
<PublishVendorSuccessModal bind:open={showSuccessModal} result={publishResult} />
