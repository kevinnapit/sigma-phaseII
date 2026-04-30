// Mutation hooks for Transfer Receipt

import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { addMockTransferReceipt } from '../api/transfer-receipt.mock';
import { transferReceiptKeys } from '../api/transfer-receipt.keys';
import { toast } from 'svelte-sonner';
import type { TransferReceiptCreatePayload } from '../types/transfer-receipt.types';

/**
 * Hook for creating transfer receipt
 */
export const useCreateTransferReceipt = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (payload: TransferReceiptCreatePayload) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			return addMockTransferReceipt(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.lists() });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.stats() });
			toast.success('Transfer receipt created successfully');
		},
		onError: (error) => {
			toast.error(`Failed to create transfer receipt: ${error.message}`);
		}
	}));
};

/**
 * Hook for submitting transfer receipt for approval
 */
export const useSubmitTransferReceipt = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (id: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Mock submission - in real app this would call API
			return { id, status: 'submitted' };
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.lists() });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.stats() });
			toast.success('Transfer receipt submitted for approval');
		},
		onError: (error) => {
			toast.error(`Failed to submit transfer receipt: ${error.message}`);
		}
	}));
};

/**
 * Hook for approving transfer receipt
 */
export const useApproveTransferReceipt = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (id: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Mock approval - in real app this would call API
			return { id, status: 'approved' };
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.lists() });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.stats() });
			toast.success('Transfer receipt approved successfully');
		},
		onError: (error) => {
			toast.error(`Failed to approve transfer receipt: ${error.message}`);
		}
	}));
};

/**
 * Hook for rejecting transfer receipt
 */
export const useRejectTransferReceipt = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Mock rejection - in real app this would call API
			return { id, status: 'rejected', reason };
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.lists() });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: transferReceiptKeys.stats() });
			toast.success('Transfer receipt rejected');
		},
		onError: (error) => {
			toast.error(`Failed to reject transfer receipt: ${error.message}`);
		}
	}));
};