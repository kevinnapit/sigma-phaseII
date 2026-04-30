import { get, set, del } from 'idb-keyval';

export interface AuthStorage {
	// Tokens
	getToken(): Promise<string | null>;
	getRefreshToken(): Promise<string | null>;
	setTokens(token: string, refreshToken: string): Promise<void>;
	clearTokens(): Promise<void>;
	// Estate
	getEstate(): Promise<string | null>;
	setEstate(serialized: string): Promise<void>;
	clearEstate(): Promise<void>;
	// Convenience: clear everything
	clearAll(): Promise<void>;
	tokenKey(): string;
	refreshTokenKey(): string;
	estateKey(): string;
}

export class LocalStorageAuthStorage implements AuthStorage {
	private readonly TOKEN_KEY = 'token';
	private readonly REFRESH_TOKEN_KEY = 'refresh-token';
	private readonly ESTATE_KEY = 'selected-estate';

	tokenKey(): string {
		return this.TOKEN_KEY;
	}
	refreshTokenKey(): string {
		return this.REFRESH_TOKEN_KEY;
	}
	estateKey(): string {
		return this.ESTATE_KEY;
	}

	async getToken() {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	async getRefreshToken() {
		return localStorage.getItem(this.REFRESH_TOKEN_KEY);
	}

	async setTokens(token: string, refreshToken: string) {
		localStorage.setItem(this.TOKEN_KEY, token);
		localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
	}

	async clearTokens() {
		localStorage.removeItem(this.TOKEN_KEY);
		localStorage.removeItem(this.REFRESH_TOKEN_KEY);
	}

	async getEstate() {
		return localStorage.getItem(this.ESTATE_KEY);
	}

	async setEstate(serialized: string) {
		localStorage.setItem(this.ESTATE_KEY, serialized);
	}

	async clearEstate() {
		localStorage.removeItem(this.ESTATE_KEY);
	}

	async clearAll() {
		await this.clearTokens();
		await this.clearEstate();
	}
}

export class IdbAuthStorage implements AuthStorage {
	private readonly TOKEN_KEY = 'auth:token';
	private readonly REFRESH_TOKEN_KEY = 'auth:refresh-token';
	private readonly ESTATE_KEY = 'auth:selected-estate';

	tokenKey(): string {
		return this.TOKEN_KEY;
	}
	refreshTokenKey(): string {
		return this.REFRESH_TOKEN_KEY;
	}
	estateKey(): string {
		return this.ESTATE_KEY;
	}

	async getToken() {
		return (await get<string>(this.TOKEN_KEY)) ?? null;
	}
	async getRefreshToken() {
		return (await get<string>(this.REFRESH_TOKEN_KEY)) ?? null;
	}
	async setTokens(token: string, refreshToken: string) {
		await set(this.TOKEN_KEY, token);
		await set(this.REFRESH_TOKEN_KEY, refreshToken);
	}
	async clearTokens() {
		await del(this.TOKEN_KEY);
		await del(this.REFRESH_TOKEN_KEY);
	}
	async getEstate() {
		return (await get<string>(this.ESTATE_KEY)) ?? null;
	}
	async setEstate(serialized: string) {
		await set(this.ESTATE_KEY, serialized);
	}
	async clearEstate() {
		await del(this.ESTATE_KEY);
	}
	async clearAll() {
		await this.clearTokens();
		await this.clearEstate();
	}
}
