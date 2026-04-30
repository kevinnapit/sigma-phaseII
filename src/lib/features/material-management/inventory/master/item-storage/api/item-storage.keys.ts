import type { ItemStorageAssignmentListParams } from '../types/item-storage.types';

/**
 * Query keys untuk Penyimpanan Barang
 */
export const itemStorageKeys = {
	all: ['material-management', 'item-storage'] as const,
	lists: () => [...itemStorageKeys.all, 'list'] as const,
	list: (params: ItemStorageAssignmentListParams) =>
		[...itemStorageKeys.lists(), params] as const,
	details: () => [...itemStorageKeys.all, 'detail'] as const,
	detail: (id: string) => [...itemStorageKeys.details(), id] as const
};
