// Query Keys
export { systemAdminKeys } from './keys';

// Module Queries & Mutations
export { useModuleTreeQuery } from './queries/useModuleTreeQuery.svelte';
export {
	useCreateModuleMutation,
	useUpdateModuleMutation,
	useDeleteModuleMutation
} from './queries/useModuleMutation.svelte';

// Permission Queries & Mutations
export {
	usePermissionListQuery,
	type PermissionListParams
} from './queries/usePermissionListQuery.svelte';
export {
	useCreatePermissionMutation,
	useUpdatePermissionMutation,
	useDeletePermissionMutation
} from './queries/usePermissionMutation.svelte';

// Role Queries & Mutations
export { useRoleListQuery } from './queries/useRoleListQuery.svelte';
export { useRoleDetailQuery } from './queries/useRoleDetailQuery.svelte';
export {
	useCreateRoleMutation,
	useToggleRoleModulesMutation,
	useToggleRolePermissionMutation
} from './queries/useRoleMutation.svelte';

// User Queries & Mutations
export { useUserListQuery, type UserListParams } from './queries/useUserListQuery.svelte';
export { useUserDetailQuery } from './queries/useUserDetailQuery.svelte';
export { useAttachRoleMutation } from './queries/useUserMutation.svelte';

// Forms
export {
	useCreateModuleForm,
	useUpdateModuleForm,
	type CreateModuleFormValues,
	type UpdateModuleFormValues
} from './forms/useModuleForm';
export {
	useCreatePermissionForm,
	useUpdatePermissionForm,
	type CreatePermissionFormValues
} from './forms/usePermissionForm';
export {
	useCreateRoleForm,
	useToggleRoleModulesForm,
	useToggleRolePermissionForm,
	type CreateRoleFormValues,
	type ToggleRoleModulesFormValues,
	type ToggleRolePermissionFormValues
} from './forms/useRoleForm';
export { useAttachRoleForm, type AttachRoleFormValues } from './forms/useUserForm';
