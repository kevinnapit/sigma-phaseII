import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// UOM (Satuan Ukuran)
type UomListParams = operations['list-uoms']['parameters']['query'];
type UomDetailParams = operations['get-uom']['parameters']['path'];
type UomByCodeParams = operations['get-uom-by-code']['parameters']['path'];

export const useUomListQuery = (params: () => UomListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.uomList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/uom/satuan-ukuran', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev,
			staleTime: 5 * 60 * 1000
		};
	});
};

export const useUomDetailQuery = (params: () => UomDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.uomDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/uom/satuan-ukuran/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

export const useUomByCodeQuery = (params: () => UomByCodeParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.uomByCode(currentParams.code),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/uom/satuan-ukuran/by-code/{code}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.code
		};
	});
};

// UOM Conversions
type UomConversionListParams = operations['list-uom-conversions']['parameters']['query'];
type UomConversionDetailParams = operations['get-uom-conversion']['parameters']['path'];

export const useUomConversionListQuery = (params: () => UomConversionListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.uomConversionList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/uom/konversi-satuan', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useUomConversionDetailQuery = (params: () => UomConversionDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.uomConversionDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/uom/konversi-satuan/{id}', {
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
	UomListParams,
	UomDetailParams,
	UomByCodeParams,
	UomConversionListParams,
	UomConversionDetailParams
};
