import { env } from '$env/dynamic/public';
import type {
	StoreListResponse,
	StoreDetailResponse,
	StoreStatsResponse,
	CreateStoreRequest,
	UpdateStoreRequest,
	StoreListParams
} from '../types/store.types';

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

/**
 * Store API
 */
export const storeApi = {
	/**
	 * Get stores list
	 */
	getStores: async (params: StoreListParams, context: ApiContext): Promise<StoreListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) searchParams.append('search', params.search);
		if (params.administrative_unit_id)
			searchParams.append('administrative_unit_id', params.administrative_unit_id);
		if (params.parent_store_id) searchParams.append('parent_store_id', params.parent_store_id);
		if (params.store_type) searchParams.append('store_type', params.store_type);
		if (params.is_active !== undefined) searchParams.append('is_active', String(params.is_active));
		if (params.is_root !== undefined) searchParams.append('is_root', String(params.is_root));
		if (params.has_children !== undefined)
			searchParams.append('has_children', String(params.has_children));
		if (params.order_by) searchParams.append('order_by', params.order_by);
		if (params.sort) searchParams.append('sort', params.sort);

		const response = await fetch(`${baseUrl}/api/stores?${searchParams}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get store by ID
	 */
	getStoreById: async (uoid: string, context: ApiContext): Promise<StoreDetailResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/stores/${uoid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get store statistics summary
	 */
	getStatsStore: async (context: ApiContext): Promise<StoreStatsResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/stores/summary`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Create new store
	 */
	createStore: async (
		data: CreateStoreRequest,
		context: ApiContext
	): Promise<StoreDetailResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/stores`, {
			method: 'POST',
			headers: {
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
	},

	/**
	 * Update existing store
	 */
	updateStore: async (
		uoid: string,
		data: UpdateStoreRequest,
		context: ApiContext
	): Promise<StoreDetailResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/stores/${uoid}`, {
			method: 'PATCH',
			headers: {
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
	},

	/**
	 * Delete store
	 */
	deleteStore: async (uoid: string, i_version: number, context: ApiContext): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/stores/${uoid}?i_version=${i_version}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId,
				'X-Context-ID': context.contextId
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	}
};
