import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type CommodityDetailParams = operations['get-commodity']['parameters']['path'];

export const useCommodityDetailQuery = (params: () => CommodityDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.commodityDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/commodities/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

export type { CommodityDetailParams };
