import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type CompanyListParams = operations['list-companies']['parameters']['query'];

export const useCompanyListQuery = (params: () => CompanyListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.companyList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/companies/', {
					params: { query: params() }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (previousData) => previousData
		};
	});
};

export type { CompanyListParams };
