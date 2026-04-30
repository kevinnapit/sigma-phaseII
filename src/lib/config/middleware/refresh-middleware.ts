import { AuthConfig } from '$lib/modules/auth/config/auth-config';
import type { UserContext } from '$lib/modules/auth/context/user.svelte';
import type { Middleware } from 'openapi-fetch';
// ── Refresh middleware ─────────────────────────────────────────────────────
// Handles TOKEN_EXPIRED_STATUS (499) for all requests through the app client.
// This is the single place where token refresh happens — covers TanStack
// queries, mutations, and direct client().GET/POST calls outside TanStack.
//
// Safe to register on any client — internally skips AuthConfig.REFRESH_TOKEN_PATH
// to prevent infinite loops. The auth client omits it anyway as a second defense.
//
// Replay approach:
//   The original request body stream may be consumed by the time onResponse
//   fires, so we cannot replay via new Request(originalRequest). Instead we
//   reconstruct a fresh Request from the original's URL, method, and headers,
//   re-reading the body via request.clone().blob() for non-GET requests.
//   Per the openapi-fetch docs, returning a Response from onResponse replaces
//   what the client sees — the replayed response flows through all subsequent
//   middleware (throwOnErrorMiddleware) normally. No middleware bypass.
export function createRefreshMiddleware(userCtx: UserContext): Middleware {
	return {
		async onResponse({ request, response }) {
			if (response.status !== AuthConfig.TOKEN_EXPIRED_STATUS) return;

			// Never intercept refresh token requests — would cause an infinite
			// loop if the refresh endpoint itself returns 499.
			// This is a safety net on top of the auth client not having this
			// middleware registered — covers edge cases where base URLs overlap
			// or the middleware is accidentally added to the wrong client.
			const url = new URL(request.url);
			if (url.pathname.includes(AuthConfig.REFRESH_TOKEN_PATH)) return;

			// runRefresh() deduplicates internally via #refreshPromise —
			// concurrent 499s all share one in-flight refresh call.
			const newToken = await userCtx.runRefresh();

			if (!newToken) {
				// Refresh failed — return nothing so throwOnErrorMiddleware
				// receives the original 499 and throws it. QueryCache.onError
				// in query-client.ts then calls handleUnauthorized.
				return;
			}

			// Reconstruct request with updated token
			const headers = new Headers(request.headers);
			headers.set('Authorization', `Bearer ${newToken}`);

			const replayRequest = new Request(request.url, {
				method: request.method,
				headers,
				body:
					request.method !== 'GET' && request.method !== 'HEAD'
						? await request.clone().blob()
						: undefined,
				credentials: request.credentials,
				mode: request.mode,
				cache: request.cache,
				redirect: request.redirect
			});

			return fetch(replayRequest);
		}
	};
}
