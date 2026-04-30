import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { itemStorageApi } from '../api/item-storage.api';
import { itemStorageKeys } from '../api/item-storage.keys';
import { toast } from 'svelte-sonner';
import type { ItemStorageAssignmentCreatePayload } from '../types/item-storage.types';
export const useCreateItemStorageAssignment = () => {
	const queryClient = useQueryClient();

	let isPending = $state(false);

	const mutation = createMutation(() => ({
		mutationFn: async (payload: ItemStorageAssignmentCreatePayload) => {
			isPending = true;
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageApi.createItemStorageAssignment(payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStorageKeys.lists() });
			toast.success('Penugasan penyimpanan barang berhasil disimpan');
			isPending = false;
		},
		onError: (error: Error) => {
			toast.error(`Gagal menyimpan penugasan: ${error.message}`);
			isPending = false;
		}
	}));

	return {
		get isPending() {
			return isPending;
		},
		mutate: mutation.mutate,
		mutateAsync: mutation.mutateAsync
	};
};
