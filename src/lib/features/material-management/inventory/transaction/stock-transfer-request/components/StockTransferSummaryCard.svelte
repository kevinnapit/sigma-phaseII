<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Save, Package, ArrowRight } from 'lucide-svelte';

	let {
		items = [],
		formData = {},
		onSaveDraft,
		isSubmitting = false
	}: {
		items?: any[];
		formData?: any;
		onSaveDraft?: () => void;
		isSubmitting?: boolean;
	} = $props();

	const totalItems = $derived(items.length);
	const isFormValid = $derived(
		formData.from_store_id && 
		formData.to_store_id && 
		formData.from_store_id !== formData.to_store_id &&
		formData.request_date && 
		items.length > 0
	);

	// Debug logging
	$effect(() => {
		console.log('Summary validation state:', {
			from_store_id: formData.from_store_id,
			to_store_id: formData.to_store_id,
			different_stores: formData.from_store_id !== formData.to_store_id,
			request_date: formData.request_date,
			items_count: items.length,
			isFormValid
		});
	});

	function handleSaveDraft() {
		if (!isFormValid) return;
		onSaveDraft?.();
	}
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Ringkasan Permintaan</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Transfer Info -->
		{#if formData.from_store_name && formData.to_store_name}
			<div class="rounded-lg bg-muted/50 p-3">
				<div class="flex items-center gap-2 text-sm">
					<Package class="h-4 w-4 text-muted-foreground" />
					<span class="font-medium">{formData.from_store_name}</span>
					<ArrowRight class="h-4 w-4 text-muted-foreground" />
					<span class="font-medium">{formData.to_store_name}</span>
				</div>
			</div>
		{/if}

		<!-- Items Summary -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-sm text-muted-foreground">Total Item</span>
				<Badge variant="outline">{totalItems} item</Badge>
			</div>
			
			{#if formData.request_date}
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Tanggal Permintaan</span>
					<span class="text-sm font-medium">
						{new Date(formData.request_date).toLocaleDateString('id-ID')}
					</span>
				</div>
			{/if}

			{#if formData.reference_number}
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">No. Referensi</span>
					<span class="text-sm font-medium">{formData.reference_number}</span>
				</div>
			{/if}
		</div>

		<!-- Validation Messages -->
		{#if !isFormValid}
			<div class="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
				<p class="font-medium">Lengkapi data berikut:</p>
				<ul class="mt-1 list-inside list-disc space-y-1">
					{#if !formData.from_store_id}
						<li>Pilih gudang asal</li>
					{/if}
					{#if !formData.to_store_id}
						<li>Pilih gudang tujuan</li>
					{/if}
					{#if formData.from_store_id === formData.to_store_id}
						<li>Gudang tujuan harus berbeda dengan gudang asal</li>
					{/if}
					{#if !formData.request_date}
						<li>Pilih tanggal permintaan</li>
					{/if}
					{#if items.length === 0}
						<li>Tambahkan minimal 1 item</li>
					{/if}
				</ul>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="space-y-2">
			<Separator />
			<div class="space-y-2">
				<Button
					variant="secondary"
					class="w-full"
					onclick={handleSaveDraft}
					disabled={!isFormValid || isSubmitting}
				>
					<Save class="mr-2 h-4 w-4" />
					{isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
				</Button>
			</div>
		</div>
	</CardContent>
</Card>