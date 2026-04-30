import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { purchaseRequestApi } from '../api/purchase-request.api';
import { purchaseRequestKeys } from '../api/purchase-request.keys';
import type { PurchaseRequestListParams } from '../types/purchase-request.types';

// Check if using mock mode
const USE_MOCK = true;

/**
 * Hook for reading all purchase requests with pagination and filters
 */
export const useReadAllPurchaseRequests = (
	params: () => PurchaseRequestListParams,
	isEnabled?: () => boolean
) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.list(currentParams),
		queryFn: () => {
			// For mock mode, use dummy context
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.getPurchaseRequests(currentParams, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.getPurchaseRequests(currentParams, context);
		},
		placeholderData: (previousData) => previousData,
		enabled: USE_MOCK ? enabled : (enabled && !!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook for getting procurement sources for an item by item code
 */
export const useProcurementSources = (itemCode: () => string, enabled?: () => boolean) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentItemCode = $derived(itemCode());
	const isEnabled = $derived(enabled ? enabled() : true);

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.procurementSources(currentItemCode),
		queryFn: () => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.getProcurementSources(currentItemCode, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.getProcurementSources(currentItemCode, context);
		},
		enabled: USE_MOCK ? (isEnabled && !!currentItemCode) : (isEnabled && !!currentItemCode && !!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook for getting purchasing groups (departments)
 */
export const usePurchasingGroups = (enabled?: () => boolean) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const isEnabled = $derived(enabled ? enabled() : true);

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.purchasingGroups(),
		queryFn: () => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.getPurchasingGroups(context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.getPurchasingGroups(context);
		},
		enabled: USE_MOCK ? isEnabled : (isEnabled && !!userContext?.token && !!userContext?.estate?.id)
	}));
};
/**
 * Hook untuk membaca detail purchase request by ID
 */
export const useReadDetailPurchaseRequest = (id: () => string) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.detail(currentId),
		queryFn: () => {
			// For mock mode
			if (USE_MOCK) {
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.getPurchaseRequestDetail(currentId, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.getPurchaseRequestDetail(currentId, context);
		},
		enabled: USE_MOCK ? !!currentId : (!!currentId && !!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook untuk membaca summary statistik purchase request
 */
export const useReadPurchaseRequestSummary = () => {
	const userContext = USE_MOCK ? null : getUserContext();

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.summary(),
		queryFn: () => {
			// For mock mode
			if (USE_MOCK) {
				return purchaseRequestApi.getPurchaseRequestSummary({
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				});
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return purchaseRequestApi.getPurchaseRequestSummary({
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		enabled: USE_MOCK ? true : (!!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook untuk membaca approval history by approval ID
 */
export const useReadApprovalHistory = (approvalId: () => string | undefined) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentApprovalId = $derived(approvalId());

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.approvalHistory(currentApprovalId || ''),
		queryFn: () => {
			// For mock mode
			if (USE_MOCK) {
				if (!currentApprovalId) {
					throw new Error('No approval ID available');
				}
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.getApprovalHistory(currentApprovalId, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id || !currentApprovalId) {
				throw new Error('No authentication token, estate selection, or approval ID available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.getApprovalHistory(currentApprovalId, context);
		},
		enabled: USE_MOCK ? !!currentApprovalId : (!!currentApprovalId && !!userContext?.token && !!userContext?.estate?.id)
	}));
};

/**
 * Hook untuk membaca tracking history by request ID (REQ-028)
 */
export const useReadTrackingHistory = (requestId: () => string | undefined) => {
	const userContext = USE_MOCK ? null : getUserContext();
	const currentRequestId = $derived(requestId());

	return createQuery(() => ({
		queryKey: purchaseRequestKeys.tracking(currentRequestId || ''),
		queryFn: () => {
			// For mock mode
			if (USE_MOCK) {
				if (!currentRequestId) {
					throw new Error('No request ID available');
				}
				const context = {
					token: 'mock-token',
					estateId: 'mock-estate',
					contextId: 'mock-context'
				};
				return purchaseRequestApi.getTrackingHistory(currentRequestId, context);
			}

			// For real API
			if (!userContext?.token || !userContext?.estate?.id || !currentRequestId) {
				throw new Error('No authentication token, estate selection, or request ID available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return purchaseRequestApi.getTrackingHistory(currentRequestId, context);
		},
		enabled: USE_MOCK ? !!currentRequestId : (!!currentRequestId && !!userContext?.token && !!userContext?.estate?.id)
	}));
};
