// Query hooks for Stock Transfer Request

import { createQuery } from '@tanstack/svelte-query';
import { stockTransferRequestApi } from '../api/stock-transfer-request.api';
import { stockTransferRequestKeys } from '../api/stock-transfer-request.keys';
import type { StockTransferRequestListParams } from '../types/stock-transfer-request.types';

/**
 * Hook for reading all stock transfer requests
 */
export const useReadAllStockTransferRequests = (
	params: () => StockTransferRequestListParams,
	isEnabled?: () => boolean
) => {
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: stockTransferRequestKeys.list(currentParams),
		queryFn: () => stockTransferRequestApi.getStockTransferRequests(currentParams),
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled
	}));
};

/**
 * Hook for reading stock transfer request detail
 */
export const useReadStockTransferRequestDetail = (id: () => string) => {
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: stockTransferRequestKeys.detail(currentId),
		queryFn: () => stockTransferRequestApi.getStockTransferRequestDetail(currentId),
		enabled: !!currentId
	}));
};

/**
 * Hook for reading stock transfer request statistics
 */
export const useReadStockTransferRequestStats = () => {
	return createQuery(() => ({
		queryKey: stockTransferRequestKeys.stats(),
		queryFn: () => stockTransferRequestApi.getStockTransferRequestStats(),
		staleTime: 30000 // 30 seconds
	}));
};
