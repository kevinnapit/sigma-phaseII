<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Trash2, Send, RotateCcw } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import {
		useReadDetailLocalVendor,
		useReadLocalVendorAddresses,
		useReadLocalVendorPartyTypes,
		useReadLocalVendorBanks,
		useReadLocalVendorOtherInfo,
		useReadLocalVendorTaxRegistrations,
		useReadLocalVendorTransactionTypes,
		useReadLocalVendorCustomProperties,
		useRegisterVendor,
		useResendVendorRegistration
	} from '$lib/features/material-management/inventory/master/vendor/local';
	import DeleteLocalVendorDialog from '$lib/features/material-management/inventory/master/vendor/local/components/DeleteLocalVendorDialog.svelte';
	import EditVendorInfoCard from '$lib/features/material-management/inventory/master/vendor/local/components/EditVendorInfoCard.svelte';
	import Guard from '$lib/components/shared/guard.svelte';
	import { VENDOR_PERMISSIONS } from '$lib/features/material-management/inventory/master/vendor/constants/vendor-permissions';
	import AddressTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/AddressTab.svelte';
	import CategoryTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/CategoryTab.svelte';
	import BankTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/BankTab.svelte';
	import OtherInfoTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/OtherInfoTab.svelte';
	import TaxTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/TaxTab.svelte';
	import TransactionTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/TransactionTab.svelte';
	import CustomTab from '$lib/features/material-management/inventory/master/vendor/local/components/detailed-information/CustomTab.svelte';

	const vendorId = $derived(page.params.id || '');

	// Fetch vendor detail
	const vendorQuery = useReadDetailLocalVendor(() => vendorId);
	const vendor = $derived(vendorQuery.data || null);

	// Registration mutations
	const registerVendorMutation = useRegisterVendor();
	const resendRegistrationMutation = useResendVendorRegistration();

	// Check if vendor is already registered
	const isRegistered = $derived(!!vendor?.vendor_user?.registration_status);

	// Only vendors with this specific party category can be registered/re-registered
	const REGISTRABLE_PARTY_CATEGORY_ID = 'b66e8af8-6d0c-4092-bb3e-ef36ad10ad80';
	const canRegister = $derived(
		vendor?.party_default_category?.id === REGISTRABLE_PARTY_CATEGORY_ID
	);

	// Fetch vendor addresses
	const addressesQuery = useReadLocalVendorAddresses(() => vendorId);
	const addresses = $derived(addressesQuery.data?.data || []);

	// Fetch vendor party types (categories)
	const partyTypesQuery = useReadLocalVendorPartyTypes(() => vendorId);
	const partyTypes = $derived(partyTypesQuery.data?.data || []);

	// Fetch vendor banks
	const banksQuery = useReadLocalVendorBanks(() => vendorId);
	const banks = $derived(banksQuery.data?.data || []);

	// Fetch vendor other info
	const otherInfoQuery = useReadLocalVendorOtherInfo(() => vendorId);
	const otherInfos = $derived(otherInfoQuery.data?.data || []);

	// Fetch vendor tax registrations
	const taxRegistrationsQuery = useReadLocalVendorTaxRegistrations(() => vendorId);
	const taxRegistrations = $derived(taxRegistrationsQuery.data?.data || []);

	// Fetch vendor transaction types
	const transactionTypesQuery = useReadLocalVendorTransactionTypes(() => vendorId);
	const transactionTypes = $derived(transactionTypesQuery.data?.data || []);

	// Fetch vendor custom properties
	const customPropertiesQuery = useReadLocalVendorCustomProperties(() => vendorId);
	const customProperties = $derived(customPropertiesQuery.data?.data || []);

	let deleteDialogOpen = $state(false);
	let activeTab = $state('alamat');

	function handleBack() {
		goto('/dashboard/material-management/inventory/master/vendor');
	}

	function handleDelete() {
		deleteDialogOpen = true;
	}

	function handleRegistration() {
		if (!vendor) return;

		if (isRegistered) {
			// Resend registration
			if (!vendor.vendor_user?.uoid) {
				toast.error('Vendor user ID tidak ditemukan');
				return;
			}

			resendRegistrationMutation.mutate(
				{ vendor_user_id: vendor.vendor_user.uoid },
				{
					onSuccess: () => {
						toast.success('Registrasi ulang vendor berhasil dikirim');
						vendorQuery.refetch();
					},
					onError: (error) => {
						toast.error(`Gagal mengirim registrasi ulang: ${error.message}`);
					}
				}
			);
		} else {
			// Initial registration
			registerVendorMutation.mutate(
				{ party_id: vendor.uoid },
				{
					onSuccess: () => {
						toast.success('Registrasi vendor berhasil dikirim');
						vendorQuery.refetch();
					},
					onError: (error) => {
						toast.error(`Gagal mengirim registrasi: ${error.message}`);
					}
				}
			);
		}
	}

	function onDeleteSuccess() {
		goto('/dashboard/material-management/inventory/master/vendor');
	}

	function onUpdateSuccess() {
		vendorQuery.refetch();
	}

	function handleAddressUpdate() {
		addressesQuery.refetch();
	}

	function handleCategoryUpdate() {
		partyTypesQuery.refetch();
	}

	function handleTransactionUpdate() {
		transactionTypesQuery.refetch();
	}

	// Get initials for avatar
	const initials = $derived(
		vendor?.company_name
			?.split(' ')
			.map((word: string) => word[0])
			.join('')
			.substring(0, 2)
			.toUpperCase() || 'SP'
	);

	const isPending = $derived(
		registerVendorMutation.isPending || resendRegistrationMutation.isPending
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="items-center justify-between sm:flex">
		<div>
			<div class=" flex items-center gap-2">
				<h1 class="text-2xl font-semibold">Detail Data Vendor</h1>
			</div>
			<p class=" text-sm text-gray-500">
				Informasi lengkap {vendor?.name || vendor?.company_name || ''} ({vendor?.code || ''})
			</p>
		</div>

		<div class="mt-5 flex items-center gap-2 max-sm:-mb-3 max-sm:justify-between">
			<Button variant="ghost" class="border" onclick={handleBack}
				><ArrowLeft class="h-4 w-4" />Kembali</Button
			>
			{#if vendor}
				<Guard permissions={VENDOR_PERMISSIONS.UPDATE}>
					{#if canRegister}
						<Button
							variant="outline"
							onclick={handleRegistration}
							disabled={isPending}
							class="bg-[#0f4c2a] text-white hover:bg-[#0d4023] hover:text-white"
						>
							{#if isPending}
								<Send class="mr-2 h-4 w-4 animate-pulse" />
								Mengirim...
							{:else if isRegistered}
								<RotateCcw class="mr-2 h-4 w-4" />
								Registrasi Ulang
							{:else}
								<Send class="mr-2 h-4 w-4" />
								Registrasi Vendor
							{/if}
						</Button>
					{/if}
				</Guard>
			{/if}
			<!-- <Button variant="destructive" onclick={handleDelete}>
				<Trash2 class="mr-2 h-4 w-4" />
				Hapus
			</Button> -->
		</div>
	</div>

	{#if vendorQuery.isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-gray-500">Memuat data...</p>
		</div>
	{:else if vendorQuery.isError}
		<div class="flex items-center justify-center py-12">
			<p class="text-red-500">Gagal memuat data vendor</p>
		</div>
	{:else if vendor}
		<!-- Profile Card -->
		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-start gap-4">
					<!-- Avatar -->
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600"
					>
						{initials}
					</div>

					<!-- Info -->
					<div class="flex-1">
						<h2 class="text-xl font-semibold">{vendor.name || vendor.company_name}</h2>
						<p class="text-sm text-gray-500">{vendor.code}</p>

						<div class="mt-2 flex items-center gap-2">
							{#if vendor.is_active}
								<Badge variant="default" class="bg-green-500 hover:bg-green-600">Aktif</Badge>
							{:else}
								<Badge variant="secondary">Tidak Aktif</Badge>
							{/if}
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Informasi Vendor Card -->
		<EditVendorInfoCard {vendor} {onUpdateSuccess} />

		<!-- Detail Informasi Tabs (tanpa Card wrapper) -->
		<Tabs.Root bind:value={activeTab} class="w-full">
			<Tabs.List class="grid w-full grid-cols-7">
				<Tabs.Trigger value="alamat">Alamat</Tabs.Trigger>
				<Tabs.Trigger value="kategori">Kategori</Tabs.Trigger>
				<Tabs.Trigger value="pajak">Pajak</Tabs.Trigger>
				<Tabs.Trigger value="kustom">Kustom</Tabs.Trigger>
				<Tabs.Trigger value="bank">Bank</Tabs.Trigger>
				<Tabs.Trigger value="transaksi">Transaksi</Tabs.Trigger>
				<Tabs.Trigger value="lainnya">Lainnya</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="alamat" class="mt-6">
				{#if addressesQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data alamat...</p>
					</div>
				{:else if addressesQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data alamat</p>
					</div>
				{:else}
					<AddressTab {addresses} {vendorId} onUpdateSuccess={handleAddressUpdate} />
				{/if}
			</Tabs.Content>

			<Tabs.Content value="kategori" class="mt-6">
				{#if partyTypesQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data kategori...</p>
					</div>
				{:else if partyTypesQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data kategori</p>
					</div>
				{:else}
					<CategoryTab {partyTypes} {vendorId} onUpdateSuccess={handleCategoryUpdate} />
				{/if}
			</Tabs.Content>

			<Tabs.Content value="pajak" class="mt-6">
				{#if taxRegistrationsQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data pajak...</p>
					</div>
				{:else if taxRegistrationsQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data pajak</p>
					</div>
				{:else}
					<TaxTab
						{taxRegistrations}
						{vendorId}
						onUpdateSuccess={() => {
							taxRegistrationsQuery.refetch();
						}}
					/>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="kustom" class="mt-6">
				{#if customPropertiesQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat properti kustom...</p>
					</div>
				{:else if customPropertiesQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat properti kustom</p>
					</div>
				{:else}
					<CustomTab
						{customProperties}
						{vendorId}
						onUpdateSuccess={() => {
							customPropertiesQuery.refetch();
						}}
					/>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="bank" class="mt-6">
				{#if banksQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data bank...</p>
					</div>
				{:else if banksQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data bank</p>
					</div>
				{:else}
					<BankTab
						{banks}
						{vendorId}
						onUpdateSuccess={() => {
							banksQuery.refetch();
						}}
					/>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="transaksi" class="mt-6">
				{#if transactionTypesQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat data transaksi...</p>
					</div>
				{:else if transactionTypesQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat data transaksi</p>
					</div>
				{:else}
					<TransactionTab {transactionTypes} {vendorId} onUpdateSuccess={handleTransactionUpdate} />
				{/if}
			</Tabs.Content>

			<Tabs.Content value="lainnya" class="mt-6">
				{#if otherInfoQuery.isLoading}
					<div class="flex items-center justify-center py-12">
						<p class="text-gray-500">Memuat informasi lainnya...</p>
					</div>
				{:else if otherInfoQuery.isError}
					<div class="flex items-center justify-center py-12">
						<p class="text-red-500">Gagal memuat informasi lainnya</p>
					</div>
				{:else}
					<OtherInfoTab
						{otherInfos}
						{vendorId}
						onUpdateSuccess={() => {
							otherInfoQuery.refetch();
						}}
					/>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</div>

<!-- Delete Dialog -->
<DeleteLocalVendorDialog bind:open={deleteDialogOpen} {vendor} onSuccess={onDeleteSuccess} />
