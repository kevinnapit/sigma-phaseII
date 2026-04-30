<script lang="ts">
	import { goto } from '$app/navigation';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Menu, Search, User, Settings, LogOut, DownloadIcon, Bell } from 'lucide-svelte';
	import SearchModal from './SearchModal.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { resolve } from '$app/paths';
	import PwaManager from '$lib/hooks/pwa-manager.svelte';
	import { permissionManager } from '$lib/hooks/use-permission';
	import { AuthConfig } from '$lib/modules/auth/config/auth-config';
	import { toast } from 'svelte-sonner';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { getMenuContext } from '$lib/config/menus/menu-state.svelte';
	import { getNotificationManager } from '$lib/hooks/use-notification.svelte';

	const userCtx = getUserContext();
	const queryClient = useQueryClient();
	const menuState = getMenuContext();
	const notificationManager = getNotificationManager()

	let showSearchModal = $state(false);

	let logoutLoading = $state(false);
	async function handleLogout(e: Event) {
		e.preventDefault();
		try {
			logoutLoading = true;
			const { data, error } = await userCtx.authClient().POST('/api/auth/logout');
			if (error) {
				console.error(error);
				toast.error(error.detail || 'Gagal Keluar');
				return;
			}
			if (data) {
				await goto(resolve(AuthConfig.UNAUTHENTICATED_REDIRECT));
				queryClient.clear();
				await Promise.all([userCtx.clear(), menuState().persistor.clearRecent()]);
				return;
			}
		} catch (err) {
			console.error(err);
			toast.error('Terjadi Kesalahan Saat Keluar');
		} finally {
			logoutLoading = false;
		}
	}

	function handleSearchClick() {
		showSearchModal = true;
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			showSearchModal = true;
		}
	}

	async function goToProfile() {
		goto(resolve('/dashboard/profil'));
	}

	$effect(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	async function handleSubscribeNotification() {
		toast.info('Mengaktifkan notifikasi...');
		const userID = userCtx.user?.id;
		if (!userID) return;
		const notificationPermission = await permissionManager.requestNotificationPermission();
		if (notificationPermission === 'denied') return
		const pushSubscription = await notificationManager.subscribe()
		if (!pushSubscription) return
		const response = await notificationManager.sendSubscription(userID)
		if (!response) toast.error('Gagal mengaktifkan notifikasi')
		else toast.info('Notifikasi berhasil diaktifkan')
		// toast.promise(async () => {
		// }, {
		// 	loading: 'Mengaktifkan notifikasi...',
		// 	success: 'Notifikasi berhasil diaktifkan',
		// 	error: 'Gagal mengaktifkan notifikasi'
		// })
	}
</script>

<SearchModal bind:open={showSearchModal} />

<header
	class="sticky top-0 z-11 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-2 md:px-4"
>
	<div class="flex flex-1 items-center gap-3">
		<SidebarTrigger class="text-gray-600 hover:text-gray-900">
			<Menu class="h-5 w-5" />
		</SidebarTrigger>

		<button
			onclick={handleSearchClick}
			class="relative flex h-9 max-w-md flex-1 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm transition-colors hover:border-gray-300 hover:bg-white"
		>
			<Search class="h-4 w-4 text-gray-400" />
			<span class="text-gray-400">Search menu...</span>
			<kbd
				class="pointer-events-none absolute right-2 flex h-5 items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 text-[10px] font-medium text-gray-500"
			>
				<span class="text-xs">⌘</span>
				<span>K</span>
			</kbd>
		</button>
	</div>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-50"
		>
			<div class="text-right">
				<div class="hidden text-xs font-medium text-gray-900 sm:block md:text-sm">
					{userCtx.user?.name || 'User'}
				</div>
				<div class="hidden w-fit text-[10px] text-gray-500 sm:block md:text-xs">
					{userCtx.user?.role?.name || 'User'}
				</div>
			</div>
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white"
			>
				{userCtx.user?.name?.slice(0, 2).toUpperCase() || 'U'}
			</div>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="w-56" align="end">
			<DropdownMenu.Label>
				<div class="flex flex-col space-y-1">
					<p class="text-sm leading-none font-medium">{userCtx.user?.name || 'User'}</p>
					<p class="text-xs leading-none text-muted-foreground">
						{userCtx.user?.role?.name || 'User'}
					</p>
				</div>
			</DropdownMenu.Label>

			<DropdownMenu.Separator />

			<DropdownMenu.Item onclick={goToProfile}>
				<User class="mr-2 h-4 w-4" />
				<span>Profil</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<Settings class="mr-2 h-4 w-4" />
				<span>Pengaturan Akun</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item onclick={() => PwaManager.installApp()}>
				<DownloadIcon class="mr-2 h-4 w-4" />
				<span>Install</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item onclick={() => handleSubscribeNotification() }>
				<Bell class="mr-2 h-4 w-4" />
				<span>Notifikasi</span>
			</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item variant="destructive" disabled={logoutLoading} onclick={handleLogout}>
				<LogOut class="mr-2 h-4 w-4" />
				<span>Keluar</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
