import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { authKeys } from '../keys';

export const useAllSessionQuery = () => {
   const userCtx = getUserContext();
   return createQuery(() => ({
      queryKey: authKeys.sessions(),
      queryFn: async () => {
         const token = userCtx.token;

         const { data, error } = await userCtx
            .authClient()
            .GET('/api/auth/sessions', {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

         if (error) throw error;
         return data;
      },
   }));
};
