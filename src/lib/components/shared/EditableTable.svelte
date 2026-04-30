<script lang="ts" generics="T extends Record<string, any>">
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Check, Pencil, Plus, Trash2, X } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Snippet } from 'svelte';

	interface Column {
		key: string;
		label: string;
		align?: 'left' | 'center' | 'right';
	}

	let {
		title,
		description,
		addButtonText = 'Tambah Data',
		data = [],
		columns,
		getRowId,
		onSave,
		onDelete,
		isSaving = false,
		canAdd = true,
		canEdit = true,
		canDelete = true,
		renderCell,
		renderEditCell,
		emptyMessage = 'Tidak ada data. Klik tombol tambah untuk menambah data.'
	}: {
		title: string;
		description?: string;
		addButtonText?: string;
		data: T[];
		columns: Column[];
		getRowId: (item: T) => string;
		onSave: (item: T, isNew: boolean) => Promise<void>;
		onDelete?: (item: T) => Promise<void>;
		isSaving?: boolean;
		canAdd?: boolean;
		canEdit?: boolean;
		canDelete?: boolean;
		renderCell: Snippet<[{ item: T; column: Column }]>;
		renderEditCell: Snippet<
			[{ item: T; column: Column; updateField: (key: string, value: any) => void }]
		>;
		emptyMessage?: string;
	} = $props();

	// State for editing rows
	let editingRowId = $state<string | null>(null);
	let isAddingNew = $state(false);
	let editFormData = $state<T | null>(null);
	let deleteDialogOpen = $state(false);
	let itemToDelete = $state<T | null>(null);

	function handleAddNew() {
		isAddingNew = true;
		editingRowId = null;
		editFormData = {} as T;
	}

	function handleEdit(item: T) {
		const itemId = getRowId(item);
		editingRowId = itemId;
		isAddingNew = false;
		editFormData = { ...item };
	}

	function handleCancel() {
		editingRowId = null;
		isAddingNew = false;
		editFormData = null;
	}

	async function handleSave() {
		if (!editFormData) return;

		try {
			await onSave(editFormData, isAddingNew);
			handleCancel();
		} catch (error) {
			// Error handling is done in parent component
		}
	}

	function handleDeleteClick(item: T) {
		if (onDelete) {
			itemToDelete = item;
			deleteDialogOpen = true;
		} else {
			toast.info('Fitur hapus belum tersedia');
		}
	}

	async function handleDeleteConfirm() {
		if (!itemToDelete || !onDelete) return;

		try {
			await onDelete(itemToDelete);
			deleteDialogOpen = false;
			itemToDelete = null;
		} catch (error) {
			// Error handling is done in parent component
		}
	}

	function handleDeleteCancel() {
		deleteDialogOpen = false;
		itemToDelete = null;
	}

	function updateField(key: string, value: any) {
		if (editFormData) {
			editFormData = { ...editFormData, [key]: value };
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<Card.Title>{title}</Card.Title>
				{#if description}
					<Card.Description>{description}</Card.Description>
				{/if}
			</div>
			<div class="flex gap-2">
				{#if canAdd}
					<Button
						variant="outline"
						size="sm"
						onclick={handleAddNew}
						disabled={isAddingNew || editingRowId !== null || isSaving}
					>
						<Plus class="mr-2 h-4 w-4" />
						{addButtonText}
					</Button>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		{#if data.length > 0 || isAddingNew}
			<div class="rounded-md">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							{#each columns as column}
								<Table.Head
									class={column.align === 'right'
										? 'text-right'
										: column.align === 'center'
											? 'text-center'
											: ''}
								>
									{column.label}
								</Table.Head>
							{/each}
							<Table.Head class="w-[100px] text-center">Aksi</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data as item, index (getRowId(item) || `item-${index}`)}
							{@const itemId = getRowId(item)}
							{@const isEditing = editingRowId === itemId}
							<Table.Row>
								{#if isEditing && editFormData}
									<!-- Edit Mode -->
									{#each columns as column}
										<Table.Cell>
											{@render renderEditCell({ item: editFormData, column, updateField })}
										</Table.Cell>
									{/each}
									<Table.Cell>
										<div class="flex items-center justify-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												onclick={handleCancel}
												disabled={isSaving}
											>
												<X class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8 text-green-600 hover:text-green-700"
												onclick={handleSave}
												disabled={isSaving}
											>
												{#if isSaving}
													<span class="text-xs">...</span>
												{:else}
													<Check class="h-4 w-4" />
												{/if}
											</Button>
										</div>
									</Table.Cell>
								{:else}
									<!-- View Mode -->
									{#each columns as column}
										<Table.Cell
											class={column.align === 'right'
												? 'text-right'
												: column.align === 'center'
													? 'text-center'
													: ''}
										>
											{@render renderCell({ item, column })}
										</Table.Cell>
									{/each}
									<Table.Cell>
										<div class="flex items-center justify-center gap-1">
											{#if canEdit}
												<Button
													variant="ghost"
													size="icon"
													class="h-8 w-8"
													onclick={() => handleEdit(item)}
													disabled={isAddingNew || editingRowId !== null || isSaving}
												>
													<Pencil class="h-4 w-4" />
												</Button>
											{/if}
											{#if canDelete}
												<Button
													variant="ghost"
													size="icon"
													class="h-8 w-8 text-red-600 hover:text-red-700"
													onclick={() => handleDeleteClick(item)}
													disabled={!onDelete || isAddingNew || editingRowId !== null || isSaving}
												>
													<Trash2 class="h-4 w-4" />
												</Button>
											{/if}
										</div>
									</Table.Cell>
								{/if}
							</Table.Row>
						{/each}

						{#if isAddingNew && editFormData}
							<!-- Add New Row -->
							<Table.Row>
								{#each columns as column}
									<Table.Cell>
										{@render renderEditCell({ item: editFormData, column, updateField })}
									</Table.Cell>
								{/each}
								<Table.Cell>
									<div class="flex items-center justify-center gap-1">
										<Button
											variant="ghost"
											size="icon"
											class="h-8 w-8"
											onclick={handleCancel}
											disabled={isSaving}
										>
											<X class="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											class="h-8 w-8 text-green-600 hover:text-green-700"
											onclick={handleSave}
											disabled={isSaving}
										>
											{#if isSaving}
												<span class="text-xs">...</span>
											{:else}
												<Check class="h-4 w-4" />
											{/if}
										</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</div>

			<div class="mt-4 text-sm text-gray-500">
				Total: {data.length} data
			</div>
		{:else}
			<div class="flex items-center justify-center py-12">
				<p class="text-gray-500">{emptyMessage}</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Hapus Data</AlertDialog.Title>
			<AlertDialog.Description>
				Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={handleDeleteCancel}>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleDeleteConfirm}
				disabled={isSaving}
				class="bg-red-600 hover:bg-red-700"
			>
				{isSaving ? 'Menghapus...' : 'Hapus'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
