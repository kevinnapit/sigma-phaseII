// Query keys for Purchase Return (Pengembalian Pembelian)

import type { PurchaseReturnListParams } from '../types/purchase-return.types';

export const purchaseReturnKeys = {
	all: ['purchase-returns'] as const,
	lists: () => [...purchaseReturnKeys.all, 'list'] as const,
	list: (params: PurchaseReturnListParams) => [...purchaseReturnKeys.lists(), params] as const,
	details: () => [...purchaseReturnKeys.all, 'detail'] as const,
	detail: (id: string) => [...purchaseReturnKeys.details(), id] as const
};
