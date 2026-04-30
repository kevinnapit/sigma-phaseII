import { env } from '$env/dynamic/public';
import type {
	StockControlListParams,
	StockControlListResponse,
	StockControlRequestDetail,
	ApprovalResponse,
	CreateStockControlPayload,
	CreateStockControlResponse,
	SubmitStockControlResponse,
	StockControlSummary
} from '../types/item-stock-control.types';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const body = await response.json();
		if (body?.errors?.[0]?.message) return body.errors[0].message;
		if (body?.detail) return body.detail;
		if (body?.message) return body.message;
	} catch {
		// ignore
	}
	return response.statusText || `HTTP ${response.status}`;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

export const itemStockControlApi = {
	/**
	 * Get items with usage data and latest request status
	 * GET /api/stock-control/items-with-usage
	 */
	getStockControls: async (
		params: StockControlListParams,
		context: ApiContext
	): Promise<StockControlListResponse> => {
		const searchParams = new URLSearchParams();

		if (params.page !== undefined) searchParams.append('page', params.page.toString());
		if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
		if (params.search) searchParams.append('search', params.search);
		if (params.department_code) searchParams.append('department_code', params.department_code);
		if (params.has_pending_request !== undefined)
			searchParams.append('has_pending_request', params.has_pending_request.toString());
		if (params.approval_status) searchParams.append('approval_status', params.approval_status);

		const qs = searchParams.toString();
		const url = `${BASE_URL}/api/stock-control/items-with-usage${qs ? `?${qs}` : ''}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Get detail of a single stock control request
	 * GET /api/stock-control/requests/{requestId}
	 */
	getStockControlDetail: async (
		requestId: string,
		context: ApiContext
	): Promise<StockControlRequestDetail> => {
		const response = await fetch(`${BASE_URL}/api/stock-control/requests/${requestId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Approve a stock control request
	 * POST /api/approvals/{approvalId}/approve
	 */
	approveStockControl: async (
		approvalId: string,
		remarks: string,
		context: ApiContext
	): Promise<ApprovalResponse> => {
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
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Reject a stock control request
	 * POST /api/approvals/{approvalId}/reject
	 */
	rejectStockControl: async (
		approvalId: string,
		remarks: string,
		context: ApiContext
	): Promise<ApprovalResponse> => {
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
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Get approval history
	 * GET /api/approvals/{approvalId}/history
	 */
	getApprovalHistory: async (
		approvalId: string,
		context: ApiContext
	): Promise<ApprovalResponse> => {
		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/history`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Create a new stock control request
	 * POST /api/stock-control/requests
	 */
	createStockControl: async (
		payload: CreateStockControlPayload,
		context: ApiContext
	): Promise<CreateStockControlResponse> => {
		const response = await fetch(`${BASE_URL}/api/stock-control/requests`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify({ items: [payload] })
		});
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Submit a stock control request for approval
	 * POST /api/stock-control/requests/{requestId}/submit
	 */
	submitStockControl: async (
		requestId: string,
		context: ApiContext
	): Promise<SubmitStockControlResponse> => {
		const response = await fetch(`${BASE_URL}/api/stock-control/requests/${requestId}/submit`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			}
		});
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Deactivate an approved stock control request
	 * PATCH /api/stock-control/requests/{requestId}/deactivate
	 */
	deactivateStockControl: async (
		requestId: string,
		reason: string,
		context: ApiContext
	): Promise<{ $schema?: string; message: string; request_id: string }> => {
		const response = await fetch(`${BASE_URL}/api/stock-control/requests/${requestId}/deactivate`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify({ reason })
		});
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Refresh usage data for stock control
	 * POST /api/stock-control/usage/refresh
	 */
	refreshUsage: async (context: ApiContext): Promise<{ message?: string }> => {
		const response = await fetch(`${BASE_URL}/api/stock-control/usage/refresh`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	},

	/**
	 * Get summary/stats
	 * GET /api/stock-control/requests/summary
	 */
	getStockControlSummary: async (context: ApiContext): Promise<StockControlSummary> => {
		const response = await fetch(`${BASE_URL}/api/stock-control/requests/summary`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});
		if (!response.ok) throw new Error(await parseErrorMessage(response));
		return response.json();
	}
};
