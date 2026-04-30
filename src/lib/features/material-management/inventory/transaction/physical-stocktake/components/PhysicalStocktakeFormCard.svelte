<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	let {
		formData = $bindable({}),
		errors = $bindable({}),
		readonly = false,
		onScheduleChange
	}: {
		formData?: any;
		errors?: Record<string, string>;
		readonly?: boolean;
		onScheduleChange?: (schedule: string) => void;
	} = $props();

	const userContext = getUserContext();

	const scheduleOptions = [
		'Stok Opname Tahunan',
		'Stok Opname Semesteran',
		'Stok Opname Kuartalan',
		'Stok Opname Bulanan'
	];

	const statusOptions = ['Verifikasi Selesai', 'Dalam Proses', 'Belum Dimulai', 'Ditangguhkan'];

	// Auto-set store to GUDANG
	$effect(() => {
		if (!formData.store_id) {
			formData.store_id = 'store-gudang';
			formData.store_name = 'GUDANG';
		}
	});

	// Auto-set verified_by from user context
	$effect(() => {
		if (!formData.verified_by) {
			formData.verified_by = userContext.user?.name || 'Pengguna Saat Ini';
		}
	});

	function handleScheduleChange(e: Event) {
		const value = (e.currentTarget as HTMLSelectElement).value;
		formData.schedule = value;
		if (!readonly) {
			onScheduleChange?.(value);
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Detail Entri Stok Opname</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- Kiri: Jadwal Verifikasi Stok -->
			<div class="space-y-2">
				<Label for="schedule">Jadwal Verifikasi Stok <span class="text-red-500">*</span></Label>
				{#if readonly}
					<Input
						value={formData.schedule || '-'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="schedule"
						value={formData.schedule || ''}
						onchange={handleScheduleChange}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
							{errors.schedule ? 'border-red-500' : ''}"
					>
						<option value="">Pilih jadwal verifikasi stok</option>
						{#each scheduleOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
					{#if errors.schedule}
						<p class="text-xs text-red-600">{errors.schedule}</p>
					{/if}
				{/if}
			</div>

			<!-- Kanan: Nomor Referensi -->
			<div class="space-y-2">
				<Label for="ref_no">Nomor Referensi</Label>
				<Input
					id="ref_no"
					bind:value={formData.ref_no}
					placeholder="Nomor referensi (opsional)"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Kiri: Gudang -->
			<div class="space-y-2">
				<Label for="store">Gudang</Label>
				<Input id="store" value="GUDANG" readonly class="cursor-not-allowed bg-muted" />
			</div>

			<!-- Kanan: Tanggal Entri -->
			<div class="space-y-2">
				<Label for="entry_date">Tanggal Entri <span class="text-red-500">*</span></Label>
				<Input
					id="entry_date"
					type={readonly ? 'text' : 'date'}
					bind:value={formData.entry_date}
					readonly={readonly}
					class={readonly
						? 'cursor-not-allowed bg-muted'
						: errors.entry_date
							? 'border-red-500'
							: ''}
				/>
				{#if !readonly && errors.entry_date}
					<p class="text-xs text-red-600">{errors.entry_date}</p>
				{/if}
			</div>

			<!-- Kiri: Tanggal Mulai -->
			<div class="space-y-2">
				<Label for="from_date">Tanggal Mulai</Label>
				<Input
					id="from_date"
					type={readonly ? 'text' : 'date'}
					bind:value={formData.from_date}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Kanan: Tanggal Selesai -->
			<div class="space-y-2">
				<Label for="to_date">Tanggal Selesai</Label>
				<Input
					id="to_date"
					type={readonly ? 'text' : 'date'}
					bind:value={formData.to_date}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Kiri: Status -->
			<div class="space-y-2">
				<Label for="status">Status <span class="text-red-500">*</span></Label>
				{#if readonly}
					<Input
						value={formData.status || '-'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="status"
						bind:value={formData.status}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
							{errors.status ? 'border-red-500' : ''}"
					>
						<option value="">Pilih status</option>
						{#each statusOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
					{#if errors.status}
						<p class="text-xs text-red-600">{errors.status}</p>
					{/if}
				{/if}
			</div>

			<!-- Kanan: Diverifikasi Oleh -->
			<div class="space-y-2">
				<Label for="verified_by">Diverifikasi Oleh</Label>
				<Input
					id="verified_by"
					value={formData.verified_by || userContext.user?.name || 'Pengguna Saat Ini'}
					readonly
					class="cursor-not-allowed bg-muted"
				/>
			</div>

			<!-- Catatan (full width) -->
			<div class="space-y-2 md:col-span-2">
				<Label for="remarks">Catatan</Label>
				<Textarea
					id="remarks"
					bind:value={formData.remarks}
					placeholder={readonly ? 'Tidak ada catatan' : 'Catatan stok opname (opsional)'}
					rows={3}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>
		</div>
	</Card.Content>
</Card.Root>
