import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

export type RoleDetailParams = { id: number };

export const useRoleDetailQuery = (params: () => RoleDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: systemAdminKeys.roleDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/system-admin/roles/{id}', {
					params: { path: { id: currentParams.id } }
				});
				if (error) throw error;
				return data;
			},
			enabled: currentParams.id > 0
		};
	});
};
