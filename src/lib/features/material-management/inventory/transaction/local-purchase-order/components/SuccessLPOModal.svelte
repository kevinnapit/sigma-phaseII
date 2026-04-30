<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle2, Eye, List, LoaderCircle, Send } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { useSubmitLPO } from '../hooks/useLocalPurchaseOrderQueries.svelte';

	const LPO_BASE_URL = '/dashboard/material-management/inventory/transaction/local-purchase-order';

	let {
		open = $bindable(false),
		lpoId = '',
		lpoNumber = ''
	}: {
		open?: boolean;
		lpoId?: string;
		lpoNumber?: string;
	} = $props();

	let submitted = $state(false);

	const submitMutation = useSubmitLPO();
	const isSubmitting = $derived(submitMutation.isPending);

	async function handleSubmit() {
		try {
			await submitMutation.mutateAsync(lpoId);
			submitted = true;
			toast.success(`LPO ${lpoNumber} berhasil diajukan untuk approval`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Gagal mengajukan LPO');
		}
	}

	function handleViewDetail() {
		goto(`${LPO_BASE_URL}/${lpoId}`);
	}

	function handleBackToList() {
		goto(LPO_BASE_URL);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md" showCloseButton={false}>
		<Dialog.Header>
			<div class="flex flex-col items-center space-y-4 text-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<CheckCircle2 class="h-10 w-10 text-green-600" />
				</div>
				<div class="space-y-2">
					<Dialog.Title class="text-xl font-semibold">LPO Berhasil Dibuat</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						Local Purchase Order Anda telah berhasil dibuat dengan nomor:
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>

		<div class="py-4">
			<div class="rounded-lg border bg-muted/50 p-4">
				<div class="flex items-center justify-between">
					<div class="flex flex-col">
						<span class="text-xs text-muted-foreground">Nomor LPO</span>
						<span class="font-mono text-sm font-semibold">{lpoNumber}</span>
					</div>
					{#if submitted}
						<Badge variant="default" class="bg-blue-600 text-white">Diajukan</Badge>
					{:else}
						<Badge variant="outline" class="bg-yellow-50 text-yellow-700">Draft</Badge>
					{/if}
				</div>

				<div class="mt-3 grid grid-cols-2 gap-2">
					<Button
						onclick={handleViewDetail}
						variant="outline"
						size="sm"
						class="w-full"
						disabled={isSubmitting}
					>
						<Eye class="mr-2 h-3 w-3" />
						Lihat Detail
					</Button>
					<Button
						onclick={handleSubmit}
						variant="default"
						size="sm"
						class="w-full"
						disabled={isSubmitting || submitted}
					>
						{#if isSubmitting}
							<LoaderCircle class="mr-2 h-3 w-3 animate-spin" />
							Mengajukan...
						{:else if submitted}
							<CheckCircle2 class="mr-2 h-3 w-3" />
							Diajukan
						{:else}
							<Send class="mr-2 h-3 w-3" />
							Ajukan
						{/if}
					</Button>
				</div>
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
