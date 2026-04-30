// Shared types across the application

export type User = {
	id: string;
	username: string;
	email?: string;
	name?: string;
	role?: string;
};

export type AuthToken = {
	accessToken: string;
	refreshToken?: string;
	expiresAt?: number;
};

export type ApiResponse<T> = {
	data: T;
	message?: string;
	success: boolean;
};

export type PaginatedResponse<T> = {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
};

export type StatCardData = {
	title: string;
	value: number | string;
	icon: any;
	iconColor: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
};
