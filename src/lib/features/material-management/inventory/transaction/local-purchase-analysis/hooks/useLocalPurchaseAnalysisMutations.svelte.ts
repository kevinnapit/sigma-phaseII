import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { localPurchaseAnalysisApi } from '../api/local-purchase-analysis.api';
import { localPurchaseAnalysisKeys } from '../api/local-purchase-analysis.keys';
import type {
	CreateRFQRequest,
	SelectWinnerRequest,
	UploadRFQDocumentParams
} from '../types/local-purchase-analysis.types';

/**
 * Hook untuk create dan send RFQ ke vendors
 */
export const useCreateAndSendRFQ = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (data: CreateRFQRequest) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.createAndSendRFQ(data, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.all });
		}
	}));
};

/**
 * Hook untuk memulai evaluasi RFQ (ubah status open -> evaluation)
 */
export const useStartEvaluation = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (rfqId: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.startEvaluation(rfqId, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.all });
		}
	}));
};

/**
 * Hook untuk upload document ke RFQ
 */
export const useUploadRFQDocument = () => {
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: (params: UploadRFQDocumentParams) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.uploadDocument(params, context);
		}
	}));
};

/**
 * Hook untuk select winner RFQ
 */
export const useSelectWinner = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ rfqId, data }: { rfqId: string; data: SelectWinnerRequest }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.selectWinner(rfqId, data, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.all });
		}
	}));
};

/**
 * Hook untuk extend deadline RFQ
 */
export const useExtendDeadline = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ rfqId, newDeadline }: { rfqId: string; newDeadline: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.extendDeadline(rfqId, newDeadline, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.rfqDetail(variables.rfqId) });
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.quotationComparison(variables.rfqId) });
		}
	}));
};

/**
 * Hook untuk menambah vendor ke RFQ
 */
export const useAddVendorToRFQ = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ rfqId, vendorIds }: { rfqId: string; vendorIds: string[] }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.addVendorToRFQ(rfqId, vendorIds, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.rfqDetail(variables.rfqId) });
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.quotationComparison(variables.rfqId) });
		}
	}));
};

/**
 * Hook untuk menghapus item dari RFQ
 */
export const useDeleteRFQItem = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ rfqId, itemId }: { rfqId: string; itemId: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.deleteRFQItem(rfqId, itemId, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.rfqDetail(variables.rfqId) });
			queryClient.invalidateQueries({ queryKey: localPurchaseAnalysisKeys.quotationComparison(variables.rfqId) });
		}
	}));
};
