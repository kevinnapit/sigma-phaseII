import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { storeApi } from '../api/store.api';
import { storesKeys } from '../api/stores.keys';
import type { StoreListParams } from '../types/store.types';

/**
 * Queries for Stores - Multiple read operations
 */

/**
 * Hook for reading all stores with pagination and filters
 */
export const useReadAllStores = (params: () => StoreListParams, enabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const isEnabled = $derived(enabled ? enabled() : true);

	return createQuery(() => ({
		queryKey: storesKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'null'
			};
			return storeApi.getStores(currentParams, context);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: !!userContext.token && !!userContext.estate?.id && isEnabled
	}));
};

/**
 * Hook for reading store detail by ID
 */
export const useReadDetailStore = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: storesKeys.detail(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'null'
			};
			return storeApi.getStoreById(currentUoid, context);
		},
		enabled: !!userContext.token && !!userContext.estate?.id && !!currentUoid
	}));
};

/**
 * Hook for reading store statistics
 */
export const useReadStoreStats = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: storesKeys.stats(),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'null'
			};
			return storeApi.getStatsStore(context);
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
