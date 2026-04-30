import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { vendorStatsApi } from '../api/vendor-stats.api';
import { vendorStatsKeys } from '../api/vendor-stats.keys';

/**
 * hook for reading vendor statistics (both local and central)
 */
export const useReadVendorStats = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: vendorStatsKeys.combined(),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return vendorStatsApi.getVendorStats(context);
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
