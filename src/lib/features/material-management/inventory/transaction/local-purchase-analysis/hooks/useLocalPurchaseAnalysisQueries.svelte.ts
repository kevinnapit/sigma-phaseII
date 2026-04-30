import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { localPurchaseAnalysisApi } from '../api/local-purchase-analysis.api';
import { localPurchaseAnalysisKeys } from '../api/local-purchase-analysis.keys';
import type {
	EligiblePRsParams,
	RFQListParams,
	RFQVendorUsersParams
} from '../types/local-purchase-analysis.types';

/**
 * Hook untuk membaca eligible Purchase Requests untuk RFQ
 */
export const useReadEligiblePRs = (params: () => EligiblePRsParams, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.eligiblePRs(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getEligiblePRs(currentParams, context);
		},
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca semua RFQs dengan pagination
 */
export const useReadAllRFQs = (params: () => RFQListParams, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.rfqList(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getAllRFQs(currentParams, context);
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca detail RFQ by ID
 */
export const useReadDetailRFQ = (id: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(id());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.rfqDetail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getRFQDetail(currentId, context);
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca detail Repeat Order by ID (endpoint sama dengan RFQ, cache terpisah)
 */
export const useReadDetailRO = (id: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(id());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.roDetail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getRFQDetail(currentId, context);
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca data perbandingan quotation
 */
export const useReadQuotationComparison = (rfqId: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(rfqId());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.quotationComparison(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getQuotationComparison(currentId, context);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca summary statistik RFQ
 */
export const useReadRFQSummary = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.summary(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseAnalysisApi.getRFQSummary({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca vendor users untuk undangan RFQ
 */
export const useReadVendorUsersForRFQ = (
	params: () => RFQVendorUsersParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.vendorUsers(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getVendorUsersForRFQ(currentParams, context);
		},
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca tracking history RFQ by ID
 */
export const useReadTrackingHistory = (rfqId: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(rfqId());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseAnalysisKeys.tracking(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return localPurchaseAnalysisApi.getTrackingHistory(currentId, context);
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};
