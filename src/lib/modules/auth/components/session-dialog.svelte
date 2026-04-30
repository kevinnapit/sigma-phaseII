<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	export type SessionCreatedPayload = {
		user_id: string;
		session_id: string;
		ip_address: string;
		user_agent: string;
		created_at: string;
	};

	let {
		open = $bindable(false),
		payload,
		onAllow,
		onReject
	}: {
		open: boolean;
		payload: SessionCreatedPayload | null;
		onAllow?: () => void;
		onReject?: (session: SessionCreatedPayload) => void;
	} = $props();

	function handleAllow() {
		if (onAllow) onAllow();
		open = false;
	}

	function handleReject() {
		if (onReject && payload) onReject(payload);
		open = false;
	}
	function parseDate(d: string) {
		if (!d) return '';
		const date = new Date(d);
		return date.toLocaleString();
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Terdapat Login Baru</AlertDialog.Title>
			<AlertDialog.Description>
				Kami mendeteksi adanya sesi login baru pada akun Anda.
				{#if payload}
					{@const parsedDate = parseDate(payload.created_at)}
					<div
						class="mt-4 flex flex-col gap-2 rounded-md bg-muted p-4 text-left text-sm text-foreground"
					>
						{#if parsedDate}
							<div><strong>Waktu:</strong> {parsedDate}</div>
						{/if}
						<div><strong>IP Address:</strong> {payload.ip_address}</div>
						<div><strong>User Agent:</strong> {payload.user_agent}</div>
					</div>
				{/if}
				<div class="mt-4">Apakah Anda mengenali aktivitas login ini?</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleReject}>Tolak Sesi</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleAllow}>Ya, Izinkan</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
