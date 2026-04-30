import type { SvelteKitPWAOptions } from '@vite-pwa/sveltekit';

const fallbackEnabled = process.env.FALLBACK_ENABLED == 'true';

const generateSW: Partial<SvelteKitPWAOptions> = {
	strategies: 'generateSW',
	workbox: {
		importScripts: ['/generate-sw.js'],
		maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 * 1024, // 4GB
		globPatterns: [
			'client/**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json,webmanifest,ttf,otf,wasm}',
			'prerendered/**/*.{html,json}'
		],
		globIgnores: ['**/*.map', '**/sw-custom.js', '**/inject-manifest.ts'],
		navigateFallback: fallbackEnabled ? '/200.html' : undefined,
		navigateFallbackDenylist: [
			// _app/ immutable assets should never be caught by the fallback.
			/^\/_app\//,
			// Static asset extensions – never navigate-fallback for these.
			/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map)$/,
			// API-shaped paths (adjust to your domain).
			/^\/api\//
		],
		disableDevLogs: false,
		clientsClaim: true,
		skipWaiting: true,
		cleanupOutdatedCaches: true,
		runtimeCaching: [
			// ── 1. Immutable JS & CSS bundles (_app/immutable/*) ──────────────
			// Vite fingerprints these files by hash → safe to cache forever.
			// CacheFirst: serve from cache, never hit the network again.
			{
				urlPattern: /\/_app\/immutable\/.+\.(js|css)$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'immutable-bundles',
					expiration: {
						maxEntries: 200,
						// 1 year – effectively forever for fingerprinted files.
						maxAgeSeconds: 60 * 60 * 24 * 365
					},
					cacheableResponse: { statuses: [0, 200] }
				}
			},

			// ── 2. Static assets in /assets/* (images, icons, etc.) ──────────
			// These rarely change.  CacheFirst with a generous TTL.
			// Cap entries so the cache doesn't grow unbounded.
			{
				urlPattern: /\/assets\/.+\.(png|jpg|jpeg|gif|webp|svg|ico)$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'static-images',
					expiration: {
						maxEntries: 100,
						// 30 days.
						maxAgeSeconds: 60 * 60 * 24 * 30
					},
					cacheableResponse: { statuses: [0, 200] }
				}
			},

			// ── 3. Web fonts (Google Fonts / self-hosted) ─────────────────────
			// Fonts are large and stable.  CacheFirst is the right call.
			// Separate cache per type keeps quotas clean.
			{
				urlPattern: /\.(woff2?|ttf|eot|otf)(\?.*)?$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'web-fonts',
					expiration: {
						maxEntries: 30,
						// 1 year.
						maxAgeSeconds: 60 * 60 * 24 * 365
					},
					cacheableResponse: { statuses: [0, 200] }
				}
			},

			// ── 4. Google Fonts stylesheets ───────────────────────────────────
			// Stylesheets can change (new font variants).
			// StaleWhileRevalidate: serve instantly from cache, refresh quietly.
			{
				urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'google-fonts-stylesheets',
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
					},
					cacheableResponse: { statuses: [0, 200] }
				}
			}

			// ── 5. YOUR API (read-only GET endpoints) ─────────────────────────
			// NetworkFirst: prefer fresh data; fall back to cached copy offline.
			// 10-second timeout before falling back, so slow networks don't hang.
			// Adjust the URL pattern to match your actual API origin.
			// {
			//   urlPattern: /^https:\/\/api\.example\.com\/v1\/.*/,
			//   handler: 'NetworkFirst',
			//   method: 'GET',
			//   options: {
			//     cacheName: 'api-get-cache',
			//     networkTimeoutSeconds: 10,
			//     expiration: {
			//       maxEntries: 50,
			//       maxAgeSeconds: 60 * 60 * 24, // 1 day
			//     },
			//     cacheableResponse: { statuses: [0, 200] },
			//   },
			// },

			// ── NOTE: POST/mutation requests are intentionally NOT cached. ─────
			// Background sync for offline mutations should be handled in
			// push-handler.js using the Background Sync API directly.
		]
	}
};

const injectManifest: Partial<SvelteKitPWAOptions> = {
	strategies: 'injectManifest',
	srcDir: 'src',
	filename: 'inject-manifest.ts',
	injectManifest: {
		globPatterns: [
			'client/**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json,webmanifest,ttf,otf,wasm}',
			'prerendered/**/*.{html,json}'
		]
	}
};

export default (injection: boolean) => {
	if (injection) {
		return injectManifest;
	}
	return generateSW;
};
