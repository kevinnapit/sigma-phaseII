<script lang="ts">
	import { page } from '$app/state';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Topbar from '$lib/components/layout/Topbar.svelte';
	import { SidebarProvider, SidebarInset } from '$lib/components/ui/sidebar';
	import {
		getMenuContext,
		MenuState,
		setMenuContext
	} from '$lib/config/menus/menu-state.svelte.js';
	import SessionWatcher from '$lib/modules/auth/components/session-watcher.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte.js';
	import AuthGuard from '../../lib/modules/auth/components/auth-guard.svelte';

	let { children } = $props();

	let sidebarOpen = $state(true);
	const userCtx = getUserContext();
	setMenuContext(() => new MenuState(userCtx.user?.modules ?? [], page.url.pathname));
	const menuCtx = getMenuContext();

	$effect.pre(() => {
		if (userCtx.user?.modules) {
			menuCtx().buildItems(userCtx.user?.modules, page.url.pathname);
		}
	});
</script>

<AuthGuard>
	<SessionWatcher {userCtx} />
	<SidebarProvider open={sidebarOpen} onOpenChange={(open) => (sidebarOpen = open)}>
		<Sidebar />
		<SidebarInset>
			<Topbar />
			<main
				class="@container flex flex-1 flex-col gap-4 overflow-y-auto p-3 transition-opacity duration-300 md:p-5 starting:opacity-0"
			>
				{@render children()}
			</main>
		</SidebarInset>
	</SidebarProvider>
</AuthGuard>
