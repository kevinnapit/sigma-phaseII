// Query keys for Physical Stocktake Entry (Entri Stok Opname Fisik)

import type { PhysicalStocktakeListParams } from '../types/physical-stocktake.types';

export const physicalStocktakeKeys = {
	all: ['physical-stocktakes'] as const,
	lists: () => [...physicalStocktakeKeys.all, 'list'] as const,
	list: (params: PhysicalStocktakeListParams) =>
		[...physicalStocktakeKeys.lists(), params] as const,
	details: () => [...physicalStocktakeKeys.all, 'detail'] as const,
	detail: (id: string) => [...physicalStocktakeKeys.details(), id] as const
};
