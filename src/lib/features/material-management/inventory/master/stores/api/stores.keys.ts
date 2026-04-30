import type { StoreListParams } from '../types/store.types';

/**
 * query keys for Material Management Stores
 * Provides consistent key generation for React Query caching
 */
export const storesKeys = {
	// Base key for all store-related queries
	all: ['material-management', 'stores'] as const,

	// Store list queries with parameters
	list: (params: StoreListParams) => [...storesKeys.all, 'list', params] as const,

	// Store detail queries
	detail: (uoid: string) => [...storesKeys.all, 'detail', uoid] as const,

	// Store statistics queries
	stats: () => [...storesKeys.all, 'stats'] as const,

	// Filtered lists by parent store
	byParent: (parentStoreId: string) => [...storesKeys.all, 'by-parent', parentStoreId] as const,

	// Filtered lists by business location
	byLocation: (businessLocationId: string) =>
		[...storesKeys.all, 'by-location', businessLocationId] as const
};
