import { env } from '$env/dynamic/public';
import type { VendorStatsResponse } from '../types/vendor-stats.types';

interface ApiContext {
	token: string;
	estateId: string;
	contextId: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

/**
 * Vendor Stats API (shared between local and central)
 */
export const vendorStatsApi = {
	/**
	 * Get vendor statistics (both local and central)
	 */
	getVendorStats: async (context: ApiContext): Promise<VendorStatsResponse> => {
		const response = await fetch(`${BASE_URL}/api/parties/summary`, {
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
