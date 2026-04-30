import type {
	GoodsIssuesListParams,
	GoodsIssuesListResponse,
	GoodsIssueDetailResponse
} from '../types/goods-issues.types';

interface ApiContext {
	token: string;
	estateId: string;
}

const BASE_URL = 'https://sid.socfindo.co.id';

export const goodsIssuesApi = {
	/**
	 * Get all goods issues with pagination
	 * GET /api/item-issues
	 */
	getAll: async (
		params: GoodsIssuesListParams,
		context: ApiContext
	): Promise<GoodsIssuesListResponse> => {
		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) {
			searchParams.append('search', params.search);
		}

		const response = await fetch(`${BASE_URL}/api/item-issues?${searchParams}`, {
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
	 * Get goods issue detail by ID
	 * GET /api/item-issues/{issueId}
	 */
	getById: async (id: string, context: ApiContext): Promise<GoodsIssueDetailResponse> => {
		const response = await fetch(`${BASE_URL}/api/item-issues/${id}`, {
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
