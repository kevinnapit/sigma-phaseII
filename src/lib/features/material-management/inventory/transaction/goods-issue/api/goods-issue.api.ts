import { env } from '$env/dynamic/public';
import type {
	GoodsIssueListParams,
	GoodsIssueListResponse,
	GoodsIssueDetailResponse,
	GoodsIssueSummaryResponse
} from '../types/goods-issue.types';
import { goodsIssueMockApi } from './goods-issue.mock';

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

export const goodsIssueApi = {
	/**
	 * Get Goods Issue summary statistics
	 */
	getGoodsIssueSummary: async (context: ApiContext): Promise<GoodsIssueSummaryResponse> => {
		if (USE_MOCK) {
			return goodsIssueMockApi.getGoodsIssueSummary();
		}

		const response = await fetch(`${BASE_URL}/api/goods-issue/summary`, {
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
	 * Get all Goods Issues with pagination and search
	 */
	getAllGoodsIssues: async (
		params: GoodsIssueListParams,
		context: ApiContext
	): Promise<GoodsIssueListResponse> => {
		if (USE_MOCK) {
			return goodsIssueMockApi.getAllGoodsIssues(params);
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

		if (params.division_id) {
			searchParams.append('division_id', params.division_id);
		}

		if (params.vendor_id) {
			searchParams.append('vendor_id', params.vendor_id);
		}

		if (params.date_from) {
			searchParams.append('date_from', params.date_from);
		}

		if (params.date_to) {
			searchParams.append('date_to', params.date_to);
		}

		const response = await fetch(`${BASE_URL}/api/goods-issue?${searchParams}`, {
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
	 * Get Goods Issue detail by ID
	 */
	getGoodsIssueDetail: async (
		id: string,
		context: ApiContext
	): Promise<GoodsIssueDetailResponse> => {
		if (USE_MOCK) {
			return goodsIssueMockApi.getGoodsIssueDetail(id);
		}

		const response = await fetch(`${BASE_URL}/api/goods-issue/${id}`, {
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
