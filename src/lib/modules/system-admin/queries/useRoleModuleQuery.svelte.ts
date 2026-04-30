import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export const useRoleModuleQuery = (
	params: Accessor<operations['get-role-with-modules']['parameters']['path']['id'] | undefined>
) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => ({
		queryKey: systemAdminKeys.roleDetail(currentParams!),
		queryFn: async () => {
			const { data, error } = await userCtx.client().GET('/api/system-admin/roles/{id}', {
				params: { path: { id: currentParams! } }
			});
			if (error) throw error;
			return data;
		},
		enabled: () => !!currentParams,
		staleTime: 5 * 60 * 1000 // 30 seconds,
	}));
};
