import type { CentralVendorListParams } from '../types/vendor-central.types';

/**
 * query keys for Central Vendors
 * Provides consistent key generation for React Query caching
 */
export const centralVendorKeys = {
	// Base key for all central vendor-related queries
	all: ['material-management', 'vendors', 'central'] as const,

	// Central vendor list queries with parameters
	list: (params: CentralVendorListParams) => [...centralVendorKeys.all, 'list', params] as const,

	// Central vendor detail queries
	detail: (uoid: string) => [...centralVendorKeys.all, 'detail', uoid] as const,

	// Central vendor statistics queries
	stats: () => [...centralVendorKeys.all, 'stats'] as const
};
