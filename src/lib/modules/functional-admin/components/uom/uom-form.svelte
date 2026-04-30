<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useUomForm } from '../../hooks/uom/use-uom.svelte';

	type UomResponse = components['schemas']['UOMItem'];
	type Mode = 'create' | 'edit';

	type Props = {
		open: boolean;
		mode?: Mode;
		uom?: UomResponse | null;
	};

	let { open = $bindable(), mode = 'create', uom = null }: Props = $props();

	const growthStageForm = useUomForm(
		() => mode,
		() => uom
	);

	$effect(() => {
		if (!open) growthStageForm.resetForm();
	});

	const title = $derived(mode === 'edit' ? 'Perbarui Satuan Ukuran' : 'Tambah Satuan Ukuran');
	const description = $derived(
		mode === 'edit' ? 'Form edit tahap pertumbuhan' : 'Form pembuatan tahap pertumbuhan'
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		growthStageForm.submit(() => {
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
			<div class="grid grid-cols-1 gap-2">
				<!-- Kode -->
				<div class="flex flex-col gap-2">
					<Label for="gs-code">Kode</Label>
					<Input
						id="gs-code"
						bind:value={growthStageForm.form.code}
						class={cn(
							growthStageForm.touched.code && growthStageForm.errors.code && 'border-red-500'
						)}
						onblur={() => {
							growthStageForm.touchField('code');
							growthStageForm.validateField('code');
						}}
						oninput={() => {
							if (growthStageForm.touched.code) growthStageForm.validateField('code');
						}}
						placeholder="Masukkan kode growth stage"
					/>
					{#if growthStageForm.touched.code && growthStageForm.errors.code}
						<p class="text-xs text-red-500">{growthStageForm.errors.code}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-1 gap-2">
				<!-- Nama -->
				<div class="flex flex-col gap-2">
					<Label for="gs-name">Nama</Label>
					<Input
						id="gs-name"
						bind:value={growthStageForm.form.name}
						class={cn(
							growthStageForm.touched.name && growthStageForm.errors.name && 'border-red-500'
						)}
						onblur={() => {
							growthStageForm.touchField('name');
							growthStageForm.validateField('name');
						}}
						oninput={() => {
							if (growthStageForm.touched.name) growthStageForm.validateField('name');
						}}
						placeholder="Masukkan nama growth stage"
					/>
					{#if growthStageForm.touched.name && growthStageForm.errors.name}
						<p class="text-xs text-red-500">{growthStageForm.errors.name}</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>
				<Button type="submit" disabled={growthStageForm.isPending}>
					{growthStageForm.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
