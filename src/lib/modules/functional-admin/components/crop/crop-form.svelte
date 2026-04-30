<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useCropForm } from '../../hooks/crop/use-crop.svelte';

	type Crop = components['schemas']['CropItem'];
	type Mode = 'create' | 'edit';

	type Props = {
		open: boolean;
		mode?: Mode;
		crops?: Crop | null;
	};

	let { open = $bindable(), mode = 'create', crops = null }: Props = $props();

	const cropForm = useCropForm(
		() => mode,
		() => crops
	);

	$effect(() => {
		if (!open) cropForm.resetForm();
	});

	const title = $derived(mode === 'edit' ? 'Perbarui data penenan' : 'Tambah data panenan');
	const description = $derived(
		mode === 'edit' ? 'Form perbarui data panenan' : 'Form tambah data panenan'
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		cropForm.submit(() => {
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
			<div class="grid grid-cols-1 gap-4">
				<!-- Kode -->
				<div class="flex flex-col gap-2">
					<Label for="crop-code">Kode</Label>
					<Input
						type="number"
						id="crop-code"
						bind:value={cropForm.form.code}
						class={cn(cropForm.touched.code && cropForm.errors.code && 'border-red-500')}
						onblur={() => {
							cropForm.touchField('code');
							cropForm.validateField('code');
						}}
						oninput={() => {
							if (cropForm.touched.code) cropForm.validateField('code');
						}}
						placeholder="Masukkan Kode Panenan"
					/>
					{#if cropForm.touched.code && cropForm.errors.code}
						<p class="text-xs text-red-500">{cropForm.errors.code}</p>
					{/if}
				</div>

				<!-- Nama -->
				<div class="flex flex-col gap-2">
					<Label for="crop-value">Nama Panenan</Label>
					<Input
						id="crop-value"
						bind:value={cropForm.form.value}
						class={cn(cropForm.touched.value && cropForm.errors.value && 'border-red-500')}
						onblur={() => {
							cropForm.touchField('value');
							cropForm.validateField('value');
						}}
						oninput={() => {
							if (cropForm.touched.value) cropForm.validateField('value');
						}}
						placeholder="Masukkan Nama Panenan"
					/>
					{#if cropForm.touched.value && cropForm.errors.value}
						<p class="text-xs text-red-500">{cropForm.errors.value}</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>
				<Button type="submit" disabled={cropForm.isPending}>
					{cropForm.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
