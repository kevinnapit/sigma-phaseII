import { createQuery } from '@tanstack/svelte-query';
import { itemSubstitutionApi } from '../api/item-substitution.api';
import { itemSubstitutionKeys } from '../api/item-substitution.keys';
import type { ItemSubstitutionListParams } from '../types/item-substitution.types';

/**
 * Hook untuk membaca semua substitusi barang
 * Catatan: Menggunakan mock data, autentikasi tidak diperlukan
 */
export const useReadAllItemSubstitutions = (
	params: () => ItemSubstitutionListParams,
	isEnabled?: () => boolean
) => {
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: itemSubstitutionKeys.list(currentParams),
		queryFn: () => {
			// Mock context - tidak digunakan tapi diperlukan oleh signature API
			const context = {
				token: 'mock-token',
				estateId: 'mock-estate'
			};
			return itemSubstitutionApi.getItemSubstitutions(currentParams, context);
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnMount: 'always',
		placeholderData: (previousData) => previousData,
		enabled: enabled
	}));
};

/**
 * Hook untuk membaca detail substitusi barang
 * Catatan: Menggunakan mock data, autentikasi tidak diperlukan
 */
export const useReadItemSubstitutionDetail = (id: () => string) => {
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: itemSubstitutionKeys.detail(currentId),
		queryFn: () => {
			// Mock context - tidak digunakan tapi diperlukan oleh signature API
			const context = {
				token: 'mock-token',
				estateId: 'mock-estate'
			};
			return itemSubstitutionApi.getItemSubstitutionDetail(currentId, context);
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!currentId
	}));
};
