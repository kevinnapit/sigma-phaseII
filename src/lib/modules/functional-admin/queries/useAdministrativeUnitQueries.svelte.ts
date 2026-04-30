import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Administrative Units
type AdministrativeUnitListParams = operations['list-administrative-units']['parameters']['query'];

export const useAdministrativeUnitListQuery = (params: () => AdministrativeUnitListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.administrativeUnitList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

// Divisions
type DivisionListParams = operations['list-divisions']['parameters']['query'];

export const useDivisionListQuery = (params: () => DivisionListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.divisionList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/divisions', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

// Estates
type EstateListParams = operations['list-estates']['parameters']['query'];
type EstateDetailParams = operations['get-estate']['parameters']['path'];
type EstateByCodeParams = operations['get-estate-by-code']['parameters']['path'];

export const useEstateListQuery = (params: () => EstateListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.estateList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/estates', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useEstateDetailQuery = (params: () => EstateDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.estateDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/estates/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

export const useEstateByCodeQuery = (params: () => EstateByCodeParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.estateByCode(currentParams.code),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/estates/code/{code}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.code
		};
	});
};

// Factories
type FactoryListParams = operations['list-factories']['parameters']['query'];
type FactoryDetailParams = operations['get-factory']['parameters']['path'];

export const useFactoryListQuery = (params: () => FactoryListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.factoryList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/factories', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useFactoryDetailQuery = (params: () => FactoryDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.factoryDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/administrative-units/factories/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

export type {
	AdministrativeUnitListParams,
	DivisionListParams,
	EstateListParams,
	EstateDetailParams,
	EstateByCodeParams,
	FactoryListParams,
	FactoryDetailParams
};
