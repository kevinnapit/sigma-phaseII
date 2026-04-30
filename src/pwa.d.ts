// PWA virtual modules
declare module 'virtual:pwa-info' {
	export interface PwaInfo {
		pwaInDevEnvironment: boolean;
		webManifest: {
			linkTag: string;
		};
	}
	export const pwaInfo: PwaInfo | undefined;
}

declare module 'virtual:pwa-register' {
	export interface RegisterSWOptions {
		immediate?: boolean;
		onNeedRefresh?: () => void;
		onOfflineReady?: () => void;
		onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
		onRegisterError?: (error: unknown) => void;
	}
	export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

declare module 'virtual:pwa-register/svelte' {
	import type { Writable } from 'svelte/store';

	export interface RegisterSWOptions {
		immediate?: boolean;
		onNeedRefresh?: () => void;
		onOfflineReady?: () => void;
		onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
		onRegisterError?: (error: unknown) => void;
	}

	export function useRegisterSW(options?: RegisterSWOptions): {
		needRefresh: Writable<boolean>;
		offlineReady: Writable<boolean>;
		updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
	};
}

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
	prompt(): Promise<void>;
}
interface WindowEventMap {
	beforeinstallprompt: BeforeInstallPromptEvent;
}
