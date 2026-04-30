import { env } from '$env/dynamic/public';

export const AuthConfig = {
	SHOULD_SEND_CREDENTIALS: env.PUBLIC_SEND_CREDENTIALS === 'true',
	AUTHENTICATED_REDIRECT: '/dashboard',
	UNAUTHENTICATED_REDIRECT: '/',
	TOKEN_EXPIRED_STATUS: 499,
	UNAUTHORIZED_STATUS: 401,
	SESSION_INVALID_STATUS: 498,
	isUnauthenticatedStatus(status: number) {
		return status === this.UNAUTHORIZED_STATUS || status === this.SESSION_INVALID_STATUS;
	},
	AuthHeader: 'Authorization',
	XEstateHeader: 'X-Estate-Selection',
	BroadcastChannelKey: 'auth:sw',
	REFRESH_TOKEN_PATH: '/api/auth/refresh'
} as const;
