<!-- lib/components/auth/auth-guard.svelte -->
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

	// By the time this guard's onMount fires, the auth-provider has
	// already settled (it gates its children behind {#if userCtx.settled}).
	// So this check is always reading finalized state — no race condition.
	onMount(() => {
		if (!userCtx.user) {
			goto(resolve(AuthConfig.UNAUTHENTICATED_REDIRECT));
			return; // leave allowed = false so the guard keeps blocking
		}
		allowed = true;
	});
</script>

{#if !allowed}
	<LoadingScreen />
{:else}
	{@render children?.()}
{/if}
