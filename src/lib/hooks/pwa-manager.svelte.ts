type PwaInstallEventDetail = { force: boolean };
export interface PwaInstall {
	count: number;
	outcome: 'accepted' | 'dismissed' | '';
	installed: boolean;
	platform: string;
	lastPrompt: Date;
}
export type PwaInstallEvent = CustomEvent<PwaInstallEventDetail>;

class PWAManager {
	private deferredPrompt: BeforeInstallPromptEvent | null = null;
	private pwaLocalStoragekey = 'pwa-install';

	constructor() {
		$effect.root(() => {
			window.addEventListener('beforeinstallprompt', (e) => {
				e.preventDefault();
				this.deferredPrompt = e;
			});

			window.addEventListener('appinstalled', () => {
				this.updateInstallPrompt({ installed: true });
				this.deferredPrompt = null;
			});
		});
	}

	private safeParse = <T>(item: string | null, fallback: T) => {
		if (!item) return fallback;
		try {
			return JSON.parse(item) as T;
		} catch {
			return fallback;
		}
	};

	private fallback: PwaInstall = {
		count: 0,
		installed: false,
		outcome: '',
		platform: 'web',
		lastPrompt: new Date()
	};

	private getInstallPrompt(): PwaInstall {
		if (typeof window === 'undefined') return this.fallback;
		return this.safeParse<PwaInstall>(
			window.localStorage.getItem(this.pwaLocalStoragekey),
			this.fallback
		);
	}

	prepareInstallPromt(force: boolean = false) {
		if (typeof window === 'undefined') return;
		const pwaInstall = force ? this.fallback : this.getInstallPrompt();
		window.localStorage.setItem(
			this.pwaLocalStoragekey,
			JSON.stringify({ ...this.fallback, ...pwaInstall })
		);
		if (force) window.location.reload();
	}

	updateInstallPrompt(prompt: Partial<PwaInstall>) {
		if (typeof window === 'undefined') return;
		const current = this.safeParse<PwaInstall>(
			window.localStorage.getItem(this.pwaLocalStoragekey),
			this.fallback
		);
		window.localStorage.setItem(this.pwaLocalStoragekey, JSON.stringify({ ...current, ...prompt }));
	}

	private shouldInstall() {
		const prompt = this.getInstallPrompt();
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

	async installApp() {
		if (!this.shouldInstall()) return;
		if (!this.deferredPrompt) {
			console.log('deferredPrompt is null');
			return;
		}
		this.deferredPrompt.prompt();
		const { outcome, platform } = await this.deferredPrompt.userChoice;
		this.updateInstallPrompt({
			count: this.getInstallPrompt().count + 1,
			lastPrompt: new Date(),
			outcome,
			platform,
			installed: outcome === 'accepted'
		});

		this.deferredPrompt = null;
	}
}

export default new PWAManager();
