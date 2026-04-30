// Query keys for Inter Estate Transfer

import type { InterEstateTransferListParams } from '../types/inter-estate-transfer.types';

export const interEstateTransferKeys = {
	all: ['inter-estate-transfer'] as const,
	lists: () => [...interEstateTransferKeys.all, 'list'] as const,
	list: (params: InterEstateTransferListParams) =>
		[...interEstateTransferKeys.lists(), params] as const,
	details: () => [...interEstateTransferKeys.all, 'detail'] as const,
	detail: (id: string) => [...interEstateTransferKeys.details(), id] as const
};
