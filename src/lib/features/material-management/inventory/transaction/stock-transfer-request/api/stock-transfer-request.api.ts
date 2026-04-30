// API functions for Stock Transfer Request

import type {
	StockTransferRequestListParams,
	StockTransferRequestListResponse,
	StockTransferRequestDetailResponse,
	StockTransferRequestStats
} from '../types/stock-transfer-request.types';
import {
	getMockStockTransferRequests,
	getMockStockTransferRequestDetail,
	getMockStockTransferRequestStats
} from './stock-transfer-request.mock';

// Toggle between mock and real API
const USE_MOCK = true;

export const stockTransferRequestApi = {
	/**
	 * Get all stock transfer requests with pagination
	 */
	getStockTransferRequests: async (
		params: StockTransferRequestListParams
	): Promise<StockTransferRequestListResponse> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));
			return getMockStockTransferRequests(params.page, params.size, params.search, params.status);
		}

		// Real API implementation here
		throw new Error('Real API not implemented yet');
	},

	/**
	 * Get stock transfer request detail by ID
	 */
	getStockTransferRequestDetail: async (
		id: string
	): Promise<StockTransferRequestDetailResponse> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));
			return getMockStockTransferRequestDetail(id);
		}

		// Real API implementation here
		throw new Error('Real API not implemented yet');
	},

	/**
	 * Get stock transfer request statistics
	 */
	getStockTransferRequestStats: async (): Promise<StockTransferRequestStats> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));
			return getMockStockTransferRequestStats();
		}

		// Real API implementation here
		throw new Error('Real API not implemented yet');
	}
};
