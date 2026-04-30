import { env } from '$env/dynamic/public';
import type {
	ItemListResponse,
	ItemDetailResponse,
	ItemListParams,
	ItemStats,
	ItemStatsResponse,
	ItemComprehensiveListResponse,
	ItemComprehensiveData,
	ItemVRLDetailData,
	ItemManufactureListResponse
} from '../types/item.types';
import { itemMockApi } from './item.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';
const USE_MOCK = true; // Set to false to use real API

/**
 * Parse error message from API response body
 */
async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const body = await response.json();
		return body?.errors?.[0]?.message ?? body?.detail ?? body?.message ?? response.statusText;
	} catch {
		return response.statusText;
	}
}

/**
 * Item API
 */
export const itemApi = {
	/**
	 * Get items list with comprehensive data
	 */
	getItems: async (
		params: ItemListParams,
		context: ApiContext
	): Promise<ItemComprehensiveListResponse> => {
		console.log('🎯 itemApi.getItems called, USE_MOCK:', USE_MOCK);
		
		if (USE_MOCK) {
			console.log('✅ Using MOCK API');
			return itemMockApi.getAllItems(params);
		}

		console.log('🌐 Using REAL API');
		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) searchParams.append('search', params.search);
		if (params.item_class_id) searchParams.append('item_class_id', params.item_class_id);
		if (params.has_expiry !== undefined)
			searchParams.append('has_expiry', String(params.has_expiry));
		if (params.is_active !== undefined) searchParams.append('is_active', String(params.is_active));
		if (params.is_critical !== undefined)
			searchParams.append('is_critical', String(params.is_critical));
		if (params.has_conversion !== undefined)
			searchParams.append('has_conversion', String(params.has_conversion));
		if (params.movement_status) searchParams.append('movement_status', params.movement_status);
		if (params.is_non_stock !== undefined)
			searchParams.append('is_non_stock', String(params.is_non_stock));
		if (params.order_by) searchParams.append('order_by', params.order_by);
		if (params.sort) searchParams.append('sort', params.sort);

		const response = await fetch(`${BASE_URL}/api/items?${searchParams}`, {
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
	 * Get item by ID
	 */
	getItemById: async (uoid: string, context: ApiContext): Promise<ItemDetailResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${uoid}`, {
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
	 * Get item statistics
	 */
	getItemStats: async (context: ApiContext): Promise<ItemStatsResponse> => {
		if (USE_MOCK) {
			return itemMockApi.getItemStats();
		}

		const response = await fetch(`${BASE_URL}/api/items/summary`, {
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
	 * Get item detail by ID (comprehensive data)
	 */
	getItemDetail: async (
		uoid: string,
		context: ApiContext
	): Promise<{ $schema?: string; data: ItemComprehensiveData }> => {
		const response = await fetch(`${BASE_URL}/api/items/${uoid}`, {
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

		const data = await response.json();
		return { data };
	},

	/**
	 * Get item VRL (Valuation, Rate, Limit) information
	 */
	getItemVRL: async (
		uoid: string,
		context: ApiContext
	): Promise<{ $schema?: string; data: ItemVRLDetailData }> => {
		const response = await fetch(`${BASE_URL}/api/items/${uoid}/item-vrl`, {
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
	 * Get item manufactures
	 */
	getItemManufactures: async (
		uoid: string,
		context: ApiContext
	): Promise<ItemManufactureListResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${uoid}/item-manufacture`, {
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
	 * Create item manufacture
	 */
	createItemManufacture: async (
		itemId: string,
		data: { name: string; reference_code: string },
		context: ApiContext
	): Promise<{ $schema?: string; data: any }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/item-manufacture`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId || '' || '',
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update item manufacture
	 */
	updateItemManufacture: async (
		itemId: string,
		manufactureId: string,
		data: { name: string; reference_code: string; i_version: number },
		context: ApiContext
	): Promise<{ $schema?: string; data: any }> => {
		const response = await fetch(
			`${BASE_URL}/api/items/${itemId}/item-manufacture/${manufactureId}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json, application/problem+json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId,
					'X-Context-ID': context.contextId || ''
				},
				body: JSON.stringify(data)
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete item manufacture
	 */
	deleteItemManufacture: async (
		itemId: string,
		manufactureId: string,
		context: ApiContext
	): Promise<{ $schema?: string; data: { message: string } }> => {
		const response = await fetch(
			`${BASE_URL}/api/items/${itemId}/item-manufacture/${manufactureId}`,
			{
				method: 'DELETE',
				headers: {
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId,
					'X-Context-ID': context.contextId || ''
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Get item UOM links
	 */
	getItemUOMLinks: async (
		itemId: string,
		context: ApiContext
	): Promise<import('../types/item.types').ItemUOMLinkListResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/uom-links`, {
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
	 * Create item UOM link
	 */
	createItemUOMLink: async (
		itemId: string,
		data: import('../types/item.types').ItemUOMLinkCreateRequest,
		context: ApiContext
	): Promise<import('../types/item.types').ItemUOMLinkCreateResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/uom-links`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update item UOM link
	 */
	updateItemUOMLink: async (
		itemId: string,
		linkId: string,
		data: {
			fk_master_value_stores_movement_type_id: string;
			fk_uom_hdrid: string;
			i_version: number;
		},
		context: ApiContext
	): Promise<import('../types/item.types').ItemUOMLinkCreateResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/uom-links/${linkId}`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete item UOM link
	 */
	deleteItemUOMLink: async (
		itemId: string,
		linkId: string,
		context: ApiContext
	): Promise<{ $schema?: string; data: { message: string } }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/uom-links/${linkId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Get item substitutes
	 */
	getItemSubstitutes: async (
		itemId: string,
		context: ApiContext
	): Promise<import('../types/item.types').ItemSubstituteListResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/substitutes`, {
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
	 * Get item usages
	 */
	getItemUsages: async (
		itemId: string,
		search: string | undefined,
		context: ApiContext
	): Promise<import('../types/item.types').ItemUsageListResponse> => {
		const searchParams = new URLSearchParams();
		if (search) {
			searchParams.append('search', search);
		}

		const url = `${BASE_URL}/api/items/${itemId}/usages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

		const response = await fetch(url, {
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
	 * Create item usage
	 */
	createItemUsage: async (
		itemId: string,
		data: import('../types/item.types').ItemUsageCreateRequest,
		context: ApiContext
	): Promise<import('../types/item.types').ItemUsageCreateResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/usages`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete item usage
	 */
	deleteItemUsage: async (
		itemId: string,
		usageId: string,
		context: ApiContext
	): Promise<{ $schema?: string; data: { message: string } }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/usages/${usageId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Get item stock records (stores)
	 */
	getItemStockRecords: async (
		itemId: string,
		context: ApiContext
	): Promise<import('../types/item.types').ItemStoreListResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/stores`, {
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
	 * Create item stock record
	 */
	createItemStockRecord: async (
		itemId: string,
		data: import('../types/item.types').ItemStoreCreateRequest,
		context: ApiContext
	): Promise<{ $schema?: string; data: any }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/stores`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update item stock record
	 */
	updateItemStockRecord: async (
		itemId: string,
		stockId: string,
		data: import('../types/item.types').ItemStoreUpdateRequest,
		context: ApiContext
	): Promise<{ $schema?: string; data: any }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/stores/${stockId}`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete item stock record
	 */
	deleteItemStockRecord: async (
		itemId: string,
		stockId: string,
		context: ApiContext
	): Promise<{ $schema?: string; message: string }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/stores/${stockId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Create item VRL
	 */
	createItemVRL: async (
		itemId: string,
		data: import('../types/item.types').ItemVRLCreateRequest,
		context: ApiContext
	): Promise<import('../types/item.types').ItemVRLResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/item-vrl`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update item VRL
	 */
	updateItemVRL: async (
		itemId: string,
		data: import('../types/item.types').ItemVRLUpdateRequest,
		context: ApiContext
	): Promise<import('../types/item.types').ItemVRLResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/item-vrl`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete item VRL
	 */
	deleteItemVRL: async (
		itemId: string,
		i_version: number,
		context: ApiContext
	): Promise<{ $schema?: string; message: string }> => {
		const response = await fetch(
			`${BASE_URL}/api/items/${itemId}/item-vrl?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId,
					'X-Context-ID': context.contextId || ''
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Get item conversions
	 */
	getItemConversions: async (
		itemId: string,
		context: ApiContext
	): Promise<import('../types/item.types').ItemConversionListResponse> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/item-conversion`, {
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
	 * Create item conversion
	 */
	createItemConversion: async (
		itemId: string,
		data: import('../types/item.types').ItemConversionCreateRequest,
		context: ApiContext
	): Promise<{ $schema?: string; data: any }> => {
		const response = await fetch(`${BASE_URL}/api/items/${itemId}/item-conversion`, {
			method: 'POST',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId || ''
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update item conversion
	 */
	updateItemConversion: async (
		itemId: string,
		conversionId: string,
		data: import('../types/item.types').ItemConversionUpdateRequest,
		context: ApiContext
	): Promise<{ $schema?: string; data: any }> => {
		const response = await fetch(
			`${BASE_URL}/api/items/${itemId}/item-conversion/${conversionId}`,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json, application/problem+json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId,
					'X-Context-ID': context.contextId || ''
				},
				body: JSON.stringify(data)
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete item conversion
	 */
	deleteItemConversion: async (
		itemId: string,
		conversionId: string,
		context: ApiContext
	): Promise<import('../types/item.types').ItemConversionDeleteResponse> => {
		const response = await fetch(
			`${BASE_URL}/api/items/${itemId}/item-conversion/${conversionId}`,
			{
				method: 'DELETE',
				headers: {
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Estate-Selection': context.estateId,
					'X-Context-ID': context.contextId || ''
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	}
};
