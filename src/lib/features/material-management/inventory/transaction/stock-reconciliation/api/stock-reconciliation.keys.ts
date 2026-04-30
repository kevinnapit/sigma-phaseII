// Query keys for Stock Reconciliation (Rekonsiliasi Stok)

import type { StockReconciliationListParams } from '../types/stock-reconciliation.types';

export const stockReconciliationKeys = {
	all: ['stock-reconciliations'] as const,
	lists: () => [...stockReconciliationKeys.all, 'list'] as const,
	list: (params: StockReconciliationListParams) =>
		[...stockReconciliationKeys.lists(), params] as const,
	details: () => [...stockReconciliationKeys.all, 'detail'] as const,
	detail: (id: string) => [...stockReconciliationKeys.details(), id] as const
};
