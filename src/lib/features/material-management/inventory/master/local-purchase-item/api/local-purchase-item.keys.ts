import type { LocalPurchaseItemListParams } from '../types/local-purchase-item.types';

/**
 * Query keys for Local Purchase Items
 * Provides consistent key generation for React Query caching
 */
export const localPurchaseItemKeys = {
	// Base key for all local purchase item-related queries
	all: ['material-management', 'local-purchase-items'] as const,

	// Local purchase item list queries with parameters
	list: (params: LocalPurchaseItemListParams) =>
		[...localPurchaseItemKeys.all, 'list', params] as const,

	// Local purchase item detail queries
	detail: (uoid: string) => [...localPurchaseItemKeys.all, 'detail', uoid] as const,

	// Local purchase item statistics queries
	stats: () => [...localPurchaseItemKeys.all, 'stats'] as const
};
