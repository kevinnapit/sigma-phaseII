<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Badge } from '$lib/components/ui/badge';
	import * as Select from '$lib/components/ui/select';
	import { ArrowRight, Building2, Calendar, FileText, AlertCircle } from 'lucide-svelte';
	import { usePurchasingGroups } from '../../hooks/usePurchaseRequestQueries.svelte';

	let {
		selectedDepartmentId = $bindable(''),
		warehouseName = $bindable(''),
		staffName = $bindable(''),
		referenceNumber = $bindable(''),
		requiredDate = $bindable(''),
		justification = $bindable(''),
		isUrgent = $bindable(false),
		onNext
	}: {
		selectedDepartmentId?: string;
		warehouseName?: string;
		staffName?: string;
		referenceNumber?: string;
		requiredDate?: string;
		justification?: string;
		isUrgent?: boolean;
		onNext: () => void;
	} = $props();

	let errors = $state<Record<string, string>>({});

	// Set default date to today
	$effect(() => {
		if (!requiredDate) {
			const today = new Date();
			requiredDate = today.toISOString().split('T')[0];
		}
	});

	// TODO: Get warehouse and staff from user context
	// For now, set dummy data
	$effect(() => {
		if (!warehouseName) {
			warehouseName = 'GUDANG'; // TODO: Get from user context
		}
		if (!staffName) {
			staffName = 'socfin-id\\farhank'; // TODO: Get from user context
		}
	});

	// Query for purchasing groups (departments)
	const purchasingGroupsQuery = usePurchasingGroups(() => true);
	const purchasingGroups = $derived(purchasingGroupsQuery.data?.data || []);

	function handleNext() {
		errors = {};

		// Validation
		if (!selectedDepartmentId) {
			errors.department = 'Departemen tujuan wajib dipilih';
		}

		if (!requiredDate) {
			errors.required_date = 'Tanggal dibutuhkan wajib diisi';
		}

		if (!justification || justification.trim().length < 10) {
			errors.justification = 'Justifikasi minimal 10 karakter';
		}

		if (Object.keys(errors).length > 0) {
			return;
		}

		onNext();
	}

	const selectedDepartment = $derived(
		purchasingGroups.find((g) => g.uoid === selectedDepartmentId)
	);
</script>

<div class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>Formulir Permintaan Barang</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Info Box -->
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-3">
				<div class="flex gap-2">
					<AlertCircle class="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
					<div>
						<p class="text-xs font-medium text-blue-900">
							Permintaan Banyak Item - Kantor Pusat
						</p>
						<p class="text-xs text-blue-700 mt-0.5">
							Fitur ini untuk permintaan multiple items sekaligus ke 1 departemen yang sama.
						</p>
					</div>
				</div>
			</div>

			<!-- Gudang Saat Ini (Read-only) -->
			<div class="space-y-2">
				<Label>Gudang Saat Ini</Label>
				<Input value={warehouseName} readonly class="bg-muted" />
			</div>

			<!-- Staff Peminta (Read-only) -->
			<div class="space-y-2">
				<Label>
					Staff Peminta <span class="text-red-500">*</span>
				</Label>
				<Input value={staffName} readonly class="bg-muted" />
			</div>

			<!-- Nomor Referensi (Optional) -->
			<div class="space-y-2">
				<Label>Nomor Referensi</Label>
				<Input
					bind:value={referenceNumber}
					placeholder="Masukkan nomor referensi (opsional)"
					maxlength="20"
				/>
				<p class="text-xs text-muted-foreground">{referenceNumber.length}/20 karakter</p>
			</div>

			<!-- Department Selection -->
			<div class="space-y-2">
				<Label>
					Departemen Tujuan <span class="text-red-500">*</span>
				</Label>
				{#if purchasingGroupsQuery.isLoading}
					<div class="flex items-center justify-center py-4">
						<div class="text-center">
							<div
								class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
							></div>
							<p class="mt-2 text-xs text-muted-foreground">Memuat departemen...</p>
						</div>
					</div>
				{:else}
					<Select.Root type="single" bind:value={selectedDepartmentId}>
						<Select.Trigger class="w-full {errors.department ? 'border-red-500' : ''}">
							{#if selectedDepartment}
								{selectedDepartment.code} - {selectedDepartment.name}
							{:else}
								Pilih departemen tujuan...
							{/if}
						</Select.Trigger>
						<Select.Content>
							{#each purchasingGroups as group}
								<Select.Item value={group.uoid}>
									{group.code} - {group.name}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if errors.department}
						<p class="text-xs text-red-600">{errors.department}</p>
					{/if}
				{/if}
			</div>

			<!-- Tanggal -->
			<div class="space-y-2">
				<Label>Tanggal</Label>
				<Input
					type="date"
					bind:value={requiredDate}
					class={errors.required_date ? 'border-red-500' : ''}
				/>
				{#if errors.required_date}
					<p class="text-xs text-red-600">{errors.required_date}</p>
				{/if}
			</div>

			<!-- Keterangan -->
			<div class="space-y-2">
				<Label>Keterangan</Label>
				<Textarea
					bind:value={justification}
					placeholder="Tambahkan keterangan atau catatan permintaan..."
					rows={4}
					maxlength="500"
					class={errors.justification ? 'border-red-500' : ''}
				/>
				<p class="text-xs text-muted-foreground">{justification.length}/500 karakter</p>
				{#if errors.justification}
					<p class="text-xs text-red-600">{errors.justification}</p>
				{/if}
			</div>

			<!-- Urgent Request -->
			<div class="flex items-center justify-between rounded-lg border p-3">
				<div class="space-y-0.5">
					<Label>Permintaan Darurat</Label>
					<p class="text-xs text-muted-foreground">
						Aktifkan jika ini adalah prioritas tinggi
					</p>
				</div>
				<Switch bind:checked={isUrgent} />
			</div>
		</CardContent>
	</Card>

	<!-- Navigation Button -->
	<div class="flex justify-end">
		<Button onclick={handleNext} size="lg" class="w-full sm:w-auto">
			Lanjut Pilih Barang
			<ArrowRight class="ml-2 h-4 w-4" />
		</Button>
	</div>
</div>
