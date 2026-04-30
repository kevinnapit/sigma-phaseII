import { toast } from 'svelte-sonner';
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { useCompanyListQuery } from '../../index.svelte';
import { cropSchema } from '../../schemas/crop.schema';
import { useCreateCropMutation, useUpdateCropMutation } from '../../queries/useCropMutation.svelte';

type Crop = components['schemas']['CropItem'];
type Mode = 'create' | 'edit';

const initialForm = {
   code: 0,
   value: '',
};

type FormFields = typeof initialForm;

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function useCropForm(
   getMode: () => Mode,
   getCrop: () => Crop | null
) {
   let form = $state<FormFields>({ ...initialForm });
   let errors = $state<FormErrors>({});
   let touched = $state<FormTouched>({});

   $effect(() => {
      const crop = getCrop();
      const mode = getMode();

      if (mode === 'edit' && crop) {
         form = {
            code: crop.code ?? 0,
            value: crop.value ?? '',
         };

         errors = {};
         touched = {};
      }
   });

   function getSchema() {
      return cropSchema;
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
            value: fieldErrors.value?.[0],
         };

         touched = {
            code: true,
            value: true,
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

   const createMutation = useCreateCropMutation({
      onSuccess: () => toast.success('Data panenan berhasil dibuat'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal membuat data panenan'
         );
      }
   });

   const updateMutation = useUpdateCropMutation({
      onSuccess: () => toast.success('Data panenan berhasil diperbarui'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal memperbarui data panenan'
         );
      }
   });

   const isPending = $derived(
      createMutation.isPending || updateMutation.isPending
   );

   function buildRequestBody() {
      return {
         code: form.code,
         value: form.value,
      };
   }

   function submit(onSuccess: () => void): void {
      if (!validateAll()) return;

      const mode = getMode();
      const crop = getCrop();

      if (mode === 'edit') {
         if (!crop?.id) return;

         updateMutation.mutate(
            {
               id: crop.id,
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