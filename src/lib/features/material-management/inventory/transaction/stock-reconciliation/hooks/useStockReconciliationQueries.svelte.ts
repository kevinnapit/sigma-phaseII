// Query hooks for Stock Reconciliation (Rekonsiliasi Stok)

import {
	getMockStockReconciliations,
	getMockStockReconciliationDetail
} from '../api/stock-reconciliation.mock';
import type { StockReconciliationListParams } from '../types/stock-reconciliation.types';

/**
 * Hook untuk membaca semua rekonsiliasi stok dengan paginasi dan pencarian
 */
export const useReadAllStockReconciliations = (
	params: () => StockReconciliationListParams
) => {
	let data = $state<ReturnType<typeof getMockStockReconciliations> | null>(null);
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
				const result = getMockStockReconciliations(
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
 * Hook untuk membaca detail rekonsiliasi stok berdasarkan ID
 */
export const useReadStockReconciliationDetail = (id: () => string) => {
	let data = $state<ReturnType<typeof getMockStockReconciliationDetail> | null>(null);
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
				const result = getMockStockReconciliationDetail(currentId);
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
