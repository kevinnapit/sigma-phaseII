import type { Middleware } from 'openapi-fetch';

// ── Error middleware ───────────────────────────────────────────────────────
// Converts non-ok responses into thrown errors so TanStack Query's
// error state and retry logic activates correctly.
//
// Runs last — after createRefreshMiddleware. If refresh succeeded the
// replayed response is ok and this is a no-op. If refresh failed, the
// original 499 (or any other non-ok status) reaches here and throws.
export const throwOnErrorMiddleware: Middleware = {
	async onResponse({ response }) {
		if (!response.ok) {
			const body = await response
				.clone()
				.json()
				.catch(() => ({}));
			throw Object.assign(new Error(`${response.status} ${response.statusText}`), {
				status: response.status,
				detail: body?.detail,
				title: body?.title,
				body
			});
		}
	}
};
