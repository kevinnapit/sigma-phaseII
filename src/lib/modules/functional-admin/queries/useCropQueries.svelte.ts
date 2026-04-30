import type { operations } from "$lib/generated/administration_and_agronomy/openapi.gen";
import { getUserContext } from "$lib/modules/auth/context/user.svelte";
import { createQuery } from "@tanstack/svelte-query";
import { functionalAdminKeys } from "../keys";

// Crop (Panenan)
type CropListParams = operations['list-crops']['parameters']['query'];

export const useCropListQuery = (params: () => CropListParams) => {
   const userCtx = getUserContext();
   return createQuery(() => {
      const query = params();
      return {
         queryKey: functionalAdminKeys.cropList(query),
         queryFn: async () => {
            const { data, error } = await userCtx
               .client()
               .GET('/api/functional-admin/general/crops', {
                  params: query ? { query } : undefined,
               });
            if (error) throw error;
            return data;
         },
         placeholderData: (prev) => prev,
      };
   });
};