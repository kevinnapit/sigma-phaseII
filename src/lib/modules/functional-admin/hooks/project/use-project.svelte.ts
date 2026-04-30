import { toast } from 'svelte-sonner';
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import { projectSchema } from '../../schemas/project.schema';
import { useAdministrativeUnitListQuery, useCreateProjectMutation, useMasterValueListQuery } from '../../index.svelte';
import { useUpdateProjectMutation } from '../../queries/useProjectMutation.svelte';
import { dateValueToISO } from '$lib/shared/utils/date-validation';
import type { DateValue } from '@internationalized/date';

type ProjectItem = components['schemas']['ProjectItem'];
type UpdateProjectRequest = components['schemas']['UpdateProjectRequest'];

type Mode = 'create' | 'edit';

const initialForm = {
   admin_unit_id: '',
   code: '',
   name: '',
   project_type_id: '',
   end_date: '',
   start_date: '',
};

type FormFields = typeof initialForm;

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function useProjectForm(
   getMode: () => Mode,
   getProject: () => ProjectItem | null
) {
   let form = $state<FormFields>({ ...initialForm });
   let errors = $state<FormErrors>({});
   let touched = $state<FormTouched>({});

   let calendarOpen = $state(false);
   let calendarEndOpen = $state(false);

   let calendarValue = $state<DateValue | undefined>();
   let calendarEndValue = $state<DateValue | undefined>();

   const administrativeUnitsQuery = useAdministrativeUnitListQuery(() => ({
      page: 1,
      page_size: 100
   }));

   const projectTypeQuery = useMasterValueListQuery(() => ({}));

   const adminUnits = $derived(
      administrativeUnitsQuery.data?.data ?? []
   );

   const projectTypes = $derived(
      projectTypeQuery.data?.data ?? []
   );

   const isAdminUnitLoading = $derived(administrativeUnitsQuery.isLoading);
   const isProjectTypeLoading = $derived(projectTypeQuery.isLoading);

   $effect(() => {
      const project = getProject();
      const mode = getMode();

      if (mode === 'edit' && project) {
         form = {
            name: project.name ?? '',
            code: project.code ?? '',
            admin_unit_id: project.administrative_unit?.id ?? '',
            project_type_id: project.project_type?.id ?? '',
            start_date: project.start_date ?? '',
            end_date: project.end_date ?? ''
         };

         errors = {};
         touched = {};
      }
   });

   function getSchema() {
      return projectSchema;
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
            code: fieldErrors.code?.[0],
            admin_unit_id: fieldErrors.admin_unit_id?.[0],
            project_type_id: fieldErrors.project_type_id?.[0],
            start_date: fieldErrors.start_date?.[0],
            end_date: fieldErrors.end_date?.[0]
         };

         touched = {
            name: true,
            code: true,
            admin_unit_id: true,
            project_type_id: true,
            start_date: true,
            end_date: true
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

   const createMutation = useCreateProjectMutation({
      onSuccess: () => toast.success('Proyek berhasil dibuat'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal membuat proyek'
         );
      }
   });

   const updateMutation = useUpdateProjectMutation({
      onSuccess: () => toast.success('Proyek berhasil diperbarui'),

      onError: (error: unknown) => {
         toast.error(
            error instanceof Error
               ? error.message
               : 'Gagal memperbarui proyek'
         );
      }
   });

   const isPending = $derived(
      createMutation.isPending || updateMutation.isPending
   );

   function buildRequestBody(): UpdateProjectRequest {
      return {
         name: form.name,
         code: form.code,
         admin_unit_id: form.admin_unit_id,
         project_type_id: form.project_type_id,
         start_date: form.start_date,
         end_date: form.end_date
      };
   }

   function submit(onSuccess: () => void): void {
      if (!validateAll()) return;

      const mode = getMode();
      const project = getProject();

      if (mode === 'edit') {
         if (!project?.id) return;

         updateMutation.mutate(
            {
               id: project.id,
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

      get adminUnits() {
         return adminUnits;
      },

      get projectTypes() {
         return projectTypes;
      },

      get isAdminUnitLoading() {
         return isAdminUnitLoading;
      },

      get isProjectTypeLoading() {
         return isProjectTypeLoading;
      },

      get calendarOpen() {
         return calendarOpen;
      },

      set calendarOpen(v) {
         calendarOpen = v;
      },

      get calendarEndOpen() {
         return calendarEndOpen;
      },

      set calendarEndOpen(v) {
         calendarEndOpen = v;
      },

      get calendarValue() {
         return calendarValue;
      },

      set calendarValue(v: DateValue | undefined) {
         calendarValue = v;

         if (v) {
            form.start_date = dateValueToISO(v);
         }
      },

      get calendarEndValue() {
         return calendarEndValue;
      },

      set calendarEndValue(v: DateValue | undefined) {
         calendarEndValue = v;

         if (v) {
            form.end_date = dateValueToISO(v);
         }
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