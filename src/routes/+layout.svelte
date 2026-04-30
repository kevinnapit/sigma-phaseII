<script lang="ts">
	import './layout.css';
	import { dev, version } from '$app/environment';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { setUserContext } from '$lib/modules/auth/context/user.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import ErrorScreen from '$lib/components/layout/error-screen.svelte';
	import LoadingScreen from '$lib/components/layout/loading-screen.svelte';
	import AuthProvider from '../lib/modules/auth/components/auth-provider.svelte';
	import RegisterSw from '$lib/components/ui/pwa/register-sw.svelte';
	import NetworkWatcher from '$lib/components/layout/network-watcher.svelte';
	import { createIDBPersister } from '$lib/config/persister/idb-persister.js';

	let { children, data } = $props();
	// svelte-ignore state_referenced_locally
	setUserContext(data.auth);

	// we need to make a proper error reporting, eg: sentry
	function reportError(_: unknown) {}
</script>

<Toaster richColors={true} theme="light" />
<RegisterSw>
	<NetworkWatcher />
	<PersistQueryClientProvider
		client={data.queryClient}
		persistOptions={{
			persister: createIDBPersister(),
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			buster: version
		}}
		onError={() => {
			console.error('[PersistQueryClientProvider] Failed to persist query client');
		}}
	>
		<div class="min-h-dvh bg-gray-50">
			{#if dev}
				<SvelteQueryDevtools buttonPosition="top-left" />
			{/if}
			<svelte:boundary onerror={reportError}>
				{#snippet failed(err, retry)}
					<ErrorScreen status={500} error={err} {retry} />
				{/snippet}
				{#snippet pending()}
					<LoadingScreen />
				{/snippet}
				<AuthProvider userCtx={data.auth}>
					{@render children()}
				</AuthProvider>
			</svelte:boundary>
		</div>
	</PersistQueryClientProvider>
</RegisterSw>
