<script lang="ts">
	// import { goto } from '$app/navigation';
	// import { resolve } from '$app/paths';
	// import { env } from '$env/static/public';
	import LoadingScreen from '$lib/components/layout/loading-screen.svelte';
	import { UserContext } from '$lib/modules/auth/context/user.svelte';
	import { queryOptions, useQueryClient } from '@tanstack/svelte-query';
	import { onMount, type Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { AuthConfig } from '../config/auth-config';

	// ── Props ──────────────────────────────────────────────────────────────
	type ErrorModel = AuthSchemas['ErrorModel'];
	interface Props {
		children: Snippet;
		userCtx: UserContext;
	}
	let { children, userCtx }: Props = $props();

	const queryClient = useQueryClient();

	// ── Query ──────────────────────────────────────────────────────────────
	// `enabled: false` — we trigger this manually in settle() rather than
	// letting TanStack Query auto-fetch on mount, because we need to control
	// the exact moment it runs (after hydration, after token checks).
	const currentUserQuery = queryOptions({
		queryKey: ['user:current'],
		queryFn: async () => {
			const { data, error } = await userCtx.authClient().GET('/api/auth/info');
			// Throw so TanStack Query registers this as a failed query and
			// we can catch it in one place in settle() below.
			if (error) throw error;
			return data;
		},
		staleTime: 1000 * 60 * 50,
		gcTime: 1000 * 60 * 50,
		retry: false,
		enabled: false
	});

	// ── Token refresh ──────────────────────────────────────────────────────
	type RefreshResult =
		| { ok: true; token: string; refreshToken: string }
		| { ok: false; reason: 'unauthorized' | 'server_error' };

	async function tryRefreshToken(refreshToken: string): Promise<RefreshResult> {
		const { data, error } = await userCtx
			.authClient()
			.POST('/api/auth/refresh', { headers: { refresh_token: refreshToken } });

		if (error) {
			if (error.status === 401) return { ok: false, reason: 'unauthorized' };
			console.error('[AUTH] Token refresh failed:', error);
			toast.error(error.detail ?? error.title ?? 'Failed to refresh session');
			return { ok: false, reason: 'server_error' };
		}

		return {
			ok: true,
			token: data?.data?.access_token ?? '',
			refreshToken: data?.data?.refresh_token ?? ''
		};
	}

	// ── Settle ─────────────────────────────────────────────────────────────
	// The single async flow that runs once on mount:
	//   1. Hydrate in-memory state from storage
	//   2. If no credentials exist → guest, mark settled and stop
	//   3. Fetch /api/auth/info with the stored token
	//   4. If token expired → attempt refresh → retry fetch
	//   5. On success → write user to context
	//   6. always → markSettled() so children (including auth-guard) unblock
	//
	// Redirect on success is intentionally NOT done here.
	// The auth-guard in /dashboard layout owns redirect logic.
	async function settle() {
		// Step 1 — load tokens and estate from storage into memory
		await userCtx.hydrate();

		// Bypassing login for GitHub Pages deployment
		const mockUser = {
			id: '1',
			username: 'admin',
			email: 'admin@sigma.com',
			name: 'Admin',
			role: { id: 'admin', name: 'Administrator' },
			modules: [
				{
					id: 1,
					name: 'Material Management',
					slug: 'material-management',
					path_name: '/dashboard/material-management',
					kind: 'module',
					children: [
						{
							id: 2,
							name: 'Inventory',
							slug: 'inventory',
							path_name: '/dashboard/material-management/inventory',
							kind: 'module',
							children: [
								{
									id: 3,
									name: 'Master',
									slug: 'master',
									path_name: '/dashboard/material-management/inventory/master',
									kind: 'group',
									children: []
								},
								{
									id: 4,
									name: 'Transaction',
									slug: 'transaction',
									path_name: '/dashboard/material-management/inventory/transaction',
									kind: 'group',
									children: []
								}
							]
						}
					]
				}
			]
		} as any;

		await userCtx.setUser({ user: mockUser }, 'mocked-token', 'mocked-refresh-token');
		userCtx.markSettled();
		return;
	}

	async function finalizeAuth(user: AuthSchemas['User']) {
		if (!userCtx.validateUser(user)) return;
		await userCtx.setUser(
			{ user, estate: userCtx.estate },
			userCtx.token ?? '',
			userCtx.refreshToken ?? ''
		);
	}

	// ── Mount ──────────────────────────────────────────────────────────────
	// onMount is browser-only and fire-once — the correct primitive for
	// a one-shot async initialization that should never re-run reactively.
	onMount(() => {
		settle();
	});
</script>

<!--
    Gate the entire app tree behind settled.
    By the time any child component mounts, userCtx.settled is guaranteed true,
    so the auth-guard's onMount check is always reading finalized state.
-->
{#if !userCtx.settled}
	<LoadingScreen />
{:else}
	{@render children?.()}
{/if}
