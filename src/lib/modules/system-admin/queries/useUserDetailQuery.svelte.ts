import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

export type UserDetailParams = { id: string };

export const useUserDetailQuery = (params: () => UserDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: systemAdminKeys.userDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/system-admin/users/{userId}', {
					params: { path: { userId: currentParams.id } }
				});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};
