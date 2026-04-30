// lib/config/middleware/middleware.ts
import type { Middleware } from 'openapi-fetch';
import type { UserContext } from '$lib/modules/auth/context/user.svelte';
import { AuthConfig } from '$lib/modules/auth/config/auth-config';

// ── Auth middleware ────────────────────────────────────────────────────────
// Reads userCtx.token and userCtx.xEstate lazily at request time.
// Because both are $state, this always reflects the latest in-memory
// value — including tokens updated after a refresh — without needing
// to recreate the client.
export function createAuthMiddleware(userCtx: UserContext): Middleware {
	return {
		async onRequest({ request }) {
			if (userCtx.token) {
				request.headers.set(AuthConfig.AuthHeader, `Bearer ${userCtx.token}`);
			}
			if (userCtx.xEstate) {
				request.headers.set(AuthConfig.XEstateHeader, userCtx.xEstate);
			}
			return request;
		}
	};
}
