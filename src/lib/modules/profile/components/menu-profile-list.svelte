<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { type Storageable } from '$lib/hooks/use-sw-manager.svelte';
	import { getQueryClientContext } from '@tanstack/svelte-query';
	import ListSession from './session/list-session.svelte';
	import SwMenu from './sw/sw-menu.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { getMenuContext } from '$lib/config/menus/menu-state.svelte';

	const storage: Storageable = {
		queryClient: getQueryClientContext(),
		menuState: getMenuContext(),
		userContext: getUserContext()
	};

	let activeTab = 'session';
</script>

<Tabs.Root bind:value={activeTab}>
	<Tabs.List class="grid w-full grid-cols-3">
		<Tabs.Trigger value="session">Sesi Akun</Tabs.Trigger>
		<Tabs.Trigger value="sw">Manajemen Aplikasi</Tabs.Trigger>
		<Tabs.Trigger value="profile">Profil</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="session" class="mt-6">
		<ListSession />
	</Tabs.Content>
	<Tabs.Content value="profile" class="mt-6">profil</Tabs.Content>
	<Tabs.Content value="sw" class="mt-6">
		<SwMenu {storage} />
	</Tabs.Content>
</Tabs.Root>
