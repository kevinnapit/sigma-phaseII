import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Area Compositions
type AreaCompositionListParams = operations['list-area-compositions']['parameters']['query'];
type AreaCompositionDetailParams = operations['get-area-composition']['parameters']['path'];

export const useAreaCompositionListQuery = (params: () => AreaCompositionListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.areaCompositionList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/area-compositions/', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useAreaCompositionDetailQuery = (params: () => AreaCompositionDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.areaCompositionDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/area-compositions/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// Company Detail
type CompanyDetailParams = operations['get-company']['parameters']['path'];

export const useCompanyDetailQuery = (params: () => CompanyDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.companyDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/companies/{id}', {
					params: { path: currentParams }
				});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// Clone Detail
type CloneDetailParams = operations['get-clone']['parameters']['path'];

export const useCloneDetailQuery = (params: () => CloneDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.cloneDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/clones/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// Kebangsaan (Nationalities)
type KebangsaanListParams = operations['list-kebangsaans']['parameters']['query'];
type KebangsaanDetailParams = operations['get-kebangsaan']['parameters']['path'];

export const useKebangsaanListQuery = (params: () => KebangsaanListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.kebangsaanList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/kebangsaan/', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useKebangsaanDetailQuery = (params: () => KebangsaanDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => ({
		queryKey: functionalAdminKeys.kebangsaanDetail(currentParams.id),
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/functional-admin/general/kebangsaan/{id}', {
					params: { path: currentParams }
				});
			if (error) throw error;
			return data;
		},
		enabled: () => !!currentParams.id
	}));
};

export type {
	AreaCompositionListParams,
	AreaCompositionDetailParams,
	CompanyDetailParams,
	CloneDetailParams,
	KebangsaanListParams,
	KebangsaanDetailParams
};
