import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { itemGroupApi } from '../api/item-group.api';
import { itemGroupKeys } from '../api/item-group.keys';
import type { ItemGroupListParams } from '../types/item-group.types';

/**
 * Queries for Item Groups
 */

/**
 * Hook for reading all item groups with pagination and filters
 */
export const useReadAllItemGroups = (
	params: () => ItemGroupListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemGroupKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemGroupApi.getItemGroups(currentParams, context);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item group detail by ID
 */
export const useReadDetailItemGroup = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: itemGroupKeys.detail(currentUoid),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemGroupApi.getItemGroupById(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading item group statistics
 */
export const useReadItemGroupStats = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: itemGroupKeys.stats(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemGroupApi.getItemGroupStats(context);
		},
		enabled: !!userContext.token && !!userContext.estate?.id,
		staleTime: 5 * 60 * 1000 // 5 minutes
	}));
};
