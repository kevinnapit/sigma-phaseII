<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Check, ChevronDown, Loader, Ruler, Package, Hash, Plus, Trash2 } from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { toast } from 'svelte-sonner';
	import type { DocketItem } from '../types/goods-receives-notes.types';

	interface VolumeEntry {
		id: string;
		length: number;
		width: number;
		height: number;
		volume: number;
	}

	interface Props {
		length: number;
		width: number;
		height: number;
		acceptedQuantity: number;
		maxQuantity: number;
		uomCode: string;
		docketNumber: string;
		dockets: DocketItem[];
		isDocketsLoading: boolean;
		showVolume?: boolean;
		onSave: () => void;
		onCancel: () => void;
	}

	let {
		length = $bindable(0),
		width = $bindable(0),
		height = $bindable(0),
		acceptedQuantity = $bindable(0),
		maxQuantity,
		uomCode,
		docketNumber = $bindable(''),
		dockets,
		isDocketsLoading,
		showVolume = false,
		onSave,
		onCancel
	}: Props = $props();

	let docketOpen = $state(false);
	let docketSearch = $state('');

	// Simple UUID generator
	function generateId() {
		return `volume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	// Multiple volume entries for showVolume mode
	let volumeEntries = $state<VolumeEntry[]>([
		{
			id: generateId(),
			length: 0,
			width: 0,
			height: 0,
			volume: 0
		}
	]);

	// Convert cm to m³: (p cm × l cm × t cm) / 1_000_000
	function cmToM3(p: number, l: number, t: number): number {
		if (p > 0 && l > 0 && t > 0) {
			return parseFloat(((p * l * t) / 1_000_000).toFixed(6));
		}
		return 0;
	}

	// Calculate volume for each entry (input in cm, result in m³)
	$effect(() => {
		if (showVolume) {
			volumeEntries.forEach((entry) => {
				entry.volume = cmToM3(entry.length, entry.width, entry.height);
			});

			// Auto-sum total volume to acceptedQuantity
			const totalVolume = volumeEntries.reduce((sum, entry) => sum + entry.volume, 0);
			acceptedQuantity = parseFloat(totalVolume.toFixed(6));

			// Update legacy bindings for backward compatibility
			if (volumeEntries.length > 0) {
				length = volumeEntries[0].length;
				width = volumeEntries[0].width;
				height = volumeEntries[0].height;
			}
		}
	});

	const totalVolume = $derived(
		showVolume ? volumeEntries.reduce((sum, entry) => sum + entry.volume, 0) : 0
	);

	const calculatedVolume = $derived(cmToM3(length, width, height));

	const filteredDockets = $derived(
		dockets.filter((d) => {
			if (d.is_used) return false;
			if (!docketSearch.trim()) return true;
			const q = docketSearch.toLowerCase();
			return (
				d.docket_number.toLowerCase().includes(q) ||
				d.vehicle_registration_number?.toLowerCase().includes(q)
			);
		})
	);

	const selectedDocket = $derived(dockets.find((d) => d.docket_number === docketNumber));

	const isQtyExceeded = $derived(acceptedQuantity > maxQuantity);

	const isValid = $derived(
		showVolume
			? totalVolume > 0 && !isQtyExceeded
			: acceptedQuantity > 0 && !isQtyExceeded
	);

	function handleAddVolume() {
		volumeEntries = [
			...volumeEntries,
			{
				id: generateId(),
				length: 0,
				width: 0,
				height: 0,
				volume: 0
			}
		];
	}

	function handleRemoveVolume(id: string) {
		if (volumeEntries.length === 1) {
			toast.error('Minimal harus ada 1 perhitungan volume');
			return;
		}
		volumeEntries = volumeEntries.filter((entry) => entry.id !== id);
	}

	function handleSave() {
		if (isQtyExceeded) {
			toast.error(
				`Jumlah diterima tidak boleh melebihi sisa belum diterima (${maxQuantity} ${uomCode})`
			);
			return;
		}
		onSave();
	}

	function selectDocket(d: DocketItem) {
		docketNumber = d.docket_number;
		docketOpen = false;
		docketSearch = '';
	}
</script>

<div class="space-y-5">
	<!-- Section: Dimensi (only when uom is M3) -->
	{#if showVolume}
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div
						class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40"
					>
						<Ruler class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
					</div>
					<p
						class="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400"
					>
						Volume
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="h-8 gap-1.5 text-xs"
					onclick={handleAddVolume}
					type="button"
				>
					<Plus class="h-3.5 w-3.5" />
					Tambah Volume
				</Button>
			</div>

			<!-- Volume entries -->
			<div class="space-y-3">
				{#each volumeEntries as entry, index (entry.id)}
					<div class="rounded-xl border bg-muted/30 p-4">
						<div class="mb-3 flex items-center justify-between">
							<span class="text-xs font-medium text-muted-foreground">
								Perhitungan {index + 1}
							</span>
							{#if volumeEntries.length > 1}
								<button
									class="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
									onclick={() => handleRemoveVolume(entry.id)}
									type="button"
									aria-label="Hapus perhitungan"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							{/if}
						</div>

						<div class="grid grid-cols-3 gap-2">
							<div class="space-y-1.5">
								<Label for="length-{entry.id}" class="text-xs font-medium text-muted-foreground"
									>Panjang</Label
								>
								<Input
									id="length-{entry.id}"
									type="number"
									min="0"
									step="1"
									bind:value={entry.length}
									class="h-12 text-center text-base font-semibold"
									placeholder="0"
								/>
								<p class="text-center text-xs text-muted-foreground">cm</p>
							</div>
							<div class="space-y-1.5">
								<Label for="width-{entry.id}" class="text-xs font-medium text-muted-foreground"
									>Lebar</Label
								>
								<Input
									id="width-{entry.id}"
									type="number"
									min="0"
									step="1"
									bind:value={entry.width}
									class="h-12 text-center text-base font-semibold"
									placeholder="0"
								/>
								<p class="text-center text-xs text-muted-foreground">cm</p>
							</div>
							<div class="space-y-1.5">
								<Label for="height-{entry.id}" class="text-xs font-medium text-muted-foreground"
									>Tinggi</Label
								>
								<Input
									id="height-{entry.id}"
									type="number"
									min="0"
									step="1"
									bind:value={entry.height}
									class="h-12 text-center text-base font-semibold"
									placeholder="0"
								/>
								<p class="text-center text-xs text-muted-foreground">cm</p>
							</div>
						</div>

						<!-- Volume result per entry -->
						{#if entry.volume > 0}
							<div
								class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800/40 dark:bg-amber-900/20"
							>
								<div class="flex items-center justify-between">
									<span class="text-xs text-amber-700 dark:text-amber-400">
										{entry.length} × {entry.width} × {entry.height} cm
									</span>
									<span class="text-sm font-bold text-amber-800 dark:text-amber-300">
										{entry.volume} m³
									</span>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>

		</div>
	{/if}

	<!-- Section: Jumlah Diterima -->
	<div class="rounded-xl border bg-muted/30 p-4">
		<div class="mb-3 flex items-center gap-2">
			<div
				class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40"
			>
				<Package class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
			</div>
			<p class="text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-400">
				Jumlah Diterima
			</p>
		</div>

		<div class="flex items-center gap-3">
			<Input
				id="drop-accepted-qty"
				type="number"
				min="0"
				step="0.01"
				bind:value={acceptedQuantity}
				disabled={showVolume}
				readonly={showVolume}
				class="h-14 flex-1 text-center text-xl font-bold {showVolume
					? 'cursor-not-allowed bg-muted'
					: ''}"
			/>
			<div
				class="flex h-14 min-w-[52px] items-center justify-center rounded-lg border bg-background px-3"
			>
				<span class="text-sm font-semibold text-muted-foreground">{uomCode}</span>
			</div>
		</div>
		{#if showVolume}
			<p class="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">
				Otomatis dihitung dari {volumeEntries.length} perhitungan volume
			</p>
		{/if}
		<p class="mt-2 text-center text-xs text-muted-foreground">
			Maks: <span class="font-medium text-foreground">{maxQuantity} {uomCode}</span>
		</p>
		{#if isQtyExceeded}
			<p class="mt-1 text-center text-xs font-medium text-destructive">
				Melebihi sisa belum diterima ({maxQuantity}
				{uomCode})
			</p>
		{/if}
	</div>

	<!-- Section: Docket Number -->
	<div class="rounded-xl border bg-muted/30 p-4">
		<div class="mb-3 flex items-center gap-2">
			<div
				class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40"
			>
				<Hash class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
			</div>
			<p class="text-xs font-semibold tracking-wide text-purple-700 uppercase dark:text-purple-400">
				Docket Number
			</p>
		</div>

		<Popover.Root bind:open={docketOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						class="flex h-12 w-full items-center justify-between rounded-lg border bg-background px-4 text-sm ring-offset-background transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						{#if selectedDocket}
							<div class="min-w-0 text-left">
								<p class="truncate font-semibold">{selectedDocket.docket_number}</p>
								{#if selectedDocket.vehicle_registration_number}
									<p class="truncate text-xs text-muted-foreground">
										{selectedDocket.vehicle_registration_number}
									</p>
								{/if}
							</div>
						{:else}
							<span class="text-muted-foreground">Pilih docket...</span>
						{/if}
						<ChevronDown class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
					</button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
				<div class="border-b p-2">
					<Input
						bind:value={docketSearch}
						placeholder="Cari nomor docket atau kendaraan..."
						class="h-9 text-sm"
					/>
				</div>
				<div class="max-h-60 overflow-y-auto">
					{#if isDocketsLoading}
						<div class="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
							<Loader class="h-4 w-4 animate-spin" />
							Memuat docket...
						</div>
					{:else if filteredDockets.length === 0}
						<p class="py-8 text-center text-sm text-muted-foreground">
							{dockets.length === 0 ? 'Tidak ada docket tersedia' : 'Docket tidak ditemukan'}
						</p>
					{:else}
						{#each filteredDockets as d}
							<button
								class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted {docketNumber ===
								d.docket_number
									? 'bg-muted/60'
									: ''}"
								onclick={() => selectDocket(d)}
							>
								<div class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
									{#if docketNumber === d.docket_number}
										<Check class="h-4 w-4 text-primary" />
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-semibold">{d.docket_number}</p>
									<div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
										{#if d.vehicle_registration_number}
											<span class="text-xs text-muted-foreground"
												>{d.vehicle_registration_number}</span
											>
										{/if}
										{#if d.net_weight}
											<span class="text-xs text-muted-foreground"
												>Net: {d.net_weight.toLocaleString('id-ID')} kg</span
											>
										{/if}
										{#if d.gross_weight}
											<span class="text-xs text-muted-foreground"
												>Gross: {d.gross_weight.toLocaleString('id-ID')} kg</span
											>
										{/if}
									</div>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</Popover.Content>
		</Popover.Root>

		<!-- Selected docket detail preview -->
		{#if selectedDocket}
			<div class="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-background p-3 text-center">
				<div>
					<p class="text-xs text-muted-foreground">Gross</p>
					<p class="text-sm font-semibold">{selectedDocket.gross_weight.toLocaleString('id-ID')}</p>
					<p class="text-xs text-muted-foreground">kg</p>
				</div>
				<div class="border-x">
					<p class="text-xs text-muted-foreground">Tare</p>
					<p class="text-sm font-semibold">{selectedDocket.tare_weight.toLocaleString('id-ID')}</p>
					<p class="text-xs text-muted-foreground">kg</p>
				</div>
				<div>
					<p class="text-xs text-muted-foreground">Net</p>
					<p class="text-sm font-bold text-green-700 dark:text-green-400">
						{selectedDocket.net_weight.toLocaleString('id-ID')}
					</p>
					<p class="text-xs text-muted-foreground">kg</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex gap-3">
		<Button variant="outline" class="h-12 flex-1 text-sm" onclick={onCancel}>Batal</Button>
		<Button
			class="h-12 flex-1 gap-2 text-sm font-semibold"
			disabled={!isValid}
			onclick={handleSave}
		>
			<Check class="h-4 w-4" />
			Simpan Item
		</Button>
	</div>
</div>
