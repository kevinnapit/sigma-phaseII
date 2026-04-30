import { HttpError, AuthError } from '$lib/shared/errors';
import { tokenStore } from './token.store';

type RequestOptions = RequestInit & {
	params?: Record<string, string | number | boolean>;
};

class HttpClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private getHeaders(customHeaders?: HeadersInit): Record<string, string> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		// Merge custom headers
		if (customHeaders) {
			if (customHeaders instanceof Headers) {
				customHeaders.forEach((value, key) => {
					headers[key] = value;
				});
			} else if (Array.isArray(customHeaders)) {
				customHeaders.forEach(([key, value]) => {
					headers[key] = value;
				});
			} else {
				Object.assign(headers, customHeaders);
			}
		}

		const token = tokenStore.getAccessToken();
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
		const cleanPath = path.startsWith('/') ? path.slice(1) : path;
		const cleanBase = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
		
		const fullPath = cleanBase + cleanPath;
		
		let url: URL;
		if (fullPath.startsWith('http://') || fullPath.startsWith('https://')) {
			url = new URL(fullPath);
		} else {
			url = new URL(fullPath, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
		}

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, String(value));
			});
		}

		return url.toString();
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const contentType = response.headers.get('content-type');
			let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

			if (contentType?.includes('application/json')) {
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorMessage;
				} catch {
					// Ignore JSON parse errors
				}
			}

			if (response.status === 401) {
				tokenStore.clear();
				throw new AuthError(errorMessage);
			}

			throw new HttpError(errorMessage, response.status);
		}

		const contentType = response.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			return response.json();
		}

		return response.text() as T;
	}

	async get<T>(path: string, options?: RequestOptions): Promise<T> {
		const url = this.buildUrl(path, options?.params);
		const response = await fetch(url, {
			...options,
			method: 'GET',
			headers: this.getHeaders(options?.headers)
		});

		return this.handleResponse<T>(response);
	}

	async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
		const url = this.buildUrl(path, options?.params);
		const response = await fetch(url, {
			...options,
			method: 'POST',
			headers: this.getHeaders(options?.headers),
			body: body ? JSON.stringify(body) : undefined
		});

		return this.handleResponse<T>(response);
	}

	async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
		const url = this.buildUrl(path, options?.params);
		const response = await fetch(url, {
			...options,
			method: 'PUT',
			headers: this.getHeaders(options?.headers),
			body: body ? JSON.stringify(body) : undefined
		});

		return this.handleResponse<T>(response);
	}

	async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
		const url = this.buildUrl(path, options?.params);
		const response = await fetch(url, {
			...options,
			method: 'PATCH',
			headers: this.getHeaders(options?.headers),
			body: body ? JSON.stringify(body) : undefined
		});

		return this.handleResponse<T>(response);
	}

	async delete<T>(path: string, options?: RequestOptions): Promise<T> {
		const url = this.buildUrl(path, options?.params);
		const response = await fetch(url, {
			...options,
			method: 'DELETE',
			headers: this.getHeaders(options?.headers)
		});

		return this.handleResponse<T>(response);
	}
}

export const httpClient = new HttpClient('/api');
