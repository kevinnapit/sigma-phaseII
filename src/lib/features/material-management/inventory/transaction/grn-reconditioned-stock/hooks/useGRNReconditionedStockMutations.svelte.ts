// Mutation hooks for GRN Re-Conditioned Stock

import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { addMockGRNReconditionedStock } from '../api/grn-reconditioned-stock.mock';
import { grnReconditionedStockKeys } from '../api/grn-reconditioned-stock.keys';
import { toast } from 'svelte-sonner';
import type { GRNReconditionedStockCreatePayload } from '../types/grn-reconditioned-stock.types';

/**
 * Hook for creating GRN Re-Conditioned Stock
 */
export const useCreateGRNReconditionedStock = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (payload: GRNReconditionedStockCreatePayload) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			return addMockGRNReconditionedStock(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.stats() });
			toast.success('GRN Re-Conditioned Stock berhasil dibuat');
		},
		onError: (error) => {
			toast.error(`Gagal membuat GRN Re-Conditioned Stock: ${error.message}`);
		}
	}));
};

/**
 * Hook for submitting GRN Re-Conditioned Stock for approval
 */
export const useSubmitGRNReconditionedStock = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (id: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1500));

			return { id, status: 'PENDING_APPROVAL' };
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.stats() });
			toast.success('GRN Re-Conditioned Stock berhasil diajukan untuk persetujuan');
		},
		onError: (error) => {
			toast.error(`Gagal mengajukan GRN Re-Conditioned Stock: ${error.message}`);
		}
	}));
};

/**
 * Hook for approving GRN Re-Conditioned Stock
 */
export const useApproveGRNReconditionedStock = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (id: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1500));

			return { id, status: 'APPROVED' };
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.stats() });
			toast.success('GRN Re-Conditioned Stock berhasil disetujui');
		},
		onError: (error) => {
			toast.error(`Gagal menyetujui GRN Re-Conditioned Stock: ${error.message}`);
		}
	}));
};

/**
 * Hook for rejecting GRN Re-Conditioned Stock
 */
export const useRejectGRNReconditionedStock = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1500));

			return { id, status: 'REJECTED', reason };
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: grnReconditionedStockKeys.stats() });
			toast.success('GRN Re-Conditioned Stock berhasil ditolak');
		},
		onError: (error) => {
			toast.error(`Gagal menolak GRN Re-Conditioned Stock: ${error.message}`);
		}
	}));
};
