<script lang="ts">
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';
	import type { Snippet } from 'svelte';

	const authCtx = getUserContext();

	interface Props {
		permissions: Parameters<typeof authCtx.hasPermission>[0];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onRejected?: () => MaybePromise<any>;
		rejected?: Snippet;
		children: Snippet;
	}
	let { permissions, onRejected, rejected, children }: Props = $props();
	let hasPermissions = $derived(authCtx.hasPermission(permissions));
	$effect.pre(() => {
		hasPermissions = authCtx.hasPermission(permissions);
		if (!hasPermissions) onRejected?.();
	});
</script>

{#if hasPermissions}
	{@render children()}
{:else}
	{@render rejected?.()}
{/if}
