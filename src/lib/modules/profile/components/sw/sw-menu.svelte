<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getSwManager, type Storageable } from '$lib/hooks/use-sw-manager.svelte';
	import { cn } from '$lib/utils';
	import { BrushCleaning, RotateCcw, SearchCheck, Wifi, Wrench } from 'lucide-svelte';

	let { storage }: { storage: Storageable } = $props();
	const sw = getSwManager();

	let isResetting = $state(false);
	let isBustingCache = $state(false);
	let isPurgingAssets = $state(false);
	let confirmOpen = $state(false);
	let pendingAction = $state<'purge-assets' | 'bust-cache' | 'reset' | null>(null);

	// replace custom toast with sonner
	import { toast } from 'svelte-sonner';

	function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
		if (type === 'success') toast.success(message);
		else if (type === 'error') toast.error(message);
		else toast.info(message);
	}

	const isConfirmPending = $derived(isPurgingAssets || isBustingCache || isResetting);

	function openConfirm(action: 'purge-assets' | 'bust-cache' | 'reset') {
		pendingAction = action;
		confirmOpen = true;
	}

	function closeConfirm() {
		if (isConfirmPending) return;
		confirmOpen = false;
		pendingAction = null;
	}

	async function handleUpdate() {
		sw.updateApp();
		showToast('Memeriksa pembaruan...', 'info');
	}

	async function handlePurgeAssets() {
		isPurgingAssets = true;
		try {
			sw.purgeAssetsCache();
			showToast('Cache aset berhasil dibersihkan.', 'success');
			closeConfirm();
		} finally {
			isPurgingAssets = false;
		}
	}

	async function handleBustCache() {
		isBustingCache = true;
		try {
			// no logged out
			await sw.bustAppCache({ menuState: storage.menuState, queryClient: storage.queryClient });
			showToast('Cache aplikasi berhasil dibersihkan.', 'success');
			closeConfirm();
			setTimeout(() => window.location.reload(), 500);
		} catch {
			showToast('Gagal membersihkan cache aplikasi.', 'error');
		} finally {
			isBustingCache = false;
		}
	}

	async function handleReset() {
		isResetting = true;
		try {
			await sw.resetApp(storage);
			showToast('Reset aplikasi selesai. Memuat ulang...', 'success');
			closeConfirm();
			await goto(resolve('/'));
		} catch {
			showToast('Reset gagal. Silakan coba lagi.', 'error');
		} finally {
			isResetting = false;
		}
	}

	async function handleConfirm() {
		if (pendingAction === 'purge-assets') {
			await handlePurgeAssets();
		}

		if (pendingAction === 'bust-cache') {
			await handleBustCache();
		}

		if (pendingAction === 'reset') {
			await handleReset();
		}
		confirmOpen = false;
	}
</script>

<div class="flex flex-col gap-2">
	<!-- <div class="grid grid-cols-2 gap-2">
		<Card.Root
			class={cn(
				'gap-2 py-4',
				sw.isOfflineReady ? 'border border-green-300' : 'border border-red-300'
			)}
		>
			<Card.Content class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Wifi />
					<span class="text-sm font-medium">Siap Offline?</span>
				</div>
				<Badge
					variant="outline"
					class={cn(
						sw.isOfflineReady
							? 'border border-green-500 bg-green-100 text-green-500'
							: 'border border-red-500 bg-red-100 text-red-500'
					)}
				>
					{sw.isOfflineReady ? 'Siap' : 'Belum siap'}
				</Badge>
			</Card.Content>
		</Card.Root>

		<Card.Root
			class={cn(
				'gap-2 py-4',
				sw.isNeedRefresh ? 'border border-amber-300' : 'border border-green-300'
			)}
		>
			<Card.Content class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Wrench />
					<span class="text-sm font-medium">Pembaruan</span>
				</div>
				<Badge
					variant="outline"
					class={cn(
						sw.isNeedRefresh
							? 'border border-amber-500 bg-amber-100 text-amber-500'
							: 'border border-green-500 bg-green-100 text-green-500'
					)}
				>
					{sw.isNeedRefresh ? 'Menunggu' : 'Terbaru'}
				</Badge>
			</Card.Content>
		</Card.Root>
	</div> -->

	{#if sw.isNeedRefresh}
		<Card.Root class="flex-row items-center justify-between p-4">
			<Card.Content>
				<span class="text-sm">Versi baru tersedia</span>
				<Button size="sm" onclick={handleUpdate}>Perbarui</Button>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Actions -->
	<Card.Root class="gap-0 divide-y p-0">
		<Card.Content>
			<div class="flex items-center justify-between py-4">
				<div>
					<p class="text-sm font-medium">Periksa pembaruan</p>
					<p class="text-xs text-muted-foreground">Paksa pengecekan pembaruan SW</p>
				</div>
				<Button variant="outline" size="sm" onclick={handleUpdate} disabled={!sw.isRegistered}>
					<div class="flex items-center gap-2">
						<SearchCheck />
						Periksa
					</div>
				</Button>
			</div>
		</Card.Content>

		<Card.Content>
			<div class="flex items-center justify-between py-4">
				<div>
					<p class="text-sm font-medium">Bersihkan aset</p>
					<p class="text-xs text-muted-foreground">Hapus cache statis</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
					onclick={() => openConfirm('purge-assets')}
					disabled={isPurgingAssets}
				>
					<div class="flex items-center gap-2">
						<BrushCleaning />
						{isPurgingAssets ? 'Membersihkan...' : 'Bersihkan'}
					</div>
				</Button>
			</div>
		</Card.Content>

		<Card.Content>
			<div class="flex items-center justify-between py-4">
				<div>
					<p class="text-sm font-medium">Bersihkan cache aplikasi</p>
					<p class="text-xs text-muted-foreground">Reset data lokal</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
					onclick={() => openConfirm('bust-cache')}
					disabled={isBustingCache}
				>
					<div class="flex items-center gap-2">
						<BrushCleaning />
						{isBustingCache ? 'Membersihkan...' : 'Bersihkan'}
					</div>
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Danger -->
	<Card.Root class="border-destructive py-4">
		<Card.Content>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-destructive">Reset penuh</p>
					<p class="text-xs text-muted-foreground">Hapus semua cache & muat ulang</p>
				</div>
				<Button
					variant="destructive"
					size="sm"
					onclick={() => openConfirm('reset')}
					disabled={isResetting}
				>
					<div class="flex items-center gap-2">
						<RotateCcw />
						{isResetting ? 'Mengatur Ulang...' : 'Atur Ulang'}
					</div>
				</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<AlertDialog.Root bind:open={confirmOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{#if pendingAction === 'purge-assets'}
					Bersihkan aset
				{:else if pendingAction === 'bust-cache'}
					Bersihkan cache aplikasi
				{:else if pendingAction === 'reset'}
					Reset penuh
				{/if}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if pendingAction === 'purge-assets'}
					Tindakan ini akan menghapus cache aset statis yang tersimpan di service worker.
				{:else if pendingAction === 'bust-cache'}
					Tindakan ini akan membersihkan cache dan data aplikasi
				{:else if pendingAction === 'reset'}
					Tindakan ini akan membersihkan semua cache lokal, membatalkan service worker, lalu memuat
					ulang aplikasi. anda akan keluar setelah melakukan aksi ini
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={closeConfirm} disabled={isConfirmPending}>
				Batal
			</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleConfirm} disabled={isConfirmPending}>
				{#if pendingAction === 'purge-assets'}
					{isPurgingAssets ? 'Membersihkan...' : 'Ya, bersihkan'}
				{:else if pendingAction === 'bust-cache'}
					{isBustingCache ? 'Membersihkan...' : 'Ya, bersihkan'}
				{:else}
					{isResetting ? 'Mengatur ulang...' : 'Ya, reset'}
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
