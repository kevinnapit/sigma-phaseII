<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Plus, Trash2 } from 'lucide-svelte';

	export interface AdditionalChargeEntry {
		id: string;
		additional_charge: string;
		calculation_base: number;
		percentage: number;
		amount: number;
	}

	const CHARGE_OPTIONS = [
		'Biaya Pengiriman',
		'Biaya Asuransi',
		'Biaya Bongkar Muat',
		'Biaya Administrasi',
		'Biaya Lainnya'
	];

	let {
		open = $bindable(false),
		itemName = '',
		baseAmount = 0,
		entries = $bindable<AdditionalChargeEntry[]>([]),
		readonly = false,
		onConfirm
	}: {
		open?: boolean;
		itemName?: string;
		baseAmount?: number;
		entries?: AdditionalChargeEntry[];
		readonly?: boolean;
		onConfirm?: (entries: AdditionalChargeEntry[]) => void;
	} = $props();

	let localEntries = $state<AdditionalChargeEntry[]>([]);

	$effect(() => {
		if (open) {
			localEntries = entries.length > 0
				? entries.map(e => ({ ...e }))
				: [newRow()];
		}
	});

	function newRow(): AdditionalChargeEntry {
		return {
			id: `ac-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			additional_charge: '',
			calculation_base: baseAmount,
			percentage: 0,
			amount: 0
		};
	}

	function addRow() {
		localEntries = [...localEntries, newRow()];
	}

	function removeRow(id: string) {
		if (localEntries.length === 1) return;
		localEntries = localEntries.filter(e => e.id !== id);
	}

	function handlePercentageChange(entry: AdditionalChargeEntry, value: string) {
		entry.percentage = parseFloat(value) || 0;
		entry.amount = parseFloat(((entry.calculation_base * entry.percentage) / 100).toFixed(2));
	}

	function handleAmountChange(entry: AdditionalChargeEntry, value: string) {
		entry.amount = parseFloat(value) || 0;
		entry.percentage = entry.calculation_base > 0
			? parseFloat(((entry.amount / entry.calculation_base) * 100).toFixed(4))
			: 0;
	}

	function handleConfirm() {
		const valid = localEntries.filter(e => e.additional_charge.trim());
		onConfirm?.(valid);
		open = false;
	}

	function handleCancel() {
		open = false;
	}

	const totalAmount = $derived(
		localEntries.reduce((sum, e) => sum + (e.amount || 0), 0)
	);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Additional Charges</Dialog.Title>
			{#if itemName}
				<Dialog.Description>{itemName}</Dialog.Description>
			{/if}
		</Dialog.Header>

		<div class="overflow-x-auto rounded-md border">
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-b bg-muted/60">
						<th class="p-2 text-left font-medium" style="min-width:180px;">Additional Charges</th>
						<th class="p-2 text-right font-medium" style="min-width:130px;">Calculation Base</th>
						<th class="p-2 text-right font-medium" style="min-width:100px;">Percentage</th>
						<th class="p-2 text-right font-medium" style="min-width:120px;">Amount</th>
						{#if !readonly}
							<th class="p-2 text-center font-medium" style="min-width:50px;"></th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each localEntries as entry (entry.id)}
						<tr class="border-b last:border-0">
							<td class="p-1.5">
								{#if readonly}
									<span class="px-1">{entry.additional_charge || '-'}</span>
								{:else}
									<select
										bind:value={entry.additional_charge}
										class="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
									>
										<option value="">Pilih biaya...</option>
										{#each CHARGE_OPTIONS as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								{/if}
							</td>
							<td class="p-1.5 text-right">
								{#if readonly}
									<span class="px-1">{new Intl.NumberFormat('id-ID').format(entry.calculation_base)}</span>
								{:else}
									<Input
										type="number"
										min="0"
										bind:value={entry.calculation_base}
										class="h-8 text-right text-sm"
									/>
								{/if}
							</td>
							<td class="p-1.5">
								{#if readonly}
									<span class="block px-1 text-right">{entry.percentage}%</span>
								{:else}
									<div class="relative">
										<Input
											type="number"
											min="0"
											max="100"
											step="0.01"
											value={entry.percentage}
											class="h-8 pr-6 text-right text-sm"
											oninput={(e) => handlePercentageChange(entry, e.currentTarget.value)}
										/>
										<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
									</div>
								{/if}
							</td>
							<td class="p-1.5">
								{#if readonly}
									<span class="block px-1 text-right">{new Intl.NumberFormat('id-ID').format(entry.amount)}</span>
								{:else}
									<Input
										type="number"
										min="0"
										step="0.01"
										value={entry.amount}
										class="h-8 text-right text-sm"
										oninput={(e) => handleAmountChange(entry, e.currentTarget.value)}
									/>
								{/if}
							</td>
							{#if !readonly}
								<td class="p-1.5 text-center">
									<Button
										variant="ghost"
										size="icon"
										class="h-7 w-7"
										onclick={() => removeRow(entry.id)}
										disabled={localEntries.length === 1}
									>
										<Trash2 class="h-3.5 w-3.5 text-destructive" />
									</Button>
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if !readonly}
			<Button variant="outline" size="sm" class="mt-2 gap-1.5" onclick={addRow}>
				<Plus class="h-3.5 w-3.5" />
				Tambah Baris
			</Button>
		{/if}

		<!-- Total -->
		<div class="mt-3 flex justify-end">
			<div class="rounded-md border bg-muted/50 px-4 py-2 text-sm">
				<span class="text-muted-foreground">Total Additional Charges: </span>
				<span class="font-semibold">Rp {new Intl.NumberFormat('id-ID').format(totalAmount)}</span>
			</div>
		</div>

		<Dialog.Footer class="mt-2">
			<Button variant="outline" onclick={handleCancel}>
				{readonly ? 'Tutup' : 'Batal'}
			</Button>
			{#if !readonly}
				<Button onclick={handleConfirm}>OK</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
