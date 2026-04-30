<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { CheckCircle, ExternalLink, List } from 'lucide-svelte';
	import type { CentralVendorPublishResponse } from '../types/vendor-central.types';

	let {
		open = $bindable(false),
		result
	}: {
		open: boolean;
		result: CentralVendorPublishResponse | null;
	} = $props();

	function handleViewDetail() {
		if (result?.party_uoid) {
			goto(`/dashboard/material-management/inventory/master/vendor/local/${result.party_uoid}`);
		}
		open = false;
	}

	function handleViewAll() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<div class="flex flex-col items-center gap-3 pb-2">
				<div class="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
					<CheckCircle class="h-8 w-8 text-green-600" />
				</div>
				<Dialog.Title class="text-center">Vendor Berhasil Didaftarkan</Dialog.Title>
				<Dialog.Description class="text-center">
					Vendor pusat telah berhasil didaftarkan sebagai vendor lokal.
				</Dialog.Description>
			</div>
		</Dialog.Header>

		{#if result}
			<div class="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Kode</span>
					<span class="font-medium">{result.code}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Nama</span>
					<span class="font-medium">{result.name}</span>
				</div>
			</div>
		{/if}

		<Dialog.Footer class="flex-col gap-2 sm:flex-col">
			<Button onclick={handleViewDetail} class="w-full bg-[#0f4c2a] hover:bg-[#0d4023]">
				<ExternalLink class="mr-2 h-4 w-4" />
				Lihat Detail Vendor Lokal
			</Button>
			<Button variant="outline" onclick={handleViewAll} class="w-full">
				<List class="mr-2 h-4 w-4" />
				Kembali ke Daftar
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
