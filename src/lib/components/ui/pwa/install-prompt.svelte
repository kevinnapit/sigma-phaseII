<script lang="ts" module>
	export type PwaInstallEventDetail = { force: boolean };
	export const PwaInstallEvent = CustomEvent<PwaInstallEventDetail>;
	export interface PwaInstall {
		count: number;
		outcome: 'accepted' | 'dismissed' | '';
		installed: boolean;
		platform: string;
		lastPrompt: Date;
	}
	const pwaLocalStoragekey = 'pwa-install';

	const safeParse = <T,>(item: string | null, fallback: T) => {
		if (!item) return fallback;
		try {
			return JSON.parse(item) as T;
		} catch {
			return fallback;
		}
	};

	const fallback: PwaInstall = {
		count: 0,
		installed: false,
		outcome: '',
		platform: 'web',
		lastPrompt: new Date()
	};

	function getInstallPrompt(): PwaInstall {
		if (typeof window === 'undefined') return fallback;
		return safeParse<PwaInstall>(window.localStorage.getItem(pwaLocalStoragekey), fallback);
	}

	export function prepareInstallPromt(force: boolean = false) {
		if (typeof window === 'undefined') return;
		const pwaInstall = force ? fallback : getInstallPrompt();
		window.localStorage.setItem(pwaLocalStoragekey, JSON.stringify({ ...fallback, ...pwaInstall }));
		if (force) window.location.reload();
	}

	function updateInstallPrompt(prompt: Partial<PwaInstall>) {
		if (typeof window === 'undefined') return;
		const current = safeParse<PwaInstall>(
			window.localStorage.getItem(pwaLocalStoragekey),
			fallback
		);
		window.localStorage.setItem(pwaLocalStoragekey, JSON.stringify({ ...current, ...prompt }));
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let deferredPrompt: BeforeInstallPromptEvent | null = null;

	onMount(() => {
		// Listen for install prompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
		});

		// Check if app is already installed
		window.addEventListener('appinstalled', () => {
			updateInstallPrompt({ installed: true });
			deferredPrompt = null;
		});

		window.addEventListener('install-pwa', (event) => {
			const { force = false } = (event as Event & { detail: PwaInstallEventDetail }).detail;
			if (shouldInstall() || force === true) installApp();
			else window.location.reload();
		});
	});

	function shouldInstall() {
		const prompt = getInstallPrompt();
		if (prompt.installed) return false;
		if (prompt.count >= 3) return false;
		if (prompt.outcome === 'accepted') return false;
		if (prompt.outcome === 'dismissed') {
			// Only show again after 24 hours
			return new Date().getTime() - new Date(prompt.lastPrompt).getTime() > 1000 * 60 * 60 * 24;
		}
		// Show for first time or other states
		return true;
	}

	async function installApp() {
		if (!deferredPrompt) {
			console.log('deferredPrompt is null');
			return;
		}
		deferredPrompt.prompt();
		const { outcome, platform } = await deferredPrompt.userChoice;
		updateInstallPrompt({
			count: getInstallPrompt().count + 1,
			lastPrompt: new Date(),
			outcome,
			platform,
			installed: outcome === 'accepted'
		});

		deferredPrompt = null;
	}
</script>
