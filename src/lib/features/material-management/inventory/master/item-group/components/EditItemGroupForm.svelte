<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import { useUpdateItemGroup } from '../hooks/useItemGroupMutations.svelte';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte';
	import { ITEM_GROUP_TYPE_NAMES } from '../constants/item-group-types';
	import type { ItemGroupItem, UpdateItemGroupRequest } from '../types/item-group.types';

	let {
		open = $bindable(false),
		itemGroup,
		onClose,
		onSuccess
	}: {
		open?: boolean;
		itemGroup: ItemGroupItem | null;
		onClose?: () => void;
		onSuccess?: () => void;
	} = $props();

	let formData = $state<UpdateItemGroupRequest | null>(null);
	let errors = $state<Record<string, string>>({});

	// Popover states
	let valuationTypeOpen = $state(false);
	let frequencyOpen = $state(false);
	let stockAccountOpen = $state(false);
	let stockIssueAccountOpen = $state(false);

	const updateItemGroupMutation = useUpdateItemGroup();

	// Fetch master values for valuation type
	const valuationTypesQuery = useMasterTypeByNameQuery(() => ({
		name: ITEM_GROUP_TYPE_NAMES.VALUATION_TYPE
	}));

	// Fetch master values for frequency of valuation
	const frequencyValuationQuery = useMasterTypeByNameQuery(() => ({
		name: ITEM_GROUP_TYPE_NAMES.FREQUENCY_OF_VALUATION
	}));

	const valuationTypes = $derived(valuationTypesQuery.data?.values || []);
	const frequencyOptions = $derived(frequencyValuationQuery.data?.values || []);

	// Stock account options - sekarang dari data itemGroup yang ada, kedepannya dari API
	const stockAccountOptions = $derived.by(() => {
		if (!itemGroup) return [];
		const options = [];
		if (itemGroup.stock_account_id && itemGroup.stock_account_name) {
			options.push({ id: itemGroup.stock_account_id, name: itemGroup.stock_account_name });
		}
		return options;
	});

	const stockIssueAccountOptions = $derived.by(() => {
		if (!itemGroup) return [];
		const options = [];
		if (itemGroup.stock_issue_account_id && itemGroup.stock_issue_account_name) {
			options.push({
				id: itemGroup.stock_issue_account_id,
				name: itemGroup.stock_issue_account_name
			});
		}
		return options;
	});

	// Selected labels for display
	const selectedValuationTypeLabel = $derived.by(() => {
		if (!formData?.valuation_type_id) return undefined;
		const type = valuationTypes.find((t: any) => t.id === formData!.valuation_type_id);
		return type?.value;
	});

	const selectedFrequencyLabel = $derived.by(() => {
		if (!formData?.frequency_of_valuation_id) return undefined;
		const freq = frequencyOptions.find((f: any) => f.id === formData!.frequency_of_valuation_id);
		return freq?.value;
	});

	const selectedStockAccountLabel = $derived.by(() => {
		if (!formData?.stock_account_id) return undefined;
		const acc = stockAccountOptions.find((a) => a.id === formData!.stock_account_id);
		return acc?.name ?? itemGroup?.stock_account_name;
	});

	const selectedStockIssueAccountLabel = $derived.by(() => {
		if (!formData?.stock_issue_account_id) return undefined;
		const acc = stockIssueAccountOptions.find((a) => a.id === formData!.stock_issue_account_id);
		return acc?.name ?? itemGroup?.stock_issue_account_name;
	});

	$effect(() => {
		if (itemGroup && open) {
			formData = {
				code: itemGroup.code,
				name: itemGroup.name,
				short_name: itemGroup.short_name,
				i_version: itemGroup.i_version,
				valuation_type_id: itemGroup.valuation_type_id,
				frequency_of_valuation_id: itemGroup.frequency_of_valuation_id,
				stock_account_id: itemGroup.stock_account_id,
				stock_issue_account_id: itemGroup.stock_issue_account_id || undefined,
				parent_item_class_id: itemGroup.parent_item_class_id || undefined
			};
			errors = {};
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!formData || !itemGroup) return;

		errors = {};

		if (!formData.valuation_type_id) {
			errors.valuation_type_id = 'Tipe penilaian wajib dipilih';
			return;
		}
		if (!formData.frequency_of_valuation_id) {
			errors.frequency_of_valuation_id = 'Frekuensi penilaian wajib dipilih';
			return;
		}
		if (!formData.stock_account_id) {
			errors.stock_account_id = 'Akun stok wajib dipilih';
			return;
		}

		try {
			await updateItemGroupMutation.mutateAsync({
				uoid: itemGroup.uoid,
				data: formData
			});
			toast.success('Grup barang berhasil diperbarui');
			open = false;
			onSuccess?.();
		} catch (error) {
			console.error('Error updating item group:', error);
			toast.error('Gagal memperbarui grup barang');
		}
	}

	function handleCancel() {
		open = false;
		onClose?.();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] max-w-2xl overflow-y-auto p-4 sm:p-6">
		<Dialog.Header class="space-y-2 sm:space-y-3">
			<Dialog.Title class="text-lg sm:text-xl">Edit Grup Barang</Dialog.Title>
			<Dialog.Description class="text-sm">
				Perbarui informasi grup barang. Simpan untuk menyimpan perubahan.
			</Dialog.Description>
		</Dialog.Header>

		{#if itemGroup && formData}
			<form onsubmit={handleSubmit} class="space-y-4 sm:space-y-6">
				<!-- Row 1: Kode & Nama (read-only) -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<Label>Kode</Label>
						<div class="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
							{formData.code}
						</div>
					</div>
					<div class="space-y-2">
						<Label>Nama</Label>
						<div
							class="truncate rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
						>
							{formData.name}
						</div>
					</div>
				</div>

				<!-- Row 2: Tipe Penilaian & Frekuensi Penilaian (editable) -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<!-- Tipe Penilaian -->
					<div class="space-y-2">
						<Label>Tipe Penilaian</Label>
						<Popover.Root bind:open={valuationTypeOpen}>
							<Popover.Trigger class="w-full">
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={valuationTypeOpen}
									class={cn(
										'w-full justify-between',
										errors.valuation_type_id && 'border-destructive'
									)}
									disabled={valuationTypesQuery.isLoading}
									type="button"
								>
									{selectedValuationTypeLabel || 'Pilih tipe penilaian'}
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[300px] p-0" align="start">
								<Command.Root shouldFilter={true}>
									<Command.Input placeholder="Cari tipe penilaian..." class="h-9" />
									<Command.Empty>
										{valuationTypesQuery.isLoading ? 'Memuat...' : 'Tidak ada data.'}
									</Command.Empty>
									<Command.Group class="max-h-[200px] overflow-auto">
										{#each valuationTypes as type}
											<Command.Item
												value={type.value}
												keywords={[type.value, type.id]}
												onSelect={() => {
													if (formData) formData.valuation_type_id = type.id;
													valuationTypeOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														formData?.valuation_type_id === type.id ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{type.value}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						{#if errors.valuation_type_id}
							<p class="text-sm text-destructive">{errors.valuation_type_id}</p>
						{/if}
					</div>

					<!-- Frekuensi Penilaian -->
					<div class="space-y-2">
						<Label>Frekuensi Penilaian</Label>
						<Popover.Root bind:open={frequencyOpen}>
							<Popover.Trigger class="w-full">
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={frequencyOpen}
									class={cn(
										'w-full justify-between',
										errors.frequency_of_valuation_id && 'border-destructive'
									)}
									disabled={frequencyValuationQuery.isLoading}
									type="button"
								>
									{selectedFrequencyLabel || 'Pilih frekuensi penilaian'}
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[300px] p-0" align="start">
								<Command.Root shouldFilter={true}>
									<Command.Input placeholder="Cari frekuensi penilaian..." class="h-9" />
									<Command.Empty>
										{frequencyValuationQuery.isLoading ? 'Memuat...' : 'Tidak ada data.'}
									</Command.Empty>
									<Command.Group class="max-h-[200px] overflow-auto">
										{#each frequencyOptions as freq}
											<Command.Item
												value={freq.value}
												keywords={[freq.value, freq.id]}
												onSelect={() => {
													if (formData) formData.frequency_of_valuation_id = freq.id;
													frequencyOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														formData?.frequency_of_valuation_id === freq.id
															? 'opacity-100'
															: 'opacity-0'
													)}
												/>
												{freq.value}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						{#if errors.frequency_of_valuation_id}
							<p class="text-sm text-destructive">{errors.frequency_of_valuation_id}</p>
						{/if}
					</div>
				</div>

				<!-- Row 3: Akun Stok & Akun Pengeluaran Stok (editable) -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<!-- Akun Stok -->
					<div class="space-y-2">
						<Label>Akun Stok</Label>
						<Popover.Root bind:open={stockAccountOpen}>
							<Popover.Trigger class="w-full">
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={stockAccountOpen}
									class={cn(
										'w-full justify-between',
										errors.stock_account_id && 'border-destructive'
									)}
									type="button"
								>
									<span class="truncate">
										{selectedStockAccountLabel || 'Pilih akun stok'}
									</span>
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[300px] p-0" align="start">
								<Command.Root shouldFilter={true}>
									<Command.Input placeholder="Cari akun stok..." class="h-9" />
									<Command.Empty>Tidak ada data.</Command.Empty>
									<Command.Group class="max-h-[200px] overflow-auto">
										{#each stockAccountOptions as acc}
											<Command.Item
												value={acc.name}
												keywords={[acc.name, acc.id]}
												onSelect={() => {
													if (formData) formData.stock_account_id = acc.id;
													stockAccountOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														formData?.stock_account_id === acc.id ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{acc.name}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						{#if errors.stock_account_id}
							<p class="text-sm text-destructive">{errors.stock_account_id}</p>
						{/if}
					</div>

					<!-- Akun Pengeluaran Stok -->
					<div class="space-y-2">
						<Label>Akun Pengeluaran Stok</Label>
						<Popover.Root bind:open={stockIssueAccountOpen}>
							<Popover.Trigger class="w-full">
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={stockIssueAccountOpen}
									class="w-full justify-between"
									type="button"
								>
									<span class="truncate">
										{selectedStockIssueAccountLabel || 'Pilih akun pengeluaran stok'}
									</span>
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[300px] p-0" align="start">
								<Command.Root shouldFilter={true}>
									<Command.Input placeholder="Cari akun pengeluaran stok..." class="h-9" />
									<Command.Empty>Tidak ada data.</Command.Empty>
									<Command.Group class="max-h-[200px] overflow-auto">
										{#each stockIssueAccountOptions as acc}
											<Command.Item
												value={acc.name}
												keywords={[acc.name, acc.id]}
												onSelect={() => {
													if (formData) formData.stock_issue_account_id = acc.id;
													stockIssueAccountOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														formData?.stock_issue_account_id === acc.id
															? 'opacity-100'
															: 'opacity-0'
													)}
												/>
												{acc.name}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>
				</div>

				<Dialog.Footer class="flex-col gap-2 sm:flex-row sm:gap-3">
					<Button type="button" variant="outline" onclick={handleCancel} class="w-full sm:w-auto">
						Batal
					</Button>
					<Button
						type="submit"
						disabled={updateItemGroupMutation.isPending}
						class="w-full sm:w-auto"
					>
						{updateItemGroupMutation.isPending ? 'Menyimpan...' : 'Simpan'}
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
