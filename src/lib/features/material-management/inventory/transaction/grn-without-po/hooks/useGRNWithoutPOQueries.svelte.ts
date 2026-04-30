// Query hooks for GRN Without PO

import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import {
	getMockGRNWithoutPOs,
	getMockGRNWithoutPODetail,
	getMockGRNWithoutPOStats
} from '../api/grn-without-po.mock';
import { grnWithoutPOKeys } from '../api/grn-without-po.keys';
import type { GRNWithoutPOListParams } from '../types/grn-without-po.types';

/**
 * Hook for reading all GRN Without PO records
 */
export const useReadAllGRNWithoutPO = (
	params: () => GRNWithoutPOListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: grnWithoutPOKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockGRNWithoutPOs(
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
 * Hook for reading GRN Without PO detail
 */
export const useReadGRNWithoutPODetail = (id: () => string) => {
	const userContext = getUserContext();
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: grnWithoutPOKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockGRNWithoutPODetail(currentId);
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading GRN Without PO stats
 */
export const useReadGRNWithoutPOStats = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: grnWithoutPOKeys.stats(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return getMockGRNWithoutPOStats();
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
