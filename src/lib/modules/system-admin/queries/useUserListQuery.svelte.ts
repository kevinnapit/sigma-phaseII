import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export type UserListParams = operations['list-users']['parameters']['query'];

export const useUserListQuery = (params: () => UserListParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: systemAdminKeys.userList(currentParams),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/system-admin/users/', {
					params: { query: currentParams }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (previousData) => previousData
		};
	});
};
