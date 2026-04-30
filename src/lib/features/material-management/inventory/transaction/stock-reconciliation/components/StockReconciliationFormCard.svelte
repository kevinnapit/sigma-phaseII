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

	// Auto-set store ke GUDANG
	$effect(() => {
		if (!formData.store_id) {
			formData.store_id = 'store-gudang';
			formData.store_name = 'GUDANG';
		}
	});

	// Auto-set status ke Disetujui
	$effect(() => {
		if (!formData.status) {
			formData.status = 'Disetujui';
		}
	});

	// Auto-set approved_by dari user context
	$effect(() => {
		if (!formData.approved_by) {
			formData.approved_by = userContext.user?.name || 'Pengguna Saat Ini';
		}
	});

	function handleScheduleChange(e: Event) {
		const value = (e.currentTarget as HTMLSelectElement).value;
		formData.verification_schedule_no = value;
		if (!readonly) {
			onScheduleChange?.(value);
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Detail Rekonsiliasi Stok</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- Kiri: Gudang -->
			<div class="space-y-2">
				<Label for="store">Gudang</Label>
				<Input id="store" value="GUDANG" readonly class="cursor-not-allowed bg-muted" />
			</div>

			<!-- Kanan: No. Jadwal Verifikasi -->
			<div class="space-y-2">
				<Label for="verification_schedule_no">
					No. Jadwal Verifikasi <span class="text-red-500">*</span>
				</Label>
				{#if readonly}
					<Input
						value={formData.verification_schedule_no || '-'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="verification_schedule_no"
						value={formData.verification_schedule_no || ''}
						onchange={handleScheduleChange}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
							{errors.verification_schedule_no ? 'border-red-500' : ''}"
					>
						<option value="">Pilih jadwal verifikasi</option>
						{#each scheduleOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
					{#if errors.verification_schedule_no}
						<p class="text-xs text-red-600">{errors.verification_schedule_no}</p>
					{/if}
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

			<!-- Kiri: Tanggal Entri -->
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

			<!-- Kanan: Status -->
			<div class="space-y-2">
				<Label for="status">Status</Label>
				<Input id="status" value="Disetujui" readonly class="cursor-not-allowed bg-muted" />
			</div>

			<!-- Kiri: Disetujui Oleh -->
			<div class="space-y-2">
				<Label for="approved_by">Disetujui Oleh</Label>
				<Input
					id="approved_by"
					value={formData.approved_by || userContext.user?.name || 'Pengguna Saat Ini'}
					readonly
					class="cursor-not-allowed bg-muted"
				/>
			</div>

			<!-- Kanan: Tanggal Disetujui -->
			<div class="space-y-2">
				<Label for="approved_date">Tanggal Disetujui <span class="text-red-500">*</span></Label>
				<Input
					id="approved_date"
					type={readonly ? 'text' : 'date'}
					bind:value={formData.approved_date}
					readonly={readonly}
					class={readonly
						? 'cursor-not-allowed bg-muted'
						: errors.approved_date
							? 'border-red-500'
							: ''}
				/>
				{#if !readonly && errors.approved_date}
					<p class="text-xs text-red-600">{errors.approved_date}</p>
				{/if}
			</div>

			<!-- Catatan (lebar penuh) -->
			<div class="space-y-2 md:col-span-2">
				<Label for="remarks">Catatan</Label>
				<Textarea
					id="remarks"
					bind:value={formData.remarks}
					placeholder={readonly ? 'Tidak ada catatan' : 'Catatan rekonsiliasi stok (opsional)'}
					rows={3}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>
		</div>
	</Card.Content>
</Card.Root>
