<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Loader2, Search, UserPlus } from 'lucide-svelte';
	import { useAddVendorToRFQ } from '../hooks/useLocalPurchaseAnalysisMutations.svelte';
	import { useReadVendorUsersForRFQ } from '../hooks/useLocalPurchaseAnalysisQueries.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		rfqId,
		existingVendorIds = [],
		onSuccess
	}: {
		open?: boolean;
		rfqId: string;
		existingVendorIds?: string[];
		onSuccess?: () => void;
	} = $props();

	const addVendorMutation = useAddVendorToRFQ();
	const isSubmitting = $derived(addVendorMutation.isPending);

	let searchQuery = $state('');
	let selectedVendorIds = $state<string[]>([]);

	// Query vendors
	const vendorsQuery = useReadVendorUsersForRFQ(() => ({
		page: 1,
		limit: 100,
		search: searchQuery || undefined
	}));

	const vendors = $derived(vendorsQuery.data?.data?.data || []);
	const isLoading = $derived(vendorsQuery.isLoading);

	// Filter out vendors yang sudah ada di RFQ
	const availableVendors = $derived(
		vendors.filter((v) => !existingVendorIds.includes(v.party_id))
	);

	// Reset form saat modal dibuka
	$effect(() => {
		if (open) {
			searchQuery = '';
			selectedVendorIds = [];
		}
	});

	function toggleVendor(vendorId: string) {
		if (selectedVendorIds.includes(vendorId)) {
			selectedVendorIds = selectedVendorIds.filter((id) => id !== vendorId);
		} else {
			selectedVendorIds = [...selectedVendorIds, vendorId];
		}
	}

	async function handleSubmit() {
		if (selectedVendorIds.length === 0) {
			toast.error('Pilih minimal 1 vendor');
			return;
		}

		try {
			await addVendorMutation.mutateAsync({
				rfqId,
				vendorIds: selectedVendorIds
			});

			toast.success(
				`${selectedVendorIds.length} vendor berhasil ditambahkan. Email RFQ akan dikirim otomatis.`
			);
			open = false;
			onSuccess?.();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Gagal menambahkan vendor. Silakan coba lagi.';
			toast.error(errorMessage);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Tambah Vendor ke RFQ</Dialog.Title>
			<Dialog.Description>
				Pilih vendor dari master data untuk ditambahkan ke RFQ ini. Vendor akan menerima email
				RFQ otomatis.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- Search -->
			<div class="space-y-2">
				<Label for="search-vendor">Cari Vendor</Label>
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="search-vendor"
						bind:value={searchQuery}
						placeholder="Cari nama atau kode vendor..."
						class="pl-9"
						disabled={isSubmitting}
					/>
				</div>
			</div>

			<!-- Vendor List -->
			<div class="space-y-2">
				<Label>Pilih Vendor ({selectedVendorIds.length} dipilih)</Label>
				<div class="max-h-[300px] space-y-2 overflow-y-auto rounded-md border p-3">
					{#if isLoading}
						<div class="flex items-center justify-center py-8">
							<Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					{:else if availableVendors.length === 0}
						<div class="py-8 text-center text-sm text-muted-foreground">
							{#if vendors.length === 0}
								Tidak ada vendor ditemukan
							{:else}
								Semua vendor sudah ditambahkan ke RFQ ini
							{/if}
						</div>
					{:else}
						{#each availableVendors as vendor}
							<label
								class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
							>
								<Checkbox
									checked={selectedVendorIds.includes(vendor.party_id)}
									onCheckedChange={() => toggleVendor(vendor.party_id)}
									disabled={isSubmitting}
								/>
								<div class="flex-1">
									<p class="font-medium">{vendor.vendor_name}</p>
									<p class="text-sm text-muted-foreground">
										{vendor.vendor_code} • {vendor.email || 'No email'}
									</p>
								</div>
							</label>
						{/each}
					{/if}
				</div>
			</div>

			{#if selectedVendorIds.length > 0}
				<p class="text-xs text-muted-foreground">
					Vendor yang dipilih akan menerima email RFQ dengan deadline yang sama dengan vendor lain.
				</p>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={isSubmitting}>
				Batal
			</Button>
			<Button onclick={handleSubmit} disabled={isSubmitting || selectedVendorIds.length === 0}>
				{#if isSubmitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Menambahkan...
				{:else}
					<UserPlus class="mr-2 h-4 w-4" />
					Tambah {selectedVendorIds.length} Vendor
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
