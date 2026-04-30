import { createQuery } from '@tanstack/svelte-query';
import { itemStorageLayoutApi } from '../api/item-storage-layout.api';
import { itemStorageLayoutKeys } from '../api/item-storage-layout.keys';
import type { ItemStorageLayoutListParams } from '../types/item-storage-layout.types';

/**
 * Hook for reading all item storage layouts
 */
export const useReadAllItemStorageLayouts = (
	params: () => ItemStorageLayoutListParams,
	isEnabled?: () => boolean
) => {
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemStorageLayoutKeys.list(currentParams),
		queryFn: () => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageLayoutApi.getItemStorageLayouts(currentParams, context);
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled
	}));
};

/**
 * Hook for reading item storage layout detail
 */
export const useReadItemStorageLayoutDetail = (uoid: () => string) => {
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemStorageLayoutKeys.detail(currentUoid),
		queryFn: () => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageLayoutApi.getItemStorageLayoutDetail(currentUoid, context);
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!currentUoid
	}));
};

/**
 * Hook for reading item storage layout statistics
 */
export const useReadItemStorageLayoutStats = () => {
	return createQuery(() => ({
		queryKey: itemStorageLayoutKeys.stats(),
		queryFn: () => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageLayoutApi.getItemStorageLayoutStats(context);
		},
		staleTime: 5 * 60 * 1000,
		enabled: true
	}));
};
