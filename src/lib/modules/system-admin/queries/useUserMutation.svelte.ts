import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient } from '@tanstack/svelte-query';
import { AttachRoleRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import { createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { systemAdminKeys } from '../keys';

type AttachRoleInput = Schemas['AttachRoleRequest'];

type AttachRoleMutationResponse = {
	data?: Schemas['AttachRoleResponse'];
	error?: Schemas['ErrorModel'] | unknown;
};

export const useAttachRoleMutation = (
	options?: CreateMutationOptions<AttachRoleMutationResponse, Error, AttachRoleInput>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: AttachRoleInput) => {
				const valid = AttachRoleRequestSchema.safeParse(input);
				if (!valid.success) {
					return { data: undefined, error: valid.error };
				}
				const { data, error } = await userCtx.client().POST('/api/system-admin/users/attach-role', {
					body: input
				});
				return { data, error };
			},
			...restOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.users()
				});
				onSuccess?.(...args);
			}
		};
	});
};

// Create User
type UserInput = Schemas['CreateUserRequest'];
type UserResponse = Schemas['CreateUserResponse'];
type Error = Schemas['ErrorModel'] | unknown;

type CreateUserMutationResponse = {
	data?: UserResponse
	error?: Error
};

export const useCreateUserMutation = (
	options?: CreateMutationOptions<
		CreateUserMutationResponse,
		Error,
		UserInput
	>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};

		return {
			mutationFn: async (input: UserInput) => {
				const { data, error } = await userCtx
					.client()
					.POST('/api/system-admin/users/', {
						body: input
					});

				return { data, error };
			},

			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.users()
				});

				onSuccess?.(...args);
			},

			...restOptions
		};
	});
};

// Delete User
// Delete UOM
type DeleteUserInput = {
	userId: string;
};

type DeleteUserResponse = Schemas['DeleteUserResponse'];

type DeleteUserMutationResponse = {
	data?: DeleteUserResponse;
	error?: unknown;
};

export const useDeleteUserMutation = (
	options?: CreateMutationOptions<
		DeleteUserMutationResponse,
		Error,
		DeleteUserInput
	>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};

		return {
			mutationFn: async (input: DeleteUserInput) => {
				const { data, error } = await userCtx
					.client()
					.DELETE('/api/system-admin/users/{userId}', {
						params: {
							path: { userId: input.userId }
						}
					});

				return { data, error };
			},

			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: systemAdminKeys.users()
				});

				onSuccess?.(...args);
			},

			...restOptions
		};
	});
};