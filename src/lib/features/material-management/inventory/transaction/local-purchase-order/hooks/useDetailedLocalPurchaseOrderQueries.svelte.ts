import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { env } from '$env/dynamic/public';

// Shape compatible with SearchableCombobox (requires uoid + name)
export interface LPOAccountOption {
	uoid: string; // mapped from account.id
	name: string; // "{code} - {name}"
}

interface RawAccount {
	id: string;
	code: string;
	name: string;
	is_active: boolean;
}

interface RawAccountsResponse {
	data: RawAccount[];
	pagination: { current_page: number; page_size: number; total_items: number; total_pages: number };
}

export const useAccountsQuery = (search: () => string) => {
	const userContext = getUserContext();
	const currentSearch = $derived(search());

	return createQuery(() => ({
		queryKey: ['lpo', 'accounts', currentSearch, userContext.estate?.id],
		queryFn: async (): Promise<LPOAccountOption[]> => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}

			const baseUrl = env.PUBLIC_T2_API_URL || 'https://apisigma.iwkapps.com/admin';
			const params = new URLSearchParams({ page_size: '50' });
			if (currentSearch) params.set('search', currentSearch);

			const response = await fetch(`${baseUrl}/api/functional-admin/accounts/?${params}`, {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${userContext.token}`,
					'X-Estate-ID': userContext.estate.id
				}
			});

			if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

			const json: RawAccountsResponse = await response.json();
			return json.data.map((a) => ({
				uoid: a.id,
				name: `${a.code} - ${a.name}`
			}));
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};
