<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { onDestroy } from 'svelte';

	export type SessionTerminatedPayload = {
		user_id: string;
		session_ids: string[];
		terminated_at: string;
	};

	let {
		open = $bindable(false),
		payload = null,
		onLogout
	}: {
		open: boolean;
		payload?: SessionTerminatedPayload | null;
		onLogout: () => Promise<void>;
	} = $props();

	let countdown = $state(10);
	let timer: ReturnType<typeof setInterval>;

	$effect(() => {
		if (open) {
			countdown = 10;
			timer = setInterval(() => {
				countdown -= 1;
				if (countdown <= 0) {
					handleLogout();
				}
			}, 1000);
		} else {
			clearInterval(timer);
		}
	});

	onDestroy(() => {
		clearInterval(timer);
	});

	async function handleLogout() {
		clearInterval(timer);
		open = false;
		return await onLogout();
	}

	function parseDate(d: string | undefined) {
		if (!d) return '';
		const date = new Date(d);
		return date.toLocaleString();
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sesi Berakhir</AlertDialog.Title>
			<AlertDialog.Description>
				Sesi login Anda telah dihentikan oleh sistem atau perangkat lain.
				{#if payload}
					{@const parsedDate = parseDate(payload.terminated_at)}
					<div
						class="mt-4 flex flex-col gap-2 rounded-md bg-muted p-4 text-left text-sm text-foreground"
					>
						{#if parsedDate}
							<div><strong>Waktu Berakhir:</strong> {parsedDate}</div>
						{/if}
						<div>
							<strong>ID Sesi Terminated:</strong>
							<span class="break-all">{payload.session_ids.join(', ')}</span>
						</div>
					</div>
				{/if}
				<div class="mt-4 text-center text-lg font-bold text-primary">
					Keluar dalam {countdown} detik...
				</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={handleLogout}>Keluar Sekarang</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
