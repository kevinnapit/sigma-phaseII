<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { CheckCircle, Eye, Send, List } from 'lucide-svelte';

	let {
		open = $bindable(false),
		prNumber = '',
		onViewDetail,
		onSubmit,
		onBackToList
	}: {
		open?: boolean;
		prNumber?: string;
		onViewDetail?: () => void;
		onSubmit?: () => void;
		onBackToList?: () => void;
	} = $props();

	function handleViewDetail() {
		onViewDetail?.();
		open = false;
	}

	function handleSubmit() {
		onSubmit?.();
		open = false;
	}

	function handleBackToList() {
		onBackToList?.();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<div class="text-center py-6">
			<!-- Success Icon -->
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
				<CheckCircle class="h-10 w-10 text-green-600" />
			</div>

			<!-- Title -->
			<h2 class="text-2xl font-semibold mb-3">Permintaan Barang Berhasil Dibuat</h2>
			
			<!-- Description -->
			<p class="text-sm text-muted-foreground mb-6">
				Permintaan barang Anda telah berhasil dibuat dengan nomor:
			</p>

			<!-- Request Number Card -->
			<div class="rounded-lg border bg-muted/30 p-4 mb-6">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
							1
						</div>
						<div class="text-left">
							<p class="text-xs text-muted-foreground">Nomor MR</p>
							<p class="font-semibold text-base">{prNumber}</p>
						</div>
					</div>
					<Badge variant="secondary" class="bg-orange-100 text-orange-700 hover:bg-orange-100">Draft</Badge>
				</div>
				
				<div class="flex gap-2">
					<Button variant="outline" size="sm" class="flex-1" onclick={handleViewDetail}>
						<Eye class="mr-2 h-4 w-4" />
						Lihat Detail
					</Button>
					<Button size="sm" class="flex-1 bg-green-700 hover:bg-green-800" onclick={handleSubmit}>
						<Send class="mr-2 h-4 w-4" />
						Ajukan
					</Button>
				</div>
			</div>

			<!-- Back to List Button -->
			<Button class="w-full bg-green-700 hover:bg-green-800" onclick={handleBackToList}>
				<List class="mr-2 h-4 w-4" />
				Kembali ke Daftar
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>