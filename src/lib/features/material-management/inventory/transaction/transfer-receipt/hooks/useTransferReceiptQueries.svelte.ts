// Query hooks for Transfer Receipt

import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { getMockTransferReceipts, getMockTransferReceiptDetail, getMockTransferReceiptStats } from '../api/transfer-receipt.mock';
import { transferReceiptKeys } from '../api/transfer-receipt.keys';
import type { TransferReceiptListParams } from '../types/transfer-receipt.types';

/**
 * Hook for reading all transfer receipts
 */
export const useReadAllTransferReceipts = (
	params: () => TransferReceiptListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: transferReceiptKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockTransferReceipts(
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
 * Hook for reading transfer receipt detail
 */
export const useReadTransferReceiptDetail = (id: () => string) => {
	const userContext = getUserContext();
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: transferReceiptKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockTransferReceiptDetail(currentId);
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading transfer receipt stats
 */
export const useReadTransferReceiptStats = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: transferReceiptKeys.stats(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockTransferReceiptStats();
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};