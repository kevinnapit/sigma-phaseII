<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
	import { useProjectForm } from '../../hooks/project/use-project.svelte';
	import { CalendarDays } from 'lucide-svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { formatDate } from '$lib/shared/utils';

	type ProjectItem = components['schemas']['ProjectItem'];
	type Mode = 'create' | 'edit';

	type Props = {
		open: boolean;
		mode?: Mode;
		project?: ProjectItem | null;
	};

	let { open = $bindable(), mode = 'create', project = null }: Props = $props();

	const projectForm = useProjectForm(
		() => mode,
		() => project
	);

	$effect(() => {
		if (!open) projectForm.resetForm();
	});

	const title = $derived(mode === 'edit' ? 'Perbarui Proyek' : 'Tambah Proyek');
	const description = $derived(mode === 'edit' ? 'Form edit proyek' : 'Form pembuatan proyek');

	function handleSubmit(e: Event) {
		e.preventDefault();

		projectForm.submit(() => {
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
				<!-- Code -->
				<div class="flex flex-col gap-2">
					<Label for="project-code">Kode Proyek</Label>
					<Input
						id="project-code"
						bind:value={projectForm.form.code}
						class={cn(projectForm.touched.code && projectForm.errors.code && 'border-red-500')}
						onblur={() => {
							projectForm.touchField('code');
							projectForm.validateField('code');
						}}
						placeholder="Masukkan kode proyek"
					/>
					{#if projectForm.touched.code && projectForm.errors.code}
						<p class="text-xs text-red-500">{projectForm.errors.code}</p>
					{/if}
				</div>

				<!-- Nama -->
				<div class="flex flex-col gap-2">
					<Label for="project-name">Nama Proyek</Label>
					<Input
						id="project-name"
						bind:value={projectForm.form.name}
						class={cn(projectForm.touched.name && projectForm.errors.name && 'border-red-500')}
						onblur={() => {
							projectForm.touchField('name');
							projectForm.validateField('name');
						}}
						placeholder="Masukkan nama proyek"
					/>
					{#if projectForm.touched.name && projectForm.errors.name}
						<p class="text-xs text-red-500">{projectForm.errors.name}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<!-- Admin Unit -->
				<div class="flex flex-col gap-2">
					<Label>Administrative Unit</Label>
					<Select.Root
						type="single"
						bind:value={projectForm.form.admin_unit_id}
						disabled={projectForm.isAdminUnitLoading}
						onValueChange={() => {
							projectForm.touchField('admin_unit_id');
							projectForm.validateField('admin_unit_id');
						}}
					>
						<Select.Trigger
							class={cn(
								'h-10 w-full',
								projectForm.touched.admin_unit_id &&
									projectForm.errors.admin_unit_id &&
									'border-red-500'
							)}
							placeholder="Pilih Administrative Unit"
						>
							{#if projectForm.isAdminUnitLoading}
								Memuat data...
							{:else if projectForm.form.admin_unit_id}
								{projectForm.adminUnits.find((c) => c.id === projectForm.form.admin_unit_id)
									?.name ?? projectForm.form.admin_unit_id}
							{:else}
								Pilih Administrative Unit
							{/if}
						</Select.Trigger>
						<Select.Content class="max-h-60">
							{#each projectForm.adminUnits as item (item.id)}
								<Select.Item value={item.id}>{item.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if projectForm.touched.admin_unit_id && projectForm.errors.admin_unit_id}
						<p class="text-xs text-red-500">{projectForm.errors.admin_unit_id}</p>
					{/if}
				</div>

				<!-- Project Type -->
				<div class="flex flex-col gap-2">
					<Label>Tipe Proyek</Label>
					<Select.Root
						type="single"
						bind:value={projectForm.form.project_type_id}
						disabled={projectForm.isProjectTypeLoading}
						onValueChange={() => {
							projectForm.touchField('project_type_id');
							projectForm.validateField('project_type_id');
						}}
					>
						<Select.Trigger
							class={cn(
								'h-10 w-full',
								projectForm.touched.project_type_id &&
									projectForm.errors.project_type_id &&
									'border-red-500'
							)}
							placeholder="Pilih Tipe Proyek"
						>
							{#if projectForm.isProjectTypeLoading}
								Memuat data...
							{:else if projectForm.form.project_type_id}
								{projectForm.projectTypes.find((c) => c.id === projectForm.form.project_type_id)
									?.value ?? projectForm.form.project_type_id}
							{:else}
								Pilih Tipe Proyek
							{/if}
						</Select.Trigger>
						<Select.Content class="max-h-60">
							{#each projectForm.projectTypes as type (type.id)}
								<Select.Item value={type.id}>{type.value}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if projectForm.touched.project_type_id && projectForm.errors.project_type_id}
						<p class="text-xs text-red-500">{projectForm.errors.project_type_id}</p>
					{/if}
				</div>
			</div>

			<!-- Start Date -->
			<div class="grid grid-cols-2 gap-2">
				<div class="flex flex-col gap-2">
					<Label>Tanggal Mulai</Label>
					<Popover.Root bind:open={projectForm.calendarOpen}>
						<Popover.Trigger
							class={cn(
								'flex h-10 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
								projectForm.touched.start_date && projectForm.errors.start_date && 'border-red-500'
							)}
							onblur={() => {
								projectForm.touchField('start_date');
								projectForm.validateField('start_date');
							}}
						>
							<CalendarDays size={16} class="shrink-0 text-muted-foreground" />
							{#if projectForm.form.start_date}
								<span>{formatDate(projectForm.form.start_date)}</span>
							{:else}
								<span class="text-muted-foreground">Pilih tanggal</span>
							{/if}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar
								type="single"
								bind:value={projectForm.calendarValue}
								locale="id-ID"
								captionLayout="dropdown"
							/>
						</Popover.Content>
					</Popover.Root>
					{#if projectForm.touched.start_date && projectForm.errors.start_date}
						<p class="text-xs text-red-500">{projectForm.errors.start_date}</p>
					{/if}
				</div>

				<!-- End Date -->
				<div class="flex flex-col gap-2">
					<Label>Tanggal Akhir</Label>

					<Popover.Root bind:open={projectForm.calendarEndOpen}>
						<Popover.Trigger
							class={cn(
								'flex h-10 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm',
								projectForm.touched.end_date && projectForm.errors.end_date && 'border-red-500'
							)}
							onblur={() => {
								projectForm.touchField('end_date');
								projectForm.validateField('end_date');
							}}
						>
							<CalendarDays size={16} class="shrink-0 text-muted-foreground" />

							{#if projectForm.form.end_date}
								<span>{formatDate(projectForm.form.end_date)}</span>
							{:else}
								<span class="text-muted-foreground">Pilih tanggal</span>
							{/if}
						</Popover.Trigger>

						<Popover.Content class="w-auto p-0" align="start">
							<Calendar
								type="single"
								bind:value={projectForm.calendarEndValue}
								locale="id-ID"
								captionLayout="dropdown"
							/>
						</Popover.Content>
					</Popover.Root>

					{#if projectForm.touched.end_date && projectForm.errors.end_date}
						<p class="text-xs text-red-500">
							{projectForm.errors.end_date}
						</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex justify-end gap-2">
				<Button variant="outline" type="button" onclick={() => (open = false)}>Batal</Button>

				<Button type="submit" disabled={projectForm.isPending}>
					{projectForm.isPending ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
