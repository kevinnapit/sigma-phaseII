<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	let {
		formData = $bindable({}),
		errors = $bindable({}),
		readonly = false
	}: {
		formData?: any;
		errors?: Record<string, string>;
		readonly?: boolean;
	} = $props();

	const allocationCodeOptions = [
		'Perk. Sementara/For Adjustment',
		'Alokasi Umum',
		'Alokasi Khusus',
		'Penyesuaian Rutin'
	];

	const accountOptions = [
		'Perk. Sementara/For Adjustment',
		'Akun Persediaan',
		'Akun Penyesuaian',
		'Akun Umum'
	];

	// Auto-set store to GUDANG
	$effect(() => {
		if (!formData.store_id) {
			formData.store_id = 'store-gudang';
			formData.store_name = 'GUDANG';
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Detail Penyesuaian Stok</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- Store (Gudang) — always GUDANG, read-only -->
			<div class="space-y-2">
				<Label for="store">Gudang</Label>
				<Input id="store" value="GUDANG" readonly class="cursor-not-allowed bg-muted" />
			</div>

			<!-- Adjustment No — auto-generated, read-only, font-mono -->
			<div class="space-y-2">
				<Label for="adjustment_number">No. Penyesuaian Stok</Label>
				<Input
					id="adjustment_number"
					value={formData.adjustment_number || 'Auto-generated'}
					readonly
					class="cursor-not-allowed bg-muted font-mono"
				/>
			</div>

			<!-- Allocation Code — dropdown, optional -->
			<div class="space-y-2">
				<Label for="allocation_code">Kode Alokasi</Label>
				{#if readonly}
					<Input
						value={formData.allocation_code || '-'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="allocation_code"
						bind:value={formData.allocation_code}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">Pilih kode alokasi (opsional)</option>
						{#each allocationCodeOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				{/if}
			</div>

			<!-- Date — required -->
			<div class="space-y-2">
				<Label for="date">Tanggal <span class="text-red-500">*</span></Label>
				<Input
					id="date"
					type={readonly ? 'text' : 'date'}
					bind:value={formData.date}
					readonly={readonly}
					class={readonly
						? 'cursor-not-allowed bg-muted'
						: errors.date
							? 'border-red-500'
							: ''}
				/>
				{#if !readonly && errors.date}
					<p class="text-xs text-red-600">{errors.date}</p>
				{/if}
			</div>

			<!-- Reference No — text input, optional -->
			<div class="space-y-2">
				<Label for="ref_no">No. Referensi</Label>
				<Input
					id="ref_no"
					bind:value={formData.ref_no}
					placeholder="No. referensi (opsional)"
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>

			<!-- Account — dropdown, optional -->
			<div class="space-y-2">
				<Label for="account">Akun</Label>
				{#if readonly}
					<Input
						value={formData.account || '-'}
						readonly
						class="cursor-not-allowed bg-muted"
					/>
				{:else}
					<select
						id="account"
						bind:value={formData.account}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">Pilih akun (opsional)</option>
						{#each accountOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				{/if}
			</div>

			<!-- Remarks — textarea, optional (full width) -->
			<div class="space-y-2 md:col-span-2">
				<Label for="remarks">Catatan</Label>
				<Textarea
					id="remarks"
					bind:value={formData.remarks}
					placeholder={readonly ? 'Tidak ada catatan' : 'Catatan penyesuaian (opsional)'}
					rows={3}
					readonly={readonly}
					class={readonly ? 'cursor-not-allowed bg-muted' : ''}
				/>
			</div>
		</div>
	</Card.Content>
</Card.Root>
