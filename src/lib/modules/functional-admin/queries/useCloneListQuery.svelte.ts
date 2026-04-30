import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type CloneListParams = operations['list-clones']['parameters']['query'];

export const useCloneListQuery = (params: () => CloneListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.cloneList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/general/clones', {
					params: { query: params() }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (previousData) => previousData
		};
	});
};

export type { CloneListParams };
