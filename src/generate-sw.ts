/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="./sw.d.ts" />

const sw = globalThis.self as unknown as ServiceWorkerGlobalScope;

// Handle incoming push notifications
sw.addEventListener('push', (event) => {
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

	event.waitUntil(sw.registration.showNotification(payload.title, options));
});

sw.addEventListener('notificationclick', (event) => {
	console.log('[ServiceWorker] Notification clicked');

	event.notification.close();

	const actionUrl: string = event.notification.data?.action_url || '/';

	event.waitUntil(
		sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			// Try to focus an existing window
			for (const client of clientList) {
				if ('focus' in client) {
					(client as WindowClient).navigate(actionUrl);
					return (client as WindowClient).focus();
				}
			}
			// Open a new window if none exists
			return sw.clients.openWindow(actionUrl);
		})
	);
});

sw.addEventListener('notificationclose', (event) => {
	console.log('[ServiceWorker] Notification closed', event.notification);
});

sw.addEventListener('pushsubscriptionchange', (event) => {
	console.log('[ServiceWorker] Push subscription change', event);
});

sw.addEventListener('message', async (event) => {
	console.log('[ServiceWorker] Message received', event);
	const type = event.data?.type as MessageType;
	if (type == 'PURGE_CACHE') {
		event.waitUntil(purgeCache());
	} else if (type == 'BUST_CACHE') {
		event.waitUntil(bustCache());
	}
});

// ── Fetch intercept ────────────────────────────────────────────────────────
// sw.addEventListener('fetch', (event: FetchEvent) => {
// 	const url = new URL(event.request.url);
// 	if (!isApiRequest(url) || isRefreshRequest(url)) return;
// 	event.respondWith(handleApiRequest(event));
// });

async function purgeCache() {
	for (const cache of await caches.keys()) {
		console.log('[ServiceWorker] Purging cache', cache);
		await sw.caches.delete(cache);
	}
}

async function bustCache() {
	await purgeCache();
}

const TOKEN_EXPIRED_STATUS = 499;
const AUTH_REFRESH_URL = '/api/auth/refresh';

// ── BroadcastChannel ───────────────────────────────────────────────────────
// After a successful refresh, broadcast to all tabs so every
// UserContext instance syncs its in-memory token.
const broadcast = new BroadcastChannel('auth:sw');

// ── postMessage helpers ────────────────────────────────────────────────────
// Get the controlling client (tab) for a given request.
// Returns null if no client is found (e.g. background sync, no tab open).
async function getClient(event: FetchEvent): Promise<Client | null> {
	const clients = await sw.clients.matchAll({ type: 'window' });
	// Use the client that made the request if identifiable,
	// otherwise fall back to the first available window client.
	return clients.find((c) => c.id === event.clientId) ?? clients[0] ?? null;
}

// Send a message to the app and wait for a response.
// Uses a MessageChannel so each request/response pair is isolated —
// no risk of one tab's response being picked up by another pending request.
function askApp<T extends AppToSwMessage>(client: Client, message: SwToAppMessage): Promise<T> {
	return new Promise((resolve) => {
		const channel = new MessageChannel();
		channel.port1.onmessage = (event: MessageEvent<T>) => resolve(event.data);
		client.postMessage(message, [channel.port2]);
	});
}

// ── Refresh deduplication ──────────────────────────────────────────────────
// Single in-flight refresh promise across all concurrent 499s.
// Prevents multiple tabs / concurrent requests from triggering
// parallel refresh calls that would race on the refresh token.
let refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(client: Client): Promise<string | null> {
	if (!refreshPromise) {
		refreshPromise = (async () => {
			const response = await askApp<AppToSwMessage>(client, { type: 'DO_REFRESH' });

			if (response.type !== 'REFRESH_RESPONSE' || !response.ok) {
				// Broadcast session expiry so all tabs react
				broadcast.postMessage({ type: 'SESSION_EXPIRED' } satisfies SwBroadcast);
				return null;
			}

			// Broadcast new token to all tabs
			broadcast.postMessage({
				type: 'TOKEN_REFRESHED',
				token: response.token
			} satisfies SwBroadcast);

			return response.token;
		})().finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
}

// ── Request helpers ────────────────────────────────────────────────────────
function isApiRequest(url: URL): boolean {
	return url.pathname.includes('/api/');
}

function isRefreshRequest(url: URL): boolean {
	// Never intercept the refresh endpoint — would cause an infinite loop
	// since the app calls this directly when the SW asks DO_REFRESH.
	return url.pathname.includes(AUTH_REFRESH_URL);
}

function cloneRequestWithToken(request: Request, token: string): Request {
	const headers = new Headers(request.headers);
	headers.set('Authorization', `Bearer ${token}`);
	return new Request(request, { headers });
}

async function handleApiRequest(event: FetchEvent): Promise<Response> {
	const client = await getClient(event);

	// No client found (e.g. prefetch with no open tab) — forward as-is.
	if (!client) return fetch(event.request);

	// Ask the app for the current token
	// const tokenResponse = await askApp<AppToSwMessage>(client, { type: 'GET_TOKEN' });
	// const token = tokenResponse.type === 'TOKEN_RESPONSE' ? tokenResponse.token : null;

	const response = await fetch(event.request);
	if (response.status !== TOKEN_EXPIRED_STATUS) return response;

	// Token expired — ask the app to refresh
	const newToken = await tryRefresh(client);

	// Refresh failed — let the 401 pass through.
	// TanStack Query will catch it and the app handles logout + redirect.
	if (!newToken) {
		return new Response(JSON.stringify({ detail: 'Unauthorized', status: 401 }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Replay with new token
	return fetch(cloneRequestWithToken(event.request, newToken));
}
