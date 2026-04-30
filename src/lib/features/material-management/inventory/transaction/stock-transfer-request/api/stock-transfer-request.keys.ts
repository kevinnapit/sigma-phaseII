// Query keys for Stock Transfer Request

import type { StockTransferRequestListParams } from '../types/stock-transfer-request.types';

export const stockTransferRequestKeys = {
	all: ['stock-transfer-requests'] as const,
	lists: () => [...stockTransferRequestKeys.all, 'list'] as const,
	list: (params: StockTransferRequestListParams) =>
		[...stockTransferRequestKeys.lists(), params] as const,
	details: () => [...stockTransferRequestKeys.all, 'detail'] as const,
	detail: (id: string) => [...stockTransferRequestKeys.details(), id] as const,
	stats: () => [...stockTransferRequestKeys.all, 'stats'] as const
};
