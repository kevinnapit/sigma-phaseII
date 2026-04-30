<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle2, List, Eye, Send, LoaderCircle } from 'lucide-svelte';
	import { useSubmitStockControl } from '../hooks/useItemStockControlMutations.svelte';

	interface CreatedRequest {
		request_id: string;
		item_code: string;
		item_name: string;
	}

	function truncate(text: string, max = 30) {
		return text.length > max ? text.slice(0, max) + '…' : text;
	}

	interface Props {
		open?: boolean;
		createdRequest?: CreatedRequest | null;
		onBackToList: () => void;
	}

	let { open = $bindable(false), createdRequest = null, onBackToList }: Props = $props();

	const submitMutation = useSubmitStockControl();

	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	// Reset state when modal opens with a new request
	$effect(() => {
		if (open && createdRequest) {
			isSubmitting = false;
			isSubmitted = false;
		}
	});

	async function handleSubmit() {
		if (!createdRequest) return;
		isSubmitting = true;
		try {
			await submitMutation.mutateAsync(createdRequest.request_id);
			isSubmitted = true;
			toast.success('Permintaan kontrol stok berhasil diajukan');
		} catch (err: any) {
			toast.error(err?.message || 'Gagal mengajukan permintaan');
		} finally {
			isSubmitting = false;
		}
	}

	function handleViewDetail() {
		if (!createdRequest) return;
		goto(
			`/dashboard/material-management/inventory/master/item-stock-control/detail/${createdRequest.request_id}`
		);
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
					<Dialog.Title class="text-xl font-semibold">Kontrol Stok Berhasil Dibuat</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground">
						Permintaan kontrol stok telah berhasil dibuat dengan status Draft. Ajukan sekarang atau
						lihat detail terlebih dahulu.
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>

		{#if createdRequest}
			<div class="py-4">
				<div class="rounded-lg border bg-muted/50 p-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
							>
								1
							</div>
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Nama Barang</span>
								<span
									class="text-xs font-semibold"
									title="{createdRequest.item_code} - {createdRequest.item_name}"
								>
									{truncate(`${createdRequest.item_code} - ${createdRequest.item_name}`)}
								</span>
							</div>
						</div>
						{#if isSubmitted}
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
							disabled={isSubmitting || isSubmitted}
						>
							{#if isSubmitting}
								<LoaderCircle class="mr-2 h-3 w-3 animate-spin" />
								Mengajukan...
							{:else if isSubmitted}
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
		{/if}

		<Dialog.Footer>
			<Button onclick={onBackToList} variant="default" class="w-full">
				<List class="mr-2 h-4 w-4" />
				Kembali ke Daftar
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
