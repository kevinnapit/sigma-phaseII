// Auth use cases - business logic
import type { IAuthRepository } from '../repositories/auth.repository';
import type { User, AuthToken } from '$lib/shared/types';

export class AuthUseCase {
	constructor(private authRepo: IAuthRepository) {}

	async login(username: string, password: string): Promise<{ user: User; token: AuthToken }> {
		if (!username || !password) {
			throw new Error('Username and password are required');
		}

		return this.authRepo.login(username, password);
	}

	async logout(): Promise<void> {
		return this.authRepo.logout();
	}

	async getCurrentUser(): Promise<User | null> {
		return this.authRepo.getCurrentUser();
	}

	async refreshToken(): Promise<AuthToken> {
		return this.authRepo.refreshToken();
	}
}
