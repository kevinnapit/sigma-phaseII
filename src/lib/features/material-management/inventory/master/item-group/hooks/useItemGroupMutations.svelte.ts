import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { itemGroupApi } from '../api/item-group.api';
import { itemGroupKeys } from '../api/item-group.keys';
import type { UpdateItemGroupRequest } from '../types/item-group.types';

/**
 * Mutations for Item Groups
 */

/**
 * Hook for updating an existing item group
 */
export const useUpdateItemGroup = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: ({ uoid, data }: { uoid: string; data: UpdateItemGroupRequest }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemGroupApi.updateItemGroup(uoid, data, context);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: itemGroupKeys.all });
			queryClient.invalidateQueries({ queryKey: itemGroupKeys.detail(variables.uoid) });
		}
	}));
};
