import type { IAuthRepository } from '$lib/domain/repositories/auth.repository';
import type { AuthToken, User } from '$lib/shared/types';

const MOCK_USERS = [
	{
		id: '1',
		username: 'admin',
		email: 'admin@socfin.com',
		name: 'SOCFIN-ID\\Administrator',
		password: 'admin123',
		role: 'Administrator'
	},
	{
		id: '2',
		username: 'user',
		email: 'user@socfin.com',
		name: 'Regular User',
		password: 'user123',
		role: 'User'
	}
];

function generateToken(): string {
	return btoa(
		JSON.stringify({
			timestamp: Date.now(),
			random: Math.random().toString(36).substring(2)
		})
	);
}

export class AuthRepositoryMock implements IAuthRepository {
	async login(username: string, password: string): Promise<{ user: User; token: AuthToken }> {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const mockUser = MOCK_USERS.find(
			(u) => (u.username === username || u.email === username) && u.password === password
		);

		if (!mockUser) {
			throw new Error('Invalid username or password');
		}

		const user: User = {
			id: mockUser.id,
			username: mockUser.username,
			email: mockUser.email,
			name: mockUser.name,
			role: mockUser.role
		};

		const token: AuthToken = {
			accessToken: generateToken(),
			refreshToken: generateToken()
		};

		if (typeof window !== 'undefined') {
			localStorage.setItem('mock_user', JSON.stringify(user));
		}

		return { user, token };
	}

	async logout(): Promise<void> {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('mock_user');
		}
	}

	async getCurrentUser(): Promise<User | null> {
		if (typeof window === 'undefined') return null;

		const stored = localStorage.getItem('mock_user');
		if (!stored) return null;

		try {
			return JSON.parse(stored);
		} catch {
			return null;
		}
	}

	async refreshToken(): Promise<AuthToken> {
		return {
			accessToken: generateToken(),
			refreshToken: generateToken()
		};
	}
}
