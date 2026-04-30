/**
 * Field helper utilities for TanStack Form
 * Provides reactive field state and error extraction
 */

/**
 * Field state for UI display
 */
export type FieldState = {
	/** Whether field has been touched */
	touched: boolean;
	/** Whether field value is dirty (changed from default) */
	dirty: boolean;
	/** Whether field is currently validating */
	validating: boolean;
	/** Field validation errors */
	errors: string[];
	/** Whether field has errors */
	hasError: boolean;
};

/**
 * Extract field state from TanStack Form field API
 * Use this to get reactive field state for UI components
 *
 * @example
 * ```svelte
 * {#snippet children(field)}
 *   {@const state = getFieldState(field)}
 *   <Input
 *     value={field.state.value}
 *     oninput={(e) => field.handleChange(e.currentTarget.value)}
 *     class={state.hasError ? 'border-red-500' : ''}
 *   />
 *   {#if state.hasError}
 *     <span class="text-red-500">{state.errors[0]}</span>
 *   {/if}
 * {/snippet}
 * ```
 */
export function getFieldState(field: {
	state: {
		meta: { isTouched: boolean; isDirty: boolean; isValidating: boolean; errors?: unknown[] };
	};
}): FieldState {
	const state = field.state;
	const errors = state.meta.errors?.filter(Boolean).map((e) => String(e)) ?? [];

	return {
		touched: state.meta.isTouched,
		dirty: state.meta.isDirty,
		validating: state.meta.isValidating,
		errors,
		hasError: errors.length > 0
	};
}

/**
 * Create field error messages from Zod validation
 *
 * @example
 * ```typescript
 * const errors = createFieldErrors(zodError);
 * // { name: ['Name is required'], email: ['Invalid email'] }
 * ```
 */
export function createFieldErrors(zodError: import('zod').ZodError): Record<string, string[]> {
	const errors: Record<string, string[]> = {};

	for (const issue of zodError.issues) {
		const path = issue.path.join('.');
		if (!errors[path]) {
			errors[path] = [];
		}
		errors[path].push(issue.message);
	}

	return errors;
}

/**
 * Check if a field should show error (touched + has error)
 */
export function shouldShowError(field: {
	state: { meta: { isTouched: boolean; errors?: unknown[] } };
}): boolean {
	const state = getFieldState(field as Parameters<typeof getFieldState>[0]);
	return state.touched && state.hasError;
}

/**
 * Get first error message for a field
 */
export function getFirstError(field: {
	state: { meta: { errors?: unknown[] } };
}): string | undefined {
	const errors = field.state.meta.errors?.filter(Boolean).map((e) => String(e)) ?? [];
	return errors[0];
}
