import { env } from '$env/dynamic/public';
import type {
	CentralVendorListResponse,
	CentralVendorDetailResponse,
	CentralVendorListParams,
	CentralVendorPublishResponse
} from '../types/vendor-central.types';

interface ApiContext {
	token: string;
	estateId?: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';
const CONTEXT_ID = 'C8382058-5AD3-415C-8B23-1930396C4AC4';

/**
 * Central Vendor API - HO (Head Office) Vendors
 */
export const centralVendorApi = {
	/**
	 * Get central vendors list from HO
	 */
	getCentralVendors: async (
		params: CentralVendorListParams,
		context: ApiContext
	): Promise<CentralVendorListResponse> => {
		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			limit: params.limit.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		const response = await fetch(`${BASE_URL}/api/vendors/ho?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get central vendor by SAP vendor code
	 */
	getCentralVendorById: async (
		sapVendorCode: string,
		context: ApiContext
	): Promise<CentralVendorDetailResponse> => {
		const response = await fetch(`${BASE_URL}/api/vendors/ho/${sapVendorCode}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId ?? ''
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Publish (register) a central vendor as a local vendor
	 */
	publishCentralVendor: async (
		sapVendorCode: string,
		context: ApiContext
	): Promise<CentralVendorPublishResponse> => {
		const response = await fetch(`${BASE_URL}/api/vendors/ho/${sapVendorCode}/publish`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'Content-Type': 'application/json',
				'X-Context-ID': CONTEXT_ID,
				'X-Estate-Selection': context.estateId ?? ''
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}
};
