// Module Forms
export {
	useCreateModuleForm,
	useUpdateModuleForm,
	type CreateModuleFormValues,
	type UpdateModuleFormValues
} from './useModuleForm';

// Permission Forms
export {
	useCreatePermissionForm,
	useUpdatePermissionForm,
	type CreatePermissionFormValues
} from './usePermissionForm';

// Role Forms
export {
	useCreateRoleForm,
	useToggleRoleModulesForm,
	useToggleRolePermissionForm,
	type CreateRoleFormValues,
	type ToggleRoleModulesFormValues,
	type ToggleRolePermissionFormValues
} from './useRoleForm';

// User Forms
export { useAttachRoleForm, type AttachRoleFormValues } from './useUserForm';
