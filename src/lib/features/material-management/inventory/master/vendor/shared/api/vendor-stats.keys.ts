/**
 * query keys for Vendor Statistics (shared between local and central)
 */
export const vendorStatsKeys = {
	// Base key for all vendor stats queries
	all: ['material-management', 'vendors', 'stats'] as const,

	// Combined stats for both local and central
	combined: () => [...vendorStatsKeys.all, 'combined'] as const
};
