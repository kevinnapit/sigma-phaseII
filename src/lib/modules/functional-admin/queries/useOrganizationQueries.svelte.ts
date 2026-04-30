import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Seasons (Musim)
type SeasonListParams = operations['list-seasons']['parameters']['query'];
type SeasonDetailParams = operations['get-season']['parameters']['path'];
type SeasonDetailsParams = operations['list-season-details']['parameters']['path'];

export const useSeasonListQuery = (params: () => SeasonListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.seasonList(params()), // Note: Key is static in keys.ts, might need fix later if params matter for caching
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/general/musim/', {
					params: { query: params() }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useSeasonDetailQuery = (params: () => SeasonDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.seasonDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/musim/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

export const useSeasonDetailsQuery = (params: () => SeasonDetailsParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.seasonDetails(currentParams.season_id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/general/musim/{season_id}/detail', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.season_id
		};
	});
};

// Geographical Units
type GeographicalUnitListParams = operations['list-geographical-units']['parameters']['query'];
type SubGeographicalUnitListParams =
	operations['list-sub-geographical-units']['parameters']['query'];
type GeographicalUnitDetailParams = operations['get-geographical-unit']['parameters']['path'];

export const useGeographicalUnitListQuery = (params: () => GeographicalUnitListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.geographicalUnitList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/geographical-units/', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev,
			enabled: true,
			refetchOnMount: true
		};
	});
};

export const useGeographicalUnitDetailQuery = (
	params: () => Partial<GeographicalUnitDetailParams>
) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.geographicalUnitDetail(currentParams?.id ?? ''),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/geographical-units/{id}', {
						params: { path: { id: currentParams?.id ?? '' } }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams?.id
		};
	});
};

export const useSubGeographicalUnitListQuery = (params: () => SubGeographicalUnitListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.geographicalUnitList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/geographical-units/sub', {
						params: { query: params() }
					});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev,
			enabled: true,
			refetchOnMount: true
		};
	});
};

// Work Places
type WorkPlaceListParams = operations['list-work-places']['parameters']['query'];
type WorkPlaceDetailParams = operations['get-work-place']['parameters']['path'];

export const useWorkPlaceListQuery = (params: () => WorkPlaceListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.workPlaceList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/work-places/', {
					params: { query: params() }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useWorkPlaceDetailQuery = (params: () => WorkPlaceDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.workPlaceDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx
					.client()
					.GET('/api/functional-admin/work-places/{id}', {
						params: { path: currentParams }
					});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// Groups
type GroupListParams = operations['list-groups']['parameters']['query'];
type GroupDetailParams = operations['get-group']['parameters']['path'];

export const useGroupListQuery = (params: () => GroupListParams) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.groupList(params()),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/groups/', {
					params: { query: params() }
				});
				if (error) throw error;
				return data;
			},
			placeholderData: (prev) => prev
		};
	});
};

export const useGroupDetailQuery = (params: () => GroupDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.groupDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/groups/{id}', {
					params: { path: currentParams }
				});
				if (error) throw error;
				return data;
			},
			enabled: !!currentParams.id
		};
	});
};

// Project Detail
type ProjectDetailParams = operations['get-project']['parameters']['path'];

export const useProjectDetailQuery = (params: () => ProjectDetailParams) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());
	return createQuery(() => {
		return {
			queryKey: functionalAdminKeys.projectDetail(currentParams.id),
			queryFn: async () => {
				const { data, error } = await userCtx.client().GET('/api/functional-admin/projects/{id}', {
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
	SeasonListParams,
	SeasonDetailParams,
	SeasonDetailsParams,
	GeographicalUnitListParams,
	GeographicalUnitDetailParams,
	WorkPlaceListParams,
	WorkPlaceDetailParams,
	GroupListParams,
	GroupDetailParams,
	ProjectDetailParams
};
