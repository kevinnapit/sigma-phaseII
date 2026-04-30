import { toast } from 'svelte-sonner';
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { nationalitySchema } from '../../schemas/nationality.schema';
import { useCreateNationalityMutation, useUpdateNationalityMutation } from '../../queries/useGeneralMutation.svelte';
import { getCountry } from './use-country.svelte';

type NationalityItem = components['schemas']['KebangsaanItem'];
type Mode = 'create' | 'edit';

const initialForm = {
   name: '',
   country_id: ''
};

type FormFields = typeof initialForm;

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function useNationalityForm(
   getMode: () => Mode,
   getNationality: () => NationalityItem | null
) {
   let form = $state<FormFields>({ ...initialForm });
   let errors = $state<FormErrors>({});
   let touched = $state<FormTouched>({});

   // Country Hooks
   const { masterValuesQuery, countries } = getCountry();
   const isCountryLoading = $derived(masterValuesQuery.isLoading);

   $effect(() => {
      const nationality = getNationality();
      const mode = getMode();

      if (mode === 'edit' && nationality) {
         form = {
            name: nationality.name ?? '',
            country_id: nationality.country_id ?? ''
         };

         errors = {};
         touched = {};
      }
   });

   function getSchema() {
      return nationalitySchema;
   }

   function validateField(field: keyof FormFields) {
      const result = getSchema().safeParse(form);

      if (result.success) {
         errors[field] = undefined;
         return;
      }

      const fieldErrors = result.error.flatten().fieldErrors;

      errors[field] = fieldErrors[field]?.[0];
   }

   function validateAll(): boolean {
      const result = getSchema().safeParse(form);

      if (!result.success) {
         const fieldErrors = result.error.flatten().fieldErrors;

         errors = {
            name: fieldErrors.name?.[0],
            country_id: fieldErrors.country_id?.[0]
         };

         touched = {
            name: true,
            country_id: true
         };

         return false;
      }

      errors = {};

      return true;
   }

   function resetForm() {
      form = { ...initialForm };
      errors = {};
      touched = {};
   }

   const createMutation = useCreateNationalityMutation({
      onSuccess: () => toast.success('Kebangsaan berhasil dibuat'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal membuat kebangsaan'
         );
      }
   });

   const updateMutation = useUpdateNationalityMutation({
      onSuccess: () => toast.success('Kebangsaan berhasil diperbarui'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal memperbarui kebangsaan'
         );
      }
   });

   const isPending = $derived(
      createMutation.isPending || updateMutation.isPending
   );

   function buildRequestBody() {
      return {
         name: form.name,
         country_id: form.country_id
      };
   }

   function submit(onSuccess: () => void): void {
      if (!validateAll()) return;

      const mode = getMode();
      const nationality = getNationality();

      if (mode === 'edit') {
         if (!nationality?.id) return;

         updateMutation.mutate(
            {
               id: nationality.id,
               data: buildRequestBody()
            },
            { onSuccess }
         );
      } else {
         createMutation.mutate(
            buildRequestBody(),
            { onSuccess }
         );
      }
   }

   return {
      get form() {
         return form;
      },

      get errors() {
         return errors;
      },

      get touched() {
         return touched;
      },

      get isPending() {
         return isPending;
      },

      get countries() {
         return countries;
      },

      get isCountryLoading() {
         return isCountryLoading;
      },

      validateField,
      validateAll,
      resetForm,
      submit,

      touchField: (field: keyof FormFields) => {
         touched[field] = true;
      }
   };
}