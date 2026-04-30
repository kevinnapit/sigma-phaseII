import type { operations } from "$lib/generated/auth/openapi.gen";
import { getUserContext } from "$lib/modules/auth/context/user.svelte";
import { createMutation, useQueryClient, type CreateMutationOptions } from "@tanstack/svelte-query";
import { authKeys } from "../keys";

// Revoke Sessions
type CreateCompanyInput =
   operations['revoke-sessions']['requestBody']['content']['application/json'];

type CreateCompanyResponse =
   operations['revoke-sessions']['responses']['200']['content']['application/json'];

type CreateCompanyMutationResponse = {
   data?: CreateCompanyResponse;
   error?: unknown;
};

export const useRevokeSessionMutation = (
   options?: CreateMutationOptions<
      CreateCompanyMutationResponse,
      Error,
      CreateCompanyInput
   >
) => {
   const authCtx = getUserContext();
   const queryClient = useQueryClient();

   return createMutation(() => {
      const { onSuccess, ...restOptions } = options || {};

      return {
         mutationFn: async (input: CreateCompanyInput) => {
            const { data, error } = await authCtx.
               authClient()
               .POST('/api/auth/revoke-sessions', {
                  body: input
               });

            return { data, error };
         },

         onSuccess: (...args) => {
            queryClient.invalidateQueries({
               queryKey: authKeys.sessions()
            });

            onSuccess?.(...args);
         },

         ...restOptions
      };
   });
};