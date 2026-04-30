import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { centralVendorApi } from '../api/vendor-central.api';
import { centralVendorKeys } from '../api/vendor-central.keys';
import type { CentralVendorListParams } from '../types/vendor-central.types';

/**
 * Queries for Central Vendors (HO Vendors)
 */

/**
 * Hook for reading all central vendors with pagination and filters
 */
export const useReadAllCentralVendors = (
	params: () => CentralVendorListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: centralVendorKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token
			};
			return centralVendorApi.getCentralVendors(currentParams, context);
		},
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token
	}));
};

/**
 * Hook for reading central vendor detail by SAP vendor code
 */
export const useReadDetailCentralVendor = (sapVendorCode: () => string) => {
	const userContext = getUserContext();
	const currentCode = $derived(sapVendorCode());

	return createQuery(() => ({
		queryKey: centralVendorKeys.detail(currentCode),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return centralVendorApi.getCentralVendorById(currentCode, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentCode && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for publishing (registering) a central vendor as a local vendor
 */
export const usePublishCentralVendor = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (sapVendorCode: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return centralVendorApi.publishCentralVendor(sapVendorCode, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: centralVendorKeys.all });
		}
	}));
};
