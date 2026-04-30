const BUILD_DIR = './build';
const PORT = Number(Bun.env.PORT) || 4173;

const server = Bun.serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		const pathname = url.pathname;

		// Try to serve the exact file
		let file = Bun.file(`${BUILD_DIR}${pathname}`);
		if (await file.exists()) {
			return new Response(file, {
				headers: getCacheHeaders(pathname)
			});
		}

		// Rewrite nested /_app/ requests to serve from the root /_app/ directory
		const appIndex = pathname.indexOf('/_app/');
		if (appIndex > 0) {
			file = Bun.file(`${BUILD_DIR}${pathname.slice(appIndex)}`);
			if (await file.exists()) {
				return new Response(file, {
					headers: getCacheHeaders(pathname)
				});
			}
		}

		// Try serving the file from the build root by basename (handles sw.js, manifest, etc.)
		const basename = pathname.split('/').pop();
		if (basename && basename.includes('.')) {
			file = Bun.file(`${BUILD_DIR}/${basename}`);
			if (await file.exists()) {
				return new Response(file, {
					headers: getCacheHeaders(basename)
				});
			}
		}

		// Try with index.html for directory paths
		if (pathname.endsWith('/')) {
			file = Bun.file(`${BUILD_DIR}${pathname}index.html`);
			if (await file.exists()) {
				return new Response(file, {
					headers: getCacheHeaders('index.html')
				});
			}
		}

		// SPA fallback — serve 200.html for client-side routing
		const fallback = Bun.file(`${BUILD_DIR}/200.html`);
		if (await fallback.exists()) {
			return new Response(fallback, {
				headers: getCacheHeaders('200.html')
			});
		}

		return new Response('Not Found', { status: 404 });
	}
});

/**
 * Returns appropriate Cache-Control headers based on the file path.
 * - sw.js: no-store (browser must always fetch fresh to detect updates)
 * - Immutable assets (hashed filenames): cached for 1 year
 * - HTML files: no-cache (revalidate on each request)
 * - Everything else: short cache with revalidation
 */
function getCacheHeaders(path: string): HeadersInit {
	// Service worker must never be cached
	if (path.endsWith('sw.js') || path.endsWith('generate-sw.js')) {
		return { 'Cache-Control': 'no-store' };
	}
	// Immutable assets have content hashes in filenames
	if (path.includes('/immutable/')) {
		return { 'Cache-Control': 'public, max-age=31536000, immutable' };
	}
	// HTML should always revalidate
	if (path.endsWith('.html')) {
		return { 'Cache-Control': 'no-cache' };
	}
	// Other static assets: cache for 1 hour with revalidation
	return { 'Cache-Control': 'public, max-age=3600, must-revalidate' };
}

console.log(`🚀 Preview server running at http://localhost:${server.port}`);
