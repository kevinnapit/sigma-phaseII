// Query hooks for Physical Stocktake Entry (Entri Stok Opname Fisik)

import {
	getMockPhysicalStocktakes,
	getMockPhysicalStocktakeDetail
} from '../api/physical-stocktake.mock';
import type { PhysicalStocktakeListParams } from '../types/physical-stocktake.types';

/**
 * Hook untuk membaca semua entri stok opname dengan paginasi dan pencarian
 */
export const useReadAllPhysicalStocktakes = (params: () => PhysicalStocktakeListParams) => {
	let data = $state<ReturnType<typeof getMockPhysicalStocktakes> | null>(null);
	let isLoading = $state(true);
	let isError = $state(false);
	let error = $state<Error | null>(null);

	$effect(() => {
		const currentParams = params();
		isLoading = true;
		isError = false;
		error = null;

		const timer = setTimeout(() => {
			try {
				const result = getMockPhysicalStocktakes(
					currentParams.page,
					currentParams.size,
					currentParams.search
				);
				data = result;
			} catch (err) {
				isError = true;
				error = err instanceof Error ? err : new Error('Terjadi kesalahan tidak diketahui');
			} finally {
				isLoading = false;
			}
		}, 300);

		return () => clearTimeout(timer);
	});

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get isError() {
			return isError;
		},
		get error() {
			return error;
		}
	};
};

/**
 * Hook untuk membaca detail entri stok opname berdasarkan ID
 */
export const useReadPhysicalStocktakeDetail = (id: () => string) => {
	let data = $state<ReturnType<typeof getMockPhysicalStocktakeDetail> | null>(null);
	let isLoading = $state(true);
	let isError = $state(false);
	let error = $state<Error | null>(null);

	$effect(() => {
		const currentId = id();
		if (!currentId) return;

		isLoading = true;
		isError = false;
		error = null;

		const timer = setTimeout(() => {
			try {
				const result = getMockPhysicalStocktakeDetail(currentId);
				data = result;
			} catch (err) {
				isError = true;
				error = err instanceof Error ? err : new Error('Terjadi kesalahan tidak diketahui');
			} finally {
				isLoading = false;
			}
		}, 300);

		return () => clearTimeout(timer);
	});

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get isError() {
			return isError;
		},
		get error() {
			return error;
		}
	};
};
