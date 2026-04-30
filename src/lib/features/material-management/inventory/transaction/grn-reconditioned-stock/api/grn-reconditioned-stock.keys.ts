// Query keys for GRN Re-Conditioned Stock

import type { GRNReconditionedStockListParams } from '../types/grn-reconditioned-stock.types';

export const grnReconditionedStockKeys = {
	all: ['material-management', 'grn-reconditioned-stock'] as const,
	lists: () => [...grnReconditionedStockKeys.all, 'list'] as const,
	list: (params: GRNReconditionedStockListParams) =>
		[...grnReconditionedStockKeys.lists(), params] as const,
	details: () => [...grnReconditionedStockKeys.all, 'detail'] as const,
	detail: (id: string) => [...grnReconditionedStockKeys.details(), id] as const,
	stats: () => [...grnReconditionedStockKeys.all, 'stats'] as const
};
