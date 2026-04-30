// Query hooks for GRN Re-Conditioned Stock

import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import {
	getMockGRNReconditionedStocks,
	getMockGRNReconditionedStockDetail,
	getMockGRNReconditionedStockStats
} from '../api/grn-reconditioned-stock.mock';
import { grnReconditionedStockKeys } from '../api/grn-reconditioned-stock.keys';
import type { GRNReconditionedStockListParams } from '../types/grn-reconditioned-stock.types';

/**
 * Hook for reading all GRN Re-Conditioned Stock records
 */
export const useReadAllGRNReconditionedStock = (
	params: () => GRNReconditionedStockListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: grnReconditionedStockKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockGRNReconditionedStocks(
				currentParams.page,
				currentParams.size,
				currentParams.search,
				currentParams.status
			);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading GRN Re-Conditioned Stock detail
 */
export const useReadGRNReconditionedStockDetail = (id: () => string) => {
	const userContext = getUserContext();
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: grnReconditionedStockKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockGRNReconditionedStockDetail(currentId);
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading GRN Re-Conditioned Stock stats
 */
export const useReadGRNReconditionedStockStats = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: grnReconditionedStockKeys.stats(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockGRNReconditionedStockStats();
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
