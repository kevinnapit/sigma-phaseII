import { env } from '$env/dynamic/public';
import type {
	ItemGroupListResponse,
	ItemGroupDetailResponse,
	ItemGroupListParams,
	ItemGroupStatsResponse,
	UpdateItemGroupRequest
} from '../types/item-group.types';

interface ApiContext {
	token: string;
	estateId: string;
	contextId: string;
}

async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const body = await response.json();
		if (body?.errors?.[0]?.message) return body.errors[0].message;
		if (body?.detail) return body.detail;
		if (body?.message) return body.message;
	} catch {
		// ignore parse error
	}
	return response.statusText || `HTTP ${response.status}`;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';
const USE_MOCK = true; // Set to false to use real API

// Mock data
const mockItemGroups = [
	{ uoid: 'ic-1', code: 'FRT', name: 'Fertilizer', short_name: 'Fertilizer' },
	{ uoid: 'ic-2', code: 'ATK', name: 'Office Supplies', short_name: 'ATK' },
	{ uoid: 'ic-3', code: 'CLN', name: 'Cleaning Supplies', short_name: 'Cleaning' },
	{ uoid: 'ic-4', code: 'STA', name: 'Stationery', short_name: 'Stationery' },
	{ uoid: 'ic-5', code: 'OFF', name: 'Office Equipment', short_name: 'Office' },
	{ uoid: 'ic-6', code: 'BEV', name: 'Beverage', short_name: 'Beverage' }
];

/**
 * Item Group (Item Class) API
 */
export const itemGroupApi = {
	/**
	 * Get item groups list
	 */
	getItemGroups: async (
		params: ItemGroupListParams,
		context: ApiContext
	): Promise<ItemGroupListResponse> => {
		if (USE_MOCK) {
			await new Promise((resolve) => setTimeout(resolve, 300));
			return {
				$schema: 'item-group-list-response',
				data: mockItemGroups,
				pagination: {
					page: 1,
					size: 50,
					total_item: mockItemGroups.length,
					total_page: 1
				}
			};
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) searchParams.append('search', params.search);
		if (params.valuation_type_id)
			searchParams.append('valuation_type_id', params.valuation_type_id);
		if (params.parent_id) searchParams.append('parent_id', params.parent_id);
		if (params.has_parent !== undefined)
			searchParams.append('has_parent', String(params.has_parent));
		if (params.is_active !== undefined) searchParams.append('is_active', String(params.is_active));
		if (params.order_by) searchParams.append('order_by', params.order_by);
		if (params.sort) searchParams.append('sort', params.sort);

		const response = await fetch(`${BASE_URL}/api/item-classes?${searchParams}`, {
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
	 * Get item group by ID
	 */
	getItemGroupById: async (uoid: string, context: ApiContext): Promise<ItemGroupDetailResponse> => {
		const response = await fetch(`${BASE_URL}/api/item-classes/${uoid}`, {
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
	 * Get item group statistics
	 */
	getItemGroupStats: async (context: ApiContext): Promise<ItemGroupStatsResponse> => {
		if (USE_MOCK) {
			await new Promise((resolve) => setTimeout(resolve, 300));
			return {
				$schema: 'item-group-stats-response',
				data: {
					total_item_groups: mockItemGroups.length,
					active_item_groups: mockItemGroups.length,
					inactive_item_groups: 0
				}
			};
		}

		const response = await fetch(`${BASE_URL}/api/item-classes/summary`, {
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
	 * Update item group
	 */
	updateItemGroup: async (
		uoid: string,
		data: UpdateItemGroupRequest,
		context: ApiContext
	): Promise<ItemGroupDetailResponse> => {
		const response = await fetch(`${BASE_URL}/api/item-classes/${uoid}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	}
};
