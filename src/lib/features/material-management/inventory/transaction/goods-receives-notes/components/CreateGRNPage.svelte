<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import {
		ArrowLeft,
		Building2,
		Calendar,
		Package,
		User,
		CreditCard,
		Warehouse,
		FileText,
		TriangleAlert,
		QrCode,
		Search,
		Check,
		Trash2,
		X,
		Layers,
		Plus
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		useReadApprovedLPODetail,
		useCreateGRN,
		useCheckMaterial,
		useReadAvailableDockets,
		useGetLPOItemByQR,
		useReadItemStorageLayouts
	} from '../hooks/useGoodsReceivesNotesQueries.svelte';
	import SuccessGRNModal from './SuccessGRNModal.svelte';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';
	import ConfirmGRNModal from './ConfirmGRNModal.svelte';
	import DroppingMaterialForm from './DroppingMaterialForm.svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import { formatDate } from '$lib/shared/utils';
	import type {
		ApprovedLPODetailItem,
		LPOItemByQRParams
	} from '../types/goods-receives-notes.types';

	let { lpoId }: { lpoId: string } = $props();

	const SESSION_KEY = $derived(`grn_create_${lpoId}`);

	const detailQuery = useReadApprovedLPODetail(() => lpoId);
	const lpo = $derived(detailQuery.data?.data);

	const createMutation = useCreateGRN();
	const isSubmitting = $derived(createMutation.isPending);

	// Header form state
	let postingDate = $state('');
	let deliveryNoteNumber = $state('');
	let deliveryNoteDate = $state('');
	let referenceNumber = $state('');
	let remarks = $state('');

	// REQ-016: Multiple vehicle numbers (header level)
	interface VehicleEntry {
		id: string;
		vehicleNumber: string;
	}

	// Simple UUID generator for vehicle IDs
	function generateId() {
		return `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	let vehicles = $state<VehicleEntry[]>([
		{
			id: generateId(),
			vehicleNumber: ''
		}
	]);

	// Success/confirm modal state
	let showSuccessModal = $state(false);
	let showConfirmModal = $state(false);
	let createdGrnId = $state('');
	let createdGrnNumber = $state('');

	// Item picker state
	interface SavedGRNItem {
		item: ApprovedLPODetailItem;
		accepted_quantity: number;
		is_dropping_material: boolean;
		// standard only
		item_storage_dtl_id?: string;
		// dropping material extras
		length?: number;
		width?: number;
		height?: number;
		calculated_volume?: number;
		docket_number?: string;
		// docket data snapshot (untuk payload submit)
		docket_gross_weight?: number;
		docket_net_weight?: number;
		docket_tare_weight?: number;
		docket_vehicle_number?: string;
		docket_weighment_date_time?: string;
	}

	type ItemPickerMode = 'none' | 'search' | 'fill-qty' | 'fill-dropping';

	let savedItems = $state<SavedGRNItem[]>([]);
	let itemPickerMode = $state<ItemPickerMode>('none');
	let selectedItem = $state<ApprovedLPODetailItem | null>(null);
	let itemSearch = $state('');

	// Standard qty input - REQ-017: Decimal support
	let currentAcceptedQty = $state(0);
	let currentItemStorageDtlId = $state('');
	let currentItemStorageSearch = $state('');

	// Storage layout query — only active when filling a standard item
	const storageLayoutQuery = useReadItemStorageLayouts(
		() => currentItemStorageSearch,
		() => itemPickerMode === 'fill-qty'
	);
	const storageLayouts = $derived(storageLayoutQuery.data?.data ?? []);
	const storageLayoutOptions = $derived(
		storageLayouts.map((s) => ({
			uoid: s.id,
			name: s.layout_unit_name,
			item_storage_name: s.item_storage_name,
			row_number: s.row_number,
			column_number: s.column_number
		}))
	);

	// Dropping material inputs - REQ-018: P×L×T for volume calculation
	let dropLength = $state(0);
	let dropWidth = $state(0);
	let dropHeight = $state(0);
	let dropAcceptedQty = $state(0);
	let dropDocketNumber = $state('');

	// QR scan for item picker
	let showItemQRModal = $state(false);
	let itemQRParams = $state<LPOItemByQRParams | null>(null);
	let itemQRScanError = $state('');
	let isItemQRScanning = $state(false);
	let itemQRScanner = $state<Html5Qrcode | null>(null);
	const ITEM_QR_ELEMENT_ID = 'item-qr-reader';

	const itemByQRQuery = useGetLPOItemByQR(() => itemQRParams);

	// When QR item lookup succeeds, map to ApprovedLPODetailItem and pick it
	$effect(() => {
		const d = itemByQRQuery.data?.data;
		if (!d || !lpo) return;
		if (!d.can_receive) {
			toast.error('Barang tidak dapat diterima', {
				description: d.receiving_completed
					? 'Penerimaan sudah selesai'
					: 'Status tidak memungkinkan'
			});
			itemQRParams = null;
			return;
		}
		// Find matching item in LPO detail list — compare case-insensitively (API returns mixed casing)
		const match = lpo.items.find((i) => i.item_id.toLowerCase() === d.item_id.toLowerCase());
		if (!match) {
			toast.error('Item tidak ditemukan dalam LPO ini');
			itemQRParams = null;
			return;
		}
		if (savedItemIds.has(match.id)) {
			toast.info('Item sudah ditambahkan');
			itemQRParams = null;
			closeItemQRModal();
			return;
		}
		closeItemQRModal();
		itemQRParams = null;
		handlePickItem(match);
	});

	$effect(() => {
		if (itemByQRQuery.isError && itemQRParams) {
			toast.error('Item tidak ditemukan', {
				description: 'QR code tidak valid atau item tidak ada dalam LPO'
			});
			itemQRParams = null;
		}
	});

	async function startItemQRScanner() {
		itemQRScanError = '';
		isItemQRScanning = false;
		await new Promise((r) => setTimeout(r, 150));
		try {
			itemQRScanner = new Html5Qrcode(ITEM_QR_ELEMENT_ID);
			await itemQRScanner.start(
				{ facingMode: 'environment' },
				{ fps: 10, qrbox: { width: 250, height: 250 } },
				(decodedText) => {
					if (!lpo) return;
					// QR format: "{lpo_number}-{item_code}", e.g. "LPO/2026/0018-7000146"
					// lpo_number may contain slashes and dashes, so split on the LAST dash
					const lastDash = decodedText.lastIndexOf('-');
					const item_code =
						lastDash !== -1 ? decodedText.slice(lastDash + 1).trim() : decodedText.trim();
					if (!item_code) {
						toast.error('Format QR tidak dikenali');
						return;
					}
					stopItemQRScanner();
					itemQRParams = { lpo_number: lpo.lpo_number, item_code };
				},
				() => {
					/* scan frame error — ignore */
				}
			);
			isItemQRScanning = true;
		} catch {
			itemQRScanError = 'Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.';
		}
	}

	async function stopItemQRScanner() {
		if (itemQRScanner) {
			try {
				await itemQRScanner.stop();
				itemQRScanner.clear();
			} catch {
				/* ignore */
			}
			itemQRScanner = null;
		}
		isItemQRScanning = false;
	}

	async function handleScanItemQR() {
		showItemQRModal = true;
		document.body.style.overflow = 'hidden';
		startItemQRScanner();
	}

	async function closeItemQRModal() {
		await stopItemQRScanner();
		showItemQRModal = false;
		itemQRScanError = '';
		document.body.style.overflow = '';
	}

	onDestroy(() => {
		document.body.style.overflow = '';
		stopItemQRScanner();
	});

	// Material check — triggered when item is selected
	let checkItemCode = $state<string | undefined>(undefined);
	const materialCheckQuery = useCheckMaterial(() => checkItemCode);
	const isCheckingMaterial = $derived(materialCheckQuery.isFetching);
	const isDroppingMaterial = $derived(materialCheckQuery.data?.data?.is_dropping_material === true);

	// Dockets — only fetch when a dropping material is being filled
	const docketsQuery = useReadAvailableDockets(() => itemPickerMode === 'fill-dropping');
	const dockets = $derived(docketsQuery.data?.data ?? []);

	const savedItemIds = $derived(new Set(savedItems.map((s) => s.item.id)));
	const availableItems = $derived(
		lpo?.items.filter((item) => {
			if (savedItemIds.has(item.id)) return false;
			if (!itemSearch.trim()) return true;
			const q = itemSearch.toLowerCase();
			return item.item_name.toLowerCase().includes(q) || item.item_code.toLowerCase().includes(q);
		}) ?? []
	);

	// Session storage
	function saveToSession() {
		const data = {
			postingDate,
			deliveryNoteNumber,
			deliveryNoteDate,
			vehicles,
			referenceNumber,
			remarks,
			savedItems
		};
		sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
	}

	function loadFromSession() {
		const raw = sessionStorage.getItem(SESSION_KEY);
		if (!raw) return;
		try {
			const data = JSON.parse(raw);
			postingDate = data.postingDate ?? '';
			deliveryNoteNumber = data.deliveryNoteNumber ?? '';
			deliveryNoteDate = data.deliveryNoteDate ?? '';
			vehicles = data.vehicles ?? [{ id: generateId(), vehicleNumber: '' }];
			referenceNumber = data.referenceNumber ?? '';
			remarks = data.remarks ?? '';
			savedItems = data.savedItems ?? [];
		} catch {
			/* ignore */
		}
	}

	function clearSession() {
		sessionStorage.removeItem(SESSION_KEY);
	}

	onMount(() => loadFromSession());

	$effect(() => {
		if (postingDate !== undefined) postingDate;
		if (deliveryNoteNumber !== undefined) deliveryNoteNumber;
		if (deliveryNoteDate !== undefined) deliveryNoteDate;
		if (vehicles) JSON.stringify(vehicles);
		if (referenceNumber !== undefined) referenceNumber;
		if (remarks !== undefined) remarks;
		if (savedItems) JSON.stringify(savedItems);
		saveToSession();
	});

	// When material check resolves, switch to correct fill mode
	$effect(() => {
		if (selectedItem && !isCheckingMaterial && checkItemCode === selectedItem.item_code) {
			if (isDroppingMaterial) {
				itemPickerMode = 'fill-dropping';
			} else {
				itemPickerMode = 'fill-qty';
			}
		}
	});

	function handlePickItem(item: ApprovedLPODetailItem) {
		selectedItem = item;
		const remaining = item.outstanding_quantity;
		currentAcceptedQty = remaining > 0 ? remaining : 0;
		currentItemStorageDtlId = '';
		currentItemStorageSearch = '';
		dropAcceptedQty = item.uom_code === 'M3' ? 0 : remaining > 0 ? remaining : 0;
		dropLength = 0;
		dropHeight = 0;
		dropDocketNumber = '';
		itemSearch = '';
		// Trigger material check — effect will switch mode when done
		checkItemCode = item.item_code;
		itemPickerMode = 'fill-qty'; // temporary while checking
	}

	function handleSaveStandardItem() {
		if (!selectedItem) return;
		if (currentAcceptedQty > selectedItem.outstanding_quantity) {
			toast.error(
				`Jumlah diterima tidak boleh melebihi sisa belum diterima (${selectedItem.outstanding_quantity} ${selectedItem.uom_code})`
			);
			return;
		}
		savedItems = [
			...savedItems,
			{
				item: selectedItem,
				accepted_quantity: currentAcceptedQty,
				is_dropping_material: false,
				item_storage_dtl_id: currentItemStorageDtlId || undefined
			}
		];
		resetPicker();
	}

	function handleSaveDroppingItem() {
		if (!selectedItem) return;
		if (dropAcceptedQty > selectedItem.outstanding_quantity) {
			toast.error(
				`Jumlah diterima tidak boleh melebihi sisa belum diterima (${selectedItem.outstanding_quantity} ${selectedItem.uom_code})`
			);
			return;
		}
		const vol = parseFloat((dropLength * dropWidth * dropHeight).toFixed(4));
		const docket = dockets.find((d) => d.docket_number === dropDocketNumber);
		// Normalize to RFC 3339 — API returns datetime without timezone offset
		const weighmentDateTime = docket?.weighment_date_time
			? docket.weighment_date_time.endsWith('Z') || docket.weighment_date_time.includes('+')
				? docket.weighment_date_time
				: docket.weighment_date_time + 'Z'
			: new Date().toISOString();
		savedItems = [
			...savedItems,
			{
				item: selectedItem,
				accepted_quantity: dropAcceptedQty,
				is_dropping_material: true,
				length: dropLength,
				width: dropWidth,
				height: dropHeight,
				calculated_volume: vol,
				docket_number: dropDocketNumber,
				docket_gross_weight: docket?.gross_weight ?? 0,
				docket_net_weight: docket?.net_weight ?? 0,
				docket_tare_weight: docket?.tare_weight ?? 0,
				docket_vehicle_number: docket?.vehicle_registration_number ?? '',
				docket_weighment_date_time: weighmentDateTime
			}
		];
		resetPicker();
	}

	function resetPicker() {
		selectedItem = null;
		checkItemCode = undefined;
		currentAcceptedQty = 0;
		currentItemStorageDtlId = '';
		currentItemStorageSearch = '';
		dropAcceptedQty = 0;
		dropLength = 0;
		dropWidth = 0;
		dropHeight = 0;
		dropDocketNumber = '';
		itemPickerMode = 'none';
	}

	function handleRemoveSavedItem(itemId: string) {
		savedItems = savedItems.filter((s) => s.item.id !== itemId);
	}

	function handleScanQR() {
		saveToSession();
		handleScanItemQR();
	}

	function handleCancelPicker() {
		resetPicker();
		itemSearch = '';
	}

	const isFormValid = $derived(
		deliveryNoteNumber.trim() !== '' &&
			deliveryNoteDate !== '' &&
			postingDate !== '' &&
			vehicles.some((v) => v.vehicleNumber.trim() !== '') &&
			savedItems.length > 0 &&
			lpo !== undefined
	);

	// REQ-016: Add vehicle
	function handleAddVehicle() {
		vehicles = [
			...vehicles,
			{
				id: generateId(),
				vehicleNumber: ''
			}
		];
	}

	// REQ-016: Remove vehicle
	function handleRemoveVehicle(id: string) {
		if (vehicles.length === 1) {
			toast.error('Minimal harus ada 1 kendaraan');
			return;
		}
		vehicles = vehicles.filter((v) => v.id !== id);
	}

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/goods-receives-notes/create');
	}

	function handleSubmit() {
		if (!isFormValid || !lpo) return;
		showConfirmModal = true;
	}

	async function handleSubmitConfirmed() {
		if (!isFormValid || !lpo) return;
		showConfirmModal = false;

		const payload = {
			grn_base_id: lpo.id,
			date: postingDate,
			delivery_despatch_note_number: deliveryNoteNumber,
			delivery_despatch_note_date: deliveryNoteDate,
			store_id: lpo.store_id,
			supplier_id: lpo.supplier_id,
			transporter_party_id: lpo.supplier_id,
			reference_number: referenceNumber || undefined,
			vehicles: vehicles.map((v) => v.vehicleNumber).filter((vn) => vn.trim() !== ''),
			remarks: remarks || undefined,
			items: savedItems.map((s) => {
				const base = {
					lpo_item_id: s.item.id,
					item_id: s.item.item_id,
					uom_id: s.item.uom_id,
					offer_quantity: s.item.quantity,
					offer_quantity_in_base_unit: s.item.quantity_in_base_unit,
					grn_received_quantity: s.accepted_quantity,
					grn_received_quantity_in_base_unit: s.accepted_quantity,
					accepted_quantity: s.accepted_quantity,
					accepted_quantity_in_base_unit: s.accepted_quantity,
					unit_rate: s.item.rate,
					value_local_currency: s.accepted_quantity * s.item.rate
				};
				if (s.is_dropping_material) {
					return {
						...base,
						volume: {
							length: s.length ?? 0,
							width: s.width ?? 0,
							height: s.height ?? 0,
							calculated_volume: s.calculated_volume ?? 0
						},
						weighment: {
							docket_number: s.docket_number ?? '',
							gross_weight: s.docket_gross_weight ?? 0,
							net_weight: s.docket_net_weight ?? 0,
							tare_weight: s.docket_tare_weight ?? 0,
							vehicle_number: s.docket_vehicle_number ?? '',
							weighment_date_time: s.docket_weighment_date_time ?? new Date().toISOString()
						}
					};
				}
				return {
					...base,
					...(s.item_storage_dtl_id ? { item_storage_dtl_id: s.item_storage_dtl_id } : {})
				};
			})
		};

		try {
			const result = await createMutation.mutateAsync(payload);
			clearSession();
			createdGrnId = result.data.id;
			createdGrnNumber = result.data.grn_number;
			showSuccessModal = true;
		} catch (error) {
			toast.error(
				`Gagal membuat penerimaan: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	function formatDateStr(dateStr: string): string {
		if (!dateStr) return '-';
		try {
			return formatDate(dateStr);
		} catch {
			return dateStr;
		}
	}

	function receivingStatusLabel(status: string): string {
		const map: Record<string, string> = {
			NOT_RECEIVED: 'Belum Diterima',
			PARTIALLY_RECEIVED: 'Diterima Sebagian',
			FULLY_RECEIVED: 'Sudah Diterima'
		};
		return map[status] ?? status;
	}

	function receivingStatusClass(status: string): string {
		if (status === 'FULLY_RECEIVED') return 'text-green-600 dark:text-green-400';
		if (status === 'PARTIALLY_RECEIVED') return 'text-amber-600 dark:text-amber-400';
		return 'text-muted-foreground';
	}
</script>

<div class="flex min-h-screen flex-col bg-background">
	<!-- Sticky top bar -->
	<div
		class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="flex items-center gap-3 px-4 py-3">
			<Button variant="ghost" size="icon" class="h-9 w-9 shrink-0" onclick={handleBack}>
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<div class="min-w-0 flex-1">
				<h1 class="truncate text-base font-semibold">Buat Penerimaan Baru</h1>
				{#if lpo}
					<p class="truncate text-xs text-muted-foreground">{lpo.lpo_number}</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex-1 space-y-4 px-4 py-4">
		{#if detailQuery.isLoading}
			<div class="animate-pulse space-y-4">
				<div class="rounded-xl border bg-card p-4">
					<div class="mb-4 h-4 w-40 rounded bg-muted"></div>
					<div class="space-y-3">
						{#each Array(5) as _}
							<div class="flex justify-between">
								<div class="h-3 w-24 rounded bg-muted"></div>
								<div class="h-3 w-32 rounded bg-muted"></div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if detailQuery.isError}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<TriangleAlert class="mb-3 h-10 w-10 text-destructive" />
				<p class="font-medium text-destructive">Gagal memuat data LPO</p>
				<p class="mt-1 text-sm text-muted-foreground">Periksa koneksi dan coba lagi</p>
				<Button variant="outline" size="sm" class="mt-4" onclick={() => detailQuery.refetch()}>
					Coba Lagi
				</Button>
			</div>
		{:else if lpo}
			<!-- Card 1: Informasi Pesanan -->
			<Card.Root class="overflow-hidden">
				<Card.Header class="pb-3">
					<Card.Title class="flex items-center gap-2 text-base">
						<FileText class="h-4 w-4 text-muted-foreground" />
						Informasi Pesanan
					</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-0 p-0">
					<div class="divide-y">
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<span class="shrink-0 text-sm text-muted-foreground">Nomor LPO</span>
							<span class="text-right text-sm font-medium">{lpo.lpo_number}</span>
						</div>
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<span class="shrink-0 text-sm text-muted-foreground">Tanggal LPO</span>
							<span class="text-right text-sm font-medium">{formatDateStr(lpo.lpo_date)}</span>
						</div>
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<div class="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
								<Building2 class="h-3.5 w-3.5" />
								Vendor
							</div>
							<div class="text-right">
								<p class="text-sm font-medium">{lpo.supplier_name}</p>
								<p class="text-xs text-muted-foreground">{lpo.supplier_code}</p>
							</div>
						</div>
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<div class="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
								<Warehouse class="h-3.5 w-3.5" />
								Gudang
							</div>
							<span class="text-right text-sm font-medium">{lpo.store_name}</span>
						</div>
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<div class="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
								<CreditCard class="h-3.5 w-3.5" />
								Pembayaran
							</div>
							<span class="text-right text-sm font-medium">{lpo.payment_type_name}</span>
						</div>
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<div class="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
								<Calendar class="h-3.5 w-3.5" />
								Tgl Dibutuhkan
							</div>
							<span class="text-right text-sm font-medium"
								>{formatDateStr(lpo.required_by_date)}</span
							>
						</div>
						<div class="flex items-start justify-between gap-3 px-6 py-3">
							<div class="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
								<User class="h-3.5 w-3.5" />
								Disetujui Oleh
							</div>
							<span class="text-right text-sm font-medium">{lpo.approved_by}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Card 2: Form Penerimaan -->
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title class="text-base">Form Penerimaan</Card.Title>
					<p class="text-xs text-muted-foreground">Lengkapi informasi penerimaan barang</p>
				</Card.Header>
				<Card.Content class="space-y-5">
					<div class="space-y-1.5">
						<Label for="posting-date" class="text-sm">
							Tanggal Posting <span class="text-destructive">*</span>
						</Label>
						<Input id="posting-date" type="date" bind:value={postingDate} class="h-11" />
					</div>
					<div class="space-y-1.5">
						<Label for="delivery-note-number" class="text-sm">
							No. Surat Jalan <span class="text-destructive">*</span>
						</Label>
						<Input
							id="delivery-note-number"
							bind:value={deliveryNoteNumber}
							placeholder="Masukkan nomor surat jalan"
							class="h-11"
						/>
					</div>
					<div class="space-y-1.5">
						<Label for="delivery-note-date" class="text-sm">
							Tanggal Surat Jalan <span class="text-destructive">*</span>
						</Label>
						<Input id="delivery-note-date" type="date" bind:value={deliveryNoteDate} class="h-11" />
					</div>
					<!-- REQ-016: Multiple Vehicle Numbers -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label class="text-sm">Nomor Kendaraan</Label>
							<Button
								variant="outline"
								size="sm"
								class="h-8 gap-1.5 text-xs"
								onclick={handleAddVehicle}
								type="button"
							>
								<Plus class="h-3.5 w-3.5" />
								Tambah Kendaraan
							</Button>
						</div>
						<div class="space-y-2">
							{#each vehicles as vehicle, index (vehicle.id)}
								<div class="flex items-center gap-2">
									<div class="flex-1">
										<Input
											bind:value={vehicle.vehicleNumber}
											placeholder="Contoh: B 1234 ABC"
											class="h-11"
										/>
									</div>
									{#if vehicles.length > 1}
										<button
											class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
											onclick={() => handleRemoveVehicle(vehicle.id)}
											type="button"
											aria-label="Hapus kendaraan"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					</div>
					<div class="space-y-1.5">
						<Label for="reference-number" class="text-sm">Nomor Referensi</Label>
						<Input
							id="reference-number"
							bind:value={referenceNumber}
							placeholder="Nomor referensi (opsional)"
							class="h-11"
						/>
					</div>
					<div class="space-y-1.5">
						<Label for="remarks" class="text-sm">Keterangan</Label>
						<textarea
							id="remarks"
							bind:value={remarks}
							placeholder="Tambahkan keterangan (opsional)"
							rows={3}
							class="w-full resize-none rounded-md border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						></textarea>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Card 3: Detail Penerimaan Barang -->
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title class="text-base">Detail Penerimaan Barang</Card.Title>
					<p class="mt-1 text-xs text-muted-foreground">
						Tambahkan barang yang diterima satu per satu
					</p>
				</Card.Header>
				<Card.Content class="space-y-4">
					<!-- Saved items list -->
					{#if savedItems.length > 0}
						<div class="space-y-2">
							{#each savedItems as saved}
								<div class="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
									<div
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full {saved.is_dropping_material
											? 'bg-amber-100 dark:bg-amber-900/30'
											: 'bg-green-100 dark:bg-green-900/30'}"
									>
										{#if saved.is_dropping_material}
											<Layers class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
										{:else}
											<Check class="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
										{/if}
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium">{saved.item.item_name}</p>
										<p class="text-xs text-muted-foreground">{saved.item.item_code}</p>
										{#if saved.is_dropping_material}
											<p class="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
												Barang Lapangan · {saved.length}×{saved.width}×{saved.height} m
											</p>
											{#if saved.docket_number}
												<p class="text-xs text-muted-foreground">Docket: {saved.docket_number}</p>
											{/if}
										{/if}
										<p
											class="mt-1 text-sm font-semibold {saved.is_dropping_material
												? 'text-amber-700 dark:text-amber-400'
												: 'text-green-700 dark:text-green-400'}"
										>
											{saved.accepted_quantity}
											{saved.item.uom_code}
										</p>
									</div>
									<button
										class="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
										onclick={() => handleRemoveSavedItem(saved.item.id)}
										aria-label="Hapus item"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Mode: none -->
					{#if itemPickerMode === 'none'}
						{#if savedItems.length === 0}
							<div
								class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center"
							>
								<Package class="mb-3 h-8 w-8 text-muted-foreground/50" />
								<p class="text-sm font-medium text-muted-foreground">
									Belum ada barang ditambahkan
								</p>
								<p class="mt-1 text-xs text-muted-foreground">Pilih cara menambahkan barang</p>
							</div>
						{/if}
						<div class="grid grid-cols-2 gap-3">
							<Button
								variant="outline"
								class="h-14 flex-col gap-1.5"
								onclick={() => {
									itemPickerMode = 'search';
									itemSearch = '';
								}}
							>
								<Search class="h-5 w-5" />
								<span class="text-xs">Cari Manual</span>
							</Button>
							<Button variant="outline" class="h-14 flex-col gap-1.5" onclick={handleScanQR}>
								<QrCode class="h-5 w-5" />
								<span class="text-xs">Scan QR</span>
							</Button>
						</div>

						<!-- Mode: search -->
					{:else if itemPickerMode === 'search'}
						<div class="space-y-3">
							<div class="flex items-center gap-2">
								<div class="relative flex-1">
									<Search
										class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
									/>
									<Input
										bind:value={itemSearch}
										placeholder="Cari nama atau kode barang..."
										class="h-11 pl-9"
									/>
								</div>
								<Button
									variant="ghost"
									size="icon"
									class="h-11 w-11 shrink-0"
									onclick={handleCancelPicker}
								>
									<X class="h-4 w-4" />
								</Button>
							</div>
							{#if availableItems.length === 0}
								<div class="py-6 text-center text-sm text-muted-foreground">
									{savedItems.length === lpo.items.length
										? 'Semua barang sudah ditambahkan'
										: 'Barang tidak ditemukan'}
								</div>
							{:else}
								<div class="space-y-2">
									{#each availableItems as item}
										{@const isFullyReceived = item.receiving_status === 'FULLY_RECEIVED'}
										<button
											class="w-full rounded-lg border bg-card p-3 text-left transition-colors {isFullyReceived
												? 'cursor-not-allowed opacity-50'
												: 'hover:bg-muted/50 active:bg-muted'}"
											onclick={() => !isFullyReceived && handlePickItem(item)}
											disabled={isFullyReceived}
										>
											<div class="flex items-start justify-between gap-2">
												<div class="min-w-0">
													<p class="truncate text-sm font-medium">{item.item_name}</p>
													<p class="text-xs text-muted-foreground">{item.item_code}</p>
												</div>
												<span class="shrink-0 text-xs text-muted-foreground">{item.uom_code}</span>
											</div>
											<div class="mt-2 space-y-1 text-xs">
												<div class="flex justify-between">
													<span class="text-muted-foreground">Qty Order</span>
													<span class="font-medium">{item.quantity} {item.uom_code}</span>
												</div>
												<div class="flex justify-between">
													<span class="text-muted-foreground">Sudah Diterima</span>
													<span class="font-medium">{item.received_quantity} {item.uom_code}</span>
												</div>
												<div class="flex justify-between">
													<span class="text-muted-foreground">Sisa Belum Diterima</span>
													<span class="font-medium text-amber-600">
														{item.outstanding_quantity}
														{item.uom_code}
													</span>
												</div>
												<div class="flex justify-between">
													<span class="text-muted-foreground">Status</span>
													<span class={receivingStatusClass(item.receiving_status)}>
														{receivingStatusLabel(item.receiving_status)}
													</span>
												</div>
											</div>
										</button>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Mode: fill-qty (standard — checking or confirmed non-dropping) -->
					{:else if itemPickerMode === 'fill-qty' && selectedItem}
						<div class="space-y-4 rounded-lg border p-4">
							<div class="flex items-start justify-between gap-2">
								<div>
									<p class="text-sm font-semibold">{selectedItem.item_name}</p>
									<p class="text-xs text-muted-foreground">
										{selectedItem.item_code} · {selectedItem.uom_code}
									</p>
								</div>
								{#if isCheckingMaterial}
									<span
										class="shrink-0 animate-pulse rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
									>
										Memeriksa...
									</span>
								{:else}
									<span
										class="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
									>
										Penerimaan Gudang
									</span>
								{/if}
							</div>
							<div class="space-y-2 rounded-lg bg-muted/40 px-3 py-3">
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Qty Order</span>
									<span class="font-medium">{selectedItem.quantity} {selectedItem.uom_code}</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Sudah Diterima</span>
									<span class="font-medium"
										>{selectedItem.received_quantity} {selectedItem.uom_code}</span
									>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Sisa Belum Diterima</span>
									<span class="font-medium text-amber-600">
										{selectedItem.outstanding_quantity}
										{selectedItem.uom_code}
									</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Status</span>
									<span class={receivingStatusClass(selectedItem.receiving_status)}>
										{receivingStatusLabel(selectedItem.receiving_status)}
									</span>
								</div>
							</div>
							<div class="space-y-1.5">
								<Label for="accepted-qty" class="text-sm font-medium">
									Jumlah Diterima <span class="text-destructive">*</span>
								</Label>
								<Input
									id="accepted-qty"
									type="number"
									min="0"
									step="0.01"
									bind:value={currentAcceptedQty}
									class="h-11 text-center text-base font-semibold"
								/>
							</div>
							<div>
								<SearchableCombobox
									bind:value={currentItemStorageDtlId}
									items={storageLayoutOptions}
									isLoading={storageLayoutQuery.isLoading}
									onSearchChange={(s) => (currentItemStorageSearch = s)}
									label="Lokasi Penyimpanan"
									placeholder="Pilih lokasi penyimpanan..."
									searchPlaceholder="Cari lokasi..."
									renderSubtitle={(item) =>
										`${item.item_storage_name} · Baris ${item.row_number} Kolom ${item.column_number}`}
								/>
							</div>
							<div class="flex gap-2">
								<Button variant="outline" class="flex-1" onclick={handleCancelPicker}>Batal</Button>
								<Button
									class="flex-1 gap-1.5"
									disabled={currentAcceptedQty <= 0 || isCheckingMaterial}
									onclick={handleSaveStandardItem}
								>
									<Check class="h-4 w-4" />
									Simpan Item
								</Button>
							</div>
						</div>

						<!-- Mode: fill-dropping (dropping material) -->
					{:else if itemPickerMode === 'fill-dropping' && selectedItem}
						<div>
							<div class="mb-3 flex items-start justify-between gap-2">
								<div>
									<p class="text-sm font-semibold">{selectedItem.item_name}</p>
									<p class="text-xs text-muted-foreground">
										{selectedItem.item_code} · {selectedItem.uom_code}
									</p>
								</div>
								<span
									class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
								>
									Barang Lapangan
								</span>
							</div>
							<div class="mb-4 space-y-2 rounded-lg bg-muted/40 px-3 py-3">
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Qty Order</span>
									<span class="font-medium">{selectedItem.quantity} {selectedItem.uom_code}</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Sudah Diterima</span>
									<span class="font-medium"
										>{selectedItem.received_quantity} {selectedItem.uom_code}</span
									>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Sisa Belum Diterima</span>
									<span class="font-medium text-amber-600">
										{selectedItem.outstanding_quantity}
										{selectedItem.uom_code}
									</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Status</span>
									<span class={receivingStatusClass(selectedItem.receiving_status)}>
										{receivingStatusLabel(selectedItem.receiving_status)}
									</span>
								</div>
							</div>
							<!-- REQ-017, REQ-018: Use original form with decimal support -->
							<DroppingMaterialForm
								bind:length={dropLength}
								bind:width={dropWidth}
								bind:height={dropHeight}
								bind:acceptedQuantity={dropAcceptedQty}
								bind:docketNumber={dropDocketNumber}
								maxQuantity={selectedItem.outstanding_quantity}
								uomCode={selectedItem.uom_code}
								showVolume={selectedItem.uom_code === 'M3'}
								{dockets}
								isDocketsLoading={docketsQuery.isLoading}
								onSave={handleSaveDroppingItem}
								onCancel={handleCancelPicker}
							/>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Action buttons -->
			<div class="space-y-2 pb-6">
				<div class="flex gap-3">
					<Button variant="outline" class="flex-1" onclick={handleBack} disabled={isSubmitting}
						>Batal</Button
					>
					<Button class="flex-1" disabled={!isFormValid || isSubmitting} onclick={handleSubmit}>
						{isSubmitting ? 'Menyimpan...' : 'Buat Penerimaan'}
					</Button>
				</div>
				{#if !isFormValid}
					<p class="text-center text-xs text-muted-foreground">
						{#if savedItems.length === 0}
							Tambahkan minimal 1 barang yang diterima
						{:else}
							Lengkapi tanggal posting, no. surat jalan, dan tanggal surat jalan
						{/if}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<SuccessGRNModal bind:open={showSuccessModal} grnId={createdGrnId} grnNumber={createdGrnNumber} />

<ConfirmGRNModal
	bind:open={showConfirmModal}
	supplierName={lpo?.supplier_name ?? ''}
	itemCount={savedItems.length}
	onConfirm={handleSubmitConfirmed}
	onCancel={() => (showConfirmModal = false)}
/>

<!-- Item QR Scan Modal -->
{#if showItemQRModal}
	<div
		class="fixed top-0 left-0 z-[9999] flex h-dvh w-screen flex-col bg-black"
		role="dialog"
		aria-modal="true"
		aria-label="Scan QR Code Item"
	>
		<!-- Header -->
		<div class="flex items-center gap-3 px-4 py-3 text-white">
			<Button
				variant="ghost"
				size="icon"
				class="h-9 w-9 text-white hover:bg-white/10"
				onclick={closeItemQRModal}
			>
				<X class="h-5 w-5" />
			</Button>
			<div>
				<p class="font-semibold">Scan QR Code Item</p>
				<p class="text-xs text-white/70">Arahkan kamera ke QR code pada item barang</p>
			</div>
		</div>

		<!-- html5-qrcode mount target -->
		<div class="flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
			{#if itemByQRQuery.isFetching}
				<div class="flex flex-col items-center gap-3 text-white">
					<div
						class="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white"
					></div>
					<p class="text-sm text-white/70">Mencari item...</p>
				</div>
			{:else}
				<div
					id={ITEM_QR_ELEMENT_ID}
					class="qr-container w-full max-w-sm overflow-hidden rounded-xl"
				></div>
			{/if}
		</div>

		<!-- Bottom status -->
		<div class="px-4 py-6 text-center text-white">
			{#if itemQRScanError}
				<div class="flex flex-col items-center gap-3">
					<p class="text-sm text-red-400">{itemQRScanError}</p>
					<Button
						variant="outline"
						size="sm"
						class="border-white/30 text-white hover:bg-white/10"
						onclick={startItemQRScanner}
					>
						Coba Lagi
					</Button>
				</div>
			{:else if isItemQRScanning}
				<p class="text-sm text-white/70">Mendeteksi QR code item...</p>
			{:else if !itemByQRQuery.isFetching}
				<p class="text-sm text-white/70">Memulai kamera...</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Hide html5-qrcode injected header UI (file input button, stop button, etc.) */
	:global(#item-qr-reader__header_message),
	:global(#item-qr-reader__status_span),
	:global(#item-qr-reader__dashboard_section_csr span),
	:global(#item-qr-reader__dashboard_section_fsr),
	:global(#item-qr-reader__dashboard) {
		display: none !important;
	}

	/* Make the video fill the container naturally */
	:global(#item-qr-reader video) {
		width: 100% !important;
		height: auto !important;
		border-radius: 0.75rem;
		display: block;
	}

	:global(#item-qr-reader) {
		border: none !important;
		padding: 0 !important;
	}
</style>
