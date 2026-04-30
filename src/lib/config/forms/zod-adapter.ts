/**
 * Zod validation adapter for TanStack Svelte Form
 * Provides seamless integration between Zod schemas and TanStack Form validation
 */

import { createForm } from '@tanstack/svelte-form';
import type { ZodType, ZodError, infer as ZodInfer } from 'zod';

/**
 * Create a TanStack Form field validator from a Zod schema
 * Use this for field-level validation
 *
 * @example
 * ```svelte
 * <form.Field
 *   name="email"
 *   validators={{
 *     onChange: createZodFieldValidator(z.string().email())
 *   }}
 * >
 *   ...
 * </form.Field>
 * ```
 */
export function createZodFieldValidator<T extends ZodType>(schema: T) {
	return ({ value }: { value: unknown }) => {
		const result = schema.safeParse(value);
		if (!result.success) {
			return result.error.issues[0]?.message ?? 'Validation failed';
		}
		return undefined;
	};
}

/**
 * Create a form-level validator from a Zod schema
 * Validates entire form data at once
 */
export function createZodFormValidator<TSchema extends ZodType>(schema: TSchema) {
	return ({ value }: { value: unknown }) => {
		const result = schema.safeParse(value);
		if (!result.success) {
			// Return error map for all fields
			const errorMap: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const path = issue.path.join('.');
				if (!errorMap[path]) {
					errorMap[path] = issue.message;
				}
			}
			return errorMap;
		}
		return undefined;
	};
}

/**
 * Create a Zod validation adapter for TanStack Form
 * Returns validators object that can be spread into form options
 *
 * @example
 * ```typescript
 * const adapter = createZodFormAdapter(CreateUserSchema);
 * const form = createForm(() => ({
 *   defaultValues: { name: '', email: '' },
 *   ...adapter,
 *   onSubmit: async ({ value }) => {
 *     // value is validated by Zod
 *   }
 * }));
 * ```
 */
export function createZodFormAdapter<TSchema extends ZodType>(schema: TSchema) {
	return {
		validators: {
			onSubmit: createZodFormValidator(schema)
		}
	};
}

/**
 * Options for creating a form with Zod validation
 */
export type ZodFormOptions<TSchema extends ZodType> = {
	/** Zod schema for validation */
	schema: TSchema;
	/** Default values for the form */
	defaultValues: ZodInfer<TSchema>;
	/** Submit handler called with validated data */
	onSubmit?: (data: ZodInfer<TSchema>) => Promise<void> | void;
	/** Optional error handler */
	onValidationError?: (error: ZodError<ZodInfer<TSchema>>) => void;
};

/**
 * Create a TanStack Form with integrated Zod validation
 * This is the recommended way to create forms with Zod schemas
 *
 * @example
 * ```typescript
 * const form = createFormWithZod({
 *   schema: CreateUserSchema,
 *   defaultValues: { name: '', email: '' },
 *   onSubmit: async (data) => {
 *     // data is typed and validated by Zod schema
 *     await api.createUser(data);
 *   }
 * });
 * ```
 */
export function createFormWithZod<TSchema extends ZodType>(options: ZodFormOptions<TSchema>) {
	const { schema, defaultValues, onSubmit, onValidationError } = options;

	return createForm(() => ({
		defaultValues,
		validators: {
			onSubmit: ({ value }) => {
				const result = schema.safeParse(value);
				if (!result.success) {
					onValidationError?.(result.error);
					// Convert Zod errors to TanStack Form format
					const errors: Record<string, string> = {};
					for (const issue of result.error.issues) {
						const path = issue.path.join('.') || 'form';
						if (!errors[path]) {
							errors[path] = issue.message;
						}
					}
					return errors;
				}
				return undefined;
			}
		},
		onSubmit: onSubmit
			? async ({ value }) => {
					const result = schema.safeParse(value);
					if (result.success) {
						await onSubmit(result.data);
					}
				}
			: undefined
	}));
}

/**
 * Validate form data against a Zod schema
 * Returns validated data or throws ZodError
 */
export function validateFormData<TSchema extends ZodType>(
	schema: TSchema,
	data: unknown
): ZodInfer<TSchema> {
	return schema.parse(data);
}

/**
 * Safe validate form data against a Zod schema
 * Returns result object with data or error
 */
export function safeValidateFormData<TSchema extends ZodType>(
	schema: TSchema,
	data: unknown
):
	| { success: true; data: ZodInfer<TSchema> }
	| { success: false; error: ZodError<ZodInfer<TSchema>> } {
	const result = schema.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, error: result.error };
}
