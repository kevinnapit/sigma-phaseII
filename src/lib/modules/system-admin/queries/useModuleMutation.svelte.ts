import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient } from '@tanstack/svelte-query';
import {
	CreateModuleRequestSchema,
	UpdateModuleRequestSchema
} from '$lib/generated/administration_and_agronomy/schemas.gen';
import { createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

// Create Module
type CreateModuleInput = Schemas['CreateModuleRequest'];

type CreateModuleMutationResponse = {
	data?: Schemas['ModuleResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useCreateModuleMutation = (
	options?: CreateMutationOptions<CreateModuleMutationResponse, Error, CreateModuleInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();
	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: CreateModuleInput) => {
				const valid = CreateModuleRequestSchema.safeParse(input);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx.client().POST('/api/system-admin/modules/', {
					body: input
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.modules()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Update Module
type UpdateModuleInput = {
	id: number;
	data: Schemas['UpdateModuleRequest'];
};

type UpdateModuleMutationResponse = {
	data?: Schemas['ModuleResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useUpdateModuleMutation = (
	options?: CreateMutationOptions<UpdateModuleMutationResponse, Error, UpdateModuleInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: UpdateModuleInput) => {
				const valid = UpdateModuleRequestSchema.safeParse(input.data);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx.client().PUT('/api/system-admin/modules/{id}', {
					params: { path: { id: input.id } },
					body: input.data
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.modules()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Delete Module
type DeleteModuleMutationResponse = {
	data?: unknown;
	error?: Schemas['ErrorModel'] | unknown;
};

export const useDeleteModuleMutation = (
	options?: CreateMutationOptions<DeleteModuleMutationResponse, Error, number>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (id: number) => {
				const { data, error } = await userCtx.client().DELETE('/api/system-admin/modules/{id}', {
					params: { path: { id } }
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.modules()
				});
				onSuccess?.(...args);
			}
		};
	});
};
