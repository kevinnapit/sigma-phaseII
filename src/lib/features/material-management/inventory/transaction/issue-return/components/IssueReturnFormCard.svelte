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
	const currentUserId = $derived(userContext.user?.id || 'user-001');

	// Gudang options
	const stores = [
		{ value: 'store-001', label: 'Gudang Poliklinik A' },
		{ value: 'store-002', label: 'Sub-Gudang Poliklinik A' },
		{ value: 'store-003', label: 'Gudang' },
		{ value: 'store-004', label: 'Sub-Gudang Div 1' },
		{ value: 'store-005', label: 'Sub-Gudang Div 2' },
		{ value: 'store-006', label: 'Sub-Gudang Pupuk/Div 3' },
		{ value: 'store-007', label: 'Sub-Gudang Pupuk/Div 4' }
	];

	// Auto-fill data
	$effect(() => {
		if (!formData.return_date) {
			formData.return_date = new Date().toISOString().split('T')[0];
		}
		if (!formData.return_by_name) {
			formData.return_by_name = currentUserName;
			formData.return_by_id = currentUserId;
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Detail Pengembalian</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
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

		<!-- Return Date -->
		<div class="space-y-2">
			<Label>Tanggal Pengembalian</Label>
			<Input
				type={readonly ? "text" : "date"}
				bind:value={formData.return_date}
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : (errors.return_date ? 'border-red-500' : '')}
			/>
			{#if !readonly && errors.return_date}
				<p class="text-xs text-red-600">{errors.return_date}</p>
			{/if}
		</div>

		<!-- Return By (Read-only from user login) -->
		<div class="space-y-2">
			<Label>Dikembalikan Oleh</Label>
			<Input
				value={formData.return_by_name}
				readonly
				class="cursor-not-allowed bg-muted"
			/>
		</div>

		<!-- Remarks -->
		<div class="space-y-2">
			<Label>Catatan</Label>
			<Textarea
				bind:value={formData.remarks}
				placeholder={readonly ? "Tidak ada catatan" : "Alasan pengembalian (opsional)"}
				rows={3}
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : ''}
			/>
		</div>
	</CardContent>
</Card>
