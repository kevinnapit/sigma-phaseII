<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	interface Props {
		open?: boolean;
		isPending?: boolean;
		onConfirm?: () => void;
		onCancel?: () => void;
	}

	let { open = $bindable(false), isPending = false, onConfirm, onCancel }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Konfirmasi Simpan Penugasan</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menyimpan penugasan penyimpanan barang ini?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				onclick={() => {
					onCancel?.();
					open = false;
				}}
				disabled={isPending}
			>
				Batal
			</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => {
					onConfirm?.();
				}}
				disabled={isPending}
				class="bg-[#0f4c2a] hover:bg-[#0d4023]"
			>
				{isPending ? 'Menyimpan...' : 'Ya, Simpan'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
