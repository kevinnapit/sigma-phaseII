import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

// list-roles operation has no query parameters

export const useRoleListQuery = () => {
	const userCtx = getUserContext();
	return createQuery(() => ({
		queryKey: systemAdminKeys.roleList(),
		queryFn: async () => {
			const { data, error } = await userCtx.client().GET('/api/system-admin/roles/');
			if (error) throw error;
			return data;
		},
		placeholderData: (previousData) => previousData
	}));
};
