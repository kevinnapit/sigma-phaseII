import type { LocalVendorListParams } from '../types/vendor-local.types';

/**
 * query keys for Local Vendors
 * Provides consistent key generation for React Query caching
 */
export const localVendorKeys = {
	// Base key for all local vendor-related queries
	all: ['material-management', 'vendors', 'local'] as const,

	// Local vendor list queries with parameters
	list: (params: LocalVendorListParams) => [...localVendorKeys.all, 'list', params] as const,

	// Local vendor detail queries
	detail: (uoid: string) => [...localVendorKeys.all, 'detail', uoid] as const,

	// Local vendor addresses queries
	addresses: (uoid: string) => [...localVendorKeys.all, 'addresses', uoid] as const,

	// Local vendor party types (categories) queries
	partyTypes: (uoid: string) => [...localVendorKeys.all, 'party-types', uoid] as const,

	// Local vendor banks queries
	banks: (uoid: string) => [...localVendorKeys.all, 'banks', uoid] as const,

	// Local vendor other info queries
	otherInfo: (uoid: string) => [...localVendorKeys.all, 'other-info', uoid] as const,

	// Local vendor tax registrations queries
	taxRegistrations: (uoid: string) => [...localVendorKeys.all, 'tax-registrations', uoid] as const,

	// Local vendor transaction types queries
	transactionTypes: (uoid: string) => [...localVendorKeys.all, 'transaction-types', uoid] as const,

	// Local vendor custom properties queries
	customProperties: (uoid: string) => [...localVendorKeys.all, 'custom-properties', uoid] as const,

	// Local vendor statistics queries
	stats: () => [...localVendorKeys.all, 'stats'] as const
};
