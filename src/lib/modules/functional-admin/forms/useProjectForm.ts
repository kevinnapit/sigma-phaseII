/**
 * Project form using OpenAPI types and Zod schemas
 */
import { createFormHook } from '$lib/config/forms';
import { CreateProjectRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type CreateProjectFormValues =
	operations['create-project']['requestBody']['content']['application/json'];

const defaultValues: CreateProjectFormValues = {
	admin_unit_id: '',
	code: '',
	name: '',
	project_type_id: '',
	start_date: new Date().toISOString().split('T')[0]
};

/**
 * Create project form hook with Zod validation
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useProjectForm } from '$lib/modules/functional-admin/index.svelte';
 *   import { useCreateProjectMutation } from '$lib/modules/functional-admin';
 *
 *   const form = useProjectForm();
 *   const mutation = useCreateProjectMutation();
 * </script>
 * ```
 */
export const useProjectForm = createFormHook({
	schema: CreateProjectRequestSchema,
	defaultValues
});

export type { CreateProjectFormValues };
