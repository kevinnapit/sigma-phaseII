import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';
import {
   createMutation,
   useQueryClient,
   type CreateMutationOptions
} from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';

// Create Company
type CreateCompanyInput =
   operations['create-company']['requestBody']['content']['application/json'];

type CreateCompanyResponse =
   operations['create-company']['responses']['200']['content']['application/json'];

type CreateCompanyMutationResponse = {
   data?: CreateCompanyResponse;
   error?: unknown;
};

export const useCreateCompanyMutation = (
   options?: CreateMutationOptions<
      CreateCompanyMutationResponse,
      Error,
      CreateCompanyInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: CreateCompanyInput) => {
            const { data, error } = await userCtx
               .client()
               .POST('/api/functional-admin/companies/', {
                  body: input
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.companies()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Update Company
type CompanyParams =
   operations['update-company']['parameters']['path']['id'];

type UpdateCompanyRequest =
   operations['update-company']['requestBody']['content']['application/json'];

type UpdateCompanyResponse =
   operations['update-company']['responses']['200']['content']['application/json'];

type UpdateCompanyInput = {
   id: CompanyParams;
   data: UpdateCompanyRequest;
};

export const useUpdateCompanyMutation = (
   options?: CreateMutationOptions<
      UpdateCompanyResponse,
      Error,
      UpdateCompanyInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: UpdateCompanyInput) => {
            const { data, error } = await userCtx
               .client()
               .PUT('/api/functional-admin/companies/{id}', {
                  params: {
                     path: { id: input.id }
                  },
                  body: input.data
               });

            if (error) throw error;

            return data as UpdateCompanyResponse;
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.companies()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Delete Company
type DeleteCompanyInput = {
   id: string;
};

type DeleteCompanyResponse =
   operations['delete-company']['responses']['204']['content'];

type DeleteCompanyMutationResponse = {
   data?: DeleteCompanyResponse;
   error?: unknown;
};

export const useDeleteCompanyMutation = (
   options?: CreateMutationOptions<
      DeleteCompanyMutationResponse,
      Error,
      DeleteCompanyInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: DeleteCompanyInput) => {
            const { data, error } = await userCtx
               .client()
               .DELETE('/api/functional-admin/companies/{id}', {
                  params: {
                     path: { id: input.id }
                  }
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.companies()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Create Group
type CreateGroupInput =
   operations['create-group']['requestBody']['content']['application/json'];

type CreateGroupResponse =
   operations['create-group']['responses']['200']['content']['application/json'];

type CreateGroupMutationResponse = {
   data?: CreateGroupResponse;
   error?: unknown;
};

export const useCreateGroupMutation = (
   options?: CreateMutationOptions<
      CreateGroupMutationResponse,
      Error,
      CreateGroupInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: CreateGroupInput) => {
            const { data, error } = await userCtx
               .client()
               .POST('/api/functional-admin/groups/', {
                  body: input
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.groups()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Update Group
type GroupParams =
   operations['update-group']['parameters']['path']['id'];

type UpdateGroupRequest =
   operations['update-group']['requestBody']['content']['application/json'];

type UpdateGroupResponse =
   operations['update-group']['responses']['200']['content']['application/json'];

type UpdateGroupInput = {
   id: GroupParams;
   data: UpdateGroupRequest;
};

export const useUpdateGroupMutation = (
   options?: CreateMutationOptions<
      UpdateGroupResponse,
      Error,
      UpdateGroupInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: UpdateGroupInput) => {
            const { data, error } = await userCtx
               .client()
               .PUT('/api/functional-admin/groups/{id}', {
                  params: {
                     path: { id: input.id }
                  },
                  body: input.data
               });

            if (error) throw error;

            return data as UpdateGroupResponse;
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.groups()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Delete Group
type DeleteGroupInput = {
   id: string;
};

type DeleteGroupResponse =
   operations['delete-group']['responses']['204']['content'];

type DeleteGroupMutationResponse = {
   data?: DeleteGroupResponse;
   error?: unknown;
};

export const useDeleteGroupMutation = (
   options?: CreateMutationOptions<
      DeleteGroupMutationResponse,
      Error,
      DeleteGroupInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: DeleteGroupInput) => {
            const { data, error } = await userCtx
               .client()
               .DELETE('/api/functional-admin/groups/{id}', {
                  params: {
                     path: { id: input.id }
                  }
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.groups()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};
