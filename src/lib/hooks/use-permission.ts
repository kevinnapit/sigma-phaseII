class PermissionManager {
	/**
	 * Permission management for Web Push notifications.
	 */

	/**
	 * Returns the current notification permission state.
	 * Must be called in a browser context.
	 */
	getNotificationPermissionState(): NotificationPermission {
		if (typeof Notification === 'undefined') {
			return 'default';
		}
		return Notification.permission;
	}

	/**
	 * Requests notification permission from the user.
	 * Returns the resulting permission state: 'granted', 'denied', or 'default'.
	 */
	async requestNotificationPermission(): Promise<NotificationPermission> {
		if (typeof Notification === 'undefined') {
			console.warn('[Permission] Notification API not available');
			return 'default';
		}

		const result = await Notification.requestPermission();
		console.log('[Permission] Permission result:', result);
		return result;
	}
}
export const permissionManager = new PermissionManager();
