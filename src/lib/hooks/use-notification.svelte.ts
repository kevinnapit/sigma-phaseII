/**
 * Push subscription management using the Push API.
 */

// import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';

import { getUserContext, UserContext } from '$lib/modules/auth/context/user.svelte';
import type { components as notifComponents } from '$lib/generated/notification/openapi.gen';
import { createContext } from 'svelte';

type PushPayload = notifComponents['schemas']['PushPayload'];

class NotificationManager {
	swRegistration: ServiceWorkerRegistration | null = null;
	subscription: PushSubscription | null = null;
	userCtx: UserContext;
	private USER_ID_HEADER = 'X-User-ID';

	constructor(swRegistrationGetter: () => ServiceWorkerRegistration | null) {
		this.userCtx = getUserContext();
		$effect(() => {
			this.swRegistration = swRegistrationGetter();
			this.getCurrentSubscription().then((sub) => {
				this.subscription = sub;
			});
		});
	}

	/**
	 * Converts a URL-safe base64 VAPID key to a Uint8Array
	 * required by pushManager.subscribe().
	 */
	urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

		const rawData = atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	}

	/**
	 * Creates a new push subscription using the Push API.
	 */
	async subscribe() {
		// Fitur notifikasi di-disable sementara
		console.log('[Push] Fitur notifikasi sedang dinonaktifkan.');
		return null;
		/*
		if (!this.swRegistration) return null;
		const applicationServerKey = this.urlBase64ToUint8Array(PUBLIC_VAPID_PUBLIC_KEY);
		const subscription = await this.swRegistration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey as BufferSource
		});
		this.subscription = subscription;

		console.log('[Push] Subscribed:', subscription);
		return subscription;
		*/
	}

	/**
	 * Unsubscribes from an existing push subscription.
	 */
	async unsubscribe() {
		if (!this.subscription) return false;
		const result = await this.subscription.unsubscribe();
		if (result) this.subscription = null;
		console.log('[Push] Unsubscribed:', result);
		return result;
	}

	/**
	 * Returns the current push subscription, if any.
	 */
	async getCurrentSubscription() {
		if (!this.swRegistration) return null;
		if (this.subscription) return this.subscription;
		const subsFromPushManager = await this.swRegistration.pushManager.getSubscription();
		if (subsFromPushManager) this.subscription = subsFromPushManager;
		return subsFromPushManager;
	}

	/**
	 * Extracts device metadata from the browser environment.
	 */
	getDeviceMetadata() {
		const ua = navigator.userAgent;

		// Parse browser info
		let browser = 'Unknown';
		let browserVersion = '';
		if (ua.includes('Firefox/')) {
			browser = 'Firefox';
			browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] ?? '';
		} else if (ua.includes('Edg/')) {
			browser = 'Edge';
			browserVersion = ua.split('Edg/')[1]?.split(' ')[0] ?? '';
		} else if (ua.includes('Chrome/')) {
			browser = 'Chrome';
			browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] ?? '';
		} else if (ua.includes('Safari/')) {
			browser = 'Safari';
			browserVersion = ua.split('Version/')[1]?.split(' ')[0] ?? '';
		}

		// Parse OS info
		let os = 'Unknown';
		let osVersion = '';
		if (ua.includes('Windows NT')) {
			os = 'Windows';
			osVersion = ua.match(/Windows NT ([\d.]+)/)?.[1] ?? '';
		} else if (ua.includes('Mac OS X')) {
			os = 'macOS';
			osVersion = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? '';
		} else if (ua.includes('Linux')) {
			os = 'Linux';
		} else if (ua.includes('Android')) {
			os = 'Android';
			osVersion = ua.match(/Android ([\d.]+)/)?.[1] ?? '';
		} else if (ua.includes('iOS')) {
			os = 'iOS';
			osVersion = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? '';
		}

		// Determine device type
		let deviceType = 'desktop';
		if (/Mobi|Android|iPhone|iPad/i.test(ua)) {
			deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
		}

		return {
			user_agent: ua,
			browser,
			browser_version: browserVersion,
			os,
			os_version: osVersion,
			device_type: deviceType,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
		};
	}

	/**
	 * Serializes a PushSubscription and sends it to the backend.
	 */
	async sendSubscription(userId: string): Promise<NotificationSchemas['SubscribeOutputBody']> {
		if (!this.subscription) throw new Error('No subscription found');
		const subscriptionJSON = this.subscription.toJSON();
		if (!subscriptionJSON.endpoint) throw new Error('Subscription endpoint is missing');
		const deviceMeta = this.getDeviceMetadata();

		const payload = {
			endpoint: subscriptionJSON.endpoint,
			p256dh_key: subscriptionJSON.keys?.p256dh ?? '',
			auth_secret: subscriptionJSON.keys?.auth ?? '',
			...deviceMeta,
			metadata: {
				screen_width: window.screen.width,
				screen_height: window.screen.height,
				language: navigator.language
			},
			tags: ['web-client']
		};

		console.log('[Subscription] Sending subscription to backend:', payload);

		const { data, response, error } = await this.userCtx.notifClient().POST(
			'/api/notifications/subscribe',
			{
				headers: {
					[this.USER_ID_HEADER]: userId
				},
				body: payload
			}
		);

		if (error) {
			throw new Error(
				`Subscribe failed (${response.status}): ${typeof error === 'string' ? error : JSON.stringify(error)}`
			);
		}

		if (!response.ok) {
			throw new Error(`Subscribe failed (${response.status})`);
		}

		console.log('[Subscription] Backend subscribe response:', response.status);
		return data;
	}

	/**
	 * Sends an unsubscribe request to the backend.
	 */
	async sendUnsubscription(endpoint: string, userId: string): Promise<NotificationSchemas['UnsubscribeOutputBody']> {
		const payload = {
			endpoint
		};

		console.log('[Subscription] Sending unsubscribe to backend:', payload);

		const { data, response, error } = await this.userCtx.notifClient().POST(
			'/api/notifications/unsubscribe',
			{
				headers: {
					[this.USER_ID_HEADER]: userId
				},
				body: payload
			}
		);

		if (error) {
			throw new Error(
				`Unsubscribe failed (${response.status}): ${typeof error === 'string' ? error : JSON.stringify(error)}`
			);
		}

		if (!response.ok) {
			throw new Error(`Unsubscribe failed (${response.status})`);
		}

		console.log('[Subscription] Backend unsubscribe response:', response.status);
		return data;
	}

	/**
	 * Triggers push notifications by user IDs (test endpoint).
	 */
	async triggerByUsers(userIds: string[], payload: PushPayload): Promise<NotificationSchemas['TriggerByUserIDsOutputBody']> {
		const body = {
			user_ids: userIds,
			payload
		};

		console.log('[Trigger] Sending trigger-by-users:', body);

		const { data, response, error } = await this.userCtx.notifClient().POST(
			'/api/notifications/test/trigger-by-users',
			{
				body
			}
		);

		if (error) {
			throw new Error(
				`Trigger-by-users failed (${response.status}): ${typeof error === 'string' ? error : JSON.stringify(error)}`
			);
		}

		if (!response.ok) {
			throw new Error(`Trigger-by-users failed (${response.status})`);
		}

		console.log('[Trigger] trigger-by-users response:', response.status);
		return data;
	}

	/**
	 * Triggers push notifications by role IDs (test endpoint).
	 */
	async triggerByRoles(roleIds: number[], payload: PushPayload): Promise<NotificationSchemas['TriggerByRoleIDsOutputBody']> {
		const body = {
			role_ids: roleIds,
			payload
		};

		const {data, response, error } = await this.userCtx.notifClient().POST(
			'/api/notifications/test/trigger-by-roles',
			{
				body
			}
		);

		if (error) {
			throw new Error(
				`Trigger-by-roles failed (${response.status}): ${typeof error === 'string' ? error : JSON.stringify(error)}`
			);
		}

		if (!response.ok) {
			throw new Error(`Trigger-by-roles failed (${response.status})`);
		}

		console.log('[Trigger] trigger-by-roles response:', response.status);
		return data;
	}
}

export function createNotificationManager(registrationFn: () => ServiceWorkerRegistration | null) {
	return new NotificationManager(registrationFn);
}

export const [getNotificationManager, setNotificationManager] = createContext<NotificationManager>();

