import { toast } from 'svelte-sonner';
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { useCreateGroupMutation, useUpdateGroupMutation } from '../../queries/useOrganizationMutation.svelte';
import { groupSchema } from '../../schemas/group.schema';
import { useCompanyListQuery } from '../../index.svelte';

type GroupRes = components['schemas']['GroupItem'];
type Mode = 'create' | 'edit';

const initialForm = {
   code: '',
   name: '',
   company_id: ''
};

type FormFields = typeof initialForm;

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function useGroupForm(
   getMode: () => Mode,
   getGroup: () => GroupRes | null
) {
   let form = $state<FormFields>({ ...initialForm });
   let errors = $state<FormErrors>({});
   let touched = $state<FormTouched>({});

   $effect(() => {
      const group = getGroup();
      const mode = getMode();

      if (mode === 'edit' && group) {
         form = {
            code: group.code ?? '',
            name: group.name ?? '',
            company_id: group.company.id ?? ''
         };

         errors = {};
         touched = {};
      }
   });

   function getSchema() {
      return groupSchema;
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
            company_id: fieldErrors.company_id?.[0]
         };

         touched = {
            code: true,
            name: true,
            company_id: true
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

   // Company List Query
   const companyListQuery = useCompanyListQuery(() => ({}));
   const companyList = $derived(companyListQuery.data?.data ?? []);
   const companyListLoading = $derived(companyListQuery.isLoading);

   const createMutation = useCreateGroupMutation({
      onSuccess: () => toast.success('Satuan ukuran berhasil dibuat'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal membuat growth stage'
         );
      }
   });

   const updateMutation = useUpdateGroupMutation({
      onSuccess: () => toast.success('Satuan ukuran berhasil diperbarui'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal memperbarui satuan ukuran'
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
         company_id: form.company_id
      };
   }

   function submit(onSuccess: () => void): void {
      if (!validateAll()) return;

      const mode = getMode();
      const group = getGroup();

      if (mode === 'edit') {
         if (!group?.id) return;

         updateMutation.mutate(
            {
               id: group.id,
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

      get companyList() {
         return companyList;
      },

      get companyListLoading() {
         return companyListLoading;
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