/**
 * Item Code Request Query Hooks
 */

import { createQuery } from '@tanstack/svelte-query';
import { itemCodeRequestMockApi } from '../api/item-code-request.mock';
import { itemCodeRequestKeys } from '../api/item-code-request.keys';
import type { ItemCodeRequestListParams } from '../types/item-code-request.types';

/**
 * Hook for reading all item code requests
 */
export const useReadAllItemCodeRequests = (
	params: () => ItemCodeRequestListParams,
	isEnabled?: () => boolean
) => {
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemCodeRequestKeys.list(currentParams),
		queryFn: () => itemCodeRequestMockApi.getItemCodeRequests(currentParams),
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled
	}));
};

/**
 * Hook for reading item code request detail
 */
export const useReadItemCodeRequestDetail = (id: () => string) => {
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: itemCodeRequestKeys.detail(currentId),
		queryFn: () => itemCodeRequestMockApi.getItemCodeRequestDetail(currentId),
		enabled: !!currentId
	}));
};

/**
 * Hook for reading summary stats
 */
export const useReadItemCodeRequestSummary = () => {
	return createQuery(() => ({
		queryKey: itemCodeRequestKeys.summary(),
		queryFn: () => itemCodeRequestMockApi.getSummary(),
		staleTime: 30000 // 30 seconds
	}));
};
