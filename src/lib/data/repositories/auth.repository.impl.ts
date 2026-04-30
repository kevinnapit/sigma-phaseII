// Auth repository implementation - API calls
import type { IAuthRepository } from '$lib/domain/repositories/auth.repository';
import type { AuthToken, User, ApiResponse } from '$lib/shared/types';
import { httpClient } from '../http/http.client';
import { tokenStore } from '../http/token.store';

export class AuthRepositoryImpl implements IAuthRepository {
	async login(username: string, password: string): Promise<{ user: User; token: AuthToken }> {
		const response = await httpClient.post<
			ApiResponse<{ user: User; accessToken: string; refreshToken?: string }>
		>('/auth/login', {
			username,
			password
		});

		const token: AuthToken = {
			accessToken: response.data.accessToken,
			refreshToken: response.data.refreshToken
		};

		tokenStore.set(token);

		return {
			user: response.data.user,
			token
		};
	}

	async logout(): Promise<void> {
		try {
			await httpClient.post('/auth/logout');
		} finally {
			tokenStore.clear();
		}
	}

	async getCurrentUser(): Promise<User | null> {
		const token = tokenStore.get();
		if (!token) return null;

		try {
			const response = await httpClient.get<ApiResponse<User>>('/auth/me');
			return response.data;
		} catch {
			tokenStore.clear();
			return null;
		}
	}

	async refreshToken(): Promise<AuthToken> {
		const currentToken = tokenStore.get();
		if (!currentToken?.refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await httpClient.post<
			ApiResponse<{ accessToken: string; refreshToken?: string }>
		>('/auth/refresh', {
			refreshToken: currentToken.refreshToken
		});

		const newToken: AuthToken = {
			accessToken: response.data.accessToken,
			refreshToken: response.data.refreshToken || currentToken.refreshToken
		};

		tokenStore.set(newToken);

		return newToken;
	}
}
