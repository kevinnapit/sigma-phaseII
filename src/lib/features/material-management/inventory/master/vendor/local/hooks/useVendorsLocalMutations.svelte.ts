import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { localVendorApi } from '../api/vendor-local.api';
import { localVendorKeys } from '../api/vendor-local.keys';
import type {
	CreateLocalVendorRequest,
	UpdateLocalVendorRequest,
	RegisterVendorRequest,
	ResendVendorRegistrationRequest
} from '../types/vendor-local.types';

/**
 * Mutations for Local Vendors - Create, Update, Delete operations
 */

/**
 * Hook for creating a new local vendor
 */
export const useCreateLocalVendor = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: (data: CreateLocalVendorRequest) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.createLocalVendor(data, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.all });
		}
	}));
};

/**
 * Hook for updating a local vendor
 */
export const useUpdateLocalVendor = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			data,
			i_version
		}: {
			uoid: string;
			data: UpdateLocalVendorRequest;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendor(uoid, data, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.all });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting a local vendor
 */
export const useDeleteLocalVendor = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, i_version }: { uoid: string; i_version: number }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendor(uoid, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.all });
			queryClient.removeQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for registering a vendor for user access
 */
export const useRegisterVendor = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: (data: RegisterVendorRequest) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.registerVendor(data, context);
		},
		onSuccess: () => {
			// Invalidate the vendors list to refresh registration status
			queryClient.invalidateQueries({ queryKey: localVendorKeys.all });
		}
	}));
};

/**
 * Hook for resending vendor registration
 */
export const useResendVendorRegistration = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: (data: ResendVendorRegistrationRequest) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.resendVendorRegistration(data, context);
		},
		onSuccess: () => {
			// Invalidate the vendors list to refresh registration status
			queryClient.invalidateQueries({ queryKey: localVendorKeys.all });
		}
	}));
};

/**
 * Hook for updating local vendor addresses
 */
export const useUpdateLocalVendorAddresses = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { address: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorAddresses(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.addresses(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for updating local vendor party types (categories)
 */
export const useUpdateLocalVendorPartyTypes = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { category: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorPartyTypes(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.partyTypes(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for updating local vendor transaction types
 */
export const useUpdateLocalVendorTransactionTypes = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { transaction_type: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorTransactionTypes(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.transactionTypes(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for updating local vendor tax registrations
 */
export const useUpdateLocalVendorTaxRegistrations = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { tax: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorTaxRegistrations(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.taxRegistrations(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor address
 */
export const useDeleteLocalVendorAddress = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			linkId,
			i_version
		}: {
			uoid: string;
			linkId: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorAddress(uoid, linkId, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.addresses(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor party type (category)
 */
export const useDeleteLocalVendorPartyType = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			partyTypeUoid,
			i_version
		}: {
			uoid: string;
			partyTypeUoid: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorPartyType(uoid, partyTypeUoid, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.partyTypes(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor transaction type
 */
export const useDeleteLocalVendorTransactionType = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			transactionTypeUoid,
			i_version
		}: {
			uoid: string;
			transactionTypeUoid: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorTransactionType(
				uoid,
				transactionTypeUoid,
				i_version,
				context
			);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.transactionTypes(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor tax registration
 */
export const useDeleteLocalVendorTaxRegistration = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			taxRegistrationUoid,
			i_version
		}: {
			uoid: string;
			taxRegistrationUoid: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorTaxRegistration(
				uoid,
				taxRegistrationUoid,
				i_version,
				context
			);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.taxRegistrations(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for updating local vendor custom properties
 */
export const useUpdateLocalVendorCustomProperties = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { property: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorCustomProperties(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.customProperties(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor custom property
 */
export const useDeleteLocalVendorCustomProperty = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			customPropertyUoid,
			i_version
		}: {
			uoid: string;
			customPropertyUoid: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorCustomProperty(
				uoid,
				customPropertyUoid,
				i_version,
				context
			);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.customProperties(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for updating local vendor banks
 */
export const useUpdateLocalVendorBanks = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { bank: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorBanks(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.banks(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor bank
 */
export const useDeleteLocalVendorBank = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			bankId,
			i_version
		}: {
			uoid: string;
			bankId: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorBank(uoid, bankId, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.banks(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for updating local vendor other infos
 */
export const useUpdateLocalVendorOtherInfos = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: { other_info: Array<any> } }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.updateLocalVendorOtherInfos(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.otherInfo(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting local vendor other info
 */
export const useDeleteLocalVendorOtherInfo = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({
			uoid,
			infoId,
			i_version
		}: {
			uoid: string;
			infoId: string;
			i_version: number;
		}) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return localVendorApi.deleteLocalVendorOtherInfo(uoid, infoId, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: localVendorKeys.otherInfo(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: localVendorKeys.detail(variables.uoid) });
		}
	}));
};
