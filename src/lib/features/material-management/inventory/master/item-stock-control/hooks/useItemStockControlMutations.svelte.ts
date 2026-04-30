import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { itemStockControlApi } from '../api/item-stock-control.api';
import { itemStockControlKeys } from '../api/item-stock-control.keys';
import type { CreateStockControlPayload } from '../types/item-stock-control.types';

const CONTEXT_ID = 'c8382058-5ad3-415c-8b23-1930396c4ac4';
export const useApproveStockControl = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ approvalId, remarks }: { approvalId: string; remarks: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.approveStockControl(approvalId, remarks, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: CONTEXT_ID
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStockControlKeys.all });
		}
	}));
};

export const useRejectStockControl = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ approvalId, remarks }: { approvalId: string; remarks: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.rejectStockControl(approvalId, remarks, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: CONTEXT_ID
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStockControlKeys.all });
		}
	}));
};

export const useCreateStockControl = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (payload: CreateStockControlPayload) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.createStockControl(payload, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStockControlKeys.all });
		}
	}));
};

export const useSubmitStockControl = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (requestId: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.submitStockControl(requestId, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: CONTEXT_ID
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStockControlKeys.all });
		}
	}));
};

export const useDeactivateStockControl = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.deactivateStockControl(requestId, reason, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: CONTEXT_ID
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStockControlKeys.all });
		}
	}));
};

export const useRefreshStockControlUsage = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return itemStockControlApi.refreshUsage({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStockControlKeys.all });
		}
	}));
};
