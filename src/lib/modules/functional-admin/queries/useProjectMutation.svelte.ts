import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient } from '@tanstack/svelte-query';
import { createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type CreateProjectInput =
	operations['create-project']['requestBody']['content']['application/json'];
type CreateProjectResponse =
	operations['create-project']['responses']['200']['content']['application/json'];
type CreateProjectError =
	operations['create-project']['responses']['default']['content']['application/problem+json'];

type CreateProjectMutationResponse = {
	data?: CreateProjectResponse;
	error?: CreateProjectError | unknown;
};

export const useCreateProjectMutation = (
	options?: CreateMutationOptions<CreateProjectMutationResponse, Error, CreateProjectInput>
) => {
	const queryClient = useQueryClient();

	const userCtx = getUserContext();
	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};
		return {
			mutationFn: async (input: CreateProjectInput) => {
				const { data, error } = await userCtx.client().POST('/api/functional-admin/projects/', {
					body: input
				});
				return { data, error };
			},
			onSuccess: (...args) => {
				queryClient.invalidateQueries({ queryKey: functionalAdminKeys.projects() });
				onSuccess?.(...args);
			},
			...restOptions
		};
	});
};

// Update Project
type ProjectParams =
	operations['update-project']['parameters']['path']['id'];

type UpdateProjectRequest =
	operations['update-project']['requestBody']['content']['application/json'];

type UpdateProjectResponse =
	operations['update-project']['responses']['200']['content']['application/json'];

type UpdateProjectInput = {
	id: ProjectParams;
	data: UpdateProjectRequest;
};

export const useUpdateProjectMutation = (
	options?: CreateMutationOptions<
		UpdateProjectResponse,
		Error,
		UpdateProjectInput
	>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};

		return {
			mutationFn: async (input: UpdateProjectInput) => {
				const { data, error } = await userCtx
					.client()
					.PUT('/api/functional-admin/projects/{id}', {
						params: {
							path: { id: input.id }
						},
						body: input.data
					});

				if (error) throw error;

				return data as UpdateProjectResponse;
			},

			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: functionalAdminKeys.projects()
				});

				onSuccess?.(...args);
			},

			...restOptions
		};
	});
};

// Delete Project
type DeleteProjectInput = {
	id: string;
};

type DeleteProjectResponse =
	operations['delete-project']['responses']['200']['content']['application/json'];

type DeleteProjectMutationResponse = {
	data?: DeleteProjectResponse;
	error?: unknown;
};

export const useDeleteProjectMutation = (
	options?: CreateMutationOptions<
		DeleteProjectMutationResponse,
		Error,
		DeleteProjectInput
	>
) => {
	const userCtx = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => {
		const { onSuccess, ...restOptions } = options || {};

		return {
			mutationFn: async (input: DeleteProjectInput) => {
				const { data, error } = await userCtx
					.client()
					.DELETE('/api/functional-admin/projects/{id}', {
						params: {
							path: { id: input.id },
						},
					});

				return { data, error };
			},

			onSuccess: (...args) => {
				queryClient.invalidateQueries({
					queryKey: functionalAdminKeys.projects()
				});

				onSuccess?.(...args);
			},

			...restOptions
		};
	});
};

export type {
	CreateProjectInput,
	CreateProjectResponse,
	UpdateProjectInput,
	UpdateProjectResponse,
	DeleteProjectInput
};
