import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Alokasi Umum
type AlokasiUmumListParams = operations['list-alokasi-umums']['parameters']['query'];
type AlokasiUmumDetailParams = operations['get-alokasi-umum']['parameters']['path'];

export const useAlokasiUmumListQuery = (params: () => AlokasiUmumListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.alokasiUmumList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/alokasi-umum/alokasi', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useAlokasiUmumDetailQuery = (params: () => AlokasiUmumDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.alokasiUmumDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/alokasi-umum/alokasi/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// Alokasi Heading
type AlokasiHeadingListParams = operations['list-alokasi-headings']['parameters']['query'];
type AlokasiHeadingDetailParams = operations['get-alokasi-heading']['parameters']['path'];

export const useAlokasiHeadingListQuery = (params: () => AlokasiHeadingListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.alokasiHeadingList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/alokasi-umum/alokasi-heading', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useAlokasiHeadingDetailQuery = (params: () => AlokasiHeadingDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.alokasiHeadingDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/alokasi-umum/alokasi-heading/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// General Allocation Settings
type AllocationSettingListParams =
	operations['list-general-allocation-settings']['parameters']['query'];
type AllocationSettingDetailParams =
	operations['get-general-allocation-setting']['parameters']['path'];

export const useAllocationSettingListQuery = (params: () => AllocationSettingListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.allocationSettingList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/alokasi-umum/setting', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useAllocationSettingDetailQuery = (params: () => AllocationSettingDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.allocationSettingDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/alokasi-umum/setting/{id}', {
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
	AlokasiUmumListParams,
	AlokasiUmumDetailParams,
	AlokasiHeadingListParams,
	AlokasiHeadingDetailParams,
	AllocationSettingListParams,
	AllocationSettingDetailParams
};
