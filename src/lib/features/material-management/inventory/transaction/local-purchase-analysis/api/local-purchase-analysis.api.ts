import { env } from '$env/dynamic/public';
import type {
	EligiblePRsResponse,
	EligiblePRsParams,
	RFQListResponse,
	RFQListParams,
	CreateRFQRequest,
	CreateRFQResponse,
	RFQDetailResponse,
	QuotationComparisonResponse,
	SelectWinnerRequest,
	SelectWinnerResponse,
	UploadRFQDocumentParams,
	UploadRFQDocumentResponse,
	RFQVendorUsersResponse,
	RFQVendorUsersParams,
	RFQSummaryResponse,
	TrackingHistoryResponse
} from '../types/local-purchase-analysis.types';
import { localPurchaseAnalysisMockApi } from './local-purchase-analysis.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';
const DEFAULT_CONTEXT_ID = 'c8382058-5ad3-415c-8b23-1930396c4ac4';

// Flag to use mock data
const USE_MOCK = true;

export const localPurchaseAnalysisApi = {
	/**
	 * Get eligible Purchase Requests for RFQ
	 */
	getEligiblePRs: async (
		params: EligiblePRsParams,
		context: ApiContext
	): Promise<EligiblePRsResponse> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getEligiblePRs(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			limit: params.limit.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/eligible-purchase-requests?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get all RFQs
	 */
	getAllRFQs: async (params: RFQListParams, context: ApiContext): Promise<RFQListResponse> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getRFQList(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			limit: params.limit.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		const response = await fetch(`${BASE_URL}/api/rfq?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Create and send RFQ to vendors
	 */
	createAndSendRFQ: async (
		data: CreateRFQRequest,
		context: ApiContext
	): Promise<CreateRFQResponse> => {
		const response = await fetch(`${BASE_URL}/api/rfq/create-and-send`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get RFQ detail by ID
	 */
	getRFQDetail: async (rfqId: string, context: ApiContext): Promise<RFQDetailResponse> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getRFQDetail(rfqId);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Start evaluation for RFQ (change status from open to evaluation)
	 */
	startEvaluation: async (rfqId: string, context: ApiContext): Promise<void> => {
		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/start-evaluation`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			}
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}
	},

	/**
	 * Get quotation comparison data for RFQ
	 */
	getQuotationComparison: async (
		rfqId: string,
		context: ApiContext
	): Promise<QuotationComparisonResponse> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getQuotationComparison(rfqId);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/quotations/compare`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Select winner for RFQ
	 */
	selectWinner: async (
		rfqId: string,
		data: SelectWinnerRequest,
		context: ApiContext
	): Promise<SelectWinnerResponse> => {
		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/winner`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},
	/**
	 * Upload document for RFQ
	 */
	uploadDocument: async (
		params: UploadRFQDocumentParams,
		context: ApiContext
	): Promise<UploadRFQDocumentResponse> => {
		const searchParams = new URLSearchParams();
		if (params.document_type) searchParams.append('document_type', params.document_type);
		if (params.description) searchParams.append('description', params.description);

		const formData = new FormData();
		formData.append('file', params.file);

		const url = `${BASE_URL}/api/rfq/${params.rfqId}/documents${searchParams.toString() ? `?${searchParams}` : ''}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			},
			body: formData
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get RFQ summary statistics
	 */
	getRFQSummary: async (context: ApiContext): Promise<RFQSummaryResponse> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getRFQSummary();
		}

		const response = await fetch(`${BASE_URL}/api/rfq/summary`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get vendor users for RFQ invitation
	 */
	getVendorUsersForRFQ: async (
		params: RFQVendorUsersParams,
		context: ApiContext
	): Promise<RFQVendorUsersResponse> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getVendorUsersForRFQ(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			limit: params.limit.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/vendor-users?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Extend deadline RFQ
	 */
	extendDeadline: async (
		rfqId: string,
		newDeadline: string,
		context: ApiContext
	): Promise<void> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.extendDeadline(rfqId, newDeadline);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/extend-deadline`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			},
			body: JSON.stringify({ deadline_date: newDeadline })
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}
	},

	/**
	 * Add vendor to RFQ
	 */
	addVendorToRFQ: async (
		rfqId: string,
		vendorIds: string[],
		context: ApiContext
	): Promise<void> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.addVendorToRFQ(rfqId, vendorIds);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/add-vendors`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			},
			body: JSON.stringify({ vendor_ids: vendorIds })
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}
	},

	/**
	 * Delete item from RFQ
	 */
	deleteRFQItem: async (rfqId: string, itemId: string, context: ApiContext): Promise<void> => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.deleteRFQItem(rfqId, itemId);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/items/${itemId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			}
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}
	},

	/**
	 * Get tracking history for RFQ
	 */
	getTrackingHistory: async (rfqId: string, context: ApiContext) => {
		if (USE_MOCK) {
			return localPurchaseAnalysisMockApi.getTrackingHistory(rfqId);
		}

		const response = await fetch(`${BASE_URL}/api/rfq/${rfqId}/tracking`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || DEFAULT_CONTEXT_ID
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}
};
