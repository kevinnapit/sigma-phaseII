<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { useCreateRoleMutation } from '$lib/modules/system-admin/queries/useRoleMutation.svelte';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from 'lucide-svelte';
	import { roleSchema } from '../schemas/role.schemas';

	let { open = $bindable(false), onSuccess }: { open: boolean; onSuccess?: () => Promise<void> } =
		$props();

	const createRoleMutation = useCreateRoleMutation({
		onSuccess: async () => {
			toast.success('Peran berhasil dibuat');
			open = false;
			resetForm();
			await onSuccess?.();
		},
		onError: () => {
			toast.error('Gagal membuat peran');
		}
	});

	// Form state
	type FormFields = 'name' | 'description';

	let name = $state('');
	let description = $state('');
	let errors = $state<Partial<Record<FormFields, string>>>({});
	let touched = $state<Partial<Record<FormFields, boolean>>>({});

	function buildPayload() {
		return { name, description, parent_id: 1 };
	}

	function validateField(field: FormFields) {
		const result = roleSchema.safeParse(buildPayload());
		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			errors[field] = (fieldErrors as Record<string, string[] | undefined>)[field]?.[0];
		} else {
			errors[field] = undefined;
		}
	}

	function handleBlur(field: FormFields) {
		touched[field] = true;
		validateField(field);
	}

	function validateAll(): boolean {
		const result = roleSchema.safeParse(buildPayload());
		if (!result.success) {
			const fe = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
			errors = {
				name: fe.name?.[0],
				description: fe.description?.[0]
			};
			touched = { name: true, description: true };
			return false;
		}
		errors = {};
		return true;
	}

	function resetForm() {
		name = '';
		description = '';
		errors = {};
		touched = {};
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validateAll()) return;

		await createRoleMutation.mutateAsync({
			name,
			description,
			parent_id: 1
		});
	}

	$effect(() => {
		if (open) resetForm();
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-106.25">
		<Dialog.Header>
			<Dialog.Title>Tambah Peran</Dialog.Title>
			<Dialog.Description>Tambah peran baru ke sistem.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="flex flex-col gap-6">
			<!-- Name Field -->
			<div class="flex flex-col gap-2">
				<Label>Nama Peran <span class="text-red-500">*</span></Label>
				<Input
					id="name"
					placeholder="Contoh: Admin, Supervisor"
					value={name}
					oninput={(e) => {
						name = e.currentTarget.value;
						if (touched.name) validateField('name');
					}}
					onblur={() => handleBlur('name')}
				/>
				{#if touched.name && errors.name}
					<p class="text-xs text-red-500">{errors.name}</p>
				{/if}
			</div>

			<!-- Description Field -->
			<div class="flex flex-col gap-2">
				<Label>Deskripsi</Label>
				<Textarea
					id="description"
					placeholder="Deskripsi peran (opsional)"
					value={description}
					oninput={(e) => {
						description = e.currentTarget.value;
						if (touched.description) validateField('description');
					}}
					onblur={() => handleBlur('description')}
				/>
				{#if touched.description && errors.description}
					<p class="text-xs text-red-500">{errors.description}</p>
				{/if}
			</div>

			<Dialog.Footer>
				<Button
					type="button"
					variant="outline"
					onclick={() => (open = false)}
					disabled={createRoleMutation.isPending}
				>
					Batal
				</Button>
				<Button type="submit" disabled={createRoleMutation.isPending}>
					{#if createRoleMutation.isPending}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Menyimpan...
					{:else}
						Buat Peran
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
