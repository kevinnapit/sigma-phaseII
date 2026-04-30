/**
 * Role form using OpenAPI types and Zod schemas
 */
import { createFormHook } from '$lib/config/forms';
import {
	CreateRoleRequestSchema,
	ToggleRoleModulesRequestSchema,
	ToggleRolePermissionRequestSchema
} from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Create Role Form
type CreateRoleFormValues = operations['create-role']['requestBody']['content']['application/json'];

const createRoleDefaultValues: CreateRoleFormValues = {
	description: '',
	parent_id: 1,
	name: ''
};

/**
 * Create role form hook with Zod validation
 */
export const useCreateRoleForm = createFormHook({
	schema: CreateRoleRequestSchema,
	defaultValues: createRoleDefaultValues
});

// Toggle Role Modules Form
type ToggleRoleModulesFormValues =
	operations['toggle-role-modules']['requestBody']['content']['application/json'];

const toggleModulesDefaultValues: ToggleRoleModulesFormValues = {
	module_ids: [],
	role_id: 0
};

/**
 * Toggle role modules form hook
 */
export const useToggleRoleModulesForm = createFormHook({
	schema: ToggleRoleModulesRequestSchema,
	defaultValues: toggleModulesDefaultValues
});

// Toggle Role Permission Form
type ToggleRolePermissionFormValues =
	operations['toggle-role-permission']['requestBody']['content']['application/json'];

const togglePermissionDefaultValues: ToggleRolePermissionFormValues = {
	permission_ids: [],
	role_id: 0
};

/**
 * Toggle role permission form hook
 */
export const useToggleRolePermissionForm = createFormHook({
	schema: ToggleRolePermissionRequestSchema,
	defaultValues: togglePermissionDefaultValues
});

export type { CreateRoleFormValues, ToggleRoleModulesFormValues, ToggleRolePermissionFormValues };
