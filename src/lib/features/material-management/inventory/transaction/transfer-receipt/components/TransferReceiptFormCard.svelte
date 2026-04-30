<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let {
		formData = $bindable({}),
		errors = $bindable({}),
		readonly = false
	}: {
		formData?: any;
		errors?: Record<string, string>;
		readonly?: boolean;
	} = $props();

	// Get user context
	const userContext = getUserContext();
	const currentUserName = $derived(userContext.user?.name || 'User');

	// Store options
	const stores = [
		{ value: 'store-001', label: 'Gudang Poliklinik A' },
		{ value: 'store-002', label: 'Sub-Gudang Poliklinik A' },
		{ value: 'store-003', label: 'Gudang' },
		{ value: 'store-004', label: 'Sub-Gudang Div 1' },
		{ value: 'store-005', label: 'Sub-Gudang Div 2' },
		{ value: 'store-006', label: 'Sub-Gudang Pupuk/Div 3' },
		{ value: 'store-007', label: 'Sub-Gudang Pupuk/Div 4' }
	];

	// Administrative Unit options
	const administrativeUnits = [
		{ value: 'admin-001', label: 'Afd Penerima' },
		{ value: 'admin-002', label: 'Afd Pengirim' },
		{ value: 'admin-003', label: 'Divisi 1' },
		{ value: 'admin-004', label: 'Divisi 2' },
		{ value: 'admin-005', label: 'Divisi 3' }
	];

	// MR Number options
	const mrNumbers = [
		{ value: 'MR/2017/8/001', label: 'MR/2017/8/001' },
		{ value: 'MR/2018/9/012', label: 'MR/2018/9/012' },
		{ value: 'MR/2019/10/023', label: 'MR/2019/10/023' },
		{ value: 'MR/2020/11/034', label: 'MR/2020/11/034' }
	];

	// Auto-fill data
	$effect(() => {
		if (!formData.grn_date) {
			formData.grn_date = new Date().toISOString().split('T')[0];
		}
		if (!formData.delivery_date) {
			formData.delivery_date = new Date().toISOString().split('T')[0];
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Detail Penerimaan Transfer</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<div class="grid gap-4 md:grid-cols-2">
			<!-- Store (Gudang) -->
			<div class="space-y-2">
				<Label for="store">Gudang</Label>
				{#if readonly}
					<Input
						value={formData.store_name || 'Tidak ada data'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="store"
						bind:value={formData.store_id}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						class:border-red-500={errors.store_id}
						onchange={(e) => {
							const target = e.currentTarget as HTMLSelectElement;
							const selectedValue = target.value;
							const selectedStore = stores.find(s => s.value === selectedValue);
							formData.store_id = selectedValue;
							formData.store_name = selectedStore?.label || '';
						}}
					>
						<option value="">Pilih gudang</option>
						{#each stores as store}
							<option value={store.value}>{store.label}</option>
						{/each}
					</select>
					{#if errors.store_id}
						<p class="text-xs text-red-600">{errors.store_id}</p>
					{/if}
				{/if}
			</div>

			<!-- Administrative Unit -->
			<div class="space-y-2">
				<Label for="admin_unit">Unit Administratif</Label>
				{#if readonly}
					<Input
						value={formData.administrative_unit_name || 'Tidak ada data'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="admin_unit"
						bind:value={formData.administrative_unit_id}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						class:border-red-500={errors.administrative_unit_id}
						onchange={(e) => {
							const target = e.currentTarget as HTMLSelectElement;
							const selectedValue = target.value;
							const selectedUnit = administrativeUnits.find(u => u.value === selectedValue);
							formData.administrative_unit_id = selectedValue;
							formData.administrative_unit_name = selectedUnit?.label || '';
						}}
					>
						<option value="">Pilih unit administratif</option>
						{#each administrativeUnits as unit}
							<option value={unit.value}>{unit.label}</option>
						{/each}
					</select>
					{#if errors.administrative_unit_id}
						<p class="text-xs text-red-600">{errors.administrative_unit_id}</p>
					{/if}
				{/if}
			</div>

			<!-- GRN Date -->
			<div class="space-y-2">
				<Label>Tanggal GRN</Label>
				<Input
					type={readonly ? "text" : "date"}
					bind:value={formData.grn_date}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : (errors.grn_date ? 'border-red-500' : '')}
				/>
				{#if !readonly && errors.grn_date}
					<p class="text-xs text-red-600">{errors.grn_date}</p>
				{/if}
			</div>

			<!-- Delivery Date -->
			<div class="space-y-2">
				<Label>Tanggal Pengiriman</Label>
				<Input
					type={readonly ? "text" : "date"}
					bind:value={formData.delivery_date}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : (errors.delivery_date ? 'border-red-500' : '')}
				/>
				{#if !readonly && errors.delivery_date}
					<p class="text-xs text-red-600">{errors.delivery_date}</p>
				{/if}
			</div>

			<!-- From Store -->
			<div class="space-y-2">
				<Label for="from_store">Dari Gudang</Label>
				{#if readonly}
					<Input
						value={formData.from_store_name || 'Tidak ada data'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
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
				{/if}
			</div>

			<!-- Ref No -->
			<div class="space-y-2">
				<Label>Nomor Referensi</Label>
				<Input
					bind:value={formData.ref_no}
					placeholder="REF/2026/001"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Delivery Note No -->
			<div class="space-y-2">
				<Label>Nomor Surat Jalan</Label>
				<Input
					bind:value={formData.delivery_note_no}
					placeholder="DN/2026/001"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Vehicle No -->
			<div class="space-y-2">
				<Label>Nomor Kendaraan</Label>
				<Input
					bind:value={formData.vehicle_no}
					placeholder="B 1234 ABC"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Transporter -->
			<div class="space-y-2">
				<Label>Transporter</Label>
				<Input
					bind:value={formData.transporter}
					placeholder="PT Transport Jaya"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- MR No -->
			<div class="space-y-2">
				<Label for="mr_no">Nomor MR</Label>
				{#if readonly}
					<Input
						value={formData.mr_no || 'Tidak ada data'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="mr_no"
						bind:value={formData.mr_no}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						class:border-red-500={errors.mr_no}
					>
						<option value="">Pilih nomor MR</option>
						{#each mrNumbers as mr}
							<option value={mr.value}>{mr.label}</option>
						{/each}
					</select>
					{#if errors.mr_no}
						<p class="text-xs text-red-600">{errors.mr_no}</p>
					{/if}
				{/if}
			</div>
		</div>

		<!-- Remarks -->
		<div class="space-y-2">
			<Label>Catatan</Label>
			<Textarea
				bind:value={formData.remarks}
				placeholder={readonly ? "Tidak ada catatan" : "Catatan tambahan (opsional)"}
				rows={3}
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : ''}
			/>
		</div>
	</CardContent>
</Card>