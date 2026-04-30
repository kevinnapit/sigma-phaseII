import { env } from '$env/dynamic/public';
import type {
	ProcurementSourceResponse,
	PurchasingGroupResponse,
	PurchaseRequestListResponse,
	PurchaseRequestListParams,
	PurchaseRequestPayload,
	PurchaseRequestCreateResponse,
	PurchaseRequestSubmitResponse,
	PurchaseRequestDetailResponse,
	ApprovalHistoryResponse,
	ApproveRejectPayload,
	PurchaseRequestSummaryResponse,
	CancelPurchaseRequestPayload,
	CancelPurchaseRequestResponse,
	TrackingHistoryResponse
} from '../types/purchase-request.types';
import { purchaseRequestMockApi } from './purchase-request.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';
const USE_MOCK = true; // Set to false to use real API

/**
 * Purchase Request API
 */
export const purchaseRequestApi = {
	/**
	 * Get all purchase requests with pagination
	 */
	getPurchaseRequests: async (
		params: PurchaseRequestListParams,
		context: ApiContext
	): Promise<PurchaseRequestListResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getPurchaseRequests(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		if (params.approval_status) {
			searchParams.append('approval_status', params.approval_status);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Create a new purchase request
	 */
	createPurchaseRequest: async (
		payload: PurchaseRequestPayload,
		context: ApiContext
	): Promise<PurchaseRequestCreateResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.createPurchaseRequest(payload);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get procurement sources for an item by item code
	 */
	getProcurementSources: async (
		itemCode: string,
		context: ApiContext
	): Promise<ProcurementSourceResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getProcurementSources(itemCode);
		}

		const response = await fetch(`${BASE_URL}/api/items/${itemCode}/procurement-sources`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get purchasing groups (departments)
	 */
	getPurchasingGroups: async (context: ApiContext): Promise<PurchasingGroupResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getPurchasingGroups();
		}

		const response = await fetch(`${BASE_URL}/api/purchasing-groups`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Submit a purchase request for approval
	 */
	submitPurchaseRequest: async (
		requestId: string,
		context: ApiContext
	): Promise<PurchaseRequestSubmitResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.submitPurchaseRequest(requestId);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests/${requestId}/submit`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get purchase request detail by ID
	 */
	getPurchaseRequestDetail: async (
		requestId: string,
		context: ApiContext
	): Promise<PurchaseRequestDetailResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getPurchaseRequestDetail(requestId);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests/${requestId}`, {
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
	 * Get approval history for a purchase request
	 */
	getApprovalHistory: async (
		approvalId: string,
		context: ApiContext
	): Promise<ApprovalHistoryResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getApprovalHistory(approvalId);
		}

		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/history`, {
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
	 * Approve purchase request
	 */
	approvePurchaseRequest: async (
		approvalId: string,
		payload: ApproveRejectPayload,
		context: ApiContext
	): Promise<any> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.approvePurchaseRequest(approvalId);
		}

		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/approve`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get purchase request summary statistics
	 */
	getPurchaseRequestSummary: async (
		context: ApiContext
	): Promise<PurchaseRequestSummaryResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getPurchaseRequestSummary();
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests/summary`, {
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
	 * Reject purchase request
	 */
	rejectPurchaseRequest: async (
		approvalId: string,
		payload: ApproveRejectPayload,
		context: ApiContext
	): Promise<any> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.rejectPurchaseRequest(approvalId);
		}

		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/reject`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Cancel purchase request
	 */
	cancelPurchaseRequest: async (
		requestId: string,
		payload: CancelPurchaseRequestPayload,
		context: ApiContext
	): Promise<CancelPurchaseRequestResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.cancelPurchaseRequest(requestId, payload);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests/${requestId}/cancel`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Update purchase request
	 */
	updatePurchaseRequest: async (
		requestId: string,
		payload: PurchaseRequestPayload,
		context: ApiContext
	): Promise<any> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.updatePurchaseRequest(requestId, payload);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests/${requestId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get tracking history for purchase request (REQ-028)
	 */
	getTrackingHistory: async (
		requestId: string,
		context: ApiContext
	): Promise<TrackingHistoryResponse> => {
		if (USE_MOCK) {
			return purchaseRequestMockApi.getTrackingHistory(requestId);
		}

		const response = await fetch(`${BASE_URL}/api/purchase-requests/${requestId}/tracking`, {
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
	}
};
