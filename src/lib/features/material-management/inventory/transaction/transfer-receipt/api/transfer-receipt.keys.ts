// Query keys for Transfer Receipt

import type { TransferReceiptListParams } from '../types/transfer-receipt.types';

export const transferReceiptKeys = {
	all: ['material-management', 'transfer-receipts'] as const,
	lists: () => [...transferReceiptKeys.all, 'list'] as const,
	list: (params: TransferReceiptListParams) => [...transferReceiptKeys.lists(), params] as const,
	details: () => [...transferReceiptKeys.all, 'detail'] as const,
	detail: (id: string) => [...transferReceiptKeys.details(), id] as const,
	stats: () => [...transferReceiptKeys.all, 'stats'] as const
};