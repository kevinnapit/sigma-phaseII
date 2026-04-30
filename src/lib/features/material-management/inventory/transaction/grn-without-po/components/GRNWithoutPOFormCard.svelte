<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	let {
		formData = $bindable({}),
		errors = $bindable({}),
		readonly = false
	}: {
		formData?: any;
		errors?: Record<string, string>;
		readonly?: boolean;
	} = $props();

	// Store options — removed, store is always "Gudang"

	// Supplier options
	const suppliers = [
		{ value: 'sup-001', label: 'S. MUNTHE' },
		{ value: 'sup-002', label: 'PT Supplier Jaya' },
		{ value: 'sup-003', label: 'CV Maju Bersama' },
		{ value: 'sup-004', label: 'UD Berkah Abadi' }
	];

	// Transporter options
	const transporters = [
		{ value: 'None', label: 'None' },
		{ value: 'PT Transport Jaya', label: 'PT Transport Jaya' },
		{ value: 'CV Logistik Nusantara', label: 'CV Logistik Nusantara' },
		{ value: 'UD Kirim Cepat', label: 'UD Kirim Cepat' }
	];

	// Auto-fill defaults
	$effect(() => {
		if (!formData.date) {
			formData.date = new Date().toISOString().split('T')[0];
		}
		// Store is always "Gudang"
		formData.store_id = 'store-003';
		formData.store_name = 'Gudang';
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Detail Penerimaan Barang Tanpa PO</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<div class="grid gap-4 md:grid-cols-2">
			<!-- Store (Gudang) - always "Gudang", read-only -->
			<div class="space-y-2">
				<Label>Gudang</Label>
				<Input
					value="Gudang"
					readonly
					class="cursor-not-allowed bg-muted"
				/>
			</div>

			<!-- GRN No (auto-generated, read-only) -->
			<div class="space-y-2">
				<Label>Nomor GRN</Label>
				<Input
					value={formData.grn_number || 'Auto-generated'}
					readonly
					class="cursor-not-allowed bg-muted font-mono"
				/>
			</div>

			<!-- Date (Tanggal) -->
			<div class="space-y-2">
				<Label>Tanggal <span class="text-red-500">*</span></Label>
				<Input
					type={readonly ? 'text' : 'date'}
					bind:value={formData.date}
					readonly={readonly}
					class={readonly
						? 'cursor-not-allowed bg-muted'
						: errors.date
							? 'border-red-500'
							: ''}
				/>
				{#if !readonly && errors.date}
					<p class="text-xs text-red-600">{errors.date}</p>
				{/if}
			</div>

			<!-- Supplier -->
			<div class="space-y-2">
				<Label for="supplier">Supplier <span class="text-red-500">*</span></Label>
				{#if readonly}
					<Input
						value={formData.supplier_name || 'Tidak ada data'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="supplier"
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						class:border-red-500={errors.supplier_id}
						onchange={(e) => {
							const target = e.currentTarget as HTMLSelectElement;
							const selectedValue = target.value;
							const selectedSupplier = suppliers.find((s) => s.value === selectedValue);
							formData.supplier_id = selectedValue;
							formData.supplier_name = selectedSupplier?.label || '';
						}}
					>
						<option value="">Pilih supplier</option>
						{#each suppliers as supplier}
							<option value={supplier.value} selected={formData.supplier_id === supplier.value}
								>{supplier.label}</option
							>
						{/each}
					</select>
					{#if errors.supplier_id}
						<p class="text-xs text-red-600">{errors.supplier_id}</p>
					{/if}
				{/if}
			</div>

			<!-- Reference No -->
			<div class="space-y-2">
				<Label>Nomor Referensi</Label>
				<Input
					bind:value={formData.ref_no}
					placeholder="REF/WPO/2026/001"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Delivery Note No (No. Surat Jalan) -->
			<div class="space-y-2">
				<Label>No. Surat Jalan</Label>
				<Input
					bind:value={formData.delivery_note_no}
					placeholder="SJ/2026/001"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Delivery Date (Tanggal Pengiriman) -->
			<div class="space-y-2">
				<Label>Tanggal Pengiriman</Label>
				<Input
					type={readonly ? 'text' : 'date'}
					bind:value={formData.delivery_date}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Vehicle No (No. Kendaraan) -->
			<div class="space-y-2">
				<Label>No. Kendaraan</Label>
				<Input
					bind:value={formData.vehicle_no}
					placeholder="B 1234 ABC"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Transporter -->
			<div class="space-y-2">
				<Label for="transporter">Transporter</Label>
				{#if readonly}
					<Input
						value={formData.transporter || 'None'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="transporter"
						bind:value={formData.transporter}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#each transporters as t}
							<option value={t.value}>{t.label}</option>
						{/each}
					</select>
				{/if}
			</div>
		</div>

		<!-- Remarks (Catatan) -->
		<div class="space-y-2">
			<Label>Catatan</Label>
			<Textarea
				bind:value={formData.remarks}
				placeholder={readonly ? 'Tidak ada catatan' : 'Catatan tambahan (opsional)'}
				rows={3}
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : ''}
			/>
		</div>
	</CardContent>
</Card>
