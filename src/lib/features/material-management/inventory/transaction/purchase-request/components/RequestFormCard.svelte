<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let {
		warehouseId = $bindable(''),
		warehouseName = $bindable(''),
		referenceNumber = $bindable(''),
		targetDate = $bindable(''),
		staffName = $bindable(''),
		remarks = $bindable(''),
		errors = $bindable({})
	}: {
		warehouseId?: string;
		warehouseName?: string;
		referenceNumber?: string;
		targetDate?: string;
		staffName?: string;
		remarks?: string;
		errors?: Record<string, string>;
	} = $props();

	// Get user context
	const userContext = getUserContext();
	const currentWarehouseName = $derived(warehouseName || userContext.estate?.name || 'GUDANG');

	// Auto-fill warehouse data from active estate so this form does not depend on the stores API.
	$effect(() => {
		if (userContext.estate?.id && !warehouseId) {
			warehouseId = userContext.estate.id;
		}
		if (userContext.estate?.name && !warehouseName) {
			warehouseName = userContext.estate.name;
		}
	});

	// Auto-fill staff name from user context
	$effect(() => {
		if (userContext.user?.name && !staffName) {
			staffName = userContext.user.name;
		}
	});

	// Set default target date to today
	$effect(() => {
		if (!targetDate) {
			const today = new Date();
			targetDate = today.toISOString().split('T')[0];
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Formulir Permintaan Barang</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Warehouse -->
		<div class="space-y-2">
			<Label>Gudang Saat Ini</Label>
			<Input
				value={currentWarehouseName}
				readonly
				class="cursor-not-allowed bg-muted {errors.warehouse_id ? 'border-red-500' : ''}"
			/>
			{#if errors.warehouse_id}
				<p class="text-xs text-red-600">{errors.warehouse_id}</p>
			{/if}
		</div>

		<!-- Staff Peminta -->
		<div class="space-y-2">
			<Label>Staff Peminta</Label>
			<Input
				bind:value={staffName}
				placeholder="Nama staff"
				readonly
				class="cursor-not-allowed bg-muted {errors.staff_name ? 'border-red-500' : ''}"
			/>
			{#if errors.staff_name}
				<p class="text-xs text-red-600">{errors.staff_name}</p>
			{/if}
		</div>

		<!-- Nomor Referensi -->
		<div class="space-y-2">
			<Label>Nomor Referensi</Label>
			<Input bind:value={referenceNumber} placeholder="DOK-001" />
		</div>

		<!-- Tanggal -->
		<div class="space-y-2">
			<Label>Tanggal</Label>
			<Input type="date" bind:value={targetDate} />
		</div>

		<!-- Keterangan -->
		<div class="space-y-2">
			<Label>Keterangan</Label>
			<Textarea
				bind:value={remarks}
				placeholder="Tambahkan keterangan (opsional)"
				rows={2}
			/>
		</div>
	</CardContent>
</Card>
