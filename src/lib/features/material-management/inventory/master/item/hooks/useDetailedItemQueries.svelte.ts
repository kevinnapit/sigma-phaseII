import { createQuery } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { storeApi } from '../../stores/api/store.api';
import { itemApi } from '../api/item.api';
import { itemKeys } from '../api/item.keys';

/**
 * Hook untuk query UOM List
 * Digunakan untuk mendapatkan daftar satuan ukuran
 */
export const useUomListQuery = (params: () => { page?: number; page_size?: number }) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: [
			'functional-admin',
			'uom-list',
			{ page: currentParams.page || 1, page_size: currentParams.page_size || 100 }
		],
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/functional-admin/uom/satuan-ukuran', {
					params: {
						query: {
							page: currentParams.page || 1,
							page_size: currentParams.page_size || 100
						}
					}
				});
			if (error) throw error;
			return data;
		},
		placeholderData: (prev) => prev
	}));
};

/**
 * Hook untuk query Stores List
 * Digunakan untuk mendapatkan daftar gudang
 */
export const useStoresListQuery = (params: () => { page?: number; size?: number }) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: [
			'material-management',
			'stores-list',
			{ page: currentParams.page || 1, size: currentParams.size || 100 }
		],
		queryFn: async () => {
			if (!userCtx.token || !userCtx.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userCtx.token,
				estateId: userCtx.estate.id,
				contextId: ''
			};
			return storeApi.getStores(
				{
					page: currentParams.page || 1,
					size: currentParams.size || 100
				},
				context
			);
		},
		placeholderData: (prev) => prev
	}));
};

/**
 * Hook untuk query Alokasi Umum List
 * Digunakan untuk mendapatkan daftar alokasi umum (general allocation)
 */
export const useAlokasiUmumListQuery = (
	params: () => {
		page?: number;
		page_size?: number;
		name?: string;
	}
) => {
	const userCtx = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: [
			'functional-admin',
			'alokasi-umum-list',
			{
				page: currentParams.page || 1,
				page_size: currentParams.page_size || 100,
				name: currentParams.name || undefined
			}
		],
		queryFn: async () => {
			const { data, error } = await userCtx
				.client()
				.GET('/api/functional-admin/alokasi-umum/alokasi', {
					params: {
						query: {
							page: currentParams.page || 1,
							page_size: currentParams.page_size || 100,
							name: currentParams.name || undefined
						}
					}
				});
			if (error) throw error;
			return data;
		},
		placeholderData: (prev) => prev
	}));
};

/**
 * Hook untuk membaca item conversions
 */
export const useReadItemConversions = (itemId: () => string) => {
	const userContext = getUserContext();
	const currentItemId = $derived(itemId());

	return createQuery(() => ({
		queryKey: itemKeys.conversions(currentItemId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return itemApi.getItemConversions(currentItemId, context);
		},
		enabled: !!currentItemId && !!userContext.token && !!userContext.estate?.id
	}));
};
