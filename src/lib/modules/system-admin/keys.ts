/**
 * Query keys for system-admin module
 * All keys are stable, namespaced, and array-based
 * Parameter types are derived from OpenAPI spec
 */
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export const systemAdminKeys = {
	all: ['system-admin'] as const,

	// Modules
	modules: () => [...systemAdminKeys.all, 'modules'] as const,
	moduleTree: () => [...systemAdminKeys.modules(), 'tree'] as const,

	// Permissions
	permissions: () => [...systemAdminKeys.all, 'permissions'] as const,
	permissionList: (params?: operations['list-permissions']['parameters']['query']) =>
		[...systemAdminKeys.permissions(), 'list', params] as const,
	permissionsAll: () => [...systemAdminKeys.permissions(), 'all'] as const,

	// Roles
	roles: () => [...systemAdminKeys.all, 'roles'] as const,
	roleList: () => [...systemAdminKeys.roles(), 'list'] as const,
	roleDetail: (id: operations['get-role-with-modules']['parameters']['path']['id']) =>
		[...systemAdminKeys.roles(), 'detail', id] as const,

	// Users
	users: () => [...systemAdminKeys.all, 'users'] as const,
	userList: (params?: operations['list-users']['parameters']['query']) =>
		[...systemAdminKeys.users(), 'list', params] as const,
	userDetail: (userId: operations['get-user-details']['parameters']['path']['userId']) =>
		[...systemAdminKeys.users(), 'detail', userId] as const,
	contexts: () => [...systemAdminKeys.all, 'contexts'] as const,
	contextList: (params?: operations['get-context-lists']['parameters']['query']) =>
		[...systemAdminKeys.contexts(), 'list', params] as const,
	contextDetail: (params: operations['find-context-by-id']['parameters']['path']) =>
		[...systemAdminKeys.contexts(), 'detail', params] as const,
	contextEntities: (params: operations['find-context-by-id-with-entities']['parameters']['path']) =>
		[...systemAdminKeys.contexts(), 'entities', params] as const,
	entities: () => [...systemAdminKeys.all, 'entities'] as const,
	entityList: (params: operations['get-entity-lists']['parameters']['query']) =>
		[...systemAdminKeys.entities(), 'list', params] as const,
	entityDetail: (params: operations['find-entity-by-id']['parameters']['path']) =>
		[...systemAdminKeys.entities(), 'detail', params] as const
};
