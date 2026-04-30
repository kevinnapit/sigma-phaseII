<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle2, List, Eye, Send, LoaderCircle } from 'lucide-svelte';
	import { useSubmitPurchaseRequest } from '../hooks/usePurchaseRequestMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		purchaseRequests = [],
		onBackToList
	}: {
		open?: boolean;
		purchaseRequests: Array<{ id: string; number: string }>; // id = hdr_uoid
		onBackToList: () => void;
	} = $props();

	const isMultiple = $derived(purchaseRequests.length > 1);

	// Submit mutation
	const submitMutation = useSubmitPurchaseRequest();

	// Track which PRs are being submitted
	let submittingIds = $state<Set<string>>(new Set());

	// Track which PRs have been submitted successfully
	let submittedIds = $state<Set<string>>(new Set());

	async function handleSubmit(requestId: string, prNumber: string) {
		// Add to submitting set
		submittingIds = new Set([...submittingIds, requestId]);

		try {
			await submitMutation.mutateAsync(requestId);

			// Add to submitted set
			submittedIds = new Set([...submittedIds, requestId]);

			toast.success(`PR ${prNumber} berhasil diajukan untuk approval`);
		} catch (error) {
			console.error('Error submitting PR:', error);
			toast.error(
				`Gagal mengajukan PR ${prNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			// Remove from submitting set
			const newSubmitting = new Set(submittingIds);
			newSubmitting.delete(requestId);
			submittingIds = newSubmitting;
		}
	}

	function isSubmitting(requestId: string) {
		return submittingIds.has(requestId);
	}

	function isSubmitted(requestId: string) {
		return submittedIds.has(requestId);
	}

	function handleViewDetail(prId: string) {
		// Navigate to detail page
		goto(`/dashboard/material-management/inventory/transaction/purchase-request/${prId}`);
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
						Permintaan Barang Berhasil Dibuat
					</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						{#if isMultiple}
							{purchaseRequests.length} permintaan barang telah berhasil dibuat dengan nomor berikut:
						{:else}
							Permintaan barang Anda telah berhasil dibuat dengan nomor:
						{/if}
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>

		<!-- PR Numbers with Actions - Scrollable -->
		<div class="max-h-[400px] space-y-3 overflow-y-auto py-4">
			{#each purchaseRequests as pr, index}
				<div class="rounded-lg border bg-muted/50 p-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
							>
								{index + 1}
							</div>
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Nomor MR</span>
								<span class="font-mono text-sm font-semibold">{pr.number}</span>
							</div>
						</div>
						{#if isSubmitted(pr.id)}
							<Badge variant="default" class="bg-blue-600 text-white">Diajukan</Badge>
						{:else}
							<Badge variant="outline" class="bg-yellow-50 text-yellow-700">Draft</Badge>
						{/if}
					</div>

					<!-- Action Buttons per PR -->
					<div class="mt-3 grid grid-cols-2 gap-2">
						<Button
							onclick={() => handleViewDetail(pr.id)}
							variant="outline"
							size="sm"
							class="w-full"
							disabled={isSubmitting(pr.id)}
						>
							<Eye class="mr-2 h-3 w-3" />
							Lihat Detail
						</Button>
						<Button
							onclick={() => handleSubmit(pr.id, pr.number)}
							variant="default"
							size="sm"
							class="w-full"
							disabled={isSubmitting(pr.id) || isSubmitted(pr.id)}
						>
							{#if isSubmitting(pr.id)}
								<LoaderCircle class="mr-2 h-3 w-3 animate-spin" />
								Mengajukan...
							{:else if isSubmitted(pr.id)}
								<CheckCircle2 class="mr-2 h-3 w-3" />
								Diajukan
							{:else}
								<Send class="mr-2 h-3 w-3" />
								Ajukan
							{/if}
						</Button>
					</div>
				</div>
			{/each}
		</div>

		<!-- Actions -->
		<Dialog.Footer class="flex-col gap-2 sm:flex-col">
			<Button onclick={onBackToList} variant="default" class="w-full">
				<List class="mr-2 h-4 w-4" />
				Kembali ke Daftar
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
