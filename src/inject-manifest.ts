// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

/// <reference types="./sw.d.ts" />

import { build, files, version, prerendered } from '$service-worker';
// import { precacheAndRoute } from 'workbox-precaching';

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files, // everything in `static`
	...prerendered // everything in `prerendered`
];

const cacheable_destinations: RequestDestination[] = ['script', 'style', 'worker', 'image', 'font'];

self.addEventListener('install', async (event) => {
	await self.skipWaiting();
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}
	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', async (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}
	// Remove previous cached data from disk
	event.waitUntil(Promise.all([deleteOldCaches(), self.clients.claim()]));
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			if (cacheable_destinations.includes(event.request.destination) == false) {
				const response = await cache.match(event.request);
				if (response) {
					return response;
				}
				return await fetch(event.request);
			}

			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

// Handle incoming push notifications
self.addEventListener('push', (event) => {
	console.log('[ServiceWorker] Push event received');

	let payload: PushPayload = {
		title: 'New Notification',
		body: 'You have a new notification'
	};

	if (event.data) {
		try {
			payload = event.data.json() as PushPayload;
			console.log('[ServiceWorker] Push payload:', payload);
		} catch (e) {
			console.warn('[ServiceWorker] Failed to parse push payload as JSON, using text:', e);
			payload = {
				title: 'New Notification',
				body: event.data.text()
			};
		}
	}

	const options: NotificationOptions = {
		body: payload.body,
		icon: payload.icon_url || undefined,
		badge: payload.badge_url || undefined,
		data: {
			action_url: payload.action_url,
			image_url: payload.image_url,
			metadata: payload.metadata
		},
		tag: 'push-notification',
		requireInteraction: false
	};

	event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
	console.log('[ServiceWorker] Notification clicked');

	event.notification.close();

	const actionUrl: string = event.notification.data?.action_url || '/';

	event.waitUntil(
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			// Try to focus an existing window
			for (const client of clientList) {
				if ('focus' in client) {
					(client as WindowClient).navigate(actionUrl);
					return (client as WindowClient).focus();
				}
			}
			// Open a new window if none exists
			return self.clients.openWindow(actionUrl);
		})
	);
});

self.addEventListener('notificationclose', (event) => {
	console.log('[ServiceWorker] Notification closed', event.notification);
});

// const precache_list = [...build, ...files, ...prerendered].map((s) => ({
// 	url: s,
// 	revision: version
// }));

// precacheAndRoute(precache_list);
