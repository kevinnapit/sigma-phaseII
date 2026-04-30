<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { DatePicker } from '$lib/components/ui/date-picker';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';
	import ConfirmLPOModal from './ConfirmLPOModal.svelte';
	import SuccessLPOModal from './SuccessLPOModal.svelte';
	import { toast } from 'svelte-sonner';
	import { ArrowLeft, Check, ChevronsUpDown, Info, Save, Search } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte.js';
	import { useReadAllStores } from '$lib/features/material-management/inventory/master/stores/hooks/useStoresQueries.svelte';
	import { useReadAllLocalVendors } from '$lib/features/material-management/inventory/master/vendor/local/hooks/useVendorsLocalQueries.svelte';
	import type {
		LPOSessionData,
		LPOItemFormState,
		LPOManualItem
	} from '../types/local-purchase-order.types';
	import { LPO_SESSION_KEY } from '../constants/session-storage';
	import { useCreateLPO } from '../hooks/useLocalPurchaseOrderQueries.svelte';
	import { useAccountsQuery } from '../hooks/useDetailedLocalPurchaseOrderQueries.svelte.js';
	import {
		LPO_BASE_URL,
		LPO_PAYMENT_TYPE_NAME,
		LPO_CASH_VALUE_ID,
		LPO_CREDIT_VALUE_ID,
		LPO_BASED_ON_ID
	} from '../constants/local-purchase-order-types';

	let sessionData = $state<LPOSessionData | null>(null);
	let isManual = $state(false);
	let manualItems = $state<LPOManualItem[]>([]);

	// Header form state
	let storeId = $state('');
	let storeName = $state('');
	let lpoDate = $state(new Date().toISOString().split('T')[0]);
	let requiredByDate = $state(new Date().toISOString().split('T')[0]);
	let referenceNumber = $state('');
	let remarks = $state('');
	let creditDays = $state(0);
	let requestedAdvanceAmount = $state(0);
	let paymentTypeId = $state('');
	let isCreditSettledLocally = $state(false);

	// Account fields
	let purchaseAccountId = $state('');
	let supplierControlAccountId = $state('');
	let advanceAccountId = $state('');

	// Account search states
	let purchaseAccountSearch = $state('');
	let controlAccountSearch = $state('');
	let advanceAccountSearch = $state('');

	// Manual vendor selection
	let vendorPopoverOpen = $state(false);
	let vendorSearch = $state('');
	let debouncedVendorSearch = $state('');
	let selectedVendorId = $state('');
	let selectedVendorName = $state('');
	let selectedVendorCode = $state('');

	$effect(() => {
		vendorSearch;
		const timer = setTimeout(() => {
			debouncedVendorSearch = vendorSearch;
		}, 400);
		return () => clearTimeout(timer);
	});

	const vendorsQuery = useReadAllLocalVendors(
		() => ({
			page: 1,
			limit: 20,
			search: debouncedVendorSearch || undefined,
			is_active: true
		}),
		() => isManual
	);
	const vendors = $derived(isManual ? vendorsQuery.data?.data || [] : []);

	// Comboboxes
	let paymentTypeOpen = $state(false);
	let settledLocallyOpen = $state(false);

	// Modal state
	let showConfirm = $state(false);
	let showSuccess = $state(false);
	let createdLpoId = $state('');
	let createdLpoNumber = $state('');

	// Item rows
	let itemRows = $state<LPOItemFormState[]>([]);

	// Payment type conditions
	const isCash = $derived(paymentTypeId === LPO_CASH_VALUE_ID);
	const isCredit = $derived(paymentTypeId === LPO_CREDIT_VALUE_ID);

	// Queries
	const paymentTypesQuery = useMasterTypeByNameQuery(() => ({ name: LPO_PAYMENT_TYPE_NAME }));
	const paymentTypes = $derived(paymentTypesQuery.data?.values || []);
	const selectedPaymentType = $derived(paymentTypes.find((p) => p.id === paymentTypeId));

	const storesQuery = useReadAllStores(() => ({
		page: 1,
		size: 100,
		store_type: '621cdb84-f45d-4908-aeb7-092566214be8'
	}));
	const activeStore = $derived((storesQuery.data?.data || []).find((s) => s.is_active === true));

	$effect(() => {
		if (activeStore && !storeId) {
			storeId = activeStore.uoid;
			storeName = activeStore.name;
		}
	});

	const purchaseAccountsQuery = useAccountsQuery(() => purchaseAccountSearch);
	const controlAccountsQuery = useAccountsQuery(() => controlAccountSearch);
	const advanceAccountsQuery = useAccountsQuery(() => advanceAccountSearch);

	const purchaseAccounts = $derived(purchaseAccountsQuery.data || []);
	const controlAccounts = $derived(controlAccountsQuery.data || []);
	const advanceAccounts = $derived(advanceAccountsQuery.data || []);

	const createLPOMutation = useCreateLPO();
	const isPending = $derived(createLPOMutation.isPending);

	onMount(() => {
		const stored = sessionStorage.getItem(LPO_SESSION_KEY);
		if (!stored) {
			toast.error('Data tidak ditemukan, silakan mulai dari awal');
			goto(`${LPO_BASE_URL}/create?step=select-vendor-items`);
			return;
		}
		const data: LPOSessionData = JSON.parse(stored);
		sessionData = data;
		isManual = data.isManual ?? false;

		if (isManual) {
			manualItems = data.manualItems ?? [];
			itemRows = manualItems.map((item) => ({
				quotation_detail_id: '',
				item_id: item.item_id,
				item_code: item.item_code,
				item_name: item.item_name,
				uom: item.uom,
				uom_id: item.uom_id,
				unit_price: 0,
				original_qty: item.qty,
				quantity: item.qty,
				purpose: item.purpose
			}));
		} else {
			itemRows = (data.selectedItems ?? []).map((item) => ({
				quotation_detail_id: item.quotation_detail_id,
				item_id: item.item_id,
				item_code: item.item_code,
				item_name: item.item_name,
				uom: item.uom,
				uom_id: item.uom_id,
				unit_price: item.unit_price,
				original_qty: item.qty,
				quantity: item.qty,
				purpose: item.pr_purpose ?? ''
			}));
		}
	});

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	const totalAmount = $derived(
		itemRows.reduce((sum, row) => sum + row.quantity * row.unit_price, 0)
	);

	function handleBack() {
		goto(`${LPO_BASE_URL}/create?step=select-vendor-items`);
	}

	function handleSaveClick() {
		if (isManual && !selectedVendorId) {
			toast.error('Pilih vendor terlebih dahulu');
			return;
		}
		if (!lpoDate) {
			toast.error('Tanggal LPO wajib diisi');
			return;
		}
		if (!requiredByDate) {
			toast.error('Tanggal Dibutuhkan wajib diisi');
			return;
		}
		if (!paymentTypeId) {
			toast.error('Tipe pembayaran wajib dipilih');
			return;
		}
		for (const row of itemRows) {
			if (row.quantity <= 0) {
				toast.error(`Jumlah untuk item ${row.item_code} harus lebih dari 0`);
				return;
			}
		}
		showConfirm = true;
	}

	async function handleConfirm() {
		showConfirm = false;

		const supplierId = isManual ? selectedVendorId : (sessionData?.vendor.vendor_id ?? '');
		if (!supplierId) return;

		try {
			const result = await createLPOMutation.mutateAsync({
				supplier_id: supplierId,
				lpo_based_on_id: LPO_BASED_ON_ID,
				lpo_date: new Date(lpoDate).toISOString(),
				required_by_date: new Date(requiredByDate).toISOString(),
				reference_number: referenceNumber || undefined,
				remarks: remarks || undefined,
				credit_days: isCash ? 0 : creditDays,
				is_credit_settled_locally: isCash ? false : isCreditSettledLocally,
				requested_advance_amount: requestedAdvanceAmount,
				payment_type_id: paymentTypeId,
				store_id: storeId || undefined,
				purchase_account_id: purchaseAccountId || undefined,
				supplier_control_account_id: isCredit ? supplierControlAccountId || undefined : undefined,
				advance_account_id: isCash ? advanceAccountId || undefined : undefined,
				is_manual: isManual,
				items: itemRows.map((row) => ({
					item_id: row.item_id,
					purpose: row.purpose,
					quantity: row.quantity,
					rate: row.unit_price,
					uom_id: row.uom_id,
					...(isManual
						? {
								purchase_request_dtl_id: manualItems.find((m) => m.item_id === row.item_id)
									?.purchase_request_dtl_id
							}
						: {})
				}))
			});

			sessionStorage.removeItem(LPO_SESSION_KEY);
			createdLpoId = result.data.id;
			createdLpoNumber = result.data.lpo_number;
			showSuccess = true;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Gagal membuat LPO');
		}
	}

	// Vendor display for header card
	const vendorDisplayName = $derived(
		isManual
			? selectedVendorId
				? `${selectedVendorName} (${selectedVendorCode})`
				: ''
			: sessionData?.vendor
				? `${sessionData.vendor.vendor_name} (${sessionData.vendor.vendor_code})`
				: ''
	);
</script>

<ConfirmLPOModal
	bind:open={showConfirm}
	onConfirm={handleConfirm}
	onCancel={() => (showConfirm = false)}
	itemCount={itemRows.length}
	vendorName={isManual ? selectedVendorName : (sessionData?.vendor.vendor_name ?? '')}
/>

<SuccessLPOModal bind:open={showSuccess} lpoId={createdLpoId} lpoNumber={createdLpoNumber} />

{#if sessionData}
	<div class="space-y-6">
		<!-- Page Header Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Isi Form Local Purchase Order</Card.Title>
				<Card.Description>
					{#if isManual}
						LPO Manual &nbsp;·&nbsp; {itemRows.length} item dipilih
					{:else}
						<span>{sessionData.vendor.vendor_name}</span>
						&nbsp;·&nbsp; {itemRows.length} item dipilih
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content class="-mt-2">
				<div class="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-2">
					{#if !isManual}
						<Button
							variant="outline"
							class="w-full sm:w-auto"
							onclick={handleBack}
							disabled={isPending}
						>
							<ArrowLeft class="mr-2 h-4 w-4" />
							Kembali
						</Button>
					{/if}
					<Button
						class={cn('w-full sm:w-auto', isManual && 'col-span-2')}
						onclick={handleSaveClick}
						disabled={isPending}
					>
						<Save class="mr-2 h-4 w-4" />
						{isPending ? 'Menyimpan...' : 'Simpan LPO'}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Informasi Umum</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<!-- Row 1: Tipe (first — drives conditions), Tanggal LPO, Tanggal Dibutuhkan -->
					<div class="space-y-1.5">
						<Label>Tipe <span class="text-destructive">*</span></Label>
						<Popover.Root bind:open={paymentTypeOpen}>
							<Popover.Trigger class="w-full" disabled={isPending}>
								<Button
									variant="outline"
									role="combobox"
									class="w-full justify-between font-normal"
									disabled={isPending}
									type="button"
								>
									<span class={cn(!selectedPaymentType && 'text-muted-foreground')}>
										{selectedPaymentType?.value ?? 'Pilih tipe...'}
									</span>
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[--radix-popover-trigger-width] p-0" align="start">
								<Command.Root shouldFilter={true}>
									<Command.Input placeholder="Cari tipe..." class="h-9" />
									<Command.Empty>
										{paymentTypesQuery.isLoading ? 'Memuat...' : 'Tidak ditemukan'}
									</Command.Empty>
									<Command.Group class="max-h-52 overflow-auto">
										{#each paymentTypes as pt}
											<Command.Item
												value={pt.value}
												onSelect={() => {
													paymentTypeId = pt.id;
													paymentTypeOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4 shrink-0',
														paymentTypeId === pt.id ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{pt.value}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>

					<div class="space-y-1.5">
						<DatePicker
							id="lpo-date"
							label="Tanggal LPO"
							bind:value={lpoDate}
							required
							disabled={isPending}
						/>
					</div>

					<div class="space-y-1.5">
						<DatePicker
							id="required-by-date"
							label="Tanggal Dibutuhkan"
							bind:value={requiredByDate}
							required
							disabled={isPending}
						/>
					</div>

					<!-- Row 2: Vendor, Gudang, Nomor Referensi -->
					<div class="space-y-1.5">
						<Label>Vendor <span class="text-destructive">*</span></Label>
						{#if isManual}
							<Popover.Root bind:open={vendorPopoverOpen}>
								<Popover.Trigger class="w-full" disabled={isPending}>
									<Button
										variant="outline"
										role="combobox"
										class="w-full justify-between font-normal"
										disabled={isPending}
										type="button"
									>
										{#if selectedVendorId}
											<span>
												{selectedVendorName}
												<span class="ml-1 text-muted-foreground">({selectedVendorCode})</span>
											</span>
										{:else}
											<span class="text-muted-foreground">Pilih vendor...</span>
										{/if}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="w-[--radix-popover-trigger-width] p-0" align="start">
									<div class="flex items-center border-b px-3">
										<Search class="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
										<input
											class="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
											placeholder="Cari vendor..."
											bind:value={vendorSearch}
										/>
									</div>
									<div class="max-h-64 overflow-y-auto p-1">
										{#if vendorsQuery.isLoading}
											<div class="py-6 text-center text-sm text-muted-foreground">Memuat...</div>
										{:else if vendors.length === 0}
											<div class="py-6 text-center text-sm text-muted-foreground">
												Vendor tidak ditemukan
											</div>
										{:else}
											{#each vendors as vendor}
												<button
													class={cn(
														'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent',
														selectedVendorId === vendor.uoid && 'bg-accent'
													)}
													onclick={() => {
														selectedVendorId = vendor.uoid;
														selectedVendorName = vendor.name;
														selectedVendorCode = vendor.code;
														vendorPopoverOpen = false;
														vendorSearch = '';
													}}
												>
													<Check
														class={cn(
															'h-4 w-4 shrink-0',
															selectedVendorId === vendor.uoid ? 'opacity-100' : 'opacity-0'
														)}
													/>
													<div class="min-w-0 flex-1">
														<p class="truncate font-medium">{vendor.name}</p>
														<p class="text-xs text-muted-foreground">{vendor.code}</p>
													</div>
												</button>
											{/each}
										{/if}
									</div>
								</Popover.Content>
							</Popover.Root>
						{:else}
							<Input
								value="{sessionData.vendor.vendor_name} ({sessionData.vendor.vendor_code})"
								disabled
								class="bg-muted"
							/>
						{/if}
					</div>

					<div class="space-y-1.5">
						<Label>Gudang <span class="text-destructive">*</span></Label>
						{#if storesQuery.isLoading}
							<Input value="Memuat gudang..." disabled />
						{:else}
							<Input value={storeName || 'Gudang tidak ditemukan'} disabled class="bg-muted" />
						{/if}
					</div>

					<div class="space-y-1.5">
						<Label for="reference-number">Nomor Referensi</Label>
						<Input
							id="reference-number"
							placeholder="Masukkan Nomor Referensi"
							bind:value={referenceNumber}
							disabled={isPending}
						/>
					</div>

					<!-- Row 3: Akun Pembelian (always), Hari Kredit (credit only), Diselesaikan Lokal (credit only) -->
					<div class="space-y-1.5">
						<SearchableCombobox
							label="Akun Pembelian"
							bind:value={purchaseAccountId}
							items={purchaseAccounts}
							isLoading={purchaseAccountsQuery.isLoading}
							onSearchChange={(s) => (purchaseAccountSearch = s)}
							placeholder="Pilih Akun Pembelian"
							searchPlaceholder="Cari akun..."
							disabled={isPending}
						/>
					</div>

					<div class="space-y-1.5">
						<Label for="credit-days">Hari Kredit</Label>
						<Input
							id="credit-days"
							type="number"
							min="0"
							bind:value={creditDays}
							disabled={isCash || isPending}
							class={isCash ? 'bg-muted' : ''}
						/>
					</div>

					<div class="space-y-1.5">
						<Label>Diselesaikan Lokal</Label>
						<Popover.Root bind:open={settledLocallyOpen}>
							<Popover.Trigger class="w-full" disabled={isCash || isPending}>
								<Button
									variant="outline"
									role="combobox"
									class="w-full justify-between font-normal"
									disabled={isCash || isPending}
									type="button"
								>
									{isCreditSettledLocally ? 'Ya' : 'Tidak'}
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[--radix-popover-trigger-width] p-0" align="start">
								<Command.Root>
									<Command.Group>
										<Command.Item
											value="tidak"
											onSelect={() => {
												isCreditSettledLocally = false;
												settledLocallyOpen = false;
											}}
										>
											<Check
												class={cn(
													'mr-2 h-4 w-4',
													!isCreditSettledLocally ? 'opacity-100' : 'opacity-0'
												)}
											/>
											Tidak
										</Command.Item>
										<Command.Item
											value="ya"
											onSelect={() => {
												isCreditSettledLocally = true;
												settledLocallyOpen = false;
											}}
										>
											<Check
												class={cn(
													'mr-2 h-4 w-4',
													isCreditSettledLocally ? 'opacity-100' : 'opacity-0'
												)}
											/>
											Ya
										</Command.Item>
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>

					<!-- Row 4: Akun Kontrol (credit only), Akun Pembayaran Muka (cash only), Jumlah Uang Muka -->
					<div class="space-y-1.5">
						<SearchableCombobox
							label="Akun Kontrol"
							bind:value={supplierControlAccountId}
							items={controlAccounts}
							isLoading={controlAccountsQuery.isLoading}
							onSearchChange={(s) => (controlAccountSearch = s)}
							placeholder="Pilih Akun Kontrol"
							searchPlaceholder="Cari akun..."
							disabled={isCash || isPending}
						/>
					</div>

					<div class="space-y-1.5">
						<SearchableCombobox
							label="Akun Pembayaran Muka"
							bind:value={advanceAccountId}
							items={advanceAccounts}
							isLoading={advanceAccountsQuery.isLoading}
							onSearchChange={(s) => (advanceAccountSearch = s)}
							placeholder="Pilih Akun"
							searchPlaceholder="Cari akun..."
							disabled={isCredit || isPending}
						/>
					</div>

					<div class="space-y-1.5">
						<Label for="advance-amount">Jumlah Uang Muka Diminta</Label>
						<Input
							id="advance-amount"
							type="number"
							min="0"
							bind:value={requestedAdvanceAmount}
							disabled={isPending}
						/>
					</div>

					<!-- Row 5: Catatan (full width) -->
					<div class="space-y-1.5 md:col-span-3">
						<Label for="remarks">Catatan</Label>
						<Textarea
							id="remarks"
							placeholder="Masukkan Catatan"
							bind:value={remarks}
							disabled={isPending}
							rows={3}
						/>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Detail Barang -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Detail Barang</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div
					class="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
				>
					<Info class="mt-0.5 h-4 w-4 shrink-0" />
					<p>
						{#if isManual}
							LPO Manual — Masukkan harga satuan dan jumlah untuk setiap item.
						{:else}
							LPO dari Proses Pembelian Lokal Harga satuan dikunci sesuai hasil Proses Pembelian
							Lokal dan tidak dapat diubah. Anda dapat mengubah jumlah (qty) jika diperlukan.
						{/if}
					</p>
				</div>

				<div class="overflow-x-auto rounded-md border">
					<table class="w-full text-sm">
						<thead class="bg-muted/50">
							<tr>
								<th class="px-3 py-2 text-left font-medium whitespace-nowrap">Kode Barang</th>
								<th class="px-3 py-2 text-left font-medium whitespace-nowrap">Nama Barang</th>
								<th class="px-3 py-2 text-left font-medium whitespace-nowrap">Satuan</th>
								<th class="px-3 py-2 text-right font-medium whitespace-nowrap">Harga Satuan</th>
								<th class="px-3 py-2 text-right font-medium whitespace-nowrap"
									>Jumlah <span class="text-destructive">*</span></th
								>
								<th class="px-3 py-2 text-left font-medium whitespace-nowrap">Tujuan</th>
								<th class="px-3 py-2 text-right font-medium whitespace-nowrap">Total Harga</th>
							</tr>
						</thead>
						<tbody class="divide-y">
							{#each itemRows as row, i}
								<tr class="hover:bg-muted/30">
									<td class="px-3 py-2 whitespace-nowrap">{row.item_code}</td>
									<td class="px-3 py-2">{row.item_name}</td>
									<td class="px-3 py-2 whitespace-nowrap text-muted-foreground">{row.uom}</td>
									<td class="px-3 py-2 text-right whitespace-nowrap">
										{#if isManual}
											<Input
												type="number"
												min="0"
												step="0.01"
												class="w-28 text-right"
												bind:value={itemRows[i].unit_price}
												disabled={isPending}
											/>
										{:else}
											{formatCurrency(row.unit_price)}
										{/if}
									</td>
									<td class="px-3 py-2">
										<Input
											type="number"
											min="0.01"
											step="0.01"
											class="w-24 text-right"
											bind:value={itemRows[i].quantity}
											disabled={isPending}
										/>
									</td>
									<td class="px-3 py-2">
										<Input
											placeholder="Tujuan..."
											class="min-w-36"
											bind:value={itemRows[i].purpose}
											disabled={isPending}
										/>
									</td>
									<td class="px-3 py-2 text-right whitespace-nowrap">
										{formatCurrency(row.quantity * row.unit_price)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="flex flex-col items-end gap-1 text-sm">
					<div class="flex gap-8">
						<span class="text-muted-foreground">Total</span>
						<span class="w-40 text-right font-medium">{formatCurrency(totalAmount)}</span>
					</div>
					<div class="flex gap-8">
						<span class="text-muted-foreground">Jumlah Kupon</span>
						<span class="w-40 text-right font-medium">{formatCurrency(totalAmount)}</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
