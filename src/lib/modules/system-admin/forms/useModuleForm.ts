/**
 * Module form using OpenAPI types and Zod schemas
 */
import { createFormHook, createEditFormHook } from '$lib/config/forms';
import {
	CreateModuleRequestSchema,
	UpdateModuleRequestSchema
} from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Create Module Form
type CreateModuleFormValues =
	operations['create-module']['requestBody']['content']['application/json'];

const createModuleDefaultValues: CreateModuleFormValues = {
	description: '',
	is_active: true,
	name: '',
	slug: '',
	icon: 'house',
	kind: 'module',
	path_name: ''
};

/**
 * Create module form hook with Zod validation
 */
export const useCreateModuleForm = createFormHook({
	schema: CreateModuleRequestSchema,
	defaultValues: createModuleDefaultValues
});

// Update Module Form
type UpdateModuleFormValues =
	operations['update-module']['requestBody']['content']['application/json'];

const updateModuleDefaultValues: UpdateModuleFormValues = {
	description: '',
	is_active: true,
	name: '',
	slug: ''
};

/**
 * Update module form hook with ID tracking
 */
export const useUpdateModuleForm = createEditFormHook<typeof UpdateModuleRequestSchema, number>({
	schema: UpdateModuleRequestSchema,
	defaultValues: updateModuleDefaultValues
});

export type { CreateModuleFormValues, UpdateModuleFormValues };
