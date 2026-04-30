declare interface PushPayload {
	title: string;
	body: string;
	icon_url?: string;
	badge_url?: string;
	image_url?: string;
	action_url?: string;
	metadata?: Record<string, unknown>;
}
declare type MessageType = 'PURGE_CACHE' | 'BUST_CACHE';

declare type AppToSwMessage =
	| { type: 'TOKEN_RESPONSE'; token: string | null }
	| { type: 'REFRESH_RESPONSE'; ok: true; token: string }
	| { type: 'REFRESH_RESPONSE'; ok: false };

declare type SwToAppMessage = { type: 'GET_TOKEN' } | { type: 'DO_REFRESH' };

declare type SwBroadcast = { type: 'TOKEN_REFRESHED'; token: string } | { type: 'SESSION_EXPIRED' };

declare global {
	interface ServiceWorkerContainerEventMap {
		message: MessageEvent<SwToAppMessage>;
	}
}
