<!-- lib/components/auth/guest-guard.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import LoadingScreen from '$lib/components/layout/loading-screen.svelte';
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { AuthConfig } from '../config/auth-config';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();

	const userCtx = getUserContext();
	let allowed = $state(false);

	// Mirror of auth-guard, inverted:
	// auth-guard  → blocks unauthenticated users, redirects to /
	// guest-guard → blocks authenticated users,   redirects to /dashboard
	//
	// Same guarantee applies: by the time this onMount fires, the
	// auth-provider has already settled, so userCtx.user is finalized.
	onMount(() => {
		if (userCtx.user) {
			goto(resolve(AuthConfig.AUTHENTICATED_REDIRECT));
			return; // leave allowed = false so the page never flashes
		}
		allowed = true;
	});
</script>

{#if !allowed}
	<LoadingScreen />
{:else}
	{@render children?.()}
{/if}
