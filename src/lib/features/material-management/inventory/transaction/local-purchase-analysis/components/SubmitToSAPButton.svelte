<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Building2, Send, AlertTriangle, Clock } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let {
		rfqId,
		rfqNumber,
		itemCount,
		onSubmitted
	}: {
		rfqId: string;
		rfqNumber: string;
		itemCount: number;
		onSubmitted?: () => void;
	} = $props();

	let showDialog = $state(false);
	let isSubmitting = $state(false);

	async function handleSubmitToSAP() {
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			showDialog = false;
			toast.success('RFQ berhasil dikirim ke SAP untuk approval');
			onSubmitted?.();
		} catch (error) {
			toast.error('Gagal mengirim ke SAP. Silakan coba lagi.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Button onclick={() => showDialog = true} class="w-full">
	<Building2 class="mr-2 h-4 w-4" />
	Kirim ke SAP untuk Approval
</Button>

<Dialog.Root bind:open={showDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Building2 class="h-5 w-5" />
				Kirim ke SAP
			</Dialog.Title>
			<Dialog.Description>
				Kirim data pemenang vendor ke SAP untuk mendapatkan approval
			</Dialog.Description>
		</Dialog.Header>
		
		<div class="space-y-4 py-4">
			<Alert.Root>
				<AlertTriangle class="h-4 w-4" />
				<Alert.Title>Informasi Penting</Alert.Title>
				<Alert.Description>
					Item dengan status "Perlu Izin" memerlukan persetujuan SAP sebelum dapat diproses lebih lanjut.
					Item yang ditolak akan otomatis dialihkan ke Head Office.
				</Alert.Description>
			</Alert.Root>

			<div class="rounded-lg border p-4">
				<h4 class="font-medium">Detail RFQ</h4>
				<div class="mt-2 space-y-1 text-sm text-muted-foreground">
					<div>Nomor: {rfqNumber}</div>
					<div>Jumlah item: {itemCount}</div>
					<div>Status: Siap dikirim ke SAP</div>
				</div>
			</div>

			<div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
				<h4 class="font-medium text-blue-900 dark:text-blue-100">Proses Selanjutnya</h4>
				<ul class="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
					<li>• Data akan dikirim ke sistem SAP</li>
					<li>• KTU akan melakukan review dan approval</li>
					<li>• Item yang disetujui dapat lanjut ke LPO</li>
					<li>• Item yang ditolak otomatis dialihkan ke HO</li>
				</ul>
			</div>
		</div>

		<Dialog.Footer class="gap-2">
			<Button variant="outline" onclick={() => showDialog = false} disabled={isSubmitting}>
				Batal
			</Button>
			<Button onclick={handleSubmitToSAP} disabled={isSubmitting}>
				{#if isSubmitting}
					<Clock class="mr-2 h-4 w-4 animate-spin" />
					Mengirim...
				{:else}
					<Send class="mr-2 h-4 w-4" />
					Kirim ke SAP
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>