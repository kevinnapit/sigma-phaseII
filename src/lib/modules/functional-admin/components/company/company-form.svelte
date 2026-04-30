<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useCompanyForm } from '../../hooks/company/use-company.svelte';
	import * as Switch from '$lib/components/ui/switch';

	type Company = components['schemas']['CompanyItem'];
	type Mode = 'create' | 'edit';

	type Props = {
		open: boolean;
		mode?: Mode;
		company?: Company | null;
	};

	let { open = $bindable(), mode = 'create', company = null }: Props = $props();

	const companyForm = useCompanyForm(
		() => mode,
		() => company
	);

	$effect(() => {
		if (!open) companyForm.resetForm();
	});

	const title = $derived(mode === 'edit' ? 'Perbarui Data Perusahaan' : 'Tambah Data Perusahaan');
	const description = $derived(
		mode === 'edit' ? 'Form edit data perusahaan' : 'Form pembuatan data perusahaan'
	);

	function getBoolLabel(val: boolean | null) {
		if (val === true) return 'Ya';
		if (val === false) return 'Tidak';
		return 'Tidak';
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		companyForm.submit(() => {
			open = false;
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-xl">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>

		<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
			<div class="grid grid-cols-2 gap-2">
				<!-- Kode -->
				<div class="flex flex-col gap-2">
					<Label for="company-code">Kode Perusahaan</Label>
					<Input
						id="company-code"
						bind:value={companyForm.form.code}
						class={cn(companyForm.touched.code && companyForm.errors.code && 'border-red-500')}
						onblur={() => {
							companyForm.touchField('code');
							companyForm.validateField('code');
						}}
						oninput={() => {
							if (companyForm.touched.code) companyForm.validateField('code');
						}}
						placeholder="Masukkan kode perusahaan"
					/>
					{#if companyForm.touched.code && companyForm.errors.code}
						<p class="text-xs text-red-500">{companyForm.errors.code}</p>
					{/if}
				</div>

				<!-- Nama -->
				<div class="flex flex-col gap-2">
					<Label for="company-name">Nama Perusahaan</Label>
					<Input
						id="company-name"
						bind:value={companyForm.form.name}
						class={cn(companyForm.touched.name && companyForm.errors.name && 'border-red-500')}
						onblur={() => {
							companyForm.touchField('name');
							companyForm.validateField('name');
						}}
						oninput={() => {
							if (companyForm.touched.name) companyForm.validateField('name');
						}}
						placeholder="Masukkan nama perusahaan"
					/>
					{#if companyForm.touched.name && companyForm.errors.name}
						<p class="text-xs text-red-500">{companyForm.errors.name}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-1 gap-2">
				<div class="flex flex-col gap-2">
					<Label>Apakah perusahaan merupakan pihak eksternal?</Label>
					<div class="flex items-center gap-2">
						<Switch.Root
							checked={companyForm.form.is_external === true}
							onCheckedChange={(v) => {
								companyForm.form.is_external = v ? true : false;
								companyForm.touchField('is_external');
								companyForm.validateField('is_external');
							}}
						/>
						<span class="text-sm">{getBoolLabel(companyForm.form.is_external)}</span>
					</div>
				</div>
				{#if companyForm.touched.is_external && companyForm.errors.is_external}
					<p class="text-xs text-red-500">{companyForm.errors.is_external}</p>
				{/if}
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>
				<Button type="submit" disabled={companyForm.isPending}>
					{companyForm.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
