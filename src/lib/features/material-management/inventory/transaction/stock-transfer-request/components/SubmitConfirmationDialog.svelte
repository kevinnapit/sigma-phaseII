<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Send, Info } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		isSubmitting = false,
		totalItems = 0
	}: {
		open?: boolean;
		onConfirm?: () => void;
		onCancel?: () => void;
		isSubmitting?: boolean;
		totalItems?: number;
	} = $props();

	function handleConfirm() {
		onConfirm?.();
	}

	function handleCancel() {
		onCancel?.();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<div class="flex items-start gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
					<Info class="h-5 w-5 text-blue-600" />
				</div>
				<div class="flex-1">
					<Dialog.Title class="text-lg font-semibold">Konfirmasi Permintaan Transfer</Dialog.Title>
					<Dialog.Description class="text-sm text-muted-foreground mt-1">
						Apakah Anda yakin ingin mengirim permintaan ini?
					</Dialog.Description>
				</div>
			</div>
		</Dialog.Header>
		
		<div class="py-4">
			<!-- Summary Info -->
			<div class="rounded-lg bg-muted/50 p-3 mb-4">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Total Item:</span>
					<span class="font-medium">{totalItems}</span>
				</div>
			</div>

			<!-- Warning Text -->
			<div class="text-sm text-muted-foreground mb-6">
				Setelah dikirim, permintaan akan diproses dan tidak dapat dibatalkan. Pastikan semua informasi sudah benar.
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-3">
				<Button
					variant="outline"
					class="flex-1"
					onclick={handleCancel}
					disabled={isSubmitting}
				>
					Batal
				</Button>
				
				<Button
					class="flex-1"
					onclick={handleConfirm}
					disabled={isSubmitting}
				>
					<Send class="mr-2 h-4 w-4" />
					{isSubmitting ? 'Mengirim...' : 'Ya, Kirim Permintaan'}
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>