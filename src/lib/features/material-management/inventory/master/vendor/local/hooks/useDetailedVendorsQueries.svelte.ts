import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { env } from '$env/dynamic/public';

/**
 * Branch types
 */
export interface Bank {
	uoid: string;
	version: number;
	code: string;
	name: string;
}

export interface Branch {
	uoid: string;
	version: number;
	code: string;
	name: string;
	bank_id: string;
	bank: Bank;
}

export interface BranchListResponse {
	$schema?: string;
	data: Branch[];
	errors?: string;
}

/**
 * Account by Group ID types
 */
export interface AccountGroup {
	id: string;
	code: string;
	name: string;
	level: number;
}

export interface AccountType {
	id: string;
	code: string;
	name: string;
}

export interface AccountItem {
	id: string;
	code: string;
	name: string;
	is_active: boolean;
	is_reconciliation_account: boolean;
	group: AccountGroup;
	account_type: AccountType;
}

export interface AccountByGroupIdResponse {
	$schema?: string;
	data: AccountItem[];
}

/**
 * Hook to fetch branches
 */
export const useBranchQuery = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: ['branches', userContext.estate?.id],
		queryFn: async (): Promise<BranchListResponse> => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}

			const baseUrl = env.PUBLIC_PRS_API_URL || 'https://apisigma.iwkapps.com/prs';

			const response = await fetch(`${baseUrl}/api/branches`, {
				method: 'GET',
				headers: {
					Accept: '*/*',
					Authorization: `Bearer ${userContext.token}`,
					'X-Estate-Selection': userContext.estate?.id || ''
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return response.json();
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Account by Module Name types
 */
export interface AccountByModuleNamePagination {
	current_page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

export interface AccountByModuleNameResponse {
	$schema?: string;
	data: AccountItem[];
	pagination: AccountByModuleNamePagination;
}

/**
 * Hook for reading accounts by group ID
 */
export const useAccountByGroupId = (groupId: string) => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: ['accounts', 'by-group-id', groupId],
		queryFn: async (): Promise<AccountByGroupIdResponse> => {
			if (!userContext.token) {
				throw new Error('No authentication token available');
			}

			const baseUrl = env.PUBLIC_T2_API_URL || 'https://apisigma.iwkapps.com/admin';

			const response = await fetch(
				`${baseUrl}/api/functional-admin/accounts/by-group-id/${groupId}`,
				{
					method: 'GET',
					headers: {
						Accept: '*/*',
						Authorization: `Bearer ${userContext.token}`
					}
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return response.json();
		},
		enabled: !!userContext.token && !!groupId
	}));
};

/**
 * Hook for reading accounts by module name
 */
export const useAccountByModuleName = (moduleName: string) => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: ['accounts', 'by-module-name', moduleName, userContext.estate?.id],
		queryFn: async (): Promise<AccountByModuleNameResponse> => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			const baseUrl = env.PUBLIC_T2_API_URL || 'https://apisigma.iwkapps.com/admin';

			const response = await fetch(
				`${baseUrl}/api/functional-admin/accounts/by-module-name/${moduleName}?module_name=${moduleName}&page_size=100`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${userContext.token}`,
						'X-Estate-ID': userContext.estate.id
					}
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return response.json();
		},
		enabled: !!userContext.token && !!userContext.estate?.id && !!moduleName
	}));
};

/**
 * All Accounts response types
 */
export interface AllAccountsResponse {
	$schema?: string;
	data: AccountItem[];
	pagination: AccountByModuleNamePagination;
}

/**
 * Hook for reading all accounts with optional search
 */
export const useAllAccountsQuery = (search: () => string = () => '') => {
	const userContext = getUserContext();
	const currentSearch = $derived(search());

	return createQuery(() => ({
		queryKey: ['accounts', 'all', userContext.estate?.id, currentSearch],
		queryFn: async (): Promise<AllAccountsResponse> => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			const baseUrl = env.PUBLIC_T2_API_URL || 'https://apisigma.iwkapps.com/admin';
			const params = new URLSearchParams({ page_size: '100' });
			if (currentSearch) params.set('search', currentSearch);

			const response = await fetch(`${baseUrl}/api/functional-admin/accounts/?${params}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${userContext.token}`,
					'X-Estate-ID': userContext.estate.id
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return response.json();
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
