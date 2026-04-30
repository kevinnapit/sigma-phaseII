// lib/modules/auth/context/user.svelte.ts
import { createAdminClient, createAuthClient, createNotifClient } from '$lib/config/fetcher/client';
import type { Permission } from '$lib/generated/permissions';
import { createContext } from 'svelte';
import type { AuthStorage } from '../storage/auth-storage';
import { AuthConfig } from '../config/auth-config';
import { checkIsAPIError } from '$lib/shared/utils/error-handler';

export type Estate = Prettify<Omit<AuthSchemas['SelectableEstateAndCommodity'], 'commodity'>>;

const safeParse = <T>(data: string): T | undefined => {
	try {
		return JSON.parse(data) as T;
	} catch {
		return undefined;
	}
};

// ── UserContext ────────────────────────────────────────────────────────────

export class UserContext {
	// ── Public reactive state ─────────────────────────────────────────
	user = $state<ValidUser | undefined>(undefined);
	estate = $state<Estate | undefined>(undefined);

	// Signals to auth-provider and auth-guard that the settle flow is done.
	// Once true it never goes back to false within a session.
	settled = $state(false);

	// ── Private reactive state ────────────────────────────────────────
	#token = $state<string | undefined>(undefined);
	#refreshToken = $state<string | undefined>(undefined);

	// Deduplicates concurrent refresh calls — only one refresh runs at
	// a time regardless of how many requests hit 499 simultaneously.
	// Shared across fetchMiddleware and withTokenRefresh callers.
	#refreshPromise: Promise<string | null> | null = null;

	// ── Derived ───────────────────────────────────────────────────────
	readonly xEstate = $derived.by(() => {
		if (!this.estate) return '';
		return this.estate.id;
		// if (!this.estate.commodity?.id) return this.estate.id ?? '';
		// return `${this.estate.id}:${this.estate.commodity.id}`;
	});

	// ── Singleton clients ─────────────────────────────────────────────
	// Created once, reused forever. Token freshness is guaranteed by
	// the auth middleware reading #token lazily at request time.
	readonly #client: ReturnType<typeof createAdminClient>;
	readonly #authClient: ReturnType<typeof createAuthClient>;
	readonly #notifClient: ReturnType<typeof createNotifClient>;

	// ── Constructor ───────────────────────────────────────────────────
	// Side-effect free except for the storage event listener and
	// $effect.pre, both of which require a browser context.
	// Instantiate inside +layout.svelte (Svelte reactive context).
	constructor(private readonly storage: AuthStorage) {
		this.#client = createAdminClient(this);
		this.#authClient = createAuthClient(this);
		this.#notifClient = createNotifClient(this);
		this.#registerStorageSync();
	}

	// ── Multi-tab token sync ──────────────────────────────────────────
	// When another tab refreshes the token, localStorage is updated.
	// The storage event fires in all OTHER tabs (not the one that wrote).
	// We sync #token in memory so the next request from this tab uses
	// the new token without waiting for a page reload or hydrate() call.
	//
	// This replaces the BroadcastChannel + SW postMessage approach —
	// same result with zero infrastructure since localStorage is already
	// shared across tabs by the browser.
	#registerStorageSync() {
		if (typeof window === 'undefined') return; // SSR guard

		window.addEventListener('storage', (e: StorageEvent) => {
			if (e.key === this.storage.tokenKey() && e.newValue) {
				this.#token = e.newValue;
			}
			if (e.key === this.storage.refreshTokenKey() && e.newValue) {
				this.#refreshToken = e.newValue;
			}
			// Token cleared in another tab (logout) — clear this tab too.
			// Auth-guard will handle redirect on next navigation.
			if (e.key === this.storage.tokenKey() && e.newValue === null) {
				this.user = undefined;
				this.#token = undefined;
				this.#refreshToken = undefined;
			}
		});
	}

	// ── Token accessors (read-only externally) ────────────────────────
	get token() {
		return this.#token;
	}
	get refreshToken() {
		return this.#refreshToken;
	}

	// ── Hydration ─────────────────────────────────────────────────────
	// Called once by auth-provider after mount before the settle flow.
	// Loads persisted tokens + estate into reactive memory.
	async hydrate() {
		const [token, refreshToken, estateRaw] = await Promise.all([
			this.storage.getToken(),
			this.storage.getRefreshToken(),
			this.storage.getEstate()
		]);

		this.#token = token ?? undefined;
		this.#refreshToken = refreshToken ?? undefined;
		this.estate = estateRaw ? safeParse<Estate>(estateRaw) : undefined;
	}

	// ── Auth lifecycle ─────────────────────────────────────────────────

	async setUser(data: { user: ValidUser; estate?: Estate }, token: string, refreshToken: string) {
		this.user = data.user;
		this.estate = data.estate;
		await Promise.all([
			this.setTokens(token, refreshToken),
			this.storage.setEstate(JSON.stringify(data.estate ?? null))
		]);
	}

	async setTokens(token: string, refreshToken: string) {
		this.#token = token;
		this.#refreshToken = refreshToken;
		await this.storage.setTokens(token, refreshToken);
	}

	// Clears auth state and persisted tokens.
	// Estate is preserved — users who log in/out frequently
	// shouldn't have to reselect their estate every time.
	// Call clearEstate() explicitly if needed.
	async clear() {
		this.user = undefined;
		this.#token = undefined;
		this.#refreshToken = undefined;
		await this.storage.clearAll();
	}

	async clearEstate() {
		this.estate = undefined;
		await this.storage.clearEstate();
	}

	markSettled() {
		this.settled = true;
	}

	// ── Refresh runner ─────────────────────────────────────────────────
	// Single source of truth for token refresh logic.
	// Called by:
	//   - createRefreshMiddleware in client.ts (covers all fetch calls)
	//   - withTokenRefresh() for explicit queryFn wrapping
	//
	// Deduplicates concurrent calls via #refreshPromise — if three
	// requests hit 499 simultaneously, only one refresh call is made
	// and all three await the same promise.
	async runRefresh(): Promise<string | null> {
		if (!this.#refreshPromise) {
			this.#refreshPromise = (async () => {
				const rt = this.#refreshToken;
				if (!rt) return null;

				try {
					const { data, error } = await this.#authClient.POST('/api/auth/refresh', {
						headers: { refresh_token: rt }
					});

					if (error || !data) return null;

					const newToken = data?.data?.access_token ?? '';
					const newRefreshToken = data?.data?.refresh_token ?? '';

					await this.setTokens(newToken, newRefreshToken);
					return newToken;
				} catch {
					return null;
				}
			})().finally(() => {
				this.#refreshPromise = null;
			});
		}
		return this.#refreshPromise;
	}

	// ── withTokenRefresh ───────────────────────────────────────────────
	// Explicit wrapper for queryFn calls that want a readable contract.
	// The fetcher middleware (createRefreshMiddleware) already handles
	// 499 for all requests — this is an opt-in convenience for queryFns
	// that want explicit retry semantics in their own code.
	//
	// Usage:
	//   queryFn: () => userCtx.withTokenRefresh((client) =>
	//       client.GET('/api/something')
	//   )
	async withTokenRefresh<T>(
		fn: (client: ReturnType<typeof createAdminClient>) => Promise<T>
	): Promise<T> {
		try {
			return await fn(this.#client);
		} catch (err: unknown) {
			if (!checkIsAPIError(err)) throw err;
			if (err.status !== AuthConfig.TOKEN_EXPIRED_STATUS) throw err;

			const newToken = await this.runRefresh();
			if (!newToken) {
				await this.clear();
				throw Object.assign(new Error('Session expired'), { status: 401 });
			}

			return await fn(this.#client);
		}
	}

	// ── Estate management ──────────────────────────────────────────────

	async setEstateAndCommodity(estate: Estate) {
		this.estate = estate;
		await this.storage.setEstate(JSON.stringify(estate));
	}

	async setEstate(estate: Estate) {
		this.estate = estate;
		await this.storage.setEstate(JSON.stringify(estate));
	}

	// ── API clients ────────────────────────────────────────────────────
	client() {
		return this.#client;
	}
	authClient() {
		return this.#authClient;
	}
	notifClient() {
		return this.#notifClient;
	}

	// ── Permissions ────────────────────────────────────────────────────

	hasPermission(permission: Permission | (string & {})) {
		if (!this.user?.permissions?.length) return false;
		return this.user.permissions.includes(permission);
	}

	authenticated(): this is this & { user: ValidUser } {
		return !!this.user;
	}

	validateUser(user: AuthSchemas['User']): user is ValidUser {
		return !!(user && user.role && (user.modules || user.permissions));
	}
}

// ── Context ────────────────────────────────────────────────────────────────

export const [getUserContext, setUserContext] = createContext<UserContext>();

// Throws if called outside /dashboard where user is guaranteed.
// Use instead of getUserContext() + null checks in protected components.
export const getValidUser = (): UserContext & { user: ValidUser } => {
	const ctx = getUserContext();
	if (!ctx.user) throw new Error('User not found — only callable inside /dashboard');
	return ctx as UserContext & { user: ValidUser };
};
