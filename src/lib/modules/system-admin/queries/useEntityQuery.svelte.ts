import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export type EntityListParams = operations['get-entity-lists']['parameters']['query'];

export const useEntityListQuery = (params: () => EntityListParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => ({
		queryKey: systemAdminKeys.entityList(currentParams),
		queryFn: async () => {
			const { data, error } = await userCtx.client().GET('/api/system-admin/entity/', {
				params: {
					query: currentParams
				}
			});
			if (error) throw error;
			return data;
		}
	}));
};
