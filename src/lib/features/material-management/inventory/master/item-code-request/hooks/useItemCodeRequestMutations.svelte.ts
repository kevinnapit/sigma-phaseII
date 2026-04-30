/**
 * Item Code Request Mutation Hooks
 */

import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { itemCodeRequestMockApi } from '../api/item-code-request.mock';
import { itemCodeRequestKeys } from '../api/item-code-request.keys';
import { toast } from 'svelte-sonner';
import type {
	CreateItemCodeRequestPayload,
	ReviewItemCodeRequestPayload
} from '../types/item-code-request.types';

/**
 * Hook for creating item code request
 */
export const useCreateItemCodeRequest = () => {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (payload: CreateItemCodeRequestPayload) => {
			return itemCodeRequestMockApi.createItemCodeRequest(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemCodeRequestKeys.lists() });
			queryClient.invalidateQueries({ queryKey: itemCodeRequestKeys.summary() });
			toast.success('Permintaan kode barang berhasil dikirim');
		},
		onError: (error) => {
			toast.error(`Gagal mengirim permintaan: ${error.message}`);
		}
	}));
};

/**
 * Hook for reviewing (approve/reject) item code request
 */
export const useReviewItemCodeRequest = () => {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({
			id,
			payload
		}: {
			id: string;
			payload: ReviewItemCodeRequestPayload;
		}) => {
			return itemCodeRequestMockApi.reviewItemCodeRequest(id, payload);
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: itemCodeRequestKeys.lists() });
			queryClient.invalidateQueries({ queryKey: itemCodeRequestKeys.detail(variables.id) });
			queryClient.invalidateQueries({ queryKey: itemCodeRequestKeys.summary() });

			const action = variables.payload.status === 'APPROVED' ? 'disetujui' : 'ditolak';
			toast.success(`Permintaan kode barang berhasil ${action}`);
		},
		onError: (error) => {
			toast.error(`Gagal memproses permintaan: ${error.message}`);
		}
	}));
};
