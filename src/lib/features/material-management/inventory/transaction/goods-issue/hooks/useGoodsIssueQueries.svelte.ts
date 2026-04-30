import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { goodsIssueApi } from '../api/goods-issue.api';
import { goodsIssueKeys } from '../api/goods-issue.keys';
import type { GoodsIssueListParams } from '../types/goods-issue.types';

/**
 * Hook untuk membaca summary statistik Goods Issue
 */
export const useReadGoodsIssueSummary = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: goodsIssueKeys.summary(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsIssueApi.getGoodsIssueSummary({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca semua Goods Issues dengan pagination dan search
 */
export const useReadAllGoodsIssues = (
	params: () => GoodsIssueListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsIssueKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsIssueApi.getAllGoodsIssues(currentParams, context);
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca detail Goods Issue by ID
 */
export const useReadGoodsIssueDetail = (id: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(id());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsIssueKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsIssueApi.getGoodsIssueDetail(currentId, context);
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};
