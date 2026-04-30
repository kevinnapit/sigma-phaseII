<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { toast } from 'svelte-sonner';
	import type { UserContext } from '../context/user.svelte';
	import SessionTerminatedDialog, {
		type SessionTerminatedPayload
	} from './session-terminated-dialog.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { AuthConfig } from '../config/auth-config';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { getMenuContext } from '$lib/config/menus/menu-state.svelte';

	// Type for session created event (kept for event parsing)
	type SessionCreatedPayload = {
		user_id: string;
		session_id: string;
		ip_address: string;
		user_agent: string;
		created_at: string;
	};

	interface Props {
		userCtx: UserContext;
	}

	let { userCtx }: Props = $props();

	const endpoint = `${env.PUBLIC_AUTH_API_URL}/api/auth/events`;

	let terminatedAlertOpen = $state(false);
	let terminatedPayload = $state<SessionTerminatedPayload | null>(null);

	const queryClient = useQueryClient();
	const menuContext = getMenuContext();

	$effect(() => {
		if (!userCtx.token) return;

		const url = new URL(endpoint);
		url.searchParams.set('token', userCtx.token);

		const eventSource = new EventSource(url.toString());

		eventSource.addEventListener('session_created', (event) => {
			try {
				const payload = JSON.parse(event.data) as SessionCreatedPayload;
				console.log('[SSE] session_created:', payload);
				// Auto-allow new sessions without showing dialog
				console.log('[SSE] session auto-allowed');
				toast.info('Sesi login baru terdeteksi dan diizinkan', { duration: 2000 });
			} catch (err) {
				console.error('[SSE] Failed to parse session_created payload:', err);
			}
		});

		eventSource.addEventListener('terminated_session', (event) => {
			console.log('[SSE] terminated_session event received');
			try {
				const payload = JSON.parse(event.data) as SessionTerminatedPayload;
				terminatedPayload = payload;
			} catch (err) {
				console.error('[SSE] Failed to parse terminated_session payload:', err);
			}
			terminatedAlertOpen = true;
		});

		eventSource.onerror = (err) => {
			console.error('[SSE] EventSource error:', err);
		};

		return () => {
			eventSource.close();
		};
	});

	async function handleLogout() {
		await goto(resolve(AuthConfig.UNAUTHENTICATED_REDIRECT));
		window.location.reload();
		queryClient.clear();
		await menuContext().persistor.clearRecent();
		await userCtx.clear();
	}
</script>

<SessionTerminatedDialog
	bind:open={terminatedAlertOpen}
	payload={terminatedPayload}
	onLogout={handleLogout}
/>
