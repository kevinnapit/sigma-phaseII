<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle2, Send, Eye, List, LoaderCircle } from 'lucide-svelte';
	import { useSubmitLPO } from '../../local-purchase-order/hooks/useLocalPurchaseOrderQueries.svelte';
	import { toast } from 'svelte-sonner';

	interface LPOItem {
		id: string;
		lpo_number: string;
		approval_status: string;
	}

	let {
		open = $bindable(false),
		lpos = []
	}: {
		open: boolean;
		lpos: LPOItem[];
	} = $props();

	const submitMutation = useSubmitLPO();

	// Track submitted state per LPO id
	let submittedIds = $state<Set<string>>(new Set());
	let submittingId = $state<string | null>(null);

	async function handleSubmit(lpo: LPOItem) {
		submittingId = lpo.id;
		try {
			await submitMutation.mutateAsync(lpo.id);
			submittedIds = new Set([...submittedIds, lpo.id]);
			toast.success(`LPO ${lpo.lpo_number} berhasil diajukan untuk persetujuan`);
		} catch (error) {
			toast.error(
				`Gagal mengajukan LPO: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			submittingId = null;
		}
	}

	function handleViewDetail(lpo: LPOItem) {
		open = false;
		goto(`/dashboard/material-management/inventory/transaction/local-purchase-order/${lpo.id}`);
	}

	function handleBackToList() {
		open = false;
		goto('/dashboard/material-management/inventory/transaction/local-purchase-analysis');
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg" showCloseButton={false}>
		<Dialog.Header>
			<div class="flex flex-col items-center space-y-4 text-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<CheckCircle2 class="h-10 w-10 text-green-600" />
				</div>
				<div class="space-y-2">
					<Dialog.Title class="text-xl font-semibold">Repeat Order Berhasil Dibuat</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						{lpos.length} LPO berhasil dibuat dari Repeat Order.
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>

		<div class="max-h-72 overflow-y-auto py-4">
			<div class="space-y-2">
				{#each lpos as lpo, i (lpo.id)}
					<div class="rounded-lg border bg-muted/50 p-3">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
								>
									{i + 1}
								</div>
								<div class="flex flex-col">
									<span class="text-xs text-muted-foreground">Nomor LPO</span>
									<span class="font-mono text-sm font-semibold">{lpo.lpo_number}</span>
								</div>
							</div>
							{#if submittedIds.has(lpo.id)}
								<Badge variant="default" class="bg-blue-600 text-white">Diajukan</Badge>
							{:else}
								<Badge variant="outline" class="bg-yellow-50 text-yellow-700">Draft</Badge>
							{/if}
						</div>

						<div class="mt-3 grid grid-cols-2 gap-2">
							<Button
								onclick={() => handleViewDetail(lpo)}
								variant="outline"
								size="sm"
								class="w-full"
								disabled={submittingId === lpo.id}
							>
								<Eye class="mr-2 h-3 w-3" />
								Lihat Detail
							</Button>
							<Button
								onclick={() => handleSubmit(lpo)}
								variant="default"
								size="sm"
								class="w-full"
								disabled={submittingId === lpo.id || submittedIds.has(lpo.id)}
							>
								{#if submittingId === lpo.id}
									<LoaderCircle class="mr-2 h-3 w-3 animate-spin" />
									Mengajukan...
								{:else if submittedIds.has(lpo.id)}
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
		</div>

		<Dialog.Footer class="flex-col gap-2 sm:flex-col">
			<Button onclick={handleBackToList} variant="default" class="w-full">
				<List class="mr-2 h-4 w-4" />
				Kembali ke Daftar
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
