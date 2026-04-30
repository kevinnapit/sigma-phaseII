import type { ItemListParams } from '../types/item.types';

/**
 * Query keys for Items
 * Provides consistent key generation for React Query caching
 */
export const itemKeys = {
	// Base key for all item-related queries
	all: ['material-management', 'items'] as const,

	// Item list queries with parameters
	list: (params: ItemListParams) => [...itemKeys.all, 'list', params] as const,

	// Item detail queries
	detail: (uoid: string) => [...itemKeys.all, 'detail', uoid] as const,

	// Item VRL detail queries
	vrlDetail: (uoid: string) => [...itemKeys.all, 'vrl-detail', uoid] as const,

	// Item manufactures queries
	manufactures: (uoid: string) => [...itemKeys.all, 'manufactures', uoid] as const,

	// Item UOM links queries
	uomLinks: (uoid: string) => [...itemKeys.all, 'uom-links', uoid] as const,

	// Item substitutes queries
	substitutes: (uoid: string) => [...itemKeys.all, 'substitutes', uoid] as const,

	// Item usages queries
	usages: (uoid: string, search?: string) => [...itemKeys.all, 'usages', uoid, search] as const,

	// Item stock records (stores) queries
	stockRecords: (uoid: string) => [...itemKeys.all, 'stock-records', uoid] as const,

	// Item conversions queries
	conversions: (uoid: string) => [...itemKeys.all, 'conversions', uoid] as const,

	// Item statistics queries
	stats: () => [...itemKeys.all, 'stats'] as const
};
