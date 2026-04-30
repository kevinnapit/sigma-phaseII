<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		ArrowLeft,
		Search,
		QrCode,
		Package,
		Calendar,
		User,
		Building2,
		Loader2,
		AlertCircle,
		X
	} from 'lucide-svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import { useReadApprovedLPOs, useGetLPOByQR } from '../hooks/useGoodsReceivesNotesQueries.svelte';
	import type { ApprovedLPOItem, LPOByQRParams } from '../types/goods-receives-notes.types';
	import { formatDate } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';
	import { onDestroy } from 'svelte';

	// Search state
	let searchValue = $state('');
	let debouncedSearch = $state('');
	let previousSearch = $state('');

	// QR scan state
	let showQRModal = $state(false);
	let qrParams = $state<LPOByQRParams | null>(null);
	let scanError = $state('');
	let isScanning = $state(false);
	let scanner = $state<Html5Qrcode | null>(null);

	const QR_ELEMENT_ID = 'qr-reader';

	// Pagination
	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const pageSize = 5;

	$effect(() => {
		searchValue;
		const timer = setTimeout(() => {
			debouncedSearch = searchValue;
		}, 500);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (debouncedSearch !== previousSearch) {
			previousSearch = debouncedSearch;
			if (currentPage !== 1) {
				updatePage(1);
			}
		}
	});

	const approvedLPOsQuery = useReadApprovedLPOs(() => ({
		page: currentPage,
		size: pageSize,
		search: debouncedSearch || undefined
	}));

	// QR lookup query — only fires when qrParams is set
	const lpoByQRQuery = useGetLPOByQR(() => qrParams);

	// Navigate to create page when QR lookup succeeds
	$effect(() => {
		if (lpoByQRQuery.data?.data?.id) {
			const lpoId = lpoByQRQuery.data.data.id;
			closeQRModal();
			goto(
				`/dashboard/material-management/inventory/transaction/goods-receives-notes/create/${lpoId}`
			);
		}
	});

	// Show error toast when QR lookup fails
	$effect(() => {
		if (lpoByQRQuery.isError && qrParams) {
			toast.error('LPO tidak ditemukan', {
				description: 'QR code tidak valid atau LPO belum disetujui'
			});
			qrParams = null;
		}
	});

	const lpos = $derived(approvedLPOsQuery.data?.data || []);
	const totalItems = $derived(approvedLPOsQuery.data?.pagination?.total_items || 0);
	const totalPages = $derived(approvedLPOsQuery.data?.pagination?.total_pages || 0);
	const isLoading = $derived(approvedLPOsQuery.isLoading);
	const isError = $derived(approvedLPOsQuery.isError);
	const isFetching = $derived(approvedLPOsQuery.isFetching);

	function updatePage(newPage: number) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', String(newPage));
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handleBack() {
		goto('/dashboard/material-management/inventory/transaction/goods-receives-notes');
	}

	function handleSelectLPO(lpo: ApprovedLPOItem) {
		goto(
			`/dashboard/material-management/inventory/transaction/goods-receives-notes/create/${lpo.id}`
		);
	}

	/**
	 * Parse QR text format: "{lpo_number}-{supplier_code}-{supplier_name}"
	 * Example: "4100133140-10720-PT PETRO ANDALAN NUSANTARA"
	 */
	function parseQRText(text: string): LPOByQRParams | null {
		const firstDash = text.indexOf('-');
		const secondDash = text.indexOf('-', firstDash + 1);
		if (firstDash === -1 || secondDash === -1) return null;

		const lpo_number = text.slice(0, firstDash);
		const supplier_code = text.slice(firstDash + 1, secondDash);
		const supplier_name = text.slice(secondDash + 1);

		if (!lpo_number || !supplier_code || !supplier_name) return null;
		return { lpo_number, supplier_code, supplier_name };
	}

	async function startCamera() {
		scanError = '';
		isScanning = false;

		// wait for the DOM element to be rendered
		await new Promise((r) => setTimeout(r, 150));

		try {
			scanner = new Html5Qrcode(QR_ELEMENT_ID);
			await scanner.start(
				{ facingMode: 'environment' },
				{ fps: 10, qrbox: { width: 250, height: 250 } },
				(decodedText) => {
					const parsed = parseQRText(decodedText);
					if (parsed) {
						stopCamera();
						qrParams = parsed;
					} else {
						toast.error('Format QR tidak dikenali');
					}
				},
				() => {
					// scan frame error — ignore, keep scanning
				}
			);
			isScanning = true;
		} catch {
			scanError = 'Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.';
		}
	}

	async function stopCamera() {
		if (scanner) {
			try {
				await scanner.stop();
				scanner.clear();
			} catch {
				// ignore stop errors
			}
			scanner = null;
		}
		isScanning = false;
	}

	async function handleScanQR() {
		showQRModal = true;
		document.body.style.overflow = 'hidden';
		startCamera();
	}

	async function closeQRModal() {
		await stopCamera();
		showQRModal = false;
		scanError = '';
		document.body.style.overflow = '';
	}

	onDestroy(() => {
		document.body.style.overflow = '';
		stopCamera();
	});

	function formatDateStr(dateStr: string): string {
		if (!dateStr) return '-';
		try {
			return formatDate(dateStr);
		} catch {
			return dateStr;
		}
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
				<p class="truncate text-xs text-muted-foreground">Pilih LPO yang telah disetujui</p>
			</div>
		</div>

		<!-- Search + QR row -->
		<div class="flex items-center gap-2 px-4 pb-3">
			<div class="relative flex-1">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					bind:value={searchValue}
					placeholder="Cari nomor LPO atau vendor..."
					class="h-10 pr-4 pl-9"
				/>
			</div>
			<Button
				variant="outline"
				size="icon"
				class="h-10 w-10 shrink-0"
				onclick={handleScanQR}
				title="Scan QR Code"
				disabled={lpoByQRQuery.isFetching}
			>
				{#if lpoByQRQuery.isFetching}
					<Loader2 class="h-5 w-5 animate-spin" />
				{:else}
					<QrCode class="h-5 w-5" />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Content -->
	<div class="flex-1 px-4 py-4">
		{#if isLoading}
			<!-- Skeleton loading -->
			<div class="space-y-3">
				{#each Array(5) as _}
					<div class="animate-pulse rounded-xl border bg-card p-4">
						<div class="mb-3 flex items-start justify-between">
							<div class="space-y-2">
								<div class="h-4 w-32 rounded bg-muted"></div>
								<div class="h-3 w-24 rounded bg-muted"></div>
							</div>
							<div class="h-6 w-20 rounded-full bg-muted"></div>
						</div>
						<div class="space-y-2">
							<div class="h-3 w-full rounded bg-muted"></div>
							<div class="h-3 w-3/4 rounded bg-muted"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if isError}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<AlertCircle class="mb-3 h-10 w-10 text-destructive" />
				<p class="font-medium text-destructive">Gagal memuat data</p>
				<p class="mt-1 text-sm text-muted-foreground">Periksa koneksi dan coba lagi</p>
				<Button
					variant="outline"
					size="sm"
					class="mt-4"
					onclick={() => approvedLPOsQuery.refetch()}
				>
					Coba Lagi
				</Button>
			</div>
		{:else if lpos.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<Package class="mb-3 h-10 w-10 text-muted-foreground" />
				<p class="font-medium">
					{debouncedSearch ? 'LPO tidak ditemukan' : 'Belum ada LPO yang disetujui'}
				</p>
				<p class="mt-1 text-sm text-muted-foreground">
					{debouncedSearch
						? `Tidak ada hasil untuk "${debouncedSearch}"`
						: 'LPO yang sudah disetujui akan muncul di sini'}
				</p>
			</div>
		{:else}
			<!-- Result count + fetching indicator -->
			<div class="mb-3 flex items-center justify-between">
				<p class="text-xs text-muted-foreground">
					{totalItems} LPO tersedia
				</p>
				{#if isFetching && !isLoading}
					<div class="flex items-center gap-1 text-xs text-muted-foreground">
						<Loader2 class="h-3 w-3 animate-spin" />
						Memperbarui...
					</div>
				{/if}
			</div>

			<!-- LPO Cards -->
			<div class="space-y-3">
				{#each lpos as lpo (lpo.id)}
					<button
						class="w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]"
						onclick={() => handleSelectLPO(lpo)}
					>
						<!-- Top row: LPO number + status badge -->
						<div class="mb-3 flex items-start justify-between gap-2">
							<div class="min-w-0">
								<p class="truncate font-semibold text-foreground">{lpo.lpo_number}</p>
								<p class="mt-0.5 text-xs text-muted-foreground">{lpo.approval_status}</p>
							</div>
							<span
								class="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
							>
								Disetujui
							</span>
						</div>

						<!-- Info rows -->
						<div class="space-y-1.5">
							<div class="flex items-center gap-2 text-sm">
								<Building2 class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
								<span class="truncate text-foreground">{lpo.supplier_name}</span>
								{#if lpo.supplier_code}
									<span class="shrink-0 text-xs text-muted-foreground">({lpo.supplier_code})</span>
								{/if}
							</div>
							<div class="flex items-center gap-2 text-sm text-muted-foreground">
								<Calendar class="h-3.5 w-3.5 shrink-0" />
								<span>Tanggal LPO: {formatDateStr(lpo.lpo_date)}</span>
							</div>
							{#if lpo.approved_by}
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<User class="h-3.5 w-3.5 shrink-0" />
									<span class="truncate">Disetujui oleh: {lpo.approved_by}</span>
								</div>
							{/if}
							{#if lpo.approval_date}
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar class="h-3.5 w-3.5 shrink-0" />
									<span>Tgl Persetujuan: {formatDateStr(lpo.approval_date)}</span>
								</div>
							{/if}
						</div>

						{#if lpo.remarks}
							<p class="mt-2 truncate text-xs text-muted-foreground italic">"{lpo.remarks}"</p>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 0}
				<div class="mt-6 flex items-center justify-between gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage <= 1}
						onclick={() => updatePage(currentPage - 1)}
						class="flex-1"
					>
						Sebelumnya
					</Button>
					<span class="shrink-0 text-xs text-muted-foreground">
						{currentPage} / {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage >= totalPages}
						onclick={() => updatePage(currentPage + 1)}
						class="flex-1"
					>
						Berikutnya
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- QR Scan Modal -->
{#if showQRModal}
	<div
		class="fixed top-0 left-0 z-[9999] flex h-dvh w-screen flex-col bg-black"
		role="dialog"
		aria-modal="true"
		aria-label="Scan QR Code LPO"
	>
		<!-- Header -->
		<div class="flex items-center gap-3 px-4 py-3 text-white">
			<Button
				variant="ghost"
				size="icon"
				class="h-9 w-9 text-white hover:bg-white/10"
				onclick={closeQRModal}
			>
				<X class="h-5 w-5" />
			</Button>
			<div>
				<p class="font-semibold">Scan QR Code LPO</p>
				<p class="text-xs text-white/70">Arahkan kamera ke QR code pada dokumen LPO</p>
			</div>
		</div>

		<!-- html5-qrcode mount target -->
		<div class="flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
			<div id={QR_ELEMENT_ID} class="qr-container w-full max-w-sm overflow-hidden rounded-xl"></div>
		</div>

		<!-- Bottom status -->
		<div class="px-4 py-6 text-center text-white">
			{#if scanError}
				<div class="flex flex-col items-center gap-3">
					<div class="flex items-center gap-2 text-red-400">
						<AlertCircle class="h-5 w-5" />
						<p class="text-sm">{scanError}</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						class="border-white/30 text-white hover:bg-white/10"
						onclick={startCamera}
					>
						Coba Lagi
					</Button>
				</div>
			{:else if isScanning}
				<div class="flex items-center justify-center gap-2 text-white/70">
					<Loader2 class="h-4 w-4 animate-spin" />
					<p class="text-sm">Mendeteksi QR code...</p>
				</div>
			{:else}
				<p class="text-sm text-white/70">Memulai kamera...</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Hide html5-qrcode injected header UI (file input button, stop button, etc.) */
	:global(#qr-reader__header_message),
	:global(#qr-reader__status_span),
	:global(#qr-reader__dashboard_section_csr span),
	:global(#qr-reader__dashboard_section_fsr),
	:global(#qr-reader__dashboard) {
		display: none !important;
	}

	/* Make the video fill the container naturally */
	:global(#qr-reader video) {
		width: 100% !important;
		height: auto !important;
		border-radius: 0.75rem;
		display: block;
	}

	:global(#qr-reader) {
		border: none !important;
		padding: 0 !important;
	}
</style>
