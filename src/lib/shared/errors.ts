// Custom error classes
export class AppError extends Error {
	constructor(
		message: string,
		public code?: string
	) {
		super(message);
		this.name = 'AppError';
	}
}

export class HttpError extends AppError {
	constructor(
		message: string,
		public statusCode: number,
		code?: string
	) {
		super(message, code);
		this.name = 'HttpError';
	}
}

export class AuthError extends AppError {
	constructor(message: string = 'Authentication failed') {
		super(message, 'AUTH_ERROR');
		this.name = 'AuthError';
	}
}

export class ValidationError extends AppError {
	constructor(
		message: string,
		public fields?: Record<string, string[]>
	) {
		super(message, 'VALIDATION_ERROR');
		this.name = 'ValidationError';
	}
}
