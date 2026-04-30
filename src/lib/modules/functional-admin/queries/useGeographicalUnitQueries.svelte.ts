import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Geographical Units
type GeographicalUnitListParams = operations['list-geographical-units']['parameters']['query'];

export const useGeographicalUnitListQuery = (params: () => GeographicalUnitListParams) => {
	const userCtx = getUserContext();
	const estateId = $derived(userCtx.estate?.id);
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.geographicalUnitList(params()),
			queryFn: async () => {
				if (!estateId) throw new Error('Estate not selected');
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/geographical-units/', {
						params: { query: params() },
						headers: {
							'X-Estate-Selection': estateId
						}
					});
				if (error) throw error;
				return data;
			},
			enabled: !!estateId,
			placeholderData: (prev) => prev
		};
	});
};

export type { GeographicalUnitListParams };
