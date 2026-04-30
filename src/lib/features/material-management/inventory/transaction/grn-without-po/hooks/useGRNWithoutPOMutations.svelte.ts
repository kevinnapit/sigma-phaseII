// Mutation hooks for GRN Without PO

import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { addMockGRNWithoutPO } from '../api/grn-without-po.mock';
import { grnWithoutPOKeys } from '../api/grn-without-po.keys';
import { toast } from 'svelte-sonner';
import type { GRNWithoutPOCreatePayload } from '../types/grn-without-po.types';

/**
 * Hook for creating GRN Without PO
 */
export const useCreateGRNWithoutPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (payload: GRNWithoutPOCreatePayload) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			return addMockGRNWithoutPO(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.stats() });
			toast.success('GRN Tanpa PO berhasil dibuat');
		},
		onError: (error) => {
			toast.error(`Gagal membuat GRN Tanpa PO: ${error.message}`);
		}
	}));
};

/**
 * Hook for submitting GRN Without PO for approval
 */
export const useSubmitGRNWithoutPO = () => {
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
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.stats() });
			toast.success('GRN Tanpa PO berhasil diajukan untuk persetujuan');
		},
		onError: (error) => {
			toast.error(`Gagal mengajukan GRN Tanpa PO: ${error.message}`);
		}
	}));
};

/**
 * Hook for approving GRN Without PO
 */
export const useApproveGRNWithoutPO = () => {
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
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.stats() });
			toast.success('GRN Tanpa PO berhasil disetujui');
		},
		onError: (error) => {
			toast.error(`Gagal menyetujui GRN Tanpa PO: ${error.message}`);
		}
	}));
};

/**
 * Hook for rejecting GRN Without PO
 */
export const useRejectGRNWithoutPO = () => {
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
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.lists() });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: grnWithoutPOKeys.stats() });
			toast.success('GRN Tanpa PO berhasil ditolak');
		},
		onError: (error) => {
			toast.error(`Gagal menolak GRN Tanpa PO: ${error.message}`);
		}
	}));
};
