import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { itemStockControlApi } from '../api/item-stock-control.api';
import { itemStockControlKeys } from '../api/item-stock-control.keys';
import type { StockControlListParams } from '../types/item-stock-control.types';

/**
 * Hook untuk membaca semua items dengan usage dan status request terbaru
 */
export const useReadAllStockControls = (
	params: () => StockControlListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemStockControlKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.getStockControls(currentParams, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca approval history
 */
export const useReadStockControlApprovalHistory = (approvalId: () => string | undefined) => {
	const userContext = getUserContext();
	const currentId = $derived(approvalId());

	return createQuery(() => ({
		queryKey: itemStockControlKeys.approvalHistory(currentId ?? ''),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.getApprovalHistory(currentId!, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};
export const useReadStockControlDetail = (requestId: () => string) => {
	const userContext = getUserContext();
	const currentId = $derived(requestId());

	return createQuery(() => ({
		queryKey: itemStockControlKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.getStockControlDetail(currentId, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca summary/stats kontrol stok
 */
export const useReadStockControlSummary = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: itemStockControlKeys.summary(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.getStockControlSummary({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
