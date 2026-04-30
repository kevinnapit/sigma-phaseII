import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { localPurchaseItemApi } from '../api/local-purchase-item.api';
import { localPurchaseItemKeys } from '../api/local-purchase-item.keys';
import type { SapSyncResponse, AutoPublishResponse } from '../types/local-purchase-item.types';

/**
 * Hook step 1: Tarik data dari SAP ke staging
 */
export const useSyncFromSap = () => {
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async (): Promise<SapSyncResponse> => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseItemApi.syncFromSap({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		}
	}));
};

/**
 * Hook step 2: Publish dari staging ke procurement source (decision: ALLOWED)
 */
export const useAutoPublish = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (): Promise<AutoPublishResponse> => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseItemApi.autoPublish({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseItemKeys.all });
		}
	}));
};
