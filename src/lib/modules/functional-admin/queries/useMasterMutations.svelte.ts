import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient } from '@tanstack/svelte-query';
import { createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';

// Provisional types since they are missing in OpenAPI
export type CreateMasterValueInput = {
	master_type_id: string;
	value: string;
	code: string; // Keeping as string to match common usage, but schema says int. will verify.
	is_active?: boolean;
	sort_order?: number;
};

export type UpdateMasterValueInput = Partial<CreateMasterValueInput> & {
	id: string;
};

export const useCreateMasterValueMutation = (
	options?: CreateMutationOptions<unknown, Error, CreateMasterValueInput>
) => {
	const queryClient = useQueryClient();
	const userCtx = getUserContext();
	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: CreateMasterValueInput) => {
				const { data, error } = await userCtx
					.client()
					.POST('/api/functional-admin/general/master-values', {
						body: input as any
					});
				if (error) throw error;
				return data;
			},
			onSuccess: (...args) => {
				queryClient.invalidateQueries({ queryKey: functionalAdminKeys.masterValueList({}) });
				// Also invalidate by type if possible, but standard list invalidation is safer
				onSuccess?.(...args);
			},
			...restOptions
		};
	});
};

export const useUpdateMasterValueMutation = (
	options?: CreateMutationOptions<unknown, Error, UpdateMasterValueInput>
) => {
	const queryClient = useQueryClient();
	const userCtx = getUserContext();
	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: UpdateMasterValueInput) => {
				const { id, ...body } = input;
				const { data, error } = await userCtx
					.client()
					.PUT('/api/functional-admin/general/master-values/{id}', {
						params: { path: { id } },
						body: body as any
					});
				if (error) throw error;
				return data;
			},
			onSuccess: (...args) => {
				queryClient.invalidateQueries({ queryKey: functionalAdminKeys.masterValueList({}) });
				onSuccess?.(...args);
			},
			...restOptions
		};
	});
};

export const useDeleteMasterValueMutation = (
	options?: CreateMutationOptions<unknown, Error, string>
) => {
	const queryClient = useQueryClient();
	const userCtx = getUserContext();
	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (id: string) => {
				const { data, error } = await userCtx
					.client()
					.DELETE('/api/functional-admin/general/master-values/{id}', {
						params: { path: { id } }
					});
				if (error) throw error;
				return data;
			},
			onSuccess: (...args) => {
				queryClient.invalidateQueries({ queryKey: functionalAdminKeys.masterValueList({}) });
				onSuccess?.(...args);
			},
			...restOptions
		};
	});
};
