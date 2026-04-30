import { env } from '$env/dynamic/public';
import type {
	ItemStorageLayoutListResponse,
	ItemStorageLayoutDetailResponse,
	ItemStorageLayoutListParams,
	ItemStorageLayoutStatsResponse,
	ItemStorageLayoutCreateRequest,
	ItemStorageLayoutUpdateRequest,
	ItemStorageLayoutCreateResponse,
	ItemStorageLayoutUpdateResponse,
	ItemStorageLayoutDeleteResponse
} from '../types/item-storage-layout.types';
import { itemStorageLayoutMockApi } from './item-storage-layout.mock';

interface ApiContext {
	token: string;
	estateId: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://api.example.com';
const USE_MOCK = true;

export const itemStorageLayoutApi = {
	getItemStorageLayouts: async (
		params: ItemStorageLayoutListParams,
		context: ApiContext
	): Promise<ItemStorageLayoutListResponse> => {
		if (USE_MOCK) {
			return itemStorageLayoutMockApi.getItemStorageLayouts(params);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) searchParams.append('search', params.search);
		if (params.store_id) searchParams.append('store_id', params.store_id);
		if (params.is_active !== undefined)
			searchParams.append('is_active', params.is_active.toString());
		if (params.order_by) searchParams.append('order_by', params.order_by);
		if (params.sort) searchParams.append('sort', params.sort);

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/item-storage-layouts?${searchParams}`,
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

	getItemStorageLayoutDetail: async (
		uoid: string,
		context: ApiContext
	): Promise<ItemStorageLayoutDetailResponse> => {
		if (USE_MOCK) {
			return itemStorageLayoutMockApi.getItemStorageLayoutDetail(uoid);
		}

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/item-storage-layouts/${uoid}`,
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

	createItemStorageLayout: async (
		payload: ItemStorageLayoutCreateRequest,
		context: ApiContext
	): Promise<ItemStorageLayoutCreateResponse> => {
		if (USE_MOCK) {
			return itemStorageLayoutMockApi.createItemStorageLayout(payload);
		}

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/item-storage-layouts`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId
				},
				body: JSON.stringify(payload)
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	updateItemStorageLayout: async (
		uoid: string,
		payload: ItemStorageLayoutUpdateRequest,
		context: ApiContext
	): Promise<ItemStorageLayoutUpdateResponse> => {
		if (USE_MOCK) {
			return itemStorageLayoutMockApi.updateItemStorageLayout(uoid, payload);
		}

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/item-storage-layouts/${uoid}`,
			{
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId
				},
				body: JSON.stringify(payload)
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	deleteItemStorageLayout: async (
		uoid: string,
		context: ApiContext
	): Promise<ItemStorageLayoutDeleteResponse> => {
		if (USE_MOCK) {
			return itemStorageLayoutMockApi.deleteItemStorageLayout(uoid);
		}

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/item-storage-layouts/${uoid}`,
			{
				method: 'DELETE',
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

	getItemStorageLayoutStats: async (
		context: ApiContext
	): Promise<ItemStorageLayoutStatsResponse> => {
		if (USE_MOCK) {
			return itemStorageLayoutMockApi.getItemStorageLayoutStats();
		}

		const response = await fetch(
			`${BASE_URL}/api/material-management/inventory/master/item-storage-layouts/stats`,
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
