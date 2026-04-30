import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';
import {
   createMutation,
   useQueryClient,
   type CreateMutationOptions
} from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';

// Create Nationality
type CreateNationalityInput =
   operations['create-kebangsaan']['requestBody']['content']['application/json'];

type CreateNationalityResponse =
   operations['create-kebangsaan']['responses']['200']['content']['application/json'];

type CreateNationalityMutationResponse = {
   data?: CreateNationalityResponse;
   error?: unknown;
};

export const useCreateNationalityMutation = (
   options?: CreateMutationOptions<
      CreateNationalityMutationResponse,
      Error,
      CreateNationalityInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: CreateNationalityInput) => {
            const { data, error } = await userCtx
               .client()
               .POST('/api/functional-admin/general/kebangsaan/', {
                  body: input
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.kebangsaan()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Update Nationality
type NationalityParams =
   operations['update-kebangsaan']['parameters']['path']['id'];

type UpdateNationalityRequest =
   operations['update-kebangsaan']['requestBody']['content']['application/json'];

type UpdateNationalityResponse =
   operations['update-kebangsaan']['responses']['200']['content']['application/json'];

type UpdateNationalityInput = {
   id: NationalityParams;
   data: UpdateNationalityRequest;
};

export const useUpdateNationalityMutation = (
   options?: CreateMutationOptions<
      UpdateNationalityResponse,
      Error,
      UpdateNationalityInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: UpdateNationalityInput) => {
            const { data, error } = await userCtx
               .client()
               .PUT('/api/functional-admin/general/kebangsaan/{id}', {
                  params: {
                     path: { id: input.id }
                  },
                  body: input.data
               });

            if (error) throw error;

            return data as UpdateNationalityResponse;
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.kebangsaan()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Delete Nationality
type DeleteNationalityInput = {
   id: string;
};

type DeleteNationalityResponse =
   operations['delete-kebangsaan']['responses']['204']['content'];

type DeleteNationalityMutationResponse = {
   data?: DeleteNationalityResponse;
   error?: unknown;
};

export const useDeleteNationalityMutation = (
   options?: CreateMutationOptions<
      DeleteNationalityMutationResponse,
      Error,
      DeleteNationalityInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: DeleteNationalityInput) => {
            const { data, error } = await userCtx
               .client()
               .DELETE('/api/functional-admin/general/kebangsaan/{id}', {
                  params: {
                     path: { id: input.id }
                  }
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.kebangsaan()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};