import createClient from 'openapi-fetch';
import type { paths as adminPaths } from '$lib/generated/administration_and_agronomy/openapi.gen';
import type { paths as authPaths } from '$lib/generated/auth/openapi.gen';
import type { paths as notifPaths } from '$lib/generated/notification/openapi.gen';
import type { UserContext } from '$lib/modules/auth/context/user.svelte';
import { env } from '$env/dynamic/public';
import {
	createAuthMiddleware,
	createRefreshMiddleware,
	throwOnErrorMiddleware
} from '../middleware';
import { AuthConfig } from '$lib/modules/auth/config/auth-config';

// ── App client ─────────────────────────────────────────────────────────────
// For all regular API calls (/api/...).
// Middleware order matters:
//   1. createAuthMiddleware   — injects Authorization + X-Estate headers
//   2. createRefreshMiddleware — intercepts 499, refreshes token, replays
//   3. throwOnErrorMiddleware  — throws on any remaining non-ok response
export function createAdminClient(userCtx: UserContext) {
	const client = createClient<adminPaths>({
		baseUrl: env.PUBLIC_T2_API_URL || 'http://localhost:3003',
		credentials: AuthConfig.SHOULD_SEND_CREDENTIALS ? 'include' : undefined
	});
	client.use(throwOnErrorMiddleware);
	client.use(createAuthMiddleware(userCtx));
	client.use(createRefreshMiddleware(userCtx));
	return client;
}

// ── Auth client ────────────────────────────────────────────────────────────
// For auth-specific calls — login, logout, refresh, /info.
// Deliberately omits createRefreshMiddleware:
//   If /api/auth/refresh itself returns 499, intercepting it would call
//   runRefresh() again, which calls /api/auth/refresh again — infinite loop.
export function createAuthClient(userCtx: UserContext) {
	const client = createClient<authPaths>({
		baseUrl: env.PUBLIC_AUTH_API_URL || 'http://localhost:8080',
		credentials: AuthConfig.SHOULD_SEND_CREDENTIALS ? 'include' : undefined
	});
	client.use(throwOnErrorMiddleware);
	client.use(createAuthMiddleware(userCtx));
	client.use(createRefreshMiddleware(userCtx));
	return client;
}

export function createNotifClient(userCtx: UserContext) {
	const client = createClient<notifPaths>({
		baseUrl: env.PUBLIC_NOTIFICATION_API_URL || 'http://localhost:3000',
		credentials: AuthConfig.SHOULD_SEND_CREDENTIALS ? 'include' : undefined
	});
	client.use(throwOnErrorMiddleware);
	client.use(createAuthMiddleware(userCtx));
	client.use(createRefreshMiddleware(userCtx));
	return client;
}
