import { toast } from 'svelte-sonner';
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';

import {
   useCreateUomMutation,
   useUpdateUomMutation
} from '../../queries/useUomMutation.svelte';

import { uomSchema } from '../../schemas/uom.schema';

type GrowthStageRes = components['schemas']['UOMItem'];
type Mode = 'create' | 'edit';

const initialForm = {
   code: '',
   name: ''
};

type FormFields = typeof initialForm;

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function useUomForm(
   getMode: () => Mode,
   getGrowthStage: () => GrowthStageRes | null
) {
   let form = $state<FormFields>({ ...initialForm });
   let errors = $state<FormErrors>({});
   let touched = $state<FormTouched>({});

   $effect(() => {
      const growthStage = getGrowthStage();
      const mode = getMode();

      if (mode === 'edit' && growthStage) {
         form = {
            code: growthStage.code ?? '',
            name: growthStage.name ?? ''
         };

         errors = {};
         touched = {};
      }
   });

   function getSchema() {
      return uomSchema;
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
            name: fieldErrors.name?.[0]
         };

         touched = {
            code: true,
            name: true
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

   const createMutation = useCreateUomMutation({
      onSuccess: () => toast.success('Satuan ukuran berhasil dibuat'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal membuat growth stage'
         );
      }
   });

   const updateMutation = useUpdateUomMutation({
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
         name: form.name
      };
   }

   function submit(onSuccess: () => void): void {
      if (!validateAll()) return;

      const mode = getMode();
      const growthStage = getGrowthStage();

      if (mode === 'edit') {
         if (!growthStage?.id) return;

         updateMutation.mutate(
            {
               id: growthStage.id,
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