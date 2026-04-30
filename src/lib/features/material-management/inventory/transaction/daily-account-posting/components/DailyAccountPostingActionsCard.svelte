<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Save } from 'lucide-svelte';
	import DailyAccountPostingConfirmModal from './DailyAccountPostingConfirmModal.svelte';
	import type { DailyAccountPostingItem } from '../types/daily-account-posting.types';

	let {
		items = [],
		formData = {},
		onSave,
		isSaving = false
	}: {
		items?: DailyAccountPostingItem[];
		formData?: any;
		onSave?: () => Promise<any>;
		isSaving?: boolean;
	} = $props();

	let showConfirmModal = $state(false);

	const isFormValid = $derived(
		!!formData.administrative_unit && !!formData.process_date && items.length > 0
	);

	const validationMessage = $derived(() => {
		if (!formData.administrative_unit) return 'Unit administratif wajib dipilih';
		if (!formData.process_date) return 'Tanggal proses wajib diisi';
		if (items.length === 0) return 'Minimal harus ada 1 item posting';
		return '';
	});

	const totalDebit = $derived(items.reduce((s, i) => s + (i.debit_amount || 0), 0));
	const totalCredit = $derived(items.reduce((s, i) => s + (i.credit_amount || 0), 0));

	function handleSaveClick() {
		if (!isFormValid) return;
		showConfirmModal = true;
	}

	async function handleConfirm() {
		showConfirmModal = false;
		try {
			await onSave?.();
		} catch (error) {
			console.error('Error saving daily account posting:', error);
		}
	}

	function handleCancel() {
		showConfirmModal = false;
	}

	function formatCurrency(n: number) {
		return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-lg">Tindakan</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Summary -->
		{#if items.length > 0}
			<div class="space-y-2 rounded-lg border bg-muted/50 p-3">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Item:</span>
					<span class="font-medium">{items.length} item</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Debit:</span>
					<span class="font-medium">{formatCurrency(totalDebit)}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Kredit:</span>
					<span class="font-semibold">{formatCurrency(totalCredit)}</span>
				</div>
			</div>
		{/if}

		<!-- Validation Message -->
		{#if !isFormValid && validationMessage()}
			<div class="rounded-md border border-yellow-200 bg-yellow-50 p-3">
				<p class="text-xs text-yellow-800">
					<strong>Perhatian:</strong>
					{validationMessage()}
				</p>
			</div>
		{/if}

		<!-- Save Button -->
		<Button class="w-full" onclick={handleSaveClick} disabled={!isFormValid || isSaving}>
			<Save class="mr-2 h-4 w-4" />
			{isSaving ? 'Menyimpan...' : 'Simpan Posting Akun'}
		</Button>
	</Card.Content>
</Card.Root>

<!-- Confirm Modal -->
<DailyAccountPostingConfirmModal
	bind:open={showConfirmModal}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
	itemCount={items.length}
	{totalDebit}
	{totalCredit}
/>
