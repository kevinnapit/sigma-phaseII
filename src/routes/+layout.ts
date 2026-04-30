import { createQueryClient } from '$lib/config/queries/query-client.svelte';
import { UserContext } from '$lib/modules/auth/context/user.svelte';
import { LocalStorageAuthStorage } from '$lib/modules/auth/storage/auth-storage';
import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = false;
export const csr = true;

export const load: LayoutLoad = async ({ depends }) => {
	depends('user:current');
	const storage = new LocalStorageAuthStorage();
	const authClient = new UserContext(storage);
	const queryClient = createQueryClient(authClient);

	return { auth: authClient, queryClient };
};
