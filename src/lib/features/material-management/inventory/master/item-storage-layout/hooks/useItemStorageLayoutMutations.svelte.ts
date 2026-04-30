import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { itemStorageLayoutApi } from '../api/item-storage-layout.api';
import { itemStorageLayoutKeys } from '../api/item-storage-layout.keys';
import { toast } from 'svelte-sonner';
import type {
	ItemStorageLayoutCreateRequest,
	ItemStorageLayoutUpdateRequest
} from '../types/item-storage-layout.types';

/**
 * Hook for creating item storage layout
 */
export const useCreateItemStorageLayout = () => {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (payload: ItemStorageLayoutCreateRequest) => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageLayoutApi.createItemStorageLayout(payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.lists() });
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.stats() });
			toast.success('Rak penyimpanan berhasil dibuat');
		},
		onError: (error: Error) => {
			toast.error(`Gagal membuat rak penyimpanan: ${error.message}`);
		}
	}));
};

/**
 * Hook for updating item storage layout
 */
export const useUpdateItemStorageLayout = () => {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({ uoid, payload }: { uoid: string; payload: ItemStorageLayoutUpdateRequest }) => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageLayoutApi.updateItemStorageLayout(uoid, payload, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.lists() });
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.detail(variables.uoid) });
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.stats() });
			toast.success('Rak penyimpanan berhasil diperbarui');
		},
		onError: (error: Error) => {
			toast.error(`Gagal memperbarui rak penyimpanan: ${error.message}`);
		}
	}));
};

/**
 * Hook for deleting item storage layout
 */
export const useDeleteItemStorageLayout = () => {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async (uoid: string) => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageLayoutApi.deleteItemStorageLayout(uoid, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.lists() });
			queryClient.invalidateQueries({ queryKey: itemStorageLayoutKeys.stats() });
			toast.success('Rak penyimpanan berhasil dihapus');
		},
		onError: (error: Error) => {
			toast.error(`Gagal menghapus rak penyimpanan: ${error.message}`);
		}
	}));
};
