/**
 * Permission form using OpenAPI types and Zod schemas
 */
import { createFormHook, createEditFormHook } from '$lib/config/forms';
import { CreatePermissionRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Create Permission Form
type CreatePermissionFormValues =
	operations['create-permission']['requestBody']['content']['application/json'];

const defaultValues: CreatePermissionFormValues = {
	description: '',
	module_id: 0,
	name: '',
	slug: ''
};

/**
 * Create permission form hook with Zod validation
 */
export const useCreatePermissionForm = createFormHook({
	schema: CreatePermissionRequestSchema,
	defaultValues
});

/**
 * Update permission form hook with ID tracking
 * Uses same schema as create
 */
export const useUpdatePermissionForm = createEditFormHook<
	typeof CreatePermissionRequestSchema,
	number
>({
	schema: CreatePermissionRequestSchema,
	defaultValues
});

export type { CreatePermissionFormValues };
