import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { localVendorApi } from '../api/vendor-local.api';
import { localVendorKeys } from '../api/vendor-local.keys';
import type { LocalVendorListParams } from '../types/vendor-local.types';

/**
 * Queries for Local Vendors - Multiple read operations
 */

/**
 * Hook for reading all local vendors with pagination and filters
 */
export const useReadAllLocalVendors = (
	params: () => LocalVendorListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localVendorKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendors(currentParams, context);
		},
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		placeholderData: (previousData) => previousData,
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor detail by ID
 */
export const useReadDetailLocalVendor = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.detail(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorById(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor addresses by vendor ID
 */
export const useReadLocalVendorAddresses = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.addresses(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorAddresses(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor party types (categories) by vendor ID
 */
export const useReadLocalVendorPartyTypes = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.partyTypes(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorPartyTypes(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor banks by vendor ID
 */
export const useReadLocalVendorBanks = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.banks(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorBanks(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor other info by vendor ID
 */
export const useReadLocalVendorOtherInfo = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.otherInfo(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorOtherInfo(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor tax registrations by vendor ID
 */
export const useReadLocalVendorTaxRegistrations = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.taxRegistrations(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorTaxRegistrations(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor transaction types by vendor ID
 */
export const useReadLocalVendorTransactionTypes = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.transactionTypes(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorTransactionTypes(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook for reading local vendor custom properties by vendor ID
 */
export const useReadLocalVendorCustomProperties = (uoid: () => string) => {
	const userContext = getUserContext();
	const currentUoid = $derived(uoid());

	return createQuery(() => ({
		queryKey: localVendorKeys.customProperties(currentUoid),
		queryFn: () => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.getLocalVendorCustomProperties(currentUoid, context);
		},
		enabled: !!currentUoid && !!userContext.token && !!userContext.estate?.id
	}));
};
