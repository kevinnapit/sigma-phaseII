import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type PermissionListParams = operations['list-permissions']['parameters']['query'];

export const usePermissionListQuery = (params: () => PermissionListParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: systemAdminKeys.permissionList(currentParams),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/system-admin/permissions/', {
					params: { query: currentParams }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (previousData) => previousData
		};
	});
};

export type { PermissionListParams };
