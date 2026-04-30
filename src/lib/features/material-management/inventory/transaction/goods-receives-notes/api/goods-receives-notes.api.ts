import { env } from '$env/dynamic/public';
import type {
	GRNListParams,
	GRNListResponse,
	GRNDetailResponse,
	ApprovedLPOListParams,
	ApprovedLPOListResponse,
	ApprovedLPODetailResponse,
	GRNCreatePayload,
	GRNCreateResponse,
	GRNApprovalResponse,
	GRNSummaryResponse,
	MaterialCheckResponse,
	DocketListResponse,
	LPOByQRParams,
	LPOByQRResponse,
	LPOItemByQRParams,
	LPOItemByQRResponse,
	ItemStorageLayoutResponse
} from '../types/goods-receives-notes.types';
import { goodsReceivesNotesMockApi } from './goods-receives-notes.mock';

interface ApiContext {
	token: string;
	estateId: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

/**
 * Flag untuk menggunakan mock data
 * Set ke true untuk development/testing
 */
const USE_MOCK = true;

export const goodsReceivesNotesApi = {
	/**
	 * Get GRN summary statistics
	 */
	getGRNSummary: async (context: ApiContext): Promise<GRNSummaryResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.getGRNSummary();
		}

		const response = await fetch(`${BASE_URL}/api/grn/summary`, {
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
	 * Get all GRNs with pagination and search
	 */
	getAllGRNs: async (params: GRNListParams, context: ApiContext): Promise<GRNListResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.getAllGRNs(params);
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

		const response = await fetch(`${BASE_URL}/api/grn/lpo?${searchParams}`, {
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
	 * Get GRN detail by ID
	 */
	getGRNDetail: async (grnId: string, context: ApiContext): Promise<GRNDetailResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.getGRNDetail(grnId);
		}

		const response = await fetch(`${BASE_URL}/api/grn/${grnId}`, {
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
	 * Get approved LPOs available for GRN creation
	 */
	getApprovedLPOs: async (
		params: ApprovedLPOListParams,
		context: ApiContext
	): Promise<ApprovedLPOListResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.getApprovedLPOs(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		const response = await fetch(`${BASE_URL}/api/grn/approved-lpo?${searchParams}`, {
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
	 * Get approved LPO detail by ID (for GRN creation)
	 */
	getApprovedLPODetail: async (
		lpoId: string,
		context: ApiContext
	): Promise<ApprovedLPODetailResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.getApprovedLPODetail(lpoId);
		}

		const response = await fetch(`${BASE_URL}/api/grn/approved-lpo/${lpoId}`, {
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
	 * Create a new GRN
	 */
	createGRN: async (payload: GRNCreatePayload, context: ApiContext): Promise<GRNCreateResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.createGRN(payload);
		}

		const response = await fetch(`${BASE_URL}/api/grn`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Submit a GRN for approval (DRAFT → PENDING_APPROVAL)
	 */
	submitGRN: async (grnId: string, context: ApiContext): Promise<void> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.submitGRN(grnId);
		}

		const response = await fetch(`${BASE_URL}/api/grn/${grnId}/submit`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
	},

	/**
	 * Approve a GRN
	 */
	approveGRN: async (
		approvalId: string,
		remarks: string,
		context: ApiContext
	): Promise<GRNApprovalResponse> => {
		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/approve`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify({ remarks })
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Reject a GRN
	 */
	rejectGRN: async (
		approvalId: string,
		remarks: string,
		context: ApiContext
	): Promise<GRNApprovalResponse> => {
		const response = await fetch(`${BASE_URL}/api/approvals/${approvalId}/reject`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			},
			body: JSON.stringify({ remarks })
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get GRN approval history
	 */
	getGRNApprovalHistory: async (
		approvalId: string,
		context: ApiContext
	): Promise<GRNApprovalResponse> => {
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
	 * Check material by code — returns is_dropping_material, requires_volume, etc.
	 */
	checkMaterial: async (
		materialCode: string,
		context: ApiContext
	): Promise<MaterialCheckResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.checkMaterial(materialCode);
		}

		const response = await fetch(`${BASE_URL}/api/materials/${materialCode}/check`, {
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
	 * Get LPO item detail by QR code scan
	 * QR format: item_code only (lpo_number taken from current context)
	 */
	getLPOItemByQR: async (
		params: LPOItemByQRParams,
		context: ApiContext
	): Promise<LPOItemByQRResponse> => {
		const searchParams = new URLSearchParams({
			lpo_number: params.lpo_number,
			item_code: params.item_code
		});

		const response = await fetch(`${BASE_URL}/api/lpo/item/by-qr?${searchParams}`, {
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
	 * Get LPO detail by QR code content
	 * QR format: "{lpo_number}-{supplier_code}-{supplier_name}"
	 */
	getLPOByQR: async (params: LPOByQRParams, context: ApiContext): Promise<LPOByQRResponse> => {
		const searchParams = new URLSearchParams({
			lpo_number: params.lpo_number,
			supplier_code: params.supplier_code,
			supplier_name: params.supplier_name
		});

		const response = await fetch(`${BASE_URL}/api/lpo/by-qr?${searchParams}`, {
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
	 * Get item storage layouts (for item_storage_dtl_id selection)
	 */
	getItemStorageLayouts: async (
		search: string | undefined,
		context: ApiContext
	): Promise<ItemStorageLayoutResponse> => {
		const searchParams = new URLSearchParams();
		if (search) searchParams.set('search', search);

		const response = await fetch(
			`${BASE_URL}/api/item-storage-layouts${searchParams.toString() ? `?${searchParams}` : ''}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get available dockets (weighments) for dropping material
	 */
	getAvailableDockets: async (context: ApiContext): Promise<DocketListResponse> => {
		if (USE_MOCK) {
			return goodsReceivesNotesMockApi.getAvailableDockets();
		}

		const response = await fetch(`${BASE_URL}/api/weighments/available`, {
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
