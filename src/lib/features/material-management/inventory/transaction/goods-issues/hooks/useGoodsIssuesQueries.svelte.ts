import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { goodsIssuesApi } from '../api/goods-issues.api';
import { goodsIssuesKeys } from '../api/goods-issues.keys';
import type { GoodsIssuesListParams } from '../types/goods-issues.types';

/**
 * Hook untuk membaca semua goods issues dengan pagination dan search
 */
export const useReadAllGoodsIssues = (
	params: () => GoodsIssuesListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsIssuesKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsIssuesApi.getAll(currentParams, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id,
		placeholderData: (previousData) => previousData
	}));
};

/**
 * Hook untuk membaca detail goods issue by ID
 */
export const useReadGoodsIssueDetail = (id: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(id());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsIssuesKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsIssuesApi.getById(currentId, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};
