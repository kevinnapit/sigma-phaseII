/* eslint-disable @typescript-eslint/no-unused-vars */
import { browser, dev } from '$app/environment';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { AuthConfig } from '$lib/modules/auth/config/auth-config';
import type { UserContext } from '$lib/modules/auth/context/user.svelte';
import { checkIsAPIError } from '$lib/shared/utils/error-handler';
import { QueryCache, QueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';

export async function handleUnauthorized(userCtx: UserContext) {
	toast.error('Anda tidak memiliki akses');
	// await userCtx.clear();
	// goto(resolve(AuthConfig.UNAUTHENTICATED_REDIRECT));
}

export const createQueryClient = (userCtx: UserContext) =>
	new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				if (checkIsAPIError(error) && AuthConfig.isUnauthenticatedStatus(error.status ?? 0)) {
					handleUnauthorized(userCtx);
				}
			}
		}),
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000,
				gcTime: 10 * 60 * 1000,
				refetchOnWindowFocus: dev,
				enabled: browser,
				networkMode: 'online',
				refetchOnMount: 'always',
				retry: (failureCount, error: unknown) => {
					if (!checkIsAPIError(error)) return failureCount < 1;
					if (AuthConfig.isUnauthenticatedStatus(error.status ?? 0)) return false;
					// One retry for transient network errors / 500s.
					if (error.status === AuthConfig.TOKEN_EXPIRED_STATUS) return false;
					// One retry for transient errors (network blip, 500)
					return failureCount < 1;
				},
				retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000)
			},
			mutations: {
				retry: (failureCount, error: unknown) => {
					if (!checkIsAPIError(error)) return false;
					if (AuthConfig.isUnauthenticatedStatus(error.status ?? 0)) {
						handleUnauthorized(userCtx);
						return false;
					}
					return false;
				}
			}
		}
	});
