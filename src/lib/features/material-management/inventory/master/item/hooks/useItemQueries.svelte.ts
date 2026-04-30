import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { itemApi } from '../api/item.api';
import { itemKeys } from '../api/item.keys';
import type { ItemListParams } from '../types/item.types';

// Check if using mock mode
const USE_MOCK = true;

/**
 * Queries for Items
 */

/**
 * Hook for reading all items
 */
export const useReadAllItems = (params: () => ItemListParams, isEnabled?: () => boolean) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemKeys.list(currentParams),
		queryFn: () => {
			// For mock mode, use dummy context
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate'
				};
				return itemApi.getItems(currentParams, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItems(currentParams, context);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: USE_MOCK ? enabled : (enabled && !!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook for reading item detail by ID
 */
export const useReadDetailItem = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemKeys.detail(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemDetail(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item VRL detail by ID
 */
export const useReadItemVRLDetail = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemKeys.vrlDetail(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemVRL(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item manufactures
 */
export const useReadItemManufactures = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemKeys.manufactures(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemManufactures(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item UOM links
 */
export const useReadItemUOMLinks = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemKeys.uomLinks(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemUOMLinks(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item substitutes
 */
export const useReadItemSubstitutes = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemKeys.substitutes(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemSubstitutes(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item statistics
 */
export const useReadItemStats = () => {
	const userContext = USE_MOCK ? null : getUserContext();

	return createQuery(() => ({
		queryKey: itemKeys.stats(),
		queryFn: () => {
			// For mock mode, use dummy context
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate'
				};
				return itemApi.getItemStats(context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemStats(context);
		},
		enabled: USE_MOCK ? true : (!!userContext?.token && !!userContext?.estate?.id),
		staleTime: 5 * 60 * 1000 // 5 minutes
	}));
};

/**
 * Hook for reading item usages
 */
export const useReadItemUsages = (uoid: () => string, search: () => string | undefined) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());
	const currentSearch = $derived(search());

	return createQuery(() => ({
		queryKey: itemKeys.usages(currentUoid, currentSearch),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.getItemUsages(currentUoid, currentSearch, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item stock records (stores)
 */
export const useReadItemStockRecords = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemKeys.stockRecords(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemStockRecords(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};
