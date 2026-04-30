<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { useCreateLocalVendor } from '../hooks/useVendorsLocalMutations.svelte';
	import { useAllAccountsQuery } from '../hooks/useDetailedVendorsQueries.svelte.js';
	import { useMasterTypeByNameQuery } from '$lib/modules/functional-admin/index.svelte.js';
	import { PARTY_TYPE_ID } from '../constants/vendor-types';
	import {
		createVendorLocalSchema,
		type CreateVendorLocalSchema
	} from '../schemas/create-vendor.schema';
	import type { CreateLocalVendorRequest } from '../types/vendor-local.types';
	import SearchableCombobox from '$lib/components/shared/SearchableCombobox.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let formData = $state<CreateVendorLocalSchema>({
		code: '',
		name: '',
		short_name: '',
		company_name: '',
		license_registration_number: '',
		notes: '',
		is_active: true,
		fk_party_default_category_id: '',
		fk_default_account_id: ''
	});

	let errors = $state<Record<string, string>>({});
	let createdVendorId = $state<string | null>(null);
	let showSuccessDialog = $state(false);
	let categoryOpen = $state(false);
	let accountSearch = $state('');

	const categoriesQuery = useMasterTypeByNameQuery(() => ({
		name: PARTY_TYPE_ID
	}));
	const categories = $derived(categoriesQuery.data?.values || []);
	const selectedCategory = $derived(
		categories.find((c) => c.id === formData.fk_party_default_category_id)
	);

	const accountsQuery = useAllAccountsQuery(() => accountSearch);
	const accounts = $derived(
		(accountsQuery.data?.data || []).map((a) => ({ uoid: a.id, name: `${a.code} - ${a.name}` }))
	);

	const createMutation = useCreateLocalVendor();

	$effect(() => {
		if (open) {
			resetForm();
		}
	});

	function handleSubmit() {
		errors = {};

		const validation = createVendorLocalSchema.safeParse(formData);
		if (!validation.success) {
			validation.error.issues.forEach((issue) => {
				if (issue.path[0]) {
					errors[issue.path[0] as string] = issue.message;
				}
			});
			toast.error('Mohon lengkapi semua field yang wajib diisi');
			return;
		}

		const requestData: CreateLocalVendorRequest = validation.data;

		createMutation.mutate(requestData, {
			onSuccess: (response) => {
				toast.success('Vendor berhasil ditambahkan');
				createdVendorId = response.uoid;
				resetForm();
				open = false;
				// Delay to ensure dialog is closed before showing success dialog
				setTimeout(() => {
					showSuccessDialog = true;
				}, 100);
			},
			onError: (error) => {
				toast.error(`Gagal menambahkan vendor: ${error.message}`);
			}
		});
	}

	function resetForm() {
		formData = {
			code: '',
			name: '',
			short_name: '',
			company_name: '',
			license_registration_number: '',
			notes: '',
			is_active: true,
			fk_party_default_category_id: '',
			fk_default_account_id: ''
		};
		errors = {};
	}

	function handleGoToDetail() {
		if (createdVendorId) {
			showSuccessDialog = false;
			goto(`/dashboard/material-management/inventory/master/vendor/local/${createdVendorId}`);
		}
	}

	function handleClose() {
		if (!createMutation.isPending) {
			open = false;
			resetForm();
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={handleClose}>
	<Dialog.Content class="max-h-[90vh] max-w-2xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Tambah Vendor Lokal</Dialog.Title>
			<Dialog.Description>Isi form di bawah untuk menambahkan vendor lokal baru</Dialog.Description>
		</Dialog.Header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-4"
		>
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="name">
						Nama <span class="text-red-500">*</span>
					</Label>
					<Input
						id="name"
						bind:value={formData.name}
						placeholder="Masukkan nama vendor"
						disabled={createMutation.isPending}
					/>
					{#if errors.name}
						<p class="text-xs text-red-500">{errors.name}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="short_name">
						Nama Singkat <span class="text-red-500">*</span>
					</Label>
					<Input
						id="short_name"
						bind:value={formData.short_name}
						placeholder="Masukkan nama singkat"
						disabled={createMutation.isPending}
					/>
					{#if errors.short_name}
						<p class="text-xs text-red-500">{errors.short_name}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="company_name">
						Nama Perusahaan <span class="text-red-500">*</span>
					</Label>
					<Input
						id="company_name"
						bind:value={formData.company_name}
						placeholder="Masukkan nama perusahaan"
						disabled={createMutation.isPending}
					/>
					{#if errors.company_name}
						<p class="text-xs text-red-500">{errors.company_name}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="category">
						Kategori Standar <span class="text-red-500">*</span>
					</Label>
					<Popover.Root bind:open={categoryOpen}>
						<Popover.Trigger class="w-full">
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={categoryOpen}
								class="w-full justify-between"
								disabled={createMutation.isPending || categoriesQuery.isLoading}
								type="button"
							>
								{selectedCategory?.value || 'Pilih kategori'}
								<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-[400px] p-0" align="start">
							<Command.Root shouldFilter={true}>
								<Command.Input placeholder="Cari kategori..." class="h-9" />
								<Command.Empty>
									{categoriesQuery.isLoading ? 'Memuat...' : 'Tidak ada kategori ditemukan.'}
								</Command.Empty>
								<Command.Group class="max-h-[200px] overflow-auto">
									{#if categories.length > 0}
										{#each categories as category}
											<Command.Item
												value={category.value}
												onSelect={() => {
													formData.fk_party_default_category_id = category.id;
													categoryOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														formData.fk_party_default_category_id === category.id
															? 'opacity-100'
															: 'opacity-0'
													)}
												/>
												{category.value}
											</Command.Item>
										{/each}
									{/if}
								</Command.Group>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
					{#if errors.fk_party_default_category_id}
						<p class="text-xs text-red-500">{errors.fk_party_default_category_id}</p>
					{/if}
				</div>

				<div class="space-y-2 md:col-span-2">
					<Label for="account">
						Akun Default <span class="text-red-500">*</span>
					</Label>
					<SearchableCombobox
						bind:value={formData.fk_default_account_id}
						items={accounts}
						isLoading={accountsQuery.isLoading}
						onSearchChange={(s) => (accountSearch = s)}
						placeholder="Pilih akun"
						searchPlaceholder="Cari kode atau nama akun..."
						disabled={createMutation.isPending}
					/>
					{#if errors.fk_default_account_id}
						<p class="text-xs text-red-500">{errors.fk_default_account_id}</p>
					{/if}
				</div>

				<div class="space-y-2 md:col-span-2">
					<Label for="license">No. Lisensi/Registrasi</Label>
					<Input
						id="license"
						bind:value={formData.license_registration_number}
						placeholder="Masukkan nomor lisensi"
						disabled={createMutation.isPending}
					/>
					{#if errors.license_registration_number}
						<p class="text-xs text-red-500">{errors.license_registration_number}</p>
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<Label for="notes">Catatan</Label>
				<Textarea
					id="notes"
					bind:value={formData.notes}
					placeholder="Masukkan catatan (opsional)"
					rows={3}
					disabled={createMutation.isPending}
				/>
				{#if errors.notes}
					<p class="text-xs text-red-500">{errors.notes}</p>
				{/if}
			</div>

			<div class="flex items-center space-x-2">
				<Switch
					id="is_active"
					bind:checked={formData.is_active}
					disabled={createMutation.isPending}
				/>
				<Label for="is_active">Vendor Aktif</Label>
			</div>

			<Dialog.Footer class="sm:gap-3">
				<Button
					type="button"
					variant="outline"
					onclick={handleClose}
					disabled={createMutation.isPending}
				>
					Batal
				</Button>
				<Button
					type="submit"
					disabled={createMutation.isPending}
					class="bg-[#0f4c2a] hover:bg-[#0d4023]"
				>
					{createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={showSuccessDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Vendor Berhasil Ditambahkan</AlertDialog.Title>
			<AlertDialog.Description>
				Silakan isi detail alamat dan data lainnya untuk melengkapi informasi vendor.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={() => (showSuccessDialog = false)}>Nanti</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleGoToDetail} class="bg-[#0f4c2a] hover:bg-[#0d4023]">
				Isi Detail Sekarang
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
