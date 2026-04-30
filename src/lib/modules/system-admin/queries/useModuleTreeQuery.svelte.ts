import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

export type GetModuleTreeParams = {
	include_inactive?: boolean;
};
export const useModuleTreeQuery = (params: () => GetModuleTreeParams) => {
	const userCtx = getUserContext();
	return createQuery(() => ({
		queryKey: systemAdminKeys.moduleTree(),
		queryFn: async () => {
			const { data, error } = await userCtx.client().GET('/api/system-admin/modules/tree', {
				params: {
					// @ts-expect-error well well well
					query: params()
				}
			});
			if (error) throw error;
			return data;
		}
	}));
};
