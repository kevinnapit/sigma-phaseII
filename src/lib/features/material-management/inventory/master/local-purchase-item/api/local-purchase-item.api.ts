import { env } from '$env/dynamic/public';
import type {
	LocalPurchaseItemListResponse,
	LocalPurchaseItemDetailResponse,
	LocalPurchaseItemListParams,
	LocalPurchaseItemStatsResponse
} from '../types/local-purchase-item.types';
import { localPurchaseItemMockApi } from './local-purchase-item.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://api.example.com';
const USE_MOCK = true; // Always use mock for this module

export const localPurchaseItemApi = {
	/**
	 * Get all local purchase items with pagination
	 */
	getLocalPurchaseItems: async (
		params: LocalPurchaseItemListParams,
		context: ApiContext
	): Promise<LocalPurchaseItemListResponse> => {
		// Use mock data
		if (USE_MOCK) {
			return localPurchaseItemMockApi.getLocalPurchaseItems(params);
		}

		// Real API implementation (for future use)
		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		if (params.is_field_item !== undefined) {
			searchParams.append('is_field_item', params.is_field_item.toString());
		}

		if (params.decision) {
			searchParams.append('decision', params.decision);
		}

		if (params.order_by) {
			searchParams.append('order_by', params.order_by);
		}

		if (params.sort) {
			searchParams.append('sort', params.sort);
		}

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/local-purchase-items?${searchParams}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
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
	 * Get local purchase item detail by ID
	 */
	getLocalPurchaseItemDetail: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalPurchaseItemDetailResponse> => {
		// Use mock data
		if (USE_MOCK) {
			return localPurchaseItemMockApi.getLocalPurchaseItemDetail(uoid);
		}

		// Real API implementation (for future use)
		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/local-purchase-items/${uoid}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
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
	 * Get local purchase item statistics
	 */
	getLocalPurchaseItemStats: async (context: ApiContext): Promise<LocalPurchaseItemStatsResponse> => {
		// Use mock data
		if (USE_MOCK) {
			return localPurchaseItemMockApi.getLocalPurchaseItemStats();
		}

		// Real API implementation (for future use)
		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/local-purchase-items/stats`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}
};
