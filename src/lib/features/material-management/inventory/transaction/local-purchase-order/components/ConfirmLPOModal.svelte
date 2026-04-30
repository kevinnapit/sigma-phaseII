<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { AlertCircle, Save } from 'lucide-svelte';

	let {
		open = $bindable(false),
		onConfirm,
		onCancel,
		itemCount = 0,
		vendorName = ''
	}: {
		open?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
		itemCount?: number;
		vendorName?: string;
	} = $props();
</script>

<AlertDialog.Root
	bind:open
	onOpenChange={(v) => {
		if (!v) onCancel();
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
					<AlertCircle class="h-6 w-6 text-blue-600" />
				</div>
				<div>
					<AlertDialog.Title>Konfirmasi Pembuatan LPO</AlertDialog.Title>
					<AlertDialog.Description>
						Apakah Anda yakin ingin membuat Local Purchase Order ini?
					</AlertDialog.Description>
				</div>
			</div>
		</AlertDialog.Header>

		<div class="my-4 space-y-2 rounded-lg border bg-muted/50 p-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Vendor:</span>
				<span class="font-semibold">{vendorName}</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Total Item:</span>
				<span class="font-semibold">{itemCount}</span>
			</div>
		</div>

		<p class="text-sm text-muted-foreground">
			Setelah dibuat, LPO akan berstatus Draft dan dapat diajukan untuk approval.
		</p>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={onCancel}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action onclick={onConfirm}>
				<Save class="mr-2 h-4 w-4" />
				Ya, Buat LPO
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
