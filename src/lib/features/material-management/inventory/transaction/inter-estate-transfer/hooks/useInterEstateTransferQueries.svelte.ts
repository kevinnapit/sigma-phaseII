// Query hooks for Inter Estate Transfer

import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { interEstateTransferApi } from '../api/inter-estate-transfer.api';
import { interEstateTransferKeys } from '../api/inter-estate-transfer.keys';
import type { InterEstateTransferListParams } from '../types/inter-estate-transfer.types';

// Check if using mock mode
const USE_MOCK = true;

/**
 * Hook for reading all inter estate transfers
 */
export const useReadAllInterEstateTransfers = (
	params: () => InterEstateTransferListParams,
	isEnabled?: () => boolean
) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: interEstateTransferKeys.list(currentParams),
		queryFn: () => {
			// For mock mode, use dummy context
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate'
				};
				return interEstateTransferApi.getInterEstateTransfers(currentParams, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return interEstateTransferApi.getInterEstateTransfers(currentParams, context);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: USE_MOCK ? enabled : (enabled && !!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook for reading inter estate transfer detail
 */
export const useReadInterEstateTransferDetail = (id: () => string) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: interEstateTransferKeys.detail(currentId),
		queryFn: () => {
			// For mock mode, use dummy context
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate'
				};
				return interEstateTransferApi.getInterEstateTransferDetail(currentId, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return interEstateTransferApi.getInterEstateTransferDetail(currentId, context);
		},
		enabled: USE_MOCK ? !!currentId : (!!currentId && !!userContext?.token && !!userContext?.estate?.id)
	}));
};
