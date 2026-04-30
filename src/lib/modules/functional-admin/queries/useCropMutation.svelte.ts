import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';
import {
   createMutation,
   useQueryClient,
   type CreateMutationOptions
} from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';

// Create Crop (Panenan)
type CreateCropInput =
   operations['create-crop']['requestBody']['content']['application/json'];

type CreateCropResponse =
   operations['create-crop']['responses']['200']['content']['application/json'];

type CreateCropMutationResponse = {
   data?: CreateCropResponse;
   error?: unknown;
};

export const useCreateCropMutation = (
   options?: CreateMutationOptions<
      CreateCropMutationResponse,
      Error,
      CreateCropInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: CreateCropInput) => {
            const { data, error } = await userCtx
               .client()
               .POST('/api/functional-admin/general/crops', {
                  body: input
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.crops()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Update Crop (Panenan)
type CropParams =
   operations['update-crop']['parameters']['path']['id'];

type UpdateCropRequest =
   operations['update-crop']['requestBody']['content']['application/json'];

type UpdateCropResponse =
   operations['update-crop']['responses']['200']['content']['application/json'];

type UpdateCropInput = {
   id: CropParams;
   data: UpdateCropRequest;
};

export const useUpdateCropMutation = (
   options?: CreateMutationOptions<
      UpdateCropResponse,
      Error,
      UpdateCropInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: UpdateCropInput) => {
            const { data, error } = await userCtx
               .client()
               .PUT('/api/functional-admin/general/crops/{id}', {
                  params: {
                     path: { id: input.id }
                  },
                  body: input.data
               });

            if (error) throw error;

            return data as UpdateCropResponse;
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.crops()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Delete Crop (Panenan)
type DeleteCropInput = {
   id: string;
};

type DeleteCropResponse =
   operations['delete-crop']['responses']['204']['content'];

type DeleteCropMutationResponse = {
   data?: DeleteCropResponse;
   error?: unknown;
};

export const useDeleteCropMutation = (
   options?: CreateMutationOptions<
      DeleteCropMutationResponse,
      Error,
      DeleteCropInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: DeleteCropInput) => {
            const { data, error } = await userCtx
               .client()
               .DELETE('/api/functional-admin/general/crops/{id}', {
                  params: {
                     path: { id: input.id }
                  }
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.crops()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};