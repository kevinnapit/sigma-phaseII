// Mutation hooks for Inter Estate Transfer

import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { interEstateTransferApi } from '../api/inter-estate-transfer.api';
import { interEstateTransferKeys } from '../api/inter-estate-transfer.keys';
import { toast } from 'svelte-sonner';
import type { ApprovalRequest, RejectionRequest } from '../types/inter-estate-transfer.types';

/**
 * Hook for approving inter estate transfer
 */
export const useApproveTransfer = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({ id, payload }: { id: string; payload: ApprovalRequest }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return interEstateTransferApi.approveTransfer(id, payload, context);
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: interEstateTransferKeys.lists() });
			queryClient.invalidateQueries({ queryKey: interEstateTransferKeys.detail(variables.id) });
			toast.success(data.message || 'Transfer berhasil disetujui');
		},
		onError: (error) => {
			toast.error(`Gagal menyetujui transfer: ${error.message}`);
		}
	}));
};

/**
 * Hook for rejecting inter estate transfer
 */
export const useRejectTransfer = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({ id, payload }: { id: string; payload: RejectionRequest }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return interEstateTransferApi.rejectTransfer(id, payload, context);
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: interEstateTransferKeys.lists() });
			queryClient.invalidateQueries({ queryKey: interEstateTransferKeys.detail(variables.id) });
			toast.success(data.message || 'Transfer berhasil ditolak');
		},
		onError: (error) => {
			toast.error(`Gagal menolak transfer: ${error.message}`);
		}
	}));
};
