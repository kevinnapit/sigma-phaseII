import { toast } from 'svelte-sonner';
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { companySchema } from '../../schemas/company.schema';
import { useCreateCompanyMutation, useUpdateCompanyMutation } from '../../queries/useOrganizationMutation.svelte';

type Company = components['schemas']['CompanyItem'];
type Mode = 'create' | 'edit';

const initialForm = {
   code: '',
   name: '',
   is_external: false
};

type FormFields = typeof initialForm;

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function useCompanyForm(
   getMode: () => Mode,
   getCompany: () => Company | null
) {
   let form = $state<FormFields>({ ...initialForm });
   let errors = $state<FormErrors>({});
   let touched = $state<FormTouched>({});

   $effect(() => {
      const company = getCompany();
      const mode = getMode();

      if (mode === 'edit' && company) {
         form = {
            code: company.code ?? '',
            name: company.name ?? '',
            is_external: company.is_external ?? false
         };

         errors = {};
         touched = {};
      }
   });

   function getSchema() {
      return companySchema;
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
            code: fieldErrors.code?.[0],
            name: fieldErrors.name?.[0],
            is_external: fieldErrors.is_external?.[0]
         };

         touched = {
            code: true,
            name: true,
            is_external: true
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

   const createMutation = useCreateCompanyMutation({
      onSuccess: () => toast.success('Perusahaan berhasil dibuat'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal membuat perusahaan'
         );
      }
   });

   const updateMutation = useUpdateCompanyMutation({
      onSuccess: () => toast.success('Perusahaan berhasil diperbarui'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal memperbarui perusahaan'
         );
      }
   });

   const isPending = $derived(
      createMutation.isPending || updateMutation.isPending
   );

   function buildRequestBody() {
      return {
         code: form.code,
         name: form.name,
         is_external: form.is_external
      };
   }

   function submit(onSuccess: () => void): void {
      if (!validateAll()) return;

      const mode = getMode();
      const company = getCompany();

      if (mode === 'edit') {
         if (!company?.id) return;

         updateMutation.mutate(
            {
               id: company.id,
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

      validateField,
      validateAll,
      resetForm,
      submit,

      touchField: (field: keyof FormFields) => {
         touched[field] = true;
      }
   };
}