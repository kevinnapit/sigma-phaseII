// Query keys for Stock Adjustment (Penyesuaian Stok)

import type { StockAdjustmentListParams } from '../types/stock-adjustment.types';

export const stockAdjustmentKeys = {
	all: ['stock-adjustments'] as const,
	lists: () => [...stockAdjustmentKeys.all, 'list'] as const,
	list: (params: StockAdjustmentListParams) =>
		[...stockAdjustmentKeys.lists(), params] as const,
	details: () => [...stockAdjustmentKeys.all, 'detail'] as const,
	detail: (id: string) => [...stockAdjustmentKeys.details(), id] as const
};
