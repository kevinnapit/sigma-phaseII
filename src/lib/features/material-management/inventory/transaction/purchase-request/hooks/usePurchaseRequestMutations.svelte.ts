import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { purchaseRequestApi } from '../api/purchase-request.api';
import { purchaseRequestKeys } from '../api/purchase-request.keys';
import type { PurchaseRequestPayload, CancelPurchaseRequestPayload } from '../types/purchase-request.types';

// Check if using mock mode
const USE_MOCK = true;

/**
 * Mutations for Purchase Requests - Create, Update, Delete operations
 */

/**
 * Hook for creating a new purchase request
 */
export const useCreatePurchaseRequest = () => {
	const queryClient = useQueryClient();
	const userContext = USE_MOCK ? null : getUserContext();

	return createMutation(() => ({
		mutationFn: (data: PurchaseRequestPayload) => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.createPurchaseRequest(data, context);
			}

			// For real API
			if (!userContext?.token) {
				throw new Error('No authentication token available');
			}
			if (!userContext?.estate?.id) {
				throw new Error('No estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.createPurchaseRequest(data, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
		}
	}));
};

/**
 * Hook for updating a purchase request
 */
export const useUpdatePurchaseRequest = () => {
	const queryClient = useQueryClient();
	const userContext = USE_MOCK ? null : getUserContext();

	return createMutation(() => ({
		mutationFn: ({ id, payload }: { id: string; payload: any }) => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.updatePurchaseRequest(id, payload, context);
			}

			// For real API
			if (!userContext?.token) {
				throw new Error('No authentication token available');
			}
			if (!userContext?.estate?.id) {
				throw new Error('No estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.updatePurchaseRequest(id, payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
		}
	}));
};

/**
 * Hook for submitting a purchase request for approval
 */
export const useSubmitPurchaseRequest = () => {
	const queryClient = useQueryClient();
	const userContext = USE_MOCK ? null : getUserContext();

	return createMutation(() => ({
		mutationFn: (requestId: string) => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.submitPurchaseRequest(requestId, context);
			}

			// For real API
			if (!userContext?.token) {
				throw new Error('No authentication token available');
			}
			if (!userContext?.estate?.id) {
				throw new Error('No estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.submitPurchaseRequest(requestId, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
		}
	}));
};

/**
 * Hook for approving a purchase request
 */
export const useApprovePurchaseRequest = () => {
	const queryClient = useQueryClient();
	const userContext = USE_MOCK ? null : getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			approvalId,
			payload
		}: {
			approvalId: string;
			payload: { remarks?: string };
		}) => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.approvePurchaseRequest(approvalId, payload, context);
			}

			// For real API
			if (!userContext?.token) {
				throw new Error('No authentication token available');
			}
			if (!userContext?.estate?.id) {
				throw new Error('No estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.approvePurchaseRequest(approvalId, payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
		}
	}));
};

/**
 * Hook for rejecting a purchase request
 */
export const useRejectPurchaseRequest = () => {
	const queryClient = useQueryClient();
	const userContext = USE_MOCK ? null : getUserContext();

	return createMutation(() => ({
		mutationFn: ({ approvalId, payload }: { approvalId: string; payload: { remarks: string } }) => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.rejectPurchaseRequest(approvalId, payload, context);
			}

			// For real API
			if (!userContext?.token) {
				throw new Error('No authentication token available');
			}
			if (!userContext?.estate?.id) {
				throw new Error('No estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.rejectPurchaseRequest(approvalId, payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
		}
	}));
};

/**
 * Hook for cancelling a purchase request
 */
export const useCancelPurchaseRequest = () => {
	const queryClient = useQueryClient();
	const userContext = USE_MOCK ? null : getUserContext();

	return createMutation(() => ({
		mutationFn: ({ id, payload }: { id: string; payload: CancelPurchaseRequestPayload }) => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.cancelPurchaseRequest(id, payload, context);
			}

			// For real API
			if (!userContext?.token) {
				throw new Error('No authentication token available');
			}
			if (!userContext?.estate?.id) {
				throw new Error('No estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.cancelPurchaseRequest(id, payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
		}
	}));
};

/**
 * Hook for creating bulk purchase request (multiple items to one department)
 */
export const useCreateBulkPurchaseRequest = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: any) => {
		isPending = true;
		error = null;
		
		try {
			// Mock implementation - simulate API call
			console.log('Creating bulk purchase request:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			// Generate mock PR number
			const prNumber = `LB/LP0/MR/2026/${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
			const newId = `pr-${Date.now()}`;
			
			// Mock success response
			const response = { 
				success: true, 
				id: newId,
				request_number: prNumber,
				data: {
					id: newId,
					request_number: prNumber,
					...payload
				}
			};
			
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
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
