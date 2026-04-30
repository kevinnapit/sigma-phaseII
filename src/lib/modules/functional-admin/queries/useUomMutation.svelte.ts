import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';
import {
   createMutation,
   useQueryClient,
   type CreateMutationOptions
} from '@tanstack/svelte-query';
import { functionalAdminKeys } from '../keys';

// Create UOM
type CreateUomInput =
   operations['create-uom']['requestBody']['content']['application/json'];

type CreateUomResponse =
   operations['create-uom']['responses']['201']['content']['application/json'];

type CreateUomMutationResponse = {
   data?: CreateUomResponse;
   error?: unknown;
};

export const useCreateUomMutation = (
   options?: CreateMutationOptions<
      CreateUomMutationResponse,
      Error,
      CreateUomInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: CreateUomInput) => {
            const { data, error } = await userCtx
               .client()
               .POST('/api/functional-admin/uom/satuan-ukuran', {
                  body: input
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.uom()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Update UOM
type UomParams =
   operations['update-uom']['parameters']['path']['id'];

type UpdateUomRequest =
   operations['update-uom']['requestBody']['content']['application/json'];

type UpdateUomResponse =
   operations['update-uom']['responses']['200']['content']['application/json'];

type UpdateUomInput = {
   id: UomParams;
   data: UpdateUomRequest;
};

export const useUpdateUomMutation = (
   options?: CreateMutationOptions<
      UpdateUomResponse,
      Error,
      UpdateUomInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: UpdateUomInput) => {
            const { data, error } = await userCtx
               .client()
               .PUT('/api/functional-admin/uom/satuan-ukuran/{id}', {
                  params: {
                     path: { id: input.id }
                  },
                  body: input.data
               });

            if (error) throw error;

            return data as UpdateUomResponse;
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.uom()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};

// Delete UOM
type DeleteUomInput = {
   id: string;
};

type DeleteUomResponse =
   operations['delete-uom']['responses']['204']['content'];

type DeleteUomMutationResponse = {
   data?: DeleteUomResponse;
   error?: unknown;
};

export const useDeleteUomMutation = (
   options?: CreateMutationOptions<
      DeleteUomMutationResponse,
      Error,
      DeleteUomInput
   >
) => {
   const userCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: DeleteUomInput) => {
            const { data, error } = await userCtx
               .client()
               .DELETE('/api/functional-admin/uom/satuan-ukuran/{id}', {
                  params: {
                     path: { id: input.id }
                  }
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: functionalAdminKeys.uom()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};