<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import { useCreateUserMutation } from '../queries/useUserMutation.svelte';
	import { useUserForm } from '../hooks/use-user.svelte';

	type RoleItem = Schemas['RoleResponse'];

	let { open = $bindable(false), roles = [] }: { open?: boolean; roles?: RoleItem[] } = $props();

	const { form, touched, errors, reset, touchAndValidate, validateAll, setFieldError } =
		useUserForm();

	const mutation = useCreateUserMutation({
		onSuccess: ({ error }) => {
			if (error) {
				toast.error((error as { detail?: string }).detail || 'Gagal membuat pengguna');
				return;
			}
			toast.success('Pengguna berhasil dibuat');
			open = false;
		},
		onError: (error) => {
			const err = error as { status?: number };
			if (err.status === 409) {
				setFieldError('userId', 'ID pengguna sudah terdaftar dalam sistem');
				return;
			}
			toast.error('Terjadi kesalahan yang tidak terduga');
		}
	});

	$effect(() => {
		if (!open) reset();
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!validateAll()) return;
		mutation.mutate({
			user_id: form.userId,
			name: form.name,
			role_id: Number(form.roleId)
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-xl">
		<Dialog.Header>
			<Dialog.Title>Tambah Pengguna</Dialog.Title>
			<Dialog.Description
				>Isi form berikut untuk menambahkan pengguna baru ke sistem.</Dialog.Description
			>
		</Dialog.Header>

		<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
			<!-- User ID -->
			<div class="flex flex-col gap-2">
				<Label for="user_id">ID Pengguna</Label>
				<Input
					id="user_id"
					bind:value={form.userId}
					class={cn(touched.userId && errors.userId && 'border-red-500')}
					placeholder="Contoh: SOCFIN-ID\Nama"
					onblur={() => touchAndValidate('userId')}
					oninput={() => {
						if (touched.userId) touchAndValidate('userId');
					}}
				/>
				{#if touched.userId && errors.userId}
					<p class="text-xs text-red-500">{errors.userId}</p>
				{/if}
			</div>

			<!-- Nama -->
			<div class="flex flex-col gap-2">
				<Label for="name">Nama Pengguna</Label>
				<Input
					id="name"
					bind:value={form.name}
					class={cn(touched.name && errors.name && 'border-red-500')}
					placeholder="Masukkan Nama Pengguna"
					onblur={() => touchAndValidate('name')}
					oninput={() => {
						if (touched.name) touchAndValidate('name');
					}}
				/>
				{#if touched.name && errors.name}
					<p class="text-xs text-red-500">{errors.name}</p>
				{/if}
			</div>

			<!-- Peran -->
			<div class="flex flex-col gap-2">
				<Label for="role">Peran</Label>
				<Select.Root
					type="single"
					bind:value={form.roleId}
					onValueChange={() => touchAndValidate('roleId')}
				>
					<Select.Trigger
						id="role"
						class={cn('w-full', touched.roleId && errors.roleId && 'border-red-500')}
					>
						{roles.find((r) => String(r.id) === form.roleId)?.name ?? 'Pilih Peran Pengguna'}
					</Select.Trigger>
					<Select.Content>
						{#each roles as role (role.id)}
							<Select.Item value={String(role.id)} label={role.name}>{role.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				{#if touched.roleId && errors.roleId}
					<p class="text-xs text-red-500">{errors.roleId}</p>
				{/if}
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>
				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
