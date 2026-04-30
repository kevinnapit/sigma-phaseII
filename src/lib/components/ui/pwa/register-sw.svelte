<script lang="ts">
	import { createSwManager, setSwManager } from '$lib/hooks/use-sw-manager.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { registerSW } from 'virtual:pwa-register';
	import { onMount } from 'svelte';
	import RegisterNotification from './register-notification.svelte';

	let { children } = $props();

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	const swManager = createSwManager(null);
	setSwManager(swManager);

	onMount(() => {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		navigator.serviceWorker.getRegistration('/').then((existing) => {
			if (existing) {
				// Already registered — just wire up the existing registration
				swManager.setRegistration(existing);
				return;
			}
			virtualRegistration();
		});
	});

	function virtualRegistration() {
		if (!pwaInfo) {
			return;
		}

		registerSW({
			immediate: true,
			onNeedRefresh() {
				swManager.setNeedRefresh(true);
			},
			onOfflineReady() {
				swManager.setOfflineReady();
			},
			onRegistered(registration) {
				if (registration) {
					swManager.setRegistration(registration);
				}
				if (registration && 'periodicSync' in registration) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(registration.periodicSync as any)
						?.register?.('content-refresh', { minInterval: 24 * 60 * 60 * 1000 })
						.catch(() => {
							/* periodicSync not granted – silently ignore */
						});
				}
			},
			onRegisterError() {
				// Ignore registration noise in environments where the PWA plugin is disabled.
			}
		});
	}
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifestLink}
</svelte:head>
<RegisterNotification>
	{@render children()}
</RegisterNotification>
