<script lang="ts">
	import * as Card from '$lib/components/ui/card';
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

	// Supplier options
	const suppliers = [
		{ value: 'sup-001', label: 'S. MUNTHE' },
		{ value: 'sup-002', label: 'PT Supplier Jaya' },
		{ value: 'sup-003', label: 'CV Maju Bersama' },
		{ value: 'sup-004', label: 'UD Berkah Abadi' }
	];

	// Auto-set store to GUDANG
	$effect(() => {
		if (!formData.store_id) {
			formData.store_id = 'store-gudang';
			formData.store_name = 'GUDANG';
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Detail Pengembalian Pembelian</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Store (Gudang) — always GUDANG, read-only -->
		<div class="space-y-2">
			<Label for="store">Gudang</Label>
			<Input
				id="store"
				value="GUDANG"
				readonly
				class="cursor-not-allowed bg-muted"
			/>
		</div>

		<!-- Purchase Return No — auto-generated, read-only -->
		<div class="space-y-2">
			<Label for="return_number">No. Pengembalian Pembelian</Label>
			<Input
				id="return_number"
				value={formData.return_number || 'Auto-generated'}
				readonly
				class="cursor-not-allowed bg-muted font-mono"
			/>
		</div>

		<!-- Supplier — dropdown, required -->
		<div class="space-y-2">
			<Label for="supplier">Supplier <span class="text-red-500">*</span></Label>
			{#if readonly}
				<Input
					value={formData.supplier_name || '-'}
					readonly
					class="cursor-not-allowed bg-muted"
				/>
			{:else}
				<select
					id="supplier"
					bind:value={formData.supplier_id}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
						<option value={supplier.value}>{supplier.label}</option>
					{/each}
				</select>
				{#if errors.supplier_id}
					<p class="text-xs text-red-600">{errors.supplier_id}</p>
				{/if}
			{/if}
		</div>

		<!-- Purchase Return Date — required -->
		<div class="space-y-2">
			<Label for="return_date">Tanggal Pengembalian <span class="text-red-500">*</span></Label>
			<Input
				id="return_date"
				type={readonly ? 'text' : 'date'}
				bind:value={formData.return_date}
				readonly={readonly}
				class={readonly
					? 'cursor-not-allowed bg-muted'
					: errors.return_date
						? 'border-red-500'
						: ''}
			/>
			{#if !readonly && errors.return_date}
				<p class="text-xs text-red-600">{errors.return_date}</p>
			{/if}
		</div>

		<!-- Purchase Return Account — optional -->
		<div class="space-y-2">
			<Label for="return_account">Akun Pengembalian</Label>
			<Input
				id="return_account"
				bind:value={formData.return_account}
				placeholder="09328-Langganan Macam2"
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : ''}
			/>
		</div>

		<!-- Remarks — optional -->
		<div class="space-y-2">
			<Label for="remarks">Catatan</Label>
			<Textarea
				id="remarks"
				bind:value={formData.remarks}
				placeholder={readonly ? 'Tidak ada catatan' : 'Catatan pengembalian (opsional)'}
				rows={3}
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : ''}
			/>
		</div>
	</Card.Content>
</Card.Root>
