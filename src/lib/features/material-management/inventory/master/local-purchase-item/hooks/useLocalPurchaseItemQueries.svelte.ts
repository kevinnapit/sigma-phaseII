import { createQuery } from '@tanstack/svelte-query';
import { localPurchaseItemApi } from '../api/local-purchase-item.api';
import { localPurchaseItemKeys } from '../api/local-purchase-item.keys';
import type { LocalPurchaseItemListParams } from '../types/local-purchase-item.types';

/**
 * Hook for reading all local purchase items
 * Note: Using mock data, no authentication required
 */
export const useReadAllLocalPurchaseItems = (
	params: () => LocalPurchaseItemListParams,
	isEnabled?: () => boolean
) => {
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseItemKeys.list(currentParams),
		queryFn: () => {
			// Mock context - not used but required by API signature
			const context = {
				token: 'mock-token',
				estateId: 'mock-estate'
			};
			return localPurchaseItemApi.getLocalPurchaseItems(currentParams, context);
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled
	}));
};

/**
 * Hook for reading local purchase item detail
 * Note: Using mock data, no authentication required
 */
export const useReadLocalPurchaseItemDetail = (uoid: () => string) => {
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localPurchaseItemKeys.detail(currentUoid),
		queryFn: () => {
			// Mock context - not used but required by API signature
			const context = {
				token: 'mock-token',
				estateId: 'mock-estate'
			};
			return localPurchaseItemApi.getLocalPurchaseItemDetail(currentUoid, context);
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!currentUoid
	}));
};

/**
 * Hook for reading local purchase item statistics
 * Note: Using mock data, no authentication required
 */
export const useReadLocalPurchaseItemStats = () => {
	return createQuery(() => ({
		queryKey: localPurchaseItemKeys.stats(),
		queryFn: () => {
			// Mock context - not used but required by API signature
			const context = {
				token: 'mock-token',
				estateId: 'mock-estate'
			};
			return localPurchaseItemApi.getLocalPurchaseItemStats(context);
		},
		staleTime: 5 * 60 * 1000,
		enabled: true
	}));
};
