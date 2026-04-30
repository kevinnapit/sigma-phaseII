<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useNationalityForm } from '../../hooks/nationality/use-nationality.svelte';

	type NationalityItem = components['schemas']['KebangsaanItem'];
	type Mode = 'create' | 'edit';

	type Props = {
		open: boolean;
		mode?: Mode;
		nationality?: NationalityItem | null;
	};

	let { open = $bindable(), mode = 'create', nationality = null }: Props = $props();

	const nationalityForm = useNationalityForm(
		() => mode,
		() => nationality
	);

	$effect(() => {
		if (!open) nationalityForm.resetForm();
	});

	const title = $derived(mode === 'edit' ? 'Perbarui Kebangsaan' : 'Tambah Kebangsaan');
	const description = $derived(
		mode === 'edit' ? 'Form edit kebangsaan' : 'Form pembuatan kebangsaan'
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		nationalityForm.submit(() => {
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
			<div class="flex flex-col gap-2">
				<Label>Negara</Label>
				<Select.Root
					type="single"
					bind:value={nationalityForm.form.country_id}
					disabled={nationalityForm.isCountryLoading}
					onValueChange={() => {
						nationalityForm.touchField('country_id');
						nationalityForm.validateField('country_id');
					}}
				>
					<Select.Trigger
						class={cn(
							'h-10 w-full',
							nationalityForm.touched.country_id &&
								nationalityForm.errors.country_id &&
								'border-red-500'
						)}
						placeholder="Pilih Negara"
					>
						{#if nationalityForm.isCountryLoading}
							Memuat data...
						{:else if nationalityForm.form.country_id}
							{nationalityForm.countries.find((c) => c.id === nationalityForm.form.country_id)
								?.value ?? nationalityForm.form.country_id}
						{:else}
							Pilih Negara
						{/if}
					</Select.Trigger>
					<Select.Content class="max-h-60">
						{#each nationalityForm.countries as country (country.id)}
							<Select.Item value={country.id}>{country.value}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				{#if nationalityForm.touched.country_id && nationalityForm.errors.country_id}
					<p class="text-xs text-red-500">{nationalityForm.errors.country_id}</p>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-2">
				<!-- Nama -->
				<div class="flex flex-col gap-2">
					<Label for="gs-name">Nama</Label>
					<Input
						id="gs-name"
						bind:value={nationalityForm.form.name}
						class={cn(
							nationalityForm.touched.name && nationalityForm.errors.name && 'border-red-500'
						)}
						onblur={() => {
							nationalityForm.touchField('name');
							nationalityForm.validateField('name');
						}}
						oninput={() => {
							if (nationalityForm.touched.name) nationalityForm.validateField('name');
						}}
						placeholder="Masukkan nama kebangsaan"
					/>
					{#if nationalityForm.touched.name && nationalityForm.errors.name}
						<p class="text-xs text-red-500">{nationalityForm.errors.name}</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>
				<Button type="submit" disabled={nationalityForm.isPending}>
					{nationalityForm.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
