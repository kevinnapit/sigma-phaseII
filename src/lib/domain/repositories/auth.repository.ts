// Auth repository interface (contract)
import type { AuthToken, User } from '$lib/shared/types';

export interface IAuthRepository {
	login(username: string, password: string): Promise<{ user: User; token: AuthToken }>;
	logout(): Promise<void>;
	getCurrentUser(): Promise<User | null>;
	refreshToken(): Promise<AuthToken>;
}
