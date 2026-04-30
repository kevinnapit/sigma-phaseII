<script lang="ts">
	import {
		type ColumnDef,
		type SortingState,
		type VisibilityState,
		type ColumnFiltersState,
		getCoreRowModel,
		type ColumnPinningState
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import type { components } from '$lib/generated/auth/openapi.gen';
	import * as DataTable from '$lib/components/ui/data-table/data-table';
	import SessionRevokeButton from './session-revoke-button.svelte';
	import SessionUserAgent from './session-user-agent.svelte';
	import SessionRevokeConfirmDialog from './session-revoke-confirm-dialog.svelte';
	import { useAllSessionQuery } from '../../queries/useSessionQueries';
	import { formatDateTime } from '$lib/shared/utils';

	type SessionItem = components['schemas']['SessionInfo'];

	// State
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let columnPinning = $state<ColumnPinningState>({});

	const querySession = useAllSessionQuery();

	let confirmOpen = $state(false);
	let selectedSession = $state<SessionItem | null>(null);

	let dataSession = $derived(querySession.data?.data ?? []);

	const handleOpenConfirm = (session: SessionItem) => {
		selectedSession = session;
		confirmOpen = true;
	};

	const columns: ColumnDef<SessionItem>[] = [
		{
			accessorKey: 'user_agent',
			header: 'Agen Pengguna',
			enableSorting: false,
			cell: ({ row }) =>
				renderComponent(SessionUserAgent, {
					user_agent: row.original.user_agent ?? '',
					is_current: row.original.is_current
				})
		},
		{
			accessorFn: (row) => row.created_at,
			header: 'Dibuat Pada',
			enableSorting: false,
			cell: ({ row }) => formatDateTime(row.original.created_at)
		},
		{
			accessorFn: (row) => row.ip_address,
			header: 'Alamat IP',
			enableSorting: false
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) =>
				renderComponent(SessionRevokeButton, {
					session_id: row.original.session_id,
					is_current: row.original.is_current,
					onRevoke: () => handleOpenConfirm(row.original)
				})
		}
	];

	const table = createSvelteTable({
		get data() {
			return dataSession;
		},
		columns,
		state: {
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnPinning() {
				return columnPinning;
			}
		},
		getRowId: (originalRow) => originalRow.session_id,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<DataTable.Root>
	<DataTable.Header title="Daftar Sesi Akun" description="Kelola data sesi akun pengguna" />
	<!-- {#snippet actions()}
			<Button class="bg-red-600 hover:bg-red-700" onclick={() => {}}>
				<ShieldOff class="h-4 w-4" />
				<span>Akhiri Semua Sesi Akun</span>
			</Button>
	{/snippet} -->

	<DataTable.Content {table} isLoading={querySession.isLoading} isError={querySession.isError} />
</DataTable.Root>

{#if selectedSession}
	<SessionRevokeConfirmDialog bind:open={confirmOpen} session={selectedSession} />
{/if}
