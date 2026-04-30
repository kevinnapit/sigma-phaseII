<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
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
	const currentUserName = $derived(userContext.user?.name || 'User');

	// Auto-fill data
	$effect(() => {
		if (!formData.required_date) {
			formData.required_date = new Date().toISOString().split('T')[0];
		}
		if (!formData.warehouse_name) {
			formData.warehouse_name = 'Gudang';
		}
		if (!formData.staff_name) {
			formData.staff_name = currentUserName;
		}
		if (formData.is_urgent === undefined) {
			formData.is_urgent = false;
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-lg">Detail Permintaan</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Tanggal Dibutuhkan -->
		<div class="space-y-2">
			<Label>Tanggal Dibutuhkan</Label>
			<Input
				type="date"
				bind:value={formData.required_date}
				class={errors.required_date ? 'border-red-500' : ''}
			/>
			{#if errors.required_date}
				<p class="text-xs text-red-600">{errors.required_date}</p>
			{/if}
		</div>

		<!-- Nama Gudang (Read-only) -->
		<div class="space-y-2">
			<Label>Nama Gudang</Label>
			<Input
				value={formData.warehouse_name}
				readonly
				class="cursor-not-allowed bg-muted"
			/>
		</div>

		<!-- Nama Staff (Read-only from user login) -->
		<div class="space-y-2">
			<Label>Nama Staff</Label>
			<Input
				value={formData.staff_name}
				readonly
				class="cursor-not-allowed bg-muted"
			/>
		</div>

		<!-- Nomor Referensi -->
		<div class="space-y-2">
			<Label>Nomor Referensi</Label>
			<Input bind:value={formData.reference_number} placeholder="REF-001 (opsional)" />
		</div>

		<!-- Catatan -->
		<div class="space-y-2">
			<Label>Catatan</Label>
			<Textarea
				bind:value={formData.notes}
				placeholder="Alasan permintaan (opsional)"
				rows={3}
			/>
		</div>

		<!-- Permintaan Darurat (Toggle) -->
		<div class="flex items-center justify-between rounded-lg border p-3">
			<div class="space-y-0.5">
				<Label for="is_urgent" class="text-sm font-medium cursor-pointer">
					Permintaan Darurat
				</Label>
				<p class="text-xs text-muted-foreground">
					Tandai jika permintaan ini bersifat mendesak
				</p>
			</div>
			<Switch
				id="is_urgent"
				bind:checked={formData.is_urgent}
			/>
		</div>
	</CardContent>
</Card>
