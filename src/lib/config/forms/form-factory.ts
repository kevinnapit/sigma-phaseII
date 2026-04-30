/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Form hook factory for creating reusable form hooks
 * Uses OpenAPI types and Zod schemas as source of truth
 */

import { createForm, type FormOptions } from '@tanstack/svelte-form';
import type { ZodType, infer as ZodInfer } from 'zod';

export type CreateFormHookOptions<TSchema extends ZodType> = {
	/** Zod schema for validation */
	schema: TSchema;
	/** Default values for the form */
	defaultValues: ZodInfer<TSchema>;
};

/**
 * Factory function to create reusable form hooks
 * This creates a form hook that integrates with mutations
 *
 * @example
 * ```typescript
 * // In module forms folder
 * import { CreateNurseryRequestSchema } from '$lib/generated/main/schemas.gen';
 *
 * export const useNurseryForm = createFormHook({
 *   schema: CreateNurseryRequestSchema,
 *   defaultValues: {
 *     code: '',
 *     name: '',
 *     // ... other fields with defaults
 *   }
 * });
 * ```
 */
export function createFormHook<TSchema extends ZodType>(options: CreateFormHookOptions<TSchema>) {
	const { schema, defaultValues } = options;

	return (
		opts?: FormOptions<ZodInfer<TSchema>, any, any, any, any, any, any, any, any, any, any> & {
			initialValues?: Partial<ZodInfer<TSchema>>;
		}
	) => {
		const { initialValues, ...formOptions } = opts || {};
		const mergedDefaults = Object.assign({}, defaultValues, initialValues);

		return createForm(() => ({
			...formOptions,
			defaultValues: mergedDefaults,
			validators: {
				...formOptions?.validators,
				onSubmit: ({ value }: { value: unknown }) => {
					const result = schema.safeParse(value);
					if (!result.success) {
						const errors: Record<string, string> = {};
						for (const issue of result.error.issues) {
							const path = issue.path.join('.') || '_form';
							if (!errors[path]) {
								errors[path] = issue.message;
							}
						}
						return errors;
					}
					return undefined;
				}
			}
		}));
	};
}

/**
 * Create an edit form hook with ID tracking
 * For update forms that need to track which entity is being edited
 */
export function createEditFormHook<TSchema extends ZodType, TId = string>(
	options: CreateFormHookOptions<TSchema>
) {
	const baseHook = createFormHook(options);

	return (
		id: TId,
		opts?: FormOptions<ZodInfer<TSchema>, any, any, any, any, any, any, any, any, any, any> & {
			initialValues?: Partial<ZodInfer<TSchema>>;
		}
	) => {
		const form = baseHook(opts);
		return {
			form,
			id
		};
	};
}
