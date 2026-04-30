<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let {
		formData = $bindable({}),
		errors = $bindable({})
	}: {
		formData?: any;
		errors?: Record<string, string>;
	} = $props();

	// Get user context
	const userContext = getUserContext();
	const currentEstateName = $derived(userContext.estate?.name || 'Aek Loba');

	const stores = [
		{ value: 'store-001', label: 'Gudang Poliklinik A' },
		{ value: 'store-002', label: 'Sub-Gudang Poliklinik A' },
		{ value: 'store-003', label: 'Gudang' },
		{ value: 'store-004', label: 'Sub-Gudang Div 1' },
		{ value: 'store-005', label: 'Sub-Gudang Div 2' },
		{ value: 'store-006', label: 'Sub-Gudang Pupuk/Div 3' },
		{ value: 'store-007', label: 'Sub-Gudang Pupuk/Div 4' }
	];

	// Auto-fill estate data
	$effect(() => {
		if (!formData.from_estate_id) {
			formData.from_estate_id = userContext.estate?.id || 'estate-001';
		}
		if (!formData.to_estate_id) {
			formData.to_estate_id = userContext.estate?.id || 'estate-001';
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Formulir Transfer Stok</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Kebun -->
		<div class="space-y-2">
			<Label>Kebun</Label>
			<Input
				value={currentEstateName}
				readonly
				class="cursor-not-allowed bg-muted"
			/>
			<p class="text-xs text-muted-foreground">Kebun ditentukan berdasarkan lokasi Anda</p>
		</div>

		<!-- Tanggal -->
		<div class="space-y-2">
			<Label>Tanggal Permintaan</Label>
			<Input
				type="date"
				bind:value={formData.request_date}
				class={errors.request_date ? 'border-red-500' : ''}
			/>
			{#if errors.request_date}
				<p class="text-xs text-red-600">{errors.request_date}</p>
			{/if}
		</div>

		<!-- Row 1: Gudang Asal & Gudang Tujuan -->
		<div class="grid grid-cols-2 gap-4">
			<!-- Gudang Asal -->
			<div class="space-y-2">
				<Label for="from_store">Gudang Asal</Label>
				<select
					id="from_store"
					bind:value={formData.from_store_id}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					class:border-red-500={errors.from_store_id}
					onchange={(e) => {
						const target = e.currentTarget as HTMLSelectElement;
						const selectedValue = target.value;
						const selectedStore = stores.find(s => s.value === selectedValue);
						formData.from_store_id = selectedValue;
						formData.from_store_name = selectedStore?.label || '';
					}}
				>
					<option value="">Pilih gudang asal</option>
					{#each stores as store}
						<option value={store.value}>{store.label}</option>
					{/each}
				</select>
				{#if errors.from_store_id}
					<p class="text-xs text-red-600">{errors.from_store_id}</p>
				{/if}
			</div>

			<!-- Gudang Tujuan -->
			<div class="space-y-2">
				<Label for="to_store">Gudang Tujuan</Label>
				<select
					id="to_store"
					bind:value={formData.to_store_id}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					class:border-red-500={errors.to_store_id}
					onchange={(e) => {
						const target = e.currentTarget as HTMLSelectElement;
						const selectedValue = target.value;
						const selectedStore = stores.find(s => s.value === selectedValue);
						formData.to_store_id = selectedValue;
						formData.to_store_name = selectedStore?.label || '';
					}}
				>
					<option value="">Pilih gudang tujuan</option>
					{#each stores as store}
						<option value={store.value}>{store.label}</option>
					{/each}
				</select>
				{#if errors.to_store_id}
					<p class="text-xs text-red-600">{errors.to_store_id}</p>
				{/if}
			</div>
		</div>

		<!-- Row 2: Nomor Referensi saja -->
		<div class="space-y-2">
			<Label>Nomor Referensi</Label>
			<Input bind:value={formData.reference_number} placeholder="REF-001 (opsional)" />
		</div>
	</CardContent>
</Card>