/**
 * User form using OpenAPI types and Zod schemas
 */
import { createFormHook } from '$lib/config/forms';
import { AttachRoleRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Attach Role Form
type AttachRoleFormValues =
	operations['attach-role-to-user']['requestBody']['content']['application/json'];

const defaultValues: AttachRoleFormValues = {
	role_id: 0,
	user_id: ''
};

/**
 * Attach role to user form hook
 */
export const useAttachRoleForm = createFormHook({
	schema: AttachRoleRequestSchema,
	defaultValues
});

export type { AttachRoleFormValues };
