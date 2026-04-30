// Query hooks for Stock Adjustment (Penyesuaian Stok)

import {
	getMockStockAdjustments,
	getMockStockAdjustmentDetail
} from '../api/stock-adjustment.mock';
import type { StockAdjustmentListParams } from '../types/stock-adjustment.types';

/**
 * Hook for reading all stock adjustments with pagination and search
 */
export const useReadAllStockAdjustments = (params: () => StockAdjustmentListParams) => {
	let data = $state<ReturnType<typeof getMockStockAdjustments> | null>(null);
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
				const result = getMockStockAdjustments(
					currentParams.page,
					currentParams.size,
					currentParams.search
				);
				data = result;
			} catch (err) {
				isError = true;
				error = err instanceof Error ? err : new Error('Unknown error');
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
 * Hook for reading stock adjustment detail by ID
 */
export const useReadStockAdjustmentDetail = (id: () => string) => {
	let data = $state<ReturnType<typeof getMockStockAdjustmentDetail> | null>(null);
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
				const result = getMockStockAdjustmentDetail(currentId);
				data = result;
			} catch (err) {
				isError = true;
				error = err instanceof Error ? err : new Error('Unknown error');
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
