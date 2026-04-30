import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient } from '@tanstack/svelte-query';
import {
	ToggleRoleModulesRequestSchema,
	ToggleRolePermissionRequestSchema
} from '$lib/generated/administration_and_agronomy/schemas.gen';
import { createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';
import { roleSchema } from '../schemas/role.schemas';

// Create Role
type CreateRoleInput = Schemas['CreateRoleRequest'];

type CreateRoleMutationResponse = {
	data?: Schemas['CreateRoleResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useCreateRoleMutation = (
	options?: CreateMutationOptions<CreateRoleMutationResponse, Error, CreateRoleInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: CreateRoleInput) => {
				const valid = roleSchema.safeParse(input);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx.client().POST('/api/system-admin/roles/', {
					body: input
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.roles()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Toggle Role Modules
type ToggleRoleModulesInput = Schemas['ToggleRoleModulesRequest'];

type ToggleRoleModulesMutationResponse = {
	data?: Schemas['ToggleRoleModulesResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useToggleRoleModulesMutation = (
	options?: CreateMutationOptions<ToggleRoleModulesMutationResponse, Error, ToggleRoleModulesInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: ToggleRoleModulesInput) => {
				const valid = ToggleRoleModulesRequestSchema.safeParse(input);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx
					.client()
					.POST('/api/system-admin/roles/toggle-modules', {
						body: input
					});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.roles()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Toggle Role Permission
type ToggleRolePermissionInput = Schemas['ToggleRolePermissionRequest'];

type ToggleRolePermissionMutationResponse = {
	data?: Schemas['ToggleRolePermissionResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useToggleRolePermissionMutation = (
	options?: CreateMutationOptions<
		ToggleRolePermissionMutationResponse,
		Error,
		ToggleRolePermissionInput
	>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();
	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: ToggleRolePermissionInput) => {
				const valid = ToggleRolePermissionRequestSchema.safeParse(input);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx
					.client()
					.POST('/api/system-admin/roles/toggle-permission', {
						body: input
					});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.roles()
				});
				onSuccess?.(...args);
			}
		};
	});
};
