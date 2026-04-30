<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle2, List, Eye, Send, LoaderCircle } from 'lucide-svelte';
	import { useSubmitTransferReceipt } from '../hooks/useTransferReceiptMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		receiptNumber = '',
		receiptId = '',
		onBackToList
	}: {
		open?: boolean;
		receiptNumber?: string;
		receiptId?: string;
		onBackToList: () => void;
	} = $props();

	// Submit mutation
	const submitMutation = useSubmitTransferReceipt();

	// Track submission state
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	async function handleSubmit() {
		isSubmitting = true;

		try {
			await submitMutation.mutateAsync(receiptId);
			isSubmitted = true;
			toast.success(`Penerimaan ${receiptNumber} berhasil diajukan untuk approval`);
		} catch (error) {
			console.error('Error submitting receipt:', error);
			toast.error(`Gagal mengajukan penerimaan: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			isSubmitting = false;
		}
	}

	function handleViewDetail() {
		// Navigate to detail page
		goto(`/dashboard/material-management/inventory/transaction/transfer-receipt/${receiptId}`);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md" showCloseButton={false}>
		<Dialog.Header>
			<div class="flex flex-col items-center space-y-4 text-center">
				<!-- Success Icon -->
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<CheckCircle2 class="h-10 w-10 text-green-600" />
				</div>

				<!-- Title -->
				<div class="space-y-2">
					<Dialog.Title class="text-xl font-semibold">
						Penerimaan Barang Transfer Berhasil Dibuat
					</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						Penerimaan barang transfer Anda telah berhasil dibuat dengan nomor:
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>

		<!-- Receipt Number with Actions -->
		<div class="py-4">
			<div class="rounded-lg border bg-muted/50 p-4">
				<div class="flex items-center justify-between">
					<div class="flex flex-col">
						<span class="text-xs text-muted-foreground">Nomor GRN Transfer</span>
						<span class="font-mono text-lg font-semibold">{receiptNumber}</span>
					</div>
					{#if isSubmitted}
						<Badge variant="default" class="bg-blue-600 text-white">Diajukan</Badge>
					{:else}
						<Badge variant="outline" class="bg-yellow-50 text-yellow-700">Draft</Badge>
					{/if}
				</div>

				<!-- Action Buttons -->
				<div class="mt-4 grid grid-cols-2 gap-3">
					<Button
						onclick={handleViewDetail}
						variant="outline"
						size="sm"
						class="w-full"
						disabled={isSubmitting}
					>
						<Eye class="mr-2 h-4 w-4" />
						Lihat Detail
					</Button>
					<Button
						onclick={handleSubmit}
						variant="default"
						size="sm"
						class="w-full"
						disabled={isSubmitting || isSubmitted}
					>
						{#if isSubmitting}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
							Mengajukan...
						{:else if isSubmitted}
							<CheckCircle2 class="mr-2 h-4 w-4" />
							Diajukan
						{:else}
							<Send class="mr-2 h-4 w-4" />
							Ajukan
						{/if}
					</Button>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<Dialog.Footer>
			<Button onclick={onBackToList} variant="default" class="w-full">
				<List class="mr-2 h-4 w-4" />
				Kembali ke Daftar
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>