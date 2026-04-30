/**
 * Form type utilities
 */

/**
 * Result from form submission
 */
export type FormSubmitResult<T> = {
	success: boolean;
	data?: T;
	error?: unknown;
};

/**
 * Form status for UI display
 */
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Field error state
 */
export type FieldError = {
	message: string;
	path: string[];
};

/**
 * Extract form values type from Zod schema
 */
export type InferFormValues<T extends import('zod').ZodType> = import('zod').infer<T>;
