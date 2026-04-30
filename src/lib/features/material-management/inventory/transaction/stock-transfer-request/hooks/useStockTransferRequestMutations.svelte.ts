// Mutation hooks for Stock Transfer Request

import { toast } from 'svelte-sonner';
import { addMockStockTransferRequest } from '../api/stock-transfer-request.mock';
import type {
	StockTransferRequestCreatePayload,
	StockTransferRequestUpdatePayload
} from '../types/stock-transfer-request.types';

/**
 * Simple mutation hook without TanStack Query for create stock transfer request
 */
export const useCreateStockTransferRequest = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: StockTransferRequestCreatePayload) => {
		isPending = true;
		error = null;
		
		try {
			// Mock implementation - simulate API call
			console.log('Creating stock transfer request:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			// Add to mock data
			const newRequest = addMockStockTransferRequest(payload);
			
			// Mock success response
			const response = { 
				success: true, 
				id: newRequest.id,
				request_number: newRequest.request_number,
				data: newRequest
			};
			
			toast.success('Permintaan transfer stok berhasil dibuat');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal membuat permintaan: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	const mutate = (payload: StockTransferRequestCreatePayload, options?: {
		onSuccess?: (data: any) => void;
		onError?: (error: Error) => void;
	}) => {
		mutateAsync(payload)
			.then((data) => options?.onSuccess?.(data))
			.catch((err) => options?.onError?.(err));
	};

	return {
		mutate,
		mutateAsync,
		isPending,
		error
	};
};

/**
 * Simple mutation hook for updating stock transfer request
 */
export const useUpdateStockTransferRequest = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: StockTransferRequestUpdatePayload) => {
		isPending = true;
		error = null;
		
		try {
			console.log('Updating stock transfer request:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			const response = { success: true };
			toast.success('Permintaan transfer stok berhasil diupdate');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal update permintaan: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	return {
		mutateAsync,
		isPending,
		error
	};
};

/**
 * Simple mutation hook for approving stock transfer request
 */
export const useApproveStockTransferRequest = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async ({ id, notes }: { id: string; notes?: string }) => {
		isPending = true;
		error = null;
		
		try {
			console.log('Approving stock transfer request:', { id, notes });
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			const response = { success: true };
			toast.success('Permintaan berhasil disetujui');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal menyetujui permintaan: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	return {
		mutateAsync,
		isPending,
		error
	};
};

/**
 * Simple mutation hook for rejecting stock transfer request
 */
export const useRejectStockTransferRequest = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async ({ id, reason }: { id: string; reason?: string }) => {
		isPending = true;
		error = null;
		
		try {
			console.log('Rejecting stock transfer request:', { id, reason });
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			const response = { success: true };
			toast.success('Permintaan berhasil ditolak');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal menolak permintaan: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	return {
		mutateAsync,
		isPending,
		error
	};
};

/**
 * Simple mutation hook for submitting stock transfer request (draft -> pending)
 */
export const useSubmitStockTransferRequest = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (id: string) => {
		isPending = true;
		error = null;
		
		try {
			console.log('Submitting stock transfer request:', id);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			const response = { success: true };
			toast.success('Permintaan berhasil diajukan');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal mengajukan permintaan: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	return {
		mutateAsync,
		isPending,
		error
	};
};
