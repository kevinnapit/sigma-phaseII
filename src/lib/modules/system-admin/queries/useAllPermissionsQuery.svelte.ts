import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

export const useAllPermissionsQuery = () => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: systemAdminKeys.permissionsAll(),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/system-admin/permissions/unpaginated', {});
				if (error) throw error;
				return data;
			}
		};
	});
};
