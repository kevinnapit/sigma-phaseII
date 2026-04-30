<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Check, Truck, Plus, Trash2, Package, Ruler } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface VehicleEntry {
		id: string;
		vehicleNumber: string;
		length: number;
		width: number;
		height: number;
		volume: number;
	}

	interface Props {
		acceptedQuantity: number;
		maxQuantity: number;
		uomCode: string;
		showVolume?: boolean;
		onSave: (vehicles: VehicleEntry[], totalVolume: number) => void;
		onCancel: () => void;
	}

	let {
		acceptedQuantity = $bindable(0),
		maxQuantity,
		uomCode,
		showVolume = false,
		onSave,
		onCancel
	}: Props = $props();

	// Simple UUID generator for vehicle IDs
	function generateId() {
		return `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	// REQ-016: Multiple vehicle numbers
	let vehicles = $state<VehicleEntry[]>([
		{
			id: generateId(),
			vehicleNumber: '',
			length: 0,
			width: 0,
			height: 0,
			volume: 0
		}
	]);

	// REQ-018: Auto-calculate volume per vehicle and total
	$effect(() => {
		vehicles.forEach((v) => {
			if (v.length > 0 && v.width > 0 && v.height > 0) {
				v.volume = parseFloat((v.length * v.width * v.height).toFixed(4));
			} else {
				v.volume = 0;
			}
		});

		// Auto-calculate total volume for acceptedQuantity
		if (showVolume) {
			const totalVolume = vehicles.reduce((sum, v) => sum + v.volume, 0);
			acceptedQuantity = parseFloat(totalVolume.toFixed(4));
		}
	});

	const totalVolume = $derived(
		vehicles.reduce((sum, v) => sum + v.volume, 0)
	);

	const isQtyExceeded = $derived(acceptedQuantity > maxQuantity);

	const isValid = $derived(() => {
		if (showVolume) {
			// For volume-based: at least one vehicle with valid dimensions
			const hasValidVehicle = vehicles.some(
				(v) => v.vehicleNumber.trim() !== '' && v.volume > 0
			);
			return hasValidVehicle && !isQtyExceeded && totalVolume > 0;
		} else {
			// For non-volume: just check accepted quantity
			return acceptedQuantity > 0 && !isQtyExceeded;
		}
	});

	// REQ-016: Add new vehicle
	function handleAddVehicle() {
		vehicles = [
			...vehicles,
			{
				id: generateId(),
				vehicleNumber: '',
				length: 0,
				width: 0,
				height: 0,
				volume: 0
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

	function handleSave() {
		if (isQtyExceeded) {
			toast.error(
				`Jumlah diterima tidak boleh melebihi sisa belum diterima (${maxQuantity} ${uomCode})`
			);
			return;
		}

		if (showVolume) {
			// Validate all vehicles have vehicle number
			const invalidVehicles = vehicles.filter(
				(v) => v.volume > 0 && v.vehicleNumber.trim() === ''
			);
			if (invalidVehicles.length > 0) {
				toast.error('Semua kendaraan dengan volume harus memiliki nomor kendaraan');
				return;
			}
		}

		onSave(vehicles, totalVolume);
	}
</script>

<div class="space-y-5">
	<!-- REQ-016 & REQ-018: Multiple Vehicles with Dimensions -->
	{#if showVolume}
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div
						class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40"
					>
						<Truck class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
					</div>
					<p
						class="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400"
					>
						Kendaraan & Volume
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="h-8 gap-1.5 text-xs"
					onclick={handleAddVehicle}
				>
					<Plus class="h-3.5 w-3.5" />
					Tambah Kendaraan
				</Button>
			</div>

			<!-- Vehicle entries -->
			<div class="space-y-3">
				{#each vehicles as vehicle, index (vehicle.id)}
					<div class="rounded-xl border bg-muted/30 p-4">
						<div class="mb-3 flex items-center justify-between">
							<span class="text-xs font-medium text-muted-foreground">
								Kendaraan {index + 1}
							</span>
							{#if vehicles.length > 1}
								<button
									class="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
									onclick={() => handleRemoveVehicle(vehicle.id)}
									aria-label="Hapus kendaraan"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							{/if}
						</div>

						<!-- Vehicle Number -->
						<div class="mb-3 space-y-1.5">
							<Label for="vehicle-{vehicle.id}" class="text-xs font-medium">
								Nomor Kendaraan <span class="text-destructive">*</span>
							</Label>
							<Input
								id="vehicle-{vehicle.id}"
								bind:value={vehicle.vehicleNumber}
								placeholder="Contoh: B 1234 ABC"
								class="h-10"
							/>
						</div>

						<!-- Dimensions: P x L x T -->
						<div class="space-y-2">
							<div class="flex items-center gap-1.5">
								<Ruler class="h-3.5 w-3.5 text-muted-foreground" />
								<Label class="text-xs font-medium text-muted-foreground">Dimensi (meter)</Label>
							</div>
							<div class="grid grid-cols-3 gap-2">
								<div class="space-y-1">
									<Label for="length-{vehicle.id}" class="text-xs text-muted-foreground"
										>Panjang</Label
									>
									<Input
										id="length-{vehicle.id}"
										type="number"
										min="0"
										step="0.01"
										bind:value={vehicle.length}
										class="h-10 text-center font-semibold"
										placeholder="0"
									/>
								</div>
								<div class="space-y-1">
									<Label for="width-{vehicle.id}" class="text-xs text-muted-foreground"
										>Lebar</Label
									>
									<Input
										id="width-{vehicle.id}"
										type="number"
										min="0"
										step="0.01"
										bind:value={vehicle.width}
										class="h-10 text-center font-semibold"
										placeholder="0"
									/>
								</div>
								<div class="space-y-1">
									<Label for="height-{vehicle.id}" class="text-xs text-muted-foreground"
										>Tinggi</Label
									>
									<Input
										id="height-{vehicle.id}"
										type="number"
										min="0"
										step="0.01"
										bind:value={vehicle.height}
										class="h-10 text-center font-semibold"
										placeholder="0"
									/>
								</div>
							</div>
						</div>

						<!-- Volume result per vehicle -->
						{#if vehicle.volume > 0}
							<div
								class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800/40 dark:bg-amber-900/20"
							>
								<div class="flex items-center justify-between">
									<span class="text-xs text-amber-700 dark:text-amber-400">Volume</span>
									<span class="text-sm font-bold text-amber-800 dark:text-amber-300">
										{vehicle.volume} m³
									</span>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Total Volume Summary -->
			{#if totalVolume > 0}
				<div
					class="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/30"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-xs font-medium text-amber-700 dark:text-amber-400">
								Total Volume ({vehicles.length} Kendaraan)
							</p>
							<p class="mt-0.5 text-xs text-amber-600/70 dark:text-amber-500/70">
								Otomatis dihitung dari semua kendaraan
							</p>
						</div>
						<div class="text-right">
							<p class="text-2xl font-bold text-amber-800 dark:text-amber-300">
								{totalVolume.toFixed(4)}
							</p>
							<p class="text-xs text-amber-700 dark:text-amber-400">m³</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Non-volume based: Simple vehicle number input -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div
						class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40"
					>
						<Truck class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
					</div>
					<p
						class="text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-400"
					>
						Nomor Kendaraan
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="h-8 gap-1.5 text-xs"
					onclick={handleAddVehicle}
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
								class="h-10"
							/>
						</div>
						{#if vehicles.length > 1}
							<button
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
								onclick={() => handleRemoveVehicle(vehicle.id)}
								aria-label="Hapus kendaraan"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- REQ-017: Jumlah Diterima (Decimal support) -->
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
				id="accepted-qty"
				type="number"
				min="0"
				step="0.01"
				bind:value={acceptedQuantity}
				disabled={showVolume}
				class="h-14 flex-1 text-center text-xl font-bold"
				placeholder="0.00"
			/>
			<div
				class="flex h-14 min-w-[52px] items-center justify-center rounded-lg border bg-background px-3"
			>
				<span class="text-sm font-semibold text-muted-foreground">{uomCode}</span>
			</div>
		</div>
		<p class="mt-2 text-center text-xs text-muted-foreground">
			Maks: <span class="font-medium text-foreground">{maxQuantity} {uomCode}</span>
			{#if showVolume}
				<span class="text-amber-600 dark:text-amber-400">
					(Otomatis dari total volume)
				</span>
			{/if}
		</p>
		{#if isQtyExceeded}
			<p class="mt-1 text-center text-xs font-medium text-destructive">
				Melebihi sisa belum diterima ({maxQuantity}
				{uomCode})
			</p>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex gap-3">
		<Button variant="outline" class="h-12 flex-1 text-sm" onclick={onCancel}>Batal</Button>
		<Button
			class="h-12 flex-1 gap-2 text-sm font-semibold"
			disabled={!isValid()}
			onclick={handleSave}
		>
			<Check class="h-4 w-4" />
			Simpan Item
		</Button>
	</div>
</div>
