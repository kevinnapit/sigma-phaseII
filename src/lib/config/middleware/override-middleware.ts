import type { Middleware } from 'openapi-fetch';

// ── Per-call override middleware ───────────────────────────────────────────
// Backward compatibility for callers that previously passed options to
// client(options) to override token or xEstate on a per-request basis.
//
// Instead of recreating the client, we apply a one-time middleware that
// overrides specific headers for a single request, then ejects itself.
//
// Usage in UserContext.client(options):
//   if (options) client.use(createOverrideMiddleware(options))
//
// The middleware ejects itself after the first request so the singleton
// client is not permanently mutated.

export interface ClientOverrideOptions {
	// Override the Authorization token for this request only.
	// Useful when making a call on behalf of a different session.
	token?: string;
	// Override the X-Estate header for this request only.
	// Useful when a component needs to query a different estate
	// than the one currently selected in userCtx.estate.
	xEstate?: string;
}

export function createOverrideMiddleware(
	client: { eject: (middleware: Middleware) => void },
	options: ClientOverrideOptions
): Middleware {
	const middleware: Middleware = {
		async onRequest({ request }) {
			if (options.token !== undefined) {
				request.headers.set('Authorization', `Bearer ${options.token}`);
			}
			if (options.xEstate !== undefined) {
				if (options.xEstate) {
					request.headers.set('X-Estate', options.xEstate);
				} else {
					// Empty string means explicitly remove the header
					request.headers.delete('X-Estate');
				}
			}
			// Self-eject after the first request — does not permanently
			// mutate the singleton client.
			client.eject(middleware);
			return request;
		}
	};
	return middleware;
}
