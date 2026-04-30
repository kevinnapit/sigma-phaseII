import { createQuery } from '@tanstack/svelte-query';
import { itemStorageApi } from '../api/item-storage.api';
import { itemStorageKeys } from '../api/item-storage.keys';
import type { ItemStorageAssignmentListParams } from '../types/item-storage.types';

/**
 * Hook untuk membaca semua penugasan penyimpanan barang
 */
export const useReadAllItemStorageAssignments = (
	params: () => ItemStorageAssignmentListParams,
	isEnabled?: () => boolean
) => {
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemStorageKeys.list(currentParams),
		queryFn: () => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageApi.getItemStorageAssignments(currentParams, context);
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled
	}));
};

/**
 * Hook untuk membaca detail penugasan penyimpanan barang
 */
export const useReadItemStorageAssignmentDetail = (id: () => string) => {
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: itemStorageKeys.detail(currentId),
		queryFn: () => {
			const context = { token: 'mock-token', estateId: 'mock-estate' };
			return itemStorageApi.getItemStorageAssignmentDetail(currentId, context);
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!currentId
	}));
};
