<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle2, List, Eye, Send, LoaderCircle } from 'lucide-svelte';
	import { useSubmitGRNWithoutPO } from '../hooks/useGRNWithoutPOMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		grnNumber = '',
		grnId = '',
		onBackToList
	}: {
		open?: boolean;
		grnNumber?: string;
		grnId?: string;
		onBackToList: () => void;
	} = $props();

	// Submit mutation
	const submitMutation = useSubmitGRNWithoutPO();

	// Track submission state
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	async function handleSubmit() {
		isSubmitting = true;

		try {
			await submitMutation.mutateAsync(grnId);
			isSubmitted = true;
			toast.success(`GRN ${grnNumber} berhasil diajukan untuk persetujuan`);
		} catch (error) {
			console.error('Error submitting GRN:', error);
			toast.error(
				`Gagal mengajukan GRN: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			isSubmitting = false;
		}
	}

	function handleViewDetail() {
		goto(
			`/dashboard/material-management/inventory/transaction/grn-without-po/${grnId}`
		);
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
						GRN Tanpa PO Berhasil Dibuat
					</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						Penerimaan barang tanpa PO Anda telah berhasil dibuat dengan nomor:
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>

		<!-- GRN Number with Actions -->
		<div class="py-4">
			<div class="rounded-lg border bg-muted/50 p-4">
				<div class="flex items-center justify-between">
					<div class="flex flex-col">
						<span class="text-xs text-muted-foreground">Nomor GRN Tanpa PO</span>
						<span class="font-mono text-lg font-semibold">{grnNumber}</span>
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
