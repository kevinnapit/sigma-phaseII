/**
 * Query keys untuk Item Code Request
 */

import type { ItemCodeRequestListParams } from '../types/item-code-request.types';

export const itemCodeRequestKeys = {
	all: ['item-code-requests'] as const,
	lists: () => [...itemCodeRequestKeys.all, 'list'] as const,
	list: (params: ItemCodeRequestListParams) =>
		[...itemCodeRequestKeys.lists(), params] as const,
	details: () => [...itemCodeRequestKeys.all, 'detail'] as const,
	detail: (id: string) => [...itemCodeRequestKeys.details(), id] as const,
	summary: () => [...itemCodeRequestKeys.all, 'summary'] as const
};
