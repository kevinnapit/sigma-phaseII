// Query keys for GRN Without PO

import type { GRNWithoutPOListParams } from '../types/grn-without-po.types';

export const grnWithoutPOKeys = {
	all: ['material-management', 'grn-without-po'] as const,
	lists: () => [...grnWithoutPOKeys.all, 'list'] as const,
	list: (params: GRNWithoutPOListParams) => [...grnWithoutPOKeys.lists(), params] as const,
	details: () => [...grnWithoutPOKeys.all, 'detail'] as const,
	detail: (id: string) => [...grnWithoutPOKeys.details(), id] as const,
	stats: () => [...grnWithoutPOKeys.all, 'stats'] as const
};
