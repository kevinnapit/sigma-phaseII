import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { storeApi } from '../api/store.api';
import { storesKeys } from '../api/stores.keys';
import type { CreateStoreRequest, UpdateStoreRequest } from '../types/store.types';

/**
 * Mutations for Stores - Create, Update, Delete operations
 */

/**
 * Hook for creating a new store
 */
export const useCreateStore = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: (data: CreateStoreRequest) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return storeApi.createStore(data, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storesKeys.all });
		}
	}));
};

/**
 * Hook for updating an existing store
 */
export const useUpdateStore = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: UpdateStoreRequest }) => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate?.id || '',
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return storeApi.updateStore(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: storesKeys.all });
			queryClient.invalidateQueries({ queryKey: storesKeys.detail(variables.uoid) });
		}
	}));
};

/**
 * Hook for deleting a store
 */
export const useDeleteStore = () => {
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
			return storeApi.deleteStore(uoid, i_version, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: storesKeys.all });
			queryClient.removeQueries({ queryKey: storesKeys.detail(variables.uoid) });
		}
	}));
};
