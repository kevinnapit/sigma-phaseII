import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

/**
 * Detailed/supporting queries for Stores - Division list for store forms
 */

type DivisionListParams = operations['list-divisions']['parameters']['query'];

/**
 * Hook for reading division list - used in create/edit store forms
 */
export const useStoreDivisionListQuery = (params: () => DivisionListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => ({
		queryKey: ['material-management', 'stores', 'divisions', params()],
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/functional-admin/administrative-units/divisions', {
					params: { query: params() }
				});
			if (error) throw error;
			return data;
		},
		placeholderData: (prev) => prev
	}));
};

export type { DivisionListParams as StoreDivisionListParams };
