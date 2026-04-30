import type { StockControlListParams } from '../types/item-stock-control.types';

export const itemStockControlKeys = {
	all: ['material-management', 'item-stock-control'] as const,

	list: (params: StockControlListParams) => [...itemStockControlKeys.all, 'list', params] as const,

	detail: (requestId: string) => [...itemStockControlKeys.all, 'detail', requestId] as const,

	approvalHistory: (approvalId: string) =>
		[...itemStockControlKeys.all, 'approval-history', approvalId] as const,

	summary: () => [...itemStockControlKeys.all, 'summary'] as const
};
