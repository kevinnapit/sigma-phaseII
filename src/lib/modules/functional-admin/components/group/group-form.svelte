<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import * as Select from '$lib/components/ui/select';
	import { useGroupForm } from '../../hooks/group/use-group.svelte';

	type GroupResponse = components['schemas']['GroupItem'];
	type Mode = 'create' | 'edit';

	type Props = {
		open: boolean;
		mode?: Mode;
		group?: GroupResponse | null;
	};

	let { open = $bindable(), mode = 'create', group = null }: Props = $props();

	const groupForm = useGroupForm(
		() => mode,
		() => group
	);

	$effect(() => {
		if (!open) groupForm.resetForm();
	});

	const title = $derived(mode === 'edit' ? 'Perbarui Grup' : 'Tambah Grup');
	const description = $derived(mode === 'edit' ? 'Form perbarui grup' : 'Form tambah grup');

	function handleSubmit(e: Event) {
		e.preventDefault();
		groupForm.submit(() => {
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
			<div class="grid gap-2">
				<Label>Pilih Perusahaan</Label>
				<Select.Root
					type="single"
					bind:value={groupForm.form.company_id}
					disabled={groupForm.companyListLoading}
				>
					<Select.Trigger class="h-10 w-full" placeholder="Pilih perusahaan">
						{#if groupForm.companyListLoading}
							Memuat data...
						{:else if groupForm.form.company_id}
							{groupForm.companyList.find((p) => p.id === groupForm.form.company_id)?.name ??
								groupForm.form.company_id}
						{:else}
							Pilih Perusahaan
						{/if}
					</Select.Trigger>
					<Select.Content class="max-h-60">
						{#each groupForm.companyList as company (company.id)}
							<Select.Item value={company.id}>{company.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				{#if groupForm.touched.company_id && groupForm.errors.company_id}
					<p class="text-xs text-red-500">{groupForm.errors.company_id}</p>
				{/if}
			</div>
			<div class="grid grid-cols-2 gap-2">
				<!-- Kode -->
				<div class="flex flex-col gap-2">
					<Label for="gs-code">Kode</Label>
					<Input
						id="gs-code"
						bind:value={groupForm.form.code}
						class={cn(groupForm.touched.code && groupForm.errors.code && 'border-red-500')}
						onblur={() => {
							groupForm.touchField('code');
							groupForm.validateField('code');
						}}
						oninput={() => {
							if (groupForm.touched.code) groupForm.validateField('code');
						}}
						placeholder="Masukkan Kode Grup"
					/>
					{#if groupForm.touched.code && groupForm.errors.code}
						<p class="text-xs text-red-500">{groupForm.errors.code}</p>
					{/if}
				</div>

				<!-- Nama -->
				<div class="flex flex-col gap-2">
					<Label for="gs-name">Nama</Label>
					<Input
						id="gs-name"
						bind:value={groupForm.form.name}
						class={cn(groupForm.touched.name && groupForm.errors.name && 'border-red-500')}
						onblur={() => {
							groupForm.touchField('name');
							groupForm.validateField('name');
						}}
						oninput={() => {
							if (groupForm.touched.name) groupForm.validateField('name');
						}}
						placeholder="Masukkan Nama Grup"
					/>
					{#if groupForm.touched.name && groupForm.errors.name}
						<p class="text-xs text-red-500">{groupForm.errors.name}</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>
				<Button type="submit" disabled={groupForm.isPending}>
					{groupForm.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
