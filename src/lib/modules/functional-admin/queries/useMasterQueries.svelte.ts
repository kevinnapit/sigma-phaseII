import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Master Types
type MasterTypeListParams = operations['list-master-types']['parameters']['query'];
type MasterTypeDetailParams = operations['get-master-type']['parameters']['path'];
type MasterTypeByNameParams = operations['get-master-type-by-name']['parameters']['query'];

export const useMasterTypeListQuery = (params: () => MasterTypeListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.masterTypeList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/master-types', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useMasterTypeDetailQuery = (params: () => MasterTypeDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.masterTypeDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/master-types/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

export const useMasterTypeByNameQuery = (params: () => { name: string }, getEnabled?: () => boolean) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	const isEnabled = getEnabled ? getEnabled() : true;
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.masterTypeByName(currentParams?.name),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/master-types/by-name/{name}', {
						params: { query: currentParams! }
					});
				if (error) throw error;

				const results = data || [];
				return results
			},
			enabled: !!currentParams.name && isEnabled
		};
	});
};

// Master Values
type MasterValueListParams = operations['list-master-values']['parameters']['query'];
type MasterValuesByTypeParams = operations['list-master-values-by-type']['parameters']['path'];
type MasterValueDetailParams = operations['get-master-value']['parameters']['path'];

export const useMasterValueListQuery = (params: () => MasterValueListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.masterValueList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/master-values', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useMasterValuesByTypeQuery = (params: () => MasterValuesByTypeParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.masterValuesByType(currentParams.master_type_id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/master-types/{master_type_id}/values', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.master_type_id
		};
	});
};

export const useMasterValueDetailQuery = (params: MasterValueDetailParams) => {
	const userCtx = getUserContext();
	return createQuery(() => ({
		queryKey: functionalAdminKeys.masterValueDetail(params.id),
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/functional-admin/general/master-values/{id}', {
					params: { path: params }
				});
			if (error) throw error;
			return data;
		},
		enabled: !!params.id
	}));
};

export type {
	MasterTypeListParams,
	MasterTypeDetailParams,
	MasterTypeByNameParams,
	MasterValueListParams,
	MasterValuesByTypeParams,
	MasterValueDetailParams
};
