<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Loader2, CalendarClock } from 'lucide-svelte';
	import { useExtendDeadline } from '../hooks/useLocalPurchaseAnalysisMutations.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		rfqId,
		currentDeadline,
		onSuccess
	}: {
		open?: boolean;
		rfqId: string;
		currentDeadline: string;
		onSuccess?: () => void;
	} = $props();

	const extendDeadlineMutation = useExtendDeadline();
	const isSubmitting = $derived(extendDeadlineMutation.isPending);

	let newDeadline = $state('');
	let error = $state('');

	// Format current deadline untuk ditampilkan
	const formattedCurrentDeadline = $derived(() => {
		if (!currentDeadline) return '';
		const date = new Date(currentDeadline);
		return date.toISOString().split('T')[0];
	});

	// Reset form saat modal dibuka
	$effect(() => {
		if (open) {
			newDeadline = '';
			error = '';
		}
	});

	function validateDeadline(): boolean {
		if (!newDeadline) {
			error = 'Tanggal deadline baru wajib diisi';
			return false;
		}

		const current = new Date(currentDeadline);
		const newDate = new Date(newDeadline);

		if (newDate <= current) {
			error = 'Tanggal deadline baru harus lebih besar dari deadline sekarang';
			return false;
		}

		error = '';
		return true;
	}

	async function handleSubmit() {
		if (!validateDeadline()) return;

		try {
			// Convert to ISO string with time
			const deadlineDate = new Date(newDeadline);
			deadlineDate.setHours(23, 59, 59, 999);
			const isoDeadline = deadlineDate.toISOString();

			await extendDeadlineMutation.mutateAsync({
				rfqId,
				newDeadline: isoDeadline
			});

			toast.success('Deadline berhasil diperpanjang. Vendor akan menerima notifikasi email.');
			open = false;
			onSuccess?.();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Gagal memperpanjang deadline. Silakan coba lagi.';
			toast.error(errorMessage);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Perpanjang Deadline</Dialog.Title>
			<Dialog.Description>
				Perpanjang deadline quotation untuk memberikan waktu tambahan kepada vendor.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- Current Deadline -->
			<div class="space-y-2">
				<Label>Deadline Saat Ini</Label>
				<div class="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
					<CalendarClock class="h-4 w-4 text-muted-foreground" />
					<span class="text-sm">{formattedCurrentDeadline()}</span>
				</div>
			</div>

			<!-- New Deadline -->
			<div class="space-y-2">
				<Label for="new-deadline">
					Deadline Baru <span class="text-destructive">*</span>
				</Label>
				<Input
					id="new-deadline"
					type="date"
					bind:value={newDeadline}
					min={formattedCurrentDeadline()}
					disabled={isSubmitting}
					class={error ? 'border-destructive' : ''}
				/>
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}
				<p class="text-xs text-muted-foreground">
					Vendor akan menerima notifikasi email otomatis tentang perpanjangan deadline.
				</p>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={isSubmitting}>
				Batal
			</Button>
			<Button onclick={handleSubmit} disabled={isSubmitting}>
				{#if isSubmitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Menyimpan...
				{:else}
					Perpanjang Deadline
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
