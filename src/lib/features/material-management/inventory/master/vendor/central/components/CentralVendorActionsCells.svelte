<script lang="ts">
	import { Eye, Ellipsis, Plus, Loader2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Guard from '$lib/components/shared/guard.svelte';
	import { toast } from 'svelte-sonner';
	import type {
		CentralVendorItem,
		CentralVendorPublishResponse
	} from '../types/vendor-central.types';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import { usePublishCentralVendor } from '../hooks/useVendorsCentralQueries.svelte';
	import PublishVendorSuccessModal from './PublishVendorSuccessModal.svelte';

	interface Props {
		vendor: CentralVendorItem;
		onViewDetail: (vendor: CentralVendorItem) => void;
		onSendInvitation: (vendor: CentralVendorItem) => void;
	}

	let { vendor, onViewDetail, onSendInvitation }: Props = $props();

	const publishMutation = usePublishCentralVendor();

	let showConfirmDialog = $state(false);
	let showSuccessModal = $state(false);
	let publishResult = $state<CentralVendorPublishResponse | null>(null);

	function handleViewDetail() {
		onViewDetail(vendor);
	}

	async function handleConfirmPublish() {
		try {
			const result = await publishMutation.mutateAsync(vendor.sap_vendor_code);
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
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="h-8 w-8 p-0">
				<span class="sr-only">Buka menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<Guard permissions={VENDOR_PERMISSIONS.DETAIL_VIEW}>
			<DropdownMenu.Item onclick={handleViewDetail}>
				<Eye class="h-4 w-4" />
				Lihat Detail
			</DropdownMenu.Item>
		</Guard>
		<DropdownMenu.Separator />
		<Guard permissions={VENDOR_PERMISSIONS.CREATE}>
			<DropdownMenu.Item onclick={() => (showConfirmDialog = true)}>
				<Plus class="h-4 w-4" />
				Daftarkan ke Vendor Lokal
			</DropdownMenu.Item>
		</Guard>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<!-- Confirm Dialog -->
<AlertDialog.Root bind:open={showConfirmDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Daftarkan Vendor Lokal</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin mendaftarkan <span class="font-semibold">{vendor.name1}</span>
				({vendor.vendor_code}) sebagai vendor lokal? Tindakan ini akan membuat data vendor baru di
				sistem.
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
