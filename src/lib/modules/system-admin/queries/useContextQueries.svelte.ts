import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery, queryOptions } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export type ContextListQueryParams = operations['get-context-lists']['parameters']['query'] & {
	enabled?: boolean;
};

export type ContextEntitiesParams =
	operations['find-context-by-id-with-entities']['parameters']['path'];

export type ContextByIdQueryParams = operations['find-context-by-id']['parameters']['path'];

export const useContextListQuery = (params: () => ContextListQueryParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: systemAdminKeys.contextList(),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/system-admin/context/', {
					params: {
						query: currentParams
					}
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev,
			enable: currentParams.enabled
		};
	});
};

export const findContextByIdQueryOptions = (params: () => ContextByIdQueryParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return queryOptions({
		queryKey: systemAdminKeys.contextDetail(currentParams),
		queryFn: async () => {
			const { data, error } = await userCtx.client().GET('/api/system-admin/context/find/{id}', {
				params: {
					path: currentParams
				}
			});
			if (error) throw error;
			return data;
		}
	});
};
export const getContextEntitiesOptions = (params: () => ContextEntitiesParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return queryOptions({
		queryKey: systemAdminKeys.contextEntities(currentParams),
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/system-admin/contextfind/{context_id}/entities', {
					params: {
						path: currentParams
					}
				});
			if (error) throw error;
			return data;
		}
	});
};
export const getContextEntities = (params: () => Partial<ContextEntitiesParams>) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => ({
		queryKey: systemAdminKeys.contextEntities({ context_id: currentParams.context_id ?? '' }),
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/system-admin/contextfind/{context_id}/entities', {
					params: {
						path: { context_id: currentParams.context_id ?? '' }
					}
				});
			if (error) throw error;
			return data;
		},
		enabled: !!currentParams.context_id
	}));
};
