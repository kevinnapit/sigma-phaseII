<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { Package, Loader2 } from 'lucide-svelte';
	import { useCreateItemCodeRequest } from '$lib/features/material-management/inventory/master/item-code-request/hooks/useItemCodeRequestMutations.svelte';
	import { usePurchasingGroups } from '$lib/features/material-management/inventory/transaction/purchase-request/hooks/usePurchaseRequestQueries.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const createMutation = useCreateItemCodeRequest();
	const purchasingGroupsQuery = usePurchasingGroups();
	
	const purchasingGroups = $derived(purchasingGroupsQuery.data?.data || []);

	let formData = $state({
		item_name: '',
		description: '',
		uom: '',
		department_destination: ''
	});
	
	let selectedDepartmentId = $state('');

	let errors = $state<Record<string, string>>({});

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.item_name.trim()) {
			newErrors.item_name = 'Nama barang wajib diisi';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Deskripsi wajib diisi';
		}

		if (!formData.uom.trim()) {
			newErrors.uom = 'Satuan wajib diisi';
		}

		if (!selectedDepartmentId) {
			newErrors.department_destination = 'Departemen tujuan wajib dipilih';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			toast.error('Mohon lengkapi semua field yang wajib diisi');
			return;
		}

		// Get department name from selected ID
		const selectedDepartment = purchasingGroups.find((g) => g.uoid === selectedDepartmentId);
		const departmentName = selectedDepartment ? `${selectedDepartment.code} - ${selectedDepartment.name}` : '';

		try {
			await createMutation.mutateAsync({
				...formData,
				department_destination: departmentName
			});
			handleClose();
		} catch (error) {
			// Error handled by mutation
		}
	}

	function handleClose() {
		open = false;
		// Reset form
		formData = {
			item_name: '',
			description: '',
			uom: '',
			department_destination: ''
		};
		selectedDepartmentId = '';
		errors = {};
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Package class="h-5 w-5" />
				Permintaan Kode Barang Baru
			</Dialog.Title>
			<Dialog.Description>
				Ajukan permintaan untuk barang yang belum memiliki kode. Tim akan memproses dan memberikan
				kode barang baru.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- Nama Barang -->
			<div class="space-y-2">
				<Label for="item_name">
					Nama Barang <span class="text-destructive">*</span>
				</Label>
				<Input
					id="item_name"
					bind:value={formData.item_name}
					placeholder="Contoh: Laptop Dell Latitude 5420"
					disabled={createMutation.isPending}
				/>
				{#if errors.item_name}
					<p class="text-sm text-destructive">{errors.item_name}</p>
				{/if}
			</div>

			<!-- Deskripsi -->
			<div class="space-y-2">
				<Label for="description">
					Deskripsi <span class="text-destructive">*</span>
				</Label>
				<Textarea
					id="description"
					bind:value={formData.description}
					placeholder="Jelaskan spesifikasi atau detail barang yang dibutuhkan..."
					rows={4}
					disabled={createMutation.isPending}
				/>
				{#if errors.description}
					<p class="text-sm text-destructive">{errors.description}</p>
				{/if}
			</div>

			<!-- Satuan -->
			<div class="space-y-2">
				<Label for="uom">
					Satuan (UOM) <span class="text-destructive">*</span>
				</Label>
				<Input
					id="uom"
					bind:value={formData.uom}
					placeholder="Contoh: UNIT, PCS, KG, LITER"
					disabled={createMutation.isPending}
				/>
				{#if errors.uom}
					<p class="text-sm text-destructive">{errors.uom}</p>
				{/if}
			</div>

			<!-- Departemen Tujuan -->
			<div class="space-y-2">
				<Label for="department_destination">
					Departemen Tujuan <span class="text-destructive">*</span>
				</Label>
				{#if purchasingGroupsQuery.isLoading}
					<div class="flex items-center justify-center py-4">
						<div class="text-center">
							<Loader2 class="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
							<p class="mt-2 text-sm text-muted-foreground">Memuat departemen...</p>
						</div>
					</div>
				{:else}
					<Select.Root type="single" bind:value={selectedDepartmentId}>
						<Select.Trigger
							class="w-full {errors.department_destination ? 'border-destructive' : ''}"
							disabled={createMutation.isPending}
						>
							{#if selectedDepartmentId && purchasingGroups.find((g) => g.uoid === selectedDepartmentId)}
								{@const selected = purchasingGroups.find((g) => g.uoid === selectedDepartmentId)}
								{selected.code} - {selected.name}
							{:else}
								Pilih departemen tujuan
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
					{#if errors.department_destination}
						<p class="text-sm text-destructive">{errors.department_destination}</p>
					{/if}
				{/if}
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={handleClose} disabled={createMutation.isPending}>Batal</Button>
			<Button onclick={handleSubmit} disabled={createMutation.isPending}>
				{#if createMutation.isPending}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Mengirim...
				{:else}
					Kirim Permintaan
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
