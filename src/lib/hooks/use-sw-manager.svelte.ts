import { createContext } from 'svelte';
import type { QueryClient } from '@tanstack/svelte-query';
import type { MenuState } from '$lib/config/menus/menu-state.svelte';
import type { UserContext } from '$lib/modules/auth/context/user.svelte';

export type Storageable = {
	queryClient: QueryClient;
	menuState: () => MenuState;
	userContext: UserContext;
};
export class SwManager {
	registration: ServiceWorkerRegistration | null = $state(null);
	isRegistered = $derived(this.registration !== null);
	isActive = $derived(this.registration?.active != null);

	#_isOfflineReady = $state(false);
	#_isNeedRefresh = $state(false);
	constructor(r: ServiceWorkerRegistration | null) {
		this.registration = r;
	}

	setRegistration(r: ServiceWorkerRegistration) {
		this.registration = r;
	}

	updateApp() {
		if (!this.registration) {
			console.log('No SW registration found');
			return;
		}
		this.registration.update();
	}

	unregisterApp() {
		if (!this.registration) {
			console.log('No SW registration found');
			return;
		}
		this.registration.unregister();
	}

	purgeAssetsCache() {
		if (!this.registration) {
			console.log('No SW registration found');
			return;
		}
		this.registration.active?.postMessage({ type: 'PURGE_CACHE' });
	}

	/**
	 * Busts the app cache by clearing the query client and menu state.
	 * - Clears the query client
	 * - Clears the menu state
	 */
	async bustAppCache(storage: Partial<Storageable>) {
		storage.queryClient?.clear();
		await storage.menuState?.().persistor.clearRecent();
		storage.userContext?.clear();
	}

	/**
	 * Resets the app by purging the assets cache, busting the app cache, and unregistering the service worker.
	 * - Purges the assets cache
	 * - Busts the app cache
	 * - Unregisters the service worker
	 * - Delete local storage
	 * - Delete user context
	 */
	async resetApp(storage: Storageable) {
		this.purgeAssetsCache();
		await this.bustAppCache(storage);
		localStorage.clear();
		this.unregisterApp();
	}

	setOfflineReady() {
		this.#_isOfflineReady = true;
		console.log('App ready to work offline.');
	}

	readonly isOfflineReady = $derived(this.#_isOfflineReady);

	setNeedRefresh(needRefresh: boolean) {
		this.#_isNeedRefresh = needRefresh;
		console.log('New content available, please refresh.');
	}

	readonly isNeedRefresh = $derived(this.#_isNeedRefresh);
}

export function createSwManager(r: ServiceWorkerRegistration | null) {
	return new SwManager(r);
}

export const [getSwManager, setSwManager] = createContext<SwManager>();
