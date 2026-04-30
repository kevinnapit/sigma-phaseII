import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { useMasterTypeListQuery, useMasterValuesByTypeQuery } from '../../index.svelte';

type MasterValue = components['schemas']['MasterValueItem'];

export function getCountry() {

   const masterTypeQuery = useMasterTypeListQuery(() => ({
      name: 'Country'
   }));

   const masterTypeId = $state('cd7164ab-5029-4e5b-8a86-102e827d9878');

   const masterValuesQuery = useMasterValuesByTypeQuery(() => ({
      master_type_id: masterTypeId
   }));

   const countries = $derived(
      (masterValuesQuery.data ?? []) as MasterValue[]
   );

   return {
      masterTypeQuery,
      masterValuesQuery,
      countries
   };
}