// Token storage in localStorage
import type { AuthToken } from '$lib/shared/types';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStore = {
	get(): AuthToken | null {
		if (typeof window === 'undefined') return null;

		const accessToken = localStorage.getItem(TOKEN_KEY);
		const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

		if (!accessToken) return null;

		return {
			accessToken,
			refreshToken: refreshToken || undefined
		};
	},

	set(token: AuthToken): void {
		if (typeof window === 'undefined') return;

		localStorage.setItem(TOKEN_KEY, token.accessToken);
		if (token.refreshToken) {
			localStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
		}
	},

	clear(): void {
		if (typeof window === 'undefined') return;

		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	},

	getAccessToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(TOKEN_KEY);
	}
};
