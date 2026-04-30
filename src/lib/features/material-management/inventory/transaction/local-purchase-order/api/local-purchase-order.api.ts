import { env } from '$env/dynamic/public';
import type {
	LPOWinnerVendorListResponse,
	LPOWinnerVendorParams,
	LPOListResponse,
	LPOListParams,
	LPOSummaryResponse,
	LPODetailResponse,
	LPOCreateParams,
	LPOCreateResponse,
	LPOSubmitResponse,
	LPOApprovalResponse,
	LPOApprovalHistoryResponse,
	LPOSendPOResponse,
	ROCreateParams,
	ROCreateResponse,
	LPOCancelParams,
	LPOCancelResponse,
	LPOUpdateParams,
	LPOUpdateResponse,
	LPOResubmitResponse,
	LPOActivityLogResponse,
	LPOTrackingHistoryResponse
} from '../types/local-purchase-order.types';
import { localPurchaseOrderMockApi } from './local-purchase-order.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

/**
 * Flag untuk menggunakan mock data
 * Set ke true untuk development/testing
 */
const USE_MOCK = true;

export const localPurchaseOrderApi = {
	getWinnerVendors: async (
		params: LPOWinnerVendorParams,
		context: ApiContext
	): Promise<LPOWinnerVendorListResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.getWinnerVendors(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});
		if (params.search) searchParams.append('search', params.search);

		const response = await fetch(`${BASE_URL}/api/lpo/winner-vendors?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	getAllLPOs: async (params: LPOListParams, context: ApiContext): Promise<LPOListResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.getAllLPOs(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});
		if (params.search) searchParams.append('search', params.search);
		if (params.approval_status) searchParams.append('approval_status', params.approval_status);

		const response = await fetch(`${BASE_URL}/api/lpo?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	getSummary: async (context: ApiContext): Promise<LPOSummaryResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.getSummary();
		}

		const response = await fetch(`${BASE_URL}/api/lpo/summary`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	getLPODetail: async (lpoId: string, context: ApiContext): Promise<LPODetailResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.getLPODetail(lpoId);
		}

		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	createLPO: async (params: LPOCreateParams, context: ApiContext): Promise<LPOCreateResponse> => {
		const response = await fetch(`${BASE_URL}/api/lpo`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify(params)
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	submitLPO: async (lpoId: string, context: ApiContext): Promise<LPOSubmitResponse> => {
		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}/submit`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	approveLPO: async (
		approvalId: string,
		remarks: string,
		context: ApiContext
	): Promise<LPOApprovalResponse> => {
		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/approve`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify({ remarks })
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	rejectLPO: async (
		approvalId: string,
		remarks: string,
		context: ApiContext
	): Promise<LPOApprovalResponse> => {
		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/reject`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify({ remarks })
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	getApprovalHistory: async (
		approvalId: string,
		context: ApiContext
	): Promise<LPOApprovalHistoryResponse> => {
		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/history`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	sendPO: async (
		lpoId: string,
		customMessage: string,
		context: ApiContext
	): Promise<LPOSendPOResponse> => {
		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}/send-po`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify({ custom_message: customMessage })
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	createRepeatOrder: async (
		params: ROCreateParams,
		context: ApiContext
	): Promise<ROCreateResponse> => {
		const response = await fetch(`${BASE_URL}/api/lpo/repeat-order`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify(params)
		});
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.errors || `HTTP ${response.status}: ${response.statusText}`);
		}
		return response.json();
	},

	/**
	 * Cancel LPO
	 */
	cancelLPO: async (
		lpoId: string,
		params: LPOCancelParams,
		context: ApiContext
	): Promise<LPOCancelResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.cancelLPO(lpoId, params);
		}

		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}/cancel`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify(params)
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	/**
	 * Update LPO
	 */
	updateLPO: async (
		lpoId: string,
		params: LPOUpdateParams,
		context: ApiContext
	): Promise<LPOUpdateResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.updateLPO(lpoId, params);
		}

		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify(params)
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	/**
	 * Resubmit LPO (after edit from rejected)
	 */
	resubmitLPO: async (lpoId: string, context: ApiContext): Promise<LPOResubmitResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.resubmitLPO(lpoId);
		}

		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}/resubmit`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	/**
	 * Get Activity Logs
	 */
	getActivityLogs: async (lpoId: string, context: ApiContext): Promise<LPOActivityLogResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.getActivityLogs(lpoId);
		}

		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}/activity-logs`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	},

	/**
	 * Get tracking history for LPO
	 */
	getTrackingHistory: async (lpoId: string, context: ApiContext): Promise<LPOTrackingHistoryResponse> => {
		if (USE_MOCK) {
			return localPurchaseOrderMockApi.getTrackingHistory(lpoId);
		}

		const response = await fetch(`${BASE_URL}/api/lpo/${lpoId}/tracking`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		return response.json();
	}
};
