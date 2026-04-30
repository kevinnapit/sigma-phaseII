import type { ItemStorageLayoutListParams } from '../types/item-storage-layout.types';

/**
 * Query keys for Item Storage Layouts
 */
export const itemStorageLayoutKeys = {
	all: ['material-management', 'item-storage-layouts'] as const,
	lists: () => [...itemStorageLayoutKeys.all, 'list'] as const,
	list: (params: ItemStorageLayoutListParams) =>
		[...itemStorageLayoutKeys.lists(), params] as const,
	details: () => [...itemStorageLayoutKeys.all, 'detail'] as const,
	detail: (uoid: string) => [...itemStorageLayoutKeys.details(), uoid] as const,
	stats: () => [...itemStorageLayoutKeys.all, 'stats'] as const
};
