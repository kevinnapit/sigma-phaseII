import type { ItemGroupListParams } from '../types/item-group.types';

/**
 * Query keys for Item Groups
 * Provides consistent key generation for React Query caching
 */
export const itemGroupKeys = {
	// Base key for all item group-related queries
	all: ['material-management', 'item-groups'] as const,

	// Item group list queries with parameters
	list: (params: ItemGroupListParams) => [...itemGroupKeys.all, 'list', params] as const,

	// Item group detail queries
	detail: (uoid: string) => [...itemGroupKeys.all, 'detail', uoid] as const,

	// Item group statistics queries
	stats: () => [...itemGroupKeys.all, 'stats'] as const
};
