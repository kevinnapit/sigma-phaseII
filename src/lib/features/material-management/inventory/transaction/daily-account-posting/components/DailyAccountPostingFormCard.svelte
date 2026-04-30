<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	let {
		formData = $bindable({}),
		errors = $bindable({}),
		readonly = false,
		onLoadItems
	}: {
		formData?: any;
		errors?: Record<string, string>;
		readonly?: boolean;
		onLoadItems?: (unit: string, date: string) => void;
	} = $props();

	const administrativeUnitOptions = [
		'Aek Loba',
		'Afd I',
		'Afd II',
		'Afd III',
		'Divisi 1',
		'Divisi 2'
	];

	// Auto-set store to GUDANG
	$effect(() => {
		if (!formData.store) {
			formData.store = 'GUDANG';
		}
	});

	// Notify parent when unit or date changes (for auto-loading items)
	$effect(() => {
		const unit = formData.administrative_unit;
		const date = formData.process_date;
		if (unit && date && onLoadItems) {
			onLoadItems(unit, date);
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Detail Posting Akun Harian</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Administrative Unit — dropdown, required -->
		<div class="space-y-2">
			<Label for="administrative_unit">
				Unit Administratif <span class="text-red-500">*</span>
			</Label>
			{#if readonly}
				<Input
					value={formData.administrative_unit || '-'}
					readonly
					class="cursor-not-allowed bg-muted"
				/>
			{:else}
				<select
					id="administrative_unit"
					bind:value={formData.administrative_unit}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					class:border-red-500={errors.administrative_unit}
				>
					<option value="">Pilih unit administratif</option>
					{#each administrativeUnitOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
				{#if errors.administrative_unit}
					<p class="text-xs text-red-600">{errors.administrative_unit}</p>
				{/if}
			{/if}
		</div>

		<!-- Gudang — always GUDANG, read-only -->
		<div class="space-y-2">
			<Label for="store">Gudang</Label>
			<Input id="store" value="GUDANG" readonly class="cursor-not-allowed bg-muted" />
		</div>

		<!-- Tanggal Proses — date, required -->
		<div class="space-y-2">
			<Label for="process_date">
				Tanggal Proses <span class="text-red-500">*</span>
			</Label>
			<Input
				id="process_date"
				type={readonly ? 'text' : 'date'}
				bind:value={formData.process_date}
				readonly={readonly}
				class={readonly
					? 'cursor-not-allowed bg-muted'
					: errors.process_date
						? 'border-red-500'
						: ''}
			/>
			{#if !readonly && errors.process_date}
				<p class="text-xs text-red-600">{errors.process_date}</p>
			{/if}
		</div>

		<!-- Catatan — optional -->
		<div class="space-y-2">
			<Label for="remarks">Catatan</Label>
			<Textarea
				id="remarks"
				bind:value={formData.remarks}
				placeholder={readonly ? 'Tidak ada catatan' : 'Catatan posting (opsional)'}
				rows={3}
				readonly={readonly}
				class={readonly ? 'cursor-not-allowed bg-muted' : ''}
			/>
		</div>
	</Card.Content>
</Card.Root>
