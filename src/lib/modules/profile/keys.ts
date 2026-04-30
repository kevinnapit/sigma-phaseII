/**
 * Query keys for auth module
 * All keys are stable, namespaced, and array-based
 * Parameter types are derived from OpenAPI spec
 */

export const authKeys = {
	all: ['auth'] as const,

	// Sessions
	sessions: () => [...authKeys.all, 'sessions'] as const,
};
