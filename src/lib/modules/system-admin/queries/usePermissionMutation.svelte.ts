import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient } from '@tanstack/svelte-query';
import { CreatePermissionRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import { createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

// Create Permission
type CreatePermissionInput = Schemas['CreatePermissionRequest'];

type CreatePermissionMutationResponse = {
	data?: Schemas['PermissionResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useCreatePermissionMutation = (
	options?: CreateMutationOptions<CreatePermissionMutationResponse, Error, CreatePermissionInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: CreatePermissionInput) => {
				const valid = CreatePermissionRequestSchema.safeParse(input);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx.client().POST('/api/system-admin/permissions/', {
					body: input
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.permissions()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Update Permission - uses same schema as Create
type UpdatePermissionInput = {
	id: number;
	data: Schemas['CreatePermissionRequest'];
};

type UpdatePermissionMutationResponse = {
	data?: Schemas['PermissionResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useUpdatePermissionMutation = (
	options?: CreateMutationOptions<UpdatePermissionMutationResponse, Error, UpdatePermissionInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: UpdatePermissionInput) => {
				const valid = CreatePermissionRequestSchema.safeParse(input.data);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx.client().PUT('/api/system-admin/permissions/{id}', {
					params: { path: { id: input.id } },
					body: input.data
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.permissions()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Delete Permission
type DeletePermissionMutationResponse = {
	data?: unknown;
	error?: Schemas['ErrorModel'] | unknown;
};

export const useDeletePermissionMutation = (
	options?: CreateMutationOptions<DeletePermissionMutationResponse, Error, number>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (id: number) => {
				const { data, error } = await userCtx
					.client()
					.DELETE('/api/system-admin/permissions/{id}', {
						params: { path: { id } }
					});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.permissions()
				});
				onSuccess?.(...args);
			}
		};
	});
};
